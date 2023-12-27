const http = require('http');
const app = require("./app")
const server = http.createServer(app);

const PORT = process.env.PORT || 5000
server.listen(PORT, console.log("Work Plexify is Running on  http://localhost:5000/"))


