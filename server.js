import dotenv from "dotenv"
import express from "express"
import cors from "cors"
import DBConnection from "./Config/dbconnection.js";
import cookieParser from "cookie-parser";
import { createServer } from 'node:http'
import { Server } from "socket.io"
import { verifyJWT } from "./middleware/auth.middleware.js";
import cookie from "cookie"
import { createroom, addusertoroom } from "./controllers/room.controller.js";
dotenv.config()

const port = process.env.PORT || 8000;
const app = express();
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))
app.use(cookieParser())
app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))

const server = createServer(app)
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true,
        methods: ["GET", "POST"],

    }
})
DBConnection()
    .then(() => {
        // app.listen(port, () => {
        //     console.log("Server running on port", port)
        // })
        // io.engine.on("headers", (headers,request)=>{
        //     if(!request.headers.cookie) return
        //     const cookie = parse(request.headers.cookie)
        //     console.log("cookie",cookie)
        // })

        // io.use((socket,next)=>{
        //     console.log(socket.handshake);
        //     next();
        // })

        io.on("connection", (socket) => {
            console.log("user connected", socket.id)
            let rawcookies = {};
            if (socket.handshake.headers['cookie']) { rawcookies = cookie.parse(socket.handshake.headers['cookie']) }
            // console.log(rawcookies)

            // const accessToken = cookies.accessToken
            // const cookief = socket.handshake.headers.cookie; 
            // const cookies = cookie.parse(socket.handshake.headers.cookie);    

            socket.on('join_room', async (data) => {
                console.log(data)
                const roomId_if_exists = await addusertoroom(data.cc_pin, data.password, rawcookies.accessToken)
                if (roomId_if_exists.success) {
                    socket.join(data.cc_pin)
                    console.log("user joined room", data.cc_pin);
                    socket.emit('user_joined');
                } else {
                    socket.emit('user_error', roomId_if_exists.error)
                }
            })
            socket.on('create_room', async (data) => {
                console.log("user created room", data.cc_pin);
                const roomId_if_exists = await createroom(data.cc_pin, data.password, rawcookies.accessToken, "default")
                console.log(roomId_if_exists)
                if (roomId_if_exists.success) {
                    socket.join(data.cc_pin)
                    console.log("user joined room", data.cc_pin);
                    socket.emit('user_joined');
                } else {
                    console.log(roomId_if_exists.error)
                    socket.emit('user_error', roomId_if_exists.error)

                }
            })
            socket.on('code_message', (data) => {
                console.log("code got", data)
                // console.log(data.cc_pin)
                const usersInRoom = io.sockets.adapter.rooms.get(data.cc_pin);
                console.log("users in room", usersInRoom, "cc_pin", data.cc_pin)
                // socket.to('kb12gsla').emit('code', { code: "are you able to recive this plss" })
                socket.to(data.cc_pin).emit('code', { code: data.code })
                // socket.to(data.cc_pin).emit('hi')
                // console.log("Room name type:", typeof data.cc_pin);
                // socket.to(data.cc_pin).emit('code', { code: data.code })
                // io.to(data.cc_pin).emit('code', { code: data.code })
                // socket.in(data.cc_pin).emit('code', { code: data.code })
                // socket.emit('code', { code: "Hello Direct test" })
                // io.emit('hi', { code: data.code })
            })
            // socket.emit('hi',{mess:"hello"})
        })

        server.on("error", (err) => {
            console.log("Error", err)
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
server.listen(port, () => {
    console.log("Server running on port", port)
})
import userRouter from "./routes/user.routes.js";
// import { Socket } from "node:dgram";

app.use("/users", userRouter)




