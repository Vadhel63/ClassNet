const mongoose = require("mongoose");

//define theMongodb database url

mognoURL = "mongodb://localhost:27017/google_classroom_clone";

//set up MongoDB connection
mongoose.connect(mognoURL, { useNewUrlParser: true, useUnifiedTopology: true });
//get default connection
//Mongodb maintains default connection object representeting the mongodb connection
const db = mongoose.connection;
//expert database connection
module.exports = db;

db.on("connected",()=>{
    console.log("connected to database");
})