// routes/roomRoutes.js
const express = require('express');
const router = express.Router();
const { createRoom, joinRoom, getRoomDetails } = require('../controllers/roomController');

// Create a new room
router.post('/create-room', createRoom);

// Join a room
router.get('/join-room/:id/:participantId', joinRoom);

// Get room details
router.get('/room/:id', getRoomDetails);

module.exports = router;