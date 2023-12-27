const express = require('express')
const router = express.Router();
const mongoose = require('mongoose');
const WorkPlexifyJobdetails = require("../model/workplexifyjobdetails");

// Helper function to convert date string to Date object
function convertToDate(dateString) {
    const [day, month, year] = dateString.split('/');
    return new Date(`${year}-${month}-${day}`);
}
// Add Job Details
router.post('/addjobdetails', (req, res, next) => {
    const jobData = new WorkPlexifyJobdetails({
        _id: new mongoose.Types.ObjectId(),
        userID: req.body.userID,
        jobid: req.body.jobid,
        // startdate: convertToDate(req.body.startdate),
        // enddate: convertToDate(req.body.enddate),
        startdate: req.body.startdate,
        enddate: req.body.enddate,
        writername: req.body.writername,
        clientname: req.body.clientname,
        jobstatus: req.body.jobstatus,
        actualprice: req.body.actualprice,
        writeprice: req.body.writeprice,
        jobdetails: req.body.jobdetails,
        createdAt: new Date(),
    });

    jobData.save()
        .then(result => {
            res.status(200).json({
                success: true,
                status: 200,
                message: "Job Added Successfully",
                jobData: result
            });
        })
        .catch(err => {
            res.status(500).json({
                status: 500,
                message: "Job details not added",
                error: err
            });
        });
});

// View All Jobs
router.get('/alljobs', ((req, res, next) => {
    WorkPlexifyJobdetails.find()
        .then(result => {
            if (result && result.length > 0) {
                // console.log(result);
                res.status(200).json({
                    success: true,
                    totalcount: result.length,
                    message: "Data Received successfully",
                    jobData: result
                });
            } else {
                res.status(200).json({
                    success: true,
                    message: "No data found",
                    jobData: []
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                success: false,
                message: "Data Not retrieved Properly",
                error: err
            })
        })
}))
// View Jobs by UserID
router.get('/jobsbyuserid/:userID', (req, res, next) => {
    const { userID } = req.params;

    WorkPlexifyJobdetails.find({ userID })
        .then(result => {
            if (result && result.length > 0) {
                res.status(200).json({
                    success: true,
                    totalcount: result.length,
                    message: `Job details retrieved successfully for userID: ${userID}`,
                    jobData: result
                });
            } else {
                res.status(200).json({
                    success: true,
                    message: `No job details found for userID: ${userID}`,
                    jobData: []
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                success: false,
                message: `Failed to retrieve job details for userID: ${userID}`,
                error: err
            });
        });
});

// Implement Single Job Details
router.get('/singlejob/:id', ((req, res, next) => {
    WorkPlexifyJobdetails.findById(req.params.id)
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
router.delete('/deletejob/:id', (req, res) => {
    WorkPlexifyJobdetails.deleteOne({ _id: req.params.id })
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

// Update Job Details
router.put('/updatejob/:id', (req, res, next) => {
    const jobId = req.params.id;
    const updateData = {
        jobid: req.body.jobid,
        startdate: req.body.startdate,
        enddate: req.body.enddate,
        writername: req.body.writername,
        clientname: req.body.clientname,
        jobstatus: req.body.jobstatus,
        actualprice: req.body.actualprice,
        writeprice: req.body.writeprice,
        jobdetails: req.body.jobdetails,
        createdAt: new Date(),
    };

    WorkPlexifyJobdetails.findByIdAndUpdate(jobId, updateData, { new: true })
        .then(updatedJob => {
            if (updatedJob) {
                res.status(200).json({
                    success: true,
                    status: 200,
                    message: "Job details updated successfully",
                    updatedJob: updatedJob
                });
            } else {
                res.status(404).json({
                    success: false,
                    status: 404,
                    message: "Job details not found for update",
                    updatedJob: null
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                success: false,
                status: 500,
                message: "Failed to update job details",
                error: err
            });
        });
});
// Update Job Details
router.put('/updatejobstatus/:id', (req, res, next) => {
    const jobId = req.params.id;
    const updateData = {
        jobstatus: req.body.jobstatus,
    };

    WorkPlexifyJobdetails.findByIdAndUpdate(jobId, updateData, { new: true })
        .then(updatedJob => {
            if (updatedJob) {
                res.status(200).json({
                    success: true,
                    status: 200,
                    message: "Status Updated successfully",
                    updatedJob: updatedJob
                });
            } else {
                res.status(404).json({
                    success: false,
                    status: 404,
                    message: "Status not Updated successfully",
                    updatedJob: null
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                success: false,
                status: 500,
                message: "Failed to update job details",
                error: err
            });
        });
});

// Filter Records by Month, Writer Name, and Year with URL path parameters
router.get('/filterjobs/:month/:writername/:year', async (req, res, next) => {
    try {
        const { month, writername, year } = req.params;

        // Construct the start and end date for the given month and year
        const startDate = new Date(`${year}-${month}-01`);
        const endDate = new Date(`${year}-${parseInt(month) + 1}-01`);

        // Build the query conditions based on the provided parameters
        const queryConditions = {
            startdate: { $gte: startDate, $lt: endDate },
        };

        if (writername) {
            queryConditions.writername = writername;
        }

        // Fetch records based on the constructed query
        const filteredJobs = await WorkPlexifyJobdetails.find(queryConditions);

        if (filteredJobs && filteredJobs.length > 0) {
            res.status(200).json({
                success: true,
                totalcount: filteredJobs.length,
                message: 'Filtered data received successfully',
                jobData: filteredJobs,
            });
        } else {
            res.status(200).json({
                success: true,
                message: 'No data found for the specified criteria',
                jobData: [],
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Failed to filter data',
            error: error.message,
        });
    }
});

// Filter Records by Year, month, client name with URL path parameters
router.get('/filterjobs/client/:year/:month/:clientname', async (req, res, next) => {
    try {
        const { year, month, clientname } = req.params;

        // Construct the start and end date for the given month and year
        const startDate = new Date(`${year}-${month}-01`);
        const endDate = new Date(`${year}-${parseInt(month) + 1}-01`);

        // Build the query conditions based on the provided parameters
        const queryConditions = {
            startdate: { $gte: startDate, $lt: endDate },
        };

        if (clientname) {
            queryConditions.clientname = clientname;
        }

        // Fetch records based on the constructed query
        const filteredJobs = await WorkPlexifyJobdetails.find(queryConditions);

        if (filteredJobs && filteredJobs.length > 0) {
            res.status(200).json({
                success: true,
                totalcount: filteredJobs.length,
                message: 'Filtered data received successfully',
                jobData: filteredJobs,
            });
        } else {
            res.status(200).json({
                success: true,
                message: 'No data found for the specified criteria',
                jobData: [],
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Failed to filter data',
            error: error.message,
        });
    }
});

// Search Job Details by Job ID or Status
router.post('/searchjobbyid', async (req, res, next) => {
    try {
        const { jobid } = req.body;

        if (!jobid) {
            return res.status(400).json({
                success: false,
                status: 400,
                message: "Missing 'jobid' in the request body",
            });
        }

        // Use Mongoose to find job details by jobid
        const jobDetails = await WorkPlexifyJobdetails.find({ jobid });

        if (jobDetails && jobDetails.length > 0) {
            res.status(200).json({
                success: true,
                totalcount: jobDetails.length,
                message: 'Job details found successfully',
                jobData: jobDetails,
            });
        } else {
            res.status(200).json({
                success: true,
                message: `No job details found for jobid: ${jobid}`,
                jobData: [],
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Failed to search job details by jobid',
            error: error.message,
        });
    }
});

// Find All Active Jobs
router.get('/activejobs', (req, res, next) => {
    WorkPlexifyJobdetails.find({ jobstatus: true })
        .then(activeJobs => {
            if (activeJobs && activeJobs.length > 0) {
                res.status(200).json({
                    success: true,
                    totalcount: activeJobs.length,
                    message: 'Active jobs retrieved successfully',
                    jobData: activeJobs,
                });
            } else {
                res.status(200).json({
                    success: true,
                    message: 'No active jobs found',
                    jobData: [],
                });
            }
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve active jobs',
                error: err,
            });
        });
});

// Find All Completed Jobs
router.get('/completedjobs', (req, res, next) => {
    WorkPlexifyJobdetails.find({ jobstatus: false })
        .then(completedJobs => {
            if (completedJobs && completedJobs.length > 0) {
                res.status(200).json({
                    success: true,
                    totalcount: completedJobs.length,
                    message: 'Completed jobs retrieved successfully',
                    jobData: completedJobs,
                });
            } else {
                res.status(200).json({
                    success: true,
                    message: 'No completed jobs found',
                    jobData: [],
                });
            }
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve completed jobs',
                error: err,
            });
        });
});


module.exports = router