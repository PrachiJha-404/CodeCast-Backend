const express = require("express");
const dotenv = require("dotenv").config();
const app = express();
const port = process.env.PORT || 8000;

app.get('/api/create-room' , (req,res)=>{
    res.status(200).send("Hello");
})

app.listen(port , ()=>{
    console.log("Server running on port 5000");
})

console.log("hey123")