const express = require("express");
const dotenv = require("dotenv").config();
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const DBConnection = require("./Config/dbconnection.js");
const roomRoutes = require("./routes/roomRoutes.js");
const Room = require("./models/Room");
const port = process.env.PORT || 8000;

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', roomRoutes);

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io
const io = socketIo(server, {
  cors: {
    origin: "*", // In production, restrict to your frontend domain
    methods: ["GET", "POST"]
  }
});

// Socket.io connection handling
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  // Join a room
  socket.on("join-room", async ({ roomId, userId, isTeacher }) => {
    try {
      socket.join(roomId);
      console.log(`User ${userId} joined room ${roomId}`);

      // Notify everyone in the room that a new user joined
      io.to(roomId).emit("user-joined", { userId, isTeacher });

      // If this is a student, update the database
      if (!isTeacher) {
        await Room.findOneAndUpdate(
          { roomId },
          { $addToSet: { students: { studentId: userId } } }
        );
      }

      // Send current code to the newly joined user
      const room = await Room.findOne({ roomId });
      if (room) {
        socket.emit("code-update", { 
          code: room.code,
          codeHistory: room.codeHistory
        });
      }
    } catch (error) {
      console.error("Error joining room:", error);
    }
  });

  // Handle code updates from the teacher
  socket.on("code-update", async ({ roomId, code, teacherId }) => {
    try {
      // Broadcast to all clients in the room except the sender
      socket.to(roomId).emit("code-update", { code });

      // Save code to database
      await Room.findOneAndUpdate(
        { roomId, createdBy: teacherId },
        { 
          $set: { code },
          $push: { codeHistory: { code, timestamp: new Date() } }
        }
      );
    } catch (error) {
      console.error("Error updating code:", error);
    }
  });

  // Handle student code branching
  socket.on("student-code-update", async ({ roomId, studentId, code }) => {
    try {
      // Update student's code version in database
      await Room.findOneAndUpdate(
        { roomId, "students.studentId": studentId },
        { $set: { "students.$.codeVersion": code } }
      );
    } catch (error) {
      console.error("Error updating student code:", error);
    }
  });

  // Handle highlight section
  socket.on("highlight-section", ({ roomId, startLine, endLine }) => {
    // Broadcast highlight request to all students in the room
    socket.to(roomId).emit("highlight-section", { startLine, endLine });
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Connect to DB and start server
DBConnection()
  .then(() => {
    server.listen(port, () => {
      console.log("Server running on port", port);
    });
    
    server.on("error", (err) => {
      console.log("Error", err);
      throw err;
    });
  })
  .catch((err) => {
    console.log("Database Connection failed", err);
  });