const mongoose = require('mongoose');

const WorkPlexifyInvoiceSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userId: String,
    invoiceID: String,
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'WorkPlexifyClients',
    },
    jobs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'WorkPlexifyJobDetails',
        }
    ],
    invoiceDate: {
        type: Date,
        default: Date.now,
    },
    totalAmount: {
        type: Number,
        default: 0,
    },
    invoiceStatus: String
});

module.exports = mongoose.model('WorkPlexifyInvoice', WorkPlexifyInvoiceSchema);