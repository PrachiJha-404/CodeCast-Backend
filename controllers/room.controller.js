import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/userModel.js"
import { Room } from "../models/roomModel.js"
import { ApiResponse } from "../utils/apiResponse.js";
import jwt from "jsonwebtoken"


//so basically what do we need
//when a person give the cc-pin we have to check if the room exist
const createroom = asyncHandler(async (cc_pin, password, name, accessToken) => {
    //for creating a room we have to get the pin and also the unique id and the name of the room which is optional
    //then see if the room existe if it exists then we have to give an error(but this is highly unlikely but best to take care of it)
    //then we have to add the room to the database and also in the admin part add the user and also in the user add the room
    try {
        const decodedToken = jwt.verify(accessToken,process.env.ACCESS_TOKEN_SECRET)
        const user = User.findById(decodedToken._id).select("-password -refreshToken")
        if (!user) {
            throw new error("User does not exist")
        }
  
        const roomexists = await Room.findOne({ cc_pin })
        if (roomexists) {
            throw new error("Room already exists")
        }
        // const user = await User.findOne({ userid })
        
        const newroom = await Room.create({ cc_pin, name, password, admins: [user._id] })
        user.rooms.push(newroom._id)
        user.save()

        return newroom._id
    } catch (error) {
        console.log("Error is creating a room", error)
    }
})
const addusertoroom = asyncHandler(async (cc_pin,password,accessToken) => { 
    try{
        //add the user to the list of participents
        const decodedToken = jwt.verify(accessToken,process.env.ACCESS_TOKEN_SECRET)
        const user = User.findById(decodedToken._id).select("-password -refreshToken")
        if (!user) {
            throw new error("User does not exist")
        }
        const room = await Room.findOne({cc_pin})
        if(!room){
            throw new error("Room does not exist")
        }
        const ispasswordcorrect = await room.isPasswordCorrect(password)
        if(!ispasswordcorrect){
            throw new error("password not correct")
        }
        user.rooms.push(room._id)
        room.participants.push(user._id)
        room.save()
        user.save()
    }catch(error){
        console.log("Error occured during adding user to room",error)
    }
})

export {createroom , addusertoroom}