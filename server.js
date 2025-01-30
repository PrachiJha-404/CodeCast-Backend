import dotenv from "dotenv"
import express from "express"
import cors from "cors"
import DBConnection from "./Config/dbconnection.js";
import cookieParser from "cookie-parser";
const port = process.env.PORT || 8000;
dotenv.config()
const app = express();
app.use(cors())
app.use(cookieParser())
app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
DBConnection()
    .then(() => {
        app.listen(port, () => {
            console.log("Server running on port", port)
        })
        app.on("error", (err) => {
            console.log("Error", err)
            throw err
        })
    })
    .catch((err) => {
        console.log("Database Connection failed", err)
    });

//routes

import userRouter from "./routes/user.routes.js";

app.use("/users", userRouter)




