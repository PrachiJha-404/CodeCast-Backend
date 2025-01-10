const express = require("express");
const dotenv = require("dotenv").config();
const app = express();
const DBConnection = require("./Config/dbconnection.js")
const port = process.env.PORT || 8000;

DBConnection();
app.get('/api/create-room' , (req,res)=>{
    res.status(200).send("Hello");
})

app.listen(port , ()=>{
    console.log("Server running on port 5000");
})

console.log("hey123")