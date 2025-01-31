import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/userModel.js"
import { ApiResponse } from "../utils/apiResponse.js";
import jwt from "jsonwebtoken"
import mongoose from "mongoose";

const generateAccessAndRefereshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })
        return { accessToken, refreshToken }


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}

const registerUser = asyncHandler(async (req, res) => {
    // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res
    console.log("hiii")

    const { name, email, password } = req.body
    console.log("email: ", email);

    if (
        [name, email, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({ email })

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists")
    }

    const user = await User.create({
        name,
        email,
        password,
    })

    // const createdUser = await User.findById(user._id).select(
    //     "-password -refreshToken"
    // )

    // if (!createdUser) {
    //     throw new ApiError(500, "Something went wrong while registering the user")
    // }
    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens()
        user.accessToken = accessToken,
            user.refreshToken = refreshToken
        user.save();
        const loggedinUser = user.toObject()
        delete loggedinUser.password
        delete loggedinUser.refreshToken

        const options = {
            httpOnly: true,
            secure: true
        }
        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    {
                        user: loggedinUser, accessToken, refreshToken
                    },
                    "User registered and logged In Successfully"
                )
            )
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401, "unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
        //contains the payload that is encrypted in the token

        const user = await User.findById(decodedToken?._id)

        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used")

        }

        const options = {
            httpOnly: true,
            secure: true
        }

        const { accessToken, newRefreshToken } = await generateAccessAndRefereshTokens(user._id)

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    { accessToken, refreshToken: newRefreshToken },
                    "Access token refreshed"
                )
            )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }

})

const loginUser = asyncHandler(async (req, res) => {
    //get data from user
    //check if user exists
    //check if password is correct
    //then generate acceses and referesh token
    //set the cookies
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email })
        if (!user) {
            throw new ApiError(404, "User not found")
        }

        const ispasswordcorrect = await user.isPasswordCorrect(password)
        if (!ispasswordcorrect) {
            throw new ApiError(401, "Email or Password not valid")
        }

        const { accessToken, refreshToken } = await generateAccessAndRefereshTokens()
        user.accessToken = accessToken,
            user.refreshToken = refreshToken
        user.save();
        const loggedinUser = user.toObject()
        delete loggedinUser.password
        delete loggedinUser.refreshToken

        const options = {
            httpOnly: true,
            secure: true
        }
        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    {
                        user: loggedinUser, accessToken, refreshToken
                    },
                    "User logged In Successfully"
                )
            )
    } catch (error) {
        throw new ApiError(400, "Something went worng while loging in the user")
    }
})


const logoutUser = asyncHandler(async (req, res) => {
    try {
        const userid = req.user._id
        await User.findByIdAndUpdate(
            userid,
            {
                _set: {
                    refreshToken: undefined
                }
            }, {
            new: true
        }
        )

        const options = {
            httpOnly: true,
            secure: true,
        }

        res
            .status(200)
            .clearcookie("accessToken", options)
            .clearcookie("refreshToken", options)
            .json(new ApiResponse(200, {}, "User looged out successfully"))


    } catch (error) {
        throw new ApiError(200, "Something went worng when logging the user out")
    }
})
const getCurrentUser = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(new ApiResponse(
            200,
            req.user,
            "User fetched successfully"
        ))
})

const updateName = asyncHandler(async (req, res) => {

    try {
        const { newname } = req.body
        const user = req.user

        const user_mongo = await User.findById(user._id)

        if (!user_mongo) {
            throw new ApiError(401, "User does not exist")
        }
        user_mongo.name = newname
        await user_mongo.save({ validateBeforeSave: false })
        res
            .status(200)
            .json(new ApiResponse(200, {}, "Name Updated Successfully"))
    } catch (error) {
        throw new ApiError(400, "Something happened while updating name")
    }
})

const changeCurrentPassword = asyncHandler(async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body
        const user = await User.findById(req.user._id)
        if (!user) {
            throw new ApiError(401, "User does not exist")
        }
        const ispasswordCorrect = user.isPasswordCorrect(oldPassword)
        if (!ispasswordCorrect) {
            throw new ApiError(402, "Invalid Credentials")
        }
        user.password = newPassword
        await user.save({ validateBeforeSave: false })
        res.status(200).json(ApiResponse(200, {}, "Password updated successfully"))
        //is is getting encrypted before saving to the database
    } catch (error) {
        throw new ApiError(400, "Something went wrong while updating password")
    }
})
//TODO Login, logout, change password, update account details, get user rooms

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    updateName,
    changeCurrentPassword,
    getCurrentUser,
    //updateAccountDetails,
    //getUserRooms
}
