const mongoose = require("mongoose");


//TODO after createing user model add it to admins and participants
const roomSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    admins: {},
    participants: {},
    directories: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "File"
        }
    ]
}, {
    timestamps: true,
});

export const Room = mongoose.model("Room", roomSchema);