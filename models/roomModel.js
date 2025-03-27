import mongoose from "mongoose"
import bcrypt from "bcrypt"


//TODO after createing user model add it to admins and participants
const roomSchema = new mongoose.Schema({
    cc_pin: {
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
    admins: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    participants: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    directories: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "File"
        }
    ]
}, {
    timestamps: true,
});

//changed the way 'this' was being used in arrow functions in both of these Mongoose Middlewares

roomSchema.pre("save" ,async function (next) {
    if(!this.isModified("password")) next();
    
    this.password = await bcrypt.hash(this.password, 10)
    next();
});

roomSchema.methods.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password , this.password)
};

//bcrypt.compare(plainTextPassword, hashedPassword) - this is the right syntax it seems so swapping this.password and password

export const Room = mongoose.model("Room", roomSchema);


