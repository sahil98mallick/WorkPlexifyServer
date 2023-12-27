const mongoose = require('mongoose')

const WorkPlexifyWritersSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userID: String,
    name: String,
    email: String,
    phone: Number,
    activestatus: Boolean,
    createdAt: String,
    Image: String
})


module.exports = mongoose.model('WorkPlexifyWriters', WorkPlexifyWritersSchema)