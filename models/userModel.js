const mongoose = require ('mongoose');

//TODO room model's admin and participant fields should reference to this model

const userSchema = new mongoose.Schema({
    uniqueid: {
        type: String, 
        required: true, 
        unique: true 
    },

    name: {
        type: String, 
        required: true
    },

    email:{
        type: String, 
        required: true, 
        unique: true, 
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
, "Please provide a valid email address,"], 
    },

    password: {
        type: String,
        required: true,
    },

    rooms: {type: mongoose.Schema.Types.ObjectID,
        ref: 'Room',
    }
    //creates an array of references to Room
})

export const User = mongoose.model("User", userSchema);
