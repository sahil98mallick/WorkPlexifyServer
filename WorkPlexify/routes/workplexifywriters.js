const express = require('express')
const router = express.Router();
const mongoose = require('mongoose');
const WorkPlexifyWriters = require("../model/workplexifywriters");
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

router.post('/addwriters', upload.single('Image'), (req, res, next) => {
    console.log('Request Body:', req.body);
    if (!req.file) {
        return res.status(400).json({ error: "No image file provided" });
    }

    // Upload the image to ImageKit
    const folderName = "WorkPlexifyWriters";
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

            const writerData = new WorkPlexifyWriters({
                _id: new mongoose.Types.ObjectId(),
                name: req.body.name,
                email: req.body.email,
                userID: req.body.userID,
                phone: req.body.phone,
                activestatus: req.body.activestatus,
                createdAt: new Date(),
                Image: result.url
            });

            writerData.save()
                .then(result => {
                    res.status(200).json({
                        success: true,
                        status: 200,
                        message: "Writer registration completed",
                        writerData: result
                    });
                })
                .catch(err => {
                    res.status(500).json({
                        status: 500,
                        message: "Writer registration not completed",
                        error: err
                    });
                });
        }
    );
});

// View All clients
router.get('/allwriters', ((req, res, next) => {
    WorkPlexifyWriters.find()
        .then(result => {
            if (result && result.length > 0) {
                // console.log(result);
                res.status(200).json({
                    success: true,
                    totalcount: result.length,
                    message: "All data retrieved successfully",
                    writerData: result
                });
            } else {
                res.status(200).json({
                    success: true,
                    message: "No data found",
                    writerData: []
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
router.get('/writersbyuserid/:userID', (req, res, next) => {
    const { userID } = req.params;

    WorkPlexifyWriters.find({ userID })
        .then(result => {
            if (result && result.length > 0) {
                res.status(200).json({
                    success: true,
                    totalcount: result.length,
                    message: `Writer retrieved successfully for userID: ${userID}`,
                    writerData: result
                });
            } else {
                res.status(200).json({
                    success: true,
                    message: `No Writer found for userID: ${userID}`,
                    writerData: []
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                success: false,
                message: `Failed to retrieve writers for userID: ${userID}`,
                error: err
            });
        });
});

// Delete the clients by Id
router.delete('/deletewriter/:id', (req, res) => {
    WorkPlexifyWriters.deleteOne({ _id: req.params.id })
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
                message: "Failed to delete writers data",
                error: err
            });
        });
});

// Update writers Active Status Details
router.put('/updatewriteractivestatus/:id', (req, res) => {
    const updateactiveData = {
        activestatus: req.body.activestatus,
    };

    WorkPlexifyWriters.findByIdAndUpdate(req.params.id, updateactiveData, { new: true })
        .then(updatedUser => {
            if (!updatedUser) {
                return res.status(404).json({
                    status: false,
                    message: "Writer is not Active or No Changes Found",
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