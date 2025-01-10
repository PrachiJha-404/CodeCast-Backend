const express = require("express");
const dotenv = require("dotenv").config();
const DBConnection = require("./Config/dbconnection.js")
const port = process.env.PORT || 8000;

const app = express();

DBConnection()
.then(()=>{
    app.listen(port , ()=>{
        console.log("Server running on port",port)
    })
    app.on("error", (err)=>{
        console.log("Error" , err)
        throw err
    })
})
.catch((err)=>{
    console.log("Database Connection failed" , err)
});


app.get('/api/create-room' , (req,res)=>{
    res.status(200).send("Hello");
})

