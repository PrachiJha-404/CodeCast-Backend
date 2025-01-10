const mongoose = require("mongoose");
const constants = require("../constants.js")
async function DBConnection  (){
    try {
        let connection = await mongoose.connect(`${process.env.CONNECTION_STRING}/${constants.DB_NAME}`)
        console.log("Database connected sucessfully")
    } catch (error) {
        console.log("MONGODB connection error" , error);
        throw error
    }
}
module.exports = DBConnection