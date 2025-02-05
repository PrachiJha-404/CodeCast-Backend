import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/userModel.js"
import { Room } from "../models/roomModel.js"
import { ApiResponse } from "../utils/apiResponse.js";
import jwt from "jsonwebtoken"


//so basically what do we need
//when a person give the cc-pin we have to check if the room exist

const createroom = asyncHandler(async (cc_pin, password, name, userid) => {
    //for creating a room we have to get the pin and also the unique id and the name of the room which is optional
    //then see if the room existe if it exists then we have to give an error(but this is highly unlikely but best to take care of it)
    //then we have to add the room to the database and also in the admin part add the user and also in the user add the room
    try {
        const roomexists = await Room.findOne({ cc_pin })
        if (roomexists) {
            return null
        }
        const newroom = await Room.create({ cc_pin, name, password, admins: [userid] })

        const user = await User.findOne({ userid })
        if (!user) {
            throw new error("User does not exist")
        }
        user.rooms.push(newroom._id)
        user.save()

        return newroom._id
    } catch (error) {
        console.log("Error is creating a room", error)
    }
})
const addroom = asyncHandler(async () => { })