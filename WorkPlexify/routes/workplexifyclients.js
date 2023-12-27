const express = require('express')
const router = express.Router();
const mongoose = require('mongoose');
const WorkPlexifyClients = require("../model/workplexifyclients");
const multer = require('multer');
const ImageKit = require("imagekit");

// Image Cloud Server Setup
const imagekit = new ImageKit({
    publicKey: "public_Si93pSkoQAbQ3cMRRj5aAW+Lgwk=",
    privateKey: "private_PXIsikXskmXAd6MaBU+f2BqsnwA=",
    urlEndpoint: "https://ik.imagekit.io/cqxtcg0kv"
});

// Define the storage engine for multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/addclients', upload.single('Image'), (req, res, next) => {
    console.log('Request Body:', req.body);
    if (!req.file) {
        return res.status(400).json({ error: "No image file provided" });
    }

    // Upload the image to ImageKit
    const folderName = "WorkPlexifyClients";
    imagekit.upload(
        {
            file: req.file.buffer,
            fileName: req.file.originalname,
            folder: folderName
        },
        (err, result) => {
            if (err) {
                return res.status(500).json({
                    status: 500,
                    error: err
                });
            }

            const clientData = new WorkPlexifyClients({
                _id: new mongoose.Types.ObjectId(),
                name: req.body.name,
                email: req.body.email,
                userID: req.body.userID,
                phone: req.body.phone,
                activestatus: req.body.activestatus,
                createdAt: new Date(),
                Image: result.url
            });

            clientData.save()
                .then(result => {
                    res.status(200).json({
                        success: true,
                        status: 200,
                        message: "Client registration completed",
                        clientData: result
                    });
                })
                .catch(err => {
                    res.status(500).json({
                        status: 500,
                        message: "Client registration not completed",
                        error: err
                    });
                });
        }
    );
});

// View All clients
router.get('/allclients', ((req, res, next) => {
    WorkPlexifyClients.find()
        .then(result => {
            if (result && result.length > 0) {
                // console.log(result);
                res.status(200).json({
                    success: true,
                    totalcount: result.length,
                    message: "All data retrieved successfully",
                    clientData: result
                });
            } else {
                res.status(200).json({
                    success: true,
                    message: "No data found",
                    clientData: []
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                success: false,
                message: "data Not retrieved Properly",
                error: err
            })
        })
}))

// View Clients by UserID
router.get('/clientsbyuserid/:userID', (req, res, next) => {
    const { userID } = req.params;

    WorkPlexifyClients.find({ userID })
        .then(result => {
            if (result && result.length > 0) {
                res.status(200).json({
                    success: true,
                    totalcount: result.length,
                    message: `Clients retrieved successfully for userID: ${userID}`,
                    clientData: result
                });
            } else {
                res.status(200).json({
                    success: true,
                    message: `No clients found for userID: ${userID}`,
                    clientData: []
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                success: false,
                message: `Failed to retrieve clients for userID: ${userID}`,
                error: err
            });
        });
});


// Delete the clients by Id
router.delete('/deleteclient/:id', (req, res) => {
    WorkPlexifyClients.deleteOne({ _id: req.params.id })
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
                message: "Failed to delete Client data",
                error: err
            });
        });
});

// Update client Active Status Details
router.put('/updateclientactivestatus/:id', (req, res) => {
    const updateactiveData = {
        activestatus: req.body.activestatus,
    };

    WorkPlexifyClients.findByIdAndUpdate(req.params.id, updateactiveData, { new: true })
        .then(updatedUser => {
            if (!updatedUser) {
                return res.status(404).json({
                    status: false,
                    message: "User is not Active or No Changes Found",
                });
            }
            res.status(200).json({
                status: true,
                message: "Updated Successfully",
                updatedactiveuser: updatedUser
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err,
                status: false,
                message: "Failed to Update",
            });
        });
});

module.exports = router