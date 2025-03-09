const Room = require('../models/roomModel');
const { v4: uuidv4 } = require('uuid');

// Create a new room
const createRoom = async (req, res) => {
  try {
    const { name, password, admins } = req.body;
    
    if (!name || !password || !admins) {
      return res.status(400).json({ message: 'Name, password, and admins are required' });
    }
    
    const id = uuidv4(); // Generate unique room ID
    const newRoom = await Room.create({
      id,
      name,
      password,
      admins,
      participants: {},
      directories: []
    });

    return res.status(201).json({ 
      success: true, 
      room: newRoom,
      message: 'Room created successfully' 
    });
  } catch (error) {
    console.error('Error creating room:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to create room',
      error: error.message 
    });
  }
};

// Join a room
const joinRoom = async (req, res) => {
  try {
    const { id, participantId } = req.params; // Use `id` instead of `roomId`

    if (!id || !participantId) {
      return res.status(400).json({ message: 'Room ID and Participant ID are required' });
    }

    const room = await Room.findOne({ id });

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Check if participant is already in the room
    if (!room.participants[participantId]) {
      room.participants[participantId] = true;
      await room.save();
    }

    return res.status(200).json({ 
      success: true,
      room: {
        id: room.id,
        name: room.name,
        directories: room.directories,
        admins: room.admins,
        participants: Object.keys(room.participants).length
      },
      message: 'Joined room successfully' 
    });
  } catch (error) {
    console.error('Error joining room:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to join room',
      error: error.message 
    });
  }
};

// Get room details
const getRoomDetails = async (req, res) => {
  try {
    const { id } = req.params; // Use `id` instead of `roomId`

    if (!id) {
      return res.status(400).json({ message: 'Room ID is required' });
    }

    const room = await Room.findOne({ id });

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    return res.status(200).json({ 
      success: true,
      room: {
        id: room.id,
        name: room.name,
        admins: room.admins,
        participants: Object.keys(room.participants).length,
        directories: room.directories
      }
    });
  } catch (error) {
    console.error('Error getting room details:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to get room details',
      error: error.message 
    });
  }
};

module.exports = {
  createRoom,
  joinRoom,
  getRoomDetails
};
