import dotenv from "dotenv"
import express from "express"
import cors from "cors"
import DBConnection from "./Config/dbconnection.js";
import cookieParser from "cookie-parser";
import {createServer} from 'node:http'
import {Server} from "socket.io"
import { createroom , addusertoroom } from "./controllers/room.controller.js";
const port = process.env.PORT || 8000;
dotenv.config()
const app = express();
app.use(cors())
app.use(cookieParser())
app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))

const server = createServer(app)
const io = new Server(server , {
    cookie: true
})
DBConnection()
    .then(() => {
        // app.listen(port, () => {
        //     console.log("Server running on port", port)
        // })
        //todo: socket io for join room and create room is left (only database stuff is happening)
        io.on("connection",(socket)=>{
            console.log("user connected",socket)
            const cookies = socket.handshake.headers.cookie
            const accessToken = cookies.accessToken

            socket.on('join_room',(cc_pin,password)=>{
                addusertoroom(cc_pin,password,accessToken)
            })
            socket.on('create_room',(cc_pin,password,name)=>{
                createroom(cc_pin,password,name,accessToken)
            })

        })
        
        server.on("error",(err)=>{
            console.log("Error",err)
            throw err
        })
        // app.on("error", (err) => {
        //     console.log("Error", err)
        //     throw err
        // })
    })
    .catch((err) => {
        console.log("Database Connection failed", err)
    });

//routes
server.listen(port,()=>{
    console.log("Server running on port",port)
})
import userRouter from "./routes/user.routes.js";
// import { Socket } from "node:dgram";

app.use("/users", userRouter)




