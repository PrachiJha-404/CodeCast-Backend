import mongoose from "mongoose"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

//TODO room model's admin and participant fields should reference to this model

//I am removing uniqueid as it is generated by the mongodb
const userSchema = new mongoose.Schema(
    {

        name: {
            type: String,
            required: true
        },

        username: {
            type: String,
            required: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
                , "Please provide a valid email address,"],
        },

        password: {
            type: String,
            required: [true, 'Password is required']
        },

        refreshToken: {
            type: String
        },

        //for an array this should be [] right?
        rooms: [{
            type: mongoose.Schema.Types.ObjectID,
            ref: 'Room',
        }],
        //creates an array of references to Room
    },
    {
        timestamps: true
    }
)

//To hash the password before storing this to the database

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

//@nikhita for user login
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            name: this.name
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,

        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}




export const User = mongoose.model("User", userSchema);
