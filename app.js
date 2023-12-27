const express = require("express");
const app = express();
const bodyParser = require('body-parser')
const morgan = require("morgan")
const cors = require("cors")
const mongoose = require("mongoose")

// Load all Routes Here
const WorkPlexifyUsers = require("./WorkPlexify/routes/workplexifyusers")
const WorkPlexifyClients = require("./WorkPlexify/routes/workplexifyclients");
const WorkPlexifyJobDetails = require("./WorkPlexify/routes/workplexifyjobdetails");
const WorkPlexifyInvoice = require("./WorkPlexify/routes/workplexifyjobinvoice");
const WorkPlexifyWriters = require("./WorkPlexify/routes/workplexifywriters");

// Database Connection with MongoDB
mongoose.connect('mongodb+srv://sahilmallick:sahilmallick9635@sahilmallick.yawwcxk.mongodb.net/?retryWrites=true&w=majority')
// Checking Mondo DB connection
mongoose.connection.on('error', err => {
    console.log("Connection Failed..Please Try Again");
})
mongoose.connection.on('connected', connected => {
    console.log("Connection Successfully..You can Use this MongoDb Now");
})
const corsOptions = {
    origin: '*',
    methods: 'GET, POST, PUT, DELETE',
};
app.use(cors(corsOptions));
app.use(morgan('dev'))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

// End Points
app.use("/users", WorkPlexifyUsers)
app.use("/clients", WorkPlexifyClients)
app.use("/jobdetails", WorkPlexifyJobDetails)
app.use("/invoice", WorkPlexifyInvoice)
app.use("/writers", WorkPlexifyWriters)


app.use((req, res, next) => {
    res.status(200).json({
        message: "Welcome to the Academia Crafter Organization",
    })
})

module.exports = app