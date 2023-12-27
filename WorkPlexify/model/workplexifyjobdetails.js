const mongoose = require('mongoose')

const WorkPlexifyJobDetailsSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userID: String,
    jobid: String,
    startdate: Date,
    enddate: Date,
    writername: String,
    clientname: String,
    jobstatus: Boolean,
    actualprice: String,
    writeprice: String,
    createdAt: String,
    jobdetails: String,
})


module.exports = mongoose.model('WorkPlexifyJobDetails', WorkPlexifyJobDetailsSchema)