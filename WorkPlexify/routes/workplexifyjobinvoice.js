const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const WorkPlexifyInvoice = require('../model/workplexifyjobinvoice');
const WorkPlexifyJobDetails = require('../model/workplexifyjobdetails');
const WorkPlexifyClients = require('../model/workplexifyclients');

function convertToDate(dateString) {
    try {
        const [month, day, year] = dateString.split('/');
        const parsedDate = new Date(`${year}-${month}-${day}`);

        // Check if the parsed date is valid
        if (isNaN(parsedDate.getTime())) {
            throw new Error(`Invalid date string: ${dateString}`);
        }

        return parsedDate;
    } catch (error) {
        console.error(error.message); // Log the specific date string causing the error
        throw error;
    }
}


// Create an endpoint to generate an invoice
router.post('/generateinvoice', async (req, res) => {
    try {
        const { userId, clientName, startDate, endDate } = req.body;

        // Convert date strings to Date objects
        const start = convertToDate(startDate);
        const end = convertToDate(endDate);

        // Find the client by ID
        const client = await WorkPlexifyClients.findById(clientName);

        if (!client) {
            return res.status(404).json({
                success: false,
                message: 'Client not found',
            });
        }

        // Check if an invoice already exists for the given client, user, and date range
        const existingInvoice = await WorkPlexifyInvoice.findOne({
            userId: userId,
            client: client._id,
            invoiceDate: { $gte: start, $lt: end },
        });

        if (existingInvoice) {
            return res.status(201).json({
                success: false,
                message: 'Duplicate invoice found within the specified date range',
                invoiceData: existingInvoice,
            });
        }

        // Find jobs for the specified client and within the date range
        const jobs = await WorkPlexifyJobDetails.find({
            userID: userId,
            clientname: clientName,
            startdate: { $gte: start, $lt: end },
        });

        if (jobs.length === 0) {
            return res.status(201).json({
                success: true,
                message: 'No jobs found for the specified client or date range',
                invoiceData: [null],
            });
        }

        // Calculate total amount based on the actual prices of the jobs
        const totalAmount = jobs.reduce((total, job) => total + parseFloat(job.actualprice), 0);

        // Find the highest existing invoiceID and increment
        const lastInvoice = await WorkPlexifyInvoice.findOne({}, {}, { sort: { 'invoiceID': -1 } });
        let lastNumber = 0;
        if (lastInvoice) {
            lastNumber = parseInt(lastInvoice.invoiceID.substring(2), 10);
        }


        // Create a new invoice
        const newInvoice = new WorkPlexifyInvoice({
            _id: new mongoose.Types.ObjectId(),
            userId: userId,
            client: client._id,
            jobs: jobs.map(job => job._id),
            invoiceDate: new Date(),
            totalAmount: totalAmount,
            invoiceStatus: 'draft',
            invoiceID: `SA${(lastNumber + 1).toString().padStart(2, '0')}`,
        });

        // Save the new invoice to the database
        await newInvoice.save();

        res.status(200).json({
            success: true,
            message: 'Invoice generated successfully',
            invoiceData: newInvoice,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Failed to generate invoice',
            error: error.message,
        });
    }
});

// View All Jobs
router.get('/allinvoice', ((req, res, next) => {
    WorkPlexifyInvoice.find()
        .then(result => {
            if (result && result.length > 0) {
                // console.log(result);
                res.status(200).json({
                    success: true,
                    totalcount: result.length,
                    message: "Data Received successfully",
                    invoiceData: result
                });
            } else {
                res.status(200).json({
                    success: true,
                    message: "No data found",
                    invoiceData: []
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                success: false,
                message: "Users data Not retrieved Properly",
                error: err
            })
        })
}))

// Implement Single Job Details
router.get('/singleclientinvoice/:id', ((req, res, next) => {
    WorkPlexifyInvoice.findById(req.params.id)
        .then(result => {
            if (result) {
                res.status(200).json({
                    message: "Data Found Successfully",
                    status: true,
                    finddata: result
                })
            } else {
                res.status(500).json({
                    message: "No Data Found"
                })
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message: "Data Not Found",
                status: false,
                error: err
            })
        })
}))

// Delete the jobs by Id
router.delete('/deleteclientinvoice/:id', (req, res) => {
    WorkPlexifyInvoice.deleteOne({ _id: req.params.id })
        .then(result => {
            if (result.deletedCount > 0) {
                // console.log(result);
                res.status(200).json({
                    success: true,
                    message: "Deleted successfully",
                    deletedata: result
                });
            } else {
                res.status(200).json({
                    success: true,
                    message: "No data found",
                    deletedata: []
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                success: false,
                message: "Failed to delete data",
                error: err
            });
        });
});

// View All Invoices by UserID
router.get('/allinvoicebyuser/:userId', async (req, res, next) => {
    try {
        const userId = req.params.userId;

        // Find invoices for the specified user
        const invoices = await WorkPlexifyInvoice.find({ userId: userId });

        if (invoices.length === 0) {
            return res.status(200).json({
                success: true,
                message: 'No invoices found for the specified user',
                invoiceData: [],
            });
        }

        res.status(200).json({
            success: true,
            totalcount: invoices.length,
            message: 'Invoices retrieved successfully',
            invoiceData: invoices,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve invoices',
            error: error.message,
        });
    }
});
module.exports = router;
