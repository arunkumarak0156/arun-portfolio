import express from "express"
import cors from "cors"
import userRoutes from "./routes/user.route.js"

const app = express()

app.use(cors())
app.use(express.json())

app.use("/api/v1/user", userRoutes)

export {app}