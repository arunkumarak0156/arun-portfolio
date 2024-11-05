import {data} from "../../public/users.js"
import { User } from "../models/user.model.js"

const getUser = async(req, res) => {
    const users = await User.find()
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
}

const getUserById = async(req, res) => {
    // console.log(req.params)
    const user = data.filter((user) => (user.id === req.query.id))

    return res.status(200).json({
        success: true,
        message: `User Detail`,
        data: user
    })
}

const createUser = async(req, res) => {
    // console.log(req.body)
    const data = req.body
    const user = await User.create(data)

    if(!user) {
        return res.status(404).json({
            success: false,
            message: `User creation error`,
        })
    }

    return res.status(201).json({
        success: true,
        message: `User Created`,
        data: user
    })
}

export {
    getUser,
    getUserById,
    createUser
}