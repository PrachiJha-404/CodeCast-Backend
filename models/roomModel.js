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

roomSchema.pre("save" ,async (next)=>{
    if(!this.isModified("password")) next();
    
    this.password = await bcrypt.hash(this.password, 10)
    next();
})

roomSchema.methods.isPasswordCorrect = async (password)=>{
    return await bcrypt.compare(this.password , password)
}

export const Room = mongoose.model("Room", roomSchema);


