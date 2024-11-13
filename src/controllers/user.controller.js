import {data} from "../../public/users.js"
import { User } from "../models/user.model.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"

const getAccessToken = async(user) => {
    try{
        return await user.generateAccessToken()     
    } catch(error) {
        throw new ApiError(500, `Something went wrong wile generating access token ${error}`)
    }
}

const getUser = asyncHandler ( async(req, res) => {
    const users = await User.find().select(["-password", "-token"])
    if(!users) {
        return res.status(400).json({
            success: false,
            message: "User not found",
        })
    }
    return res.status(200).json({
        success: true,
        message: `Total users ${users.length}`,
        length: users.length,
        data: users
    })
})

const getUserById = asyncHandler ( async(req, res) => {
    // console.log(req.params)
    const user = data.filter((user) => (user.id === req.query.id))

    return res.status(200).json({
        success: true,
        message: `User Detail`,
        data: user
    })
})

const createUser = asyncHandler ( async(req, res) => {
    const { fullName, userName, email, mobileNo, password } = req.body

    const userexist = await User.findOne({
        $or: [{ userName }, { email }]
    })

    if(userexist) {
        return res.status(404).json({
            success: false,
            message: "User allready exist"
        })
    }

    const user = await User.create(req.body)
    
    console.log(user._id)

    const createdUser = await User.findById(user._id).select(["-password", "-token"])
    console.log(createdUser._id)

    if(!createdUser) {
        return res.status(400).json({
            success: false,
            message: "Something went wrong while creating User"
        })
    }

    return res.status(201).json({
        success: true,
        message: `User Created`,
        data: createdUser
    })
})

const userLogin = asyncHandler(async(req, res, next) => {
    const { userName, password, email } = req.body

    if(!userName && !email) {
        return res.status(400).json({
            success: false,
            message: "Username or password is required"
        })
    }

    const user = await User.findOne({
        $or: [{ userName }, { email }]
    })

    if(!user) {
        return res.status(400).json({
            success: false,
            message: "Invalide credentials"
        })
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if(!isPasswordValid) {
        throw new ApiError(401, "Wrong password")
        // return res.status(400).json({
        //     success: false,
        //     message: "Wrong password"
        // })
    }

    const token = await getAccessToken(user)

    const loggedUser = await User.findById(user._id)
    // const loggedUser = await User.findById(user._id).select(["-password", "token"])
    loggedUser.token = token
    loggedUser.save({validateBeforeSave: false})

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", token, options)
    .json({
        success: true,
        data: loggedUser,
        message: "Login succefully",
    })

})

export {
    getUser,
    getUserById,
    createUser,
    userLogin
}