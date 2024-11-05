import {Router} from "express"
import {
    createUser,
    getUser,
    getUserById
} from "../controllers/user.controller.js"

const router = Router()

router.route("/users").get(getUser)
router.route("/user/:id").get(getUserById)
router.route("/create").post(createUser)

export default router