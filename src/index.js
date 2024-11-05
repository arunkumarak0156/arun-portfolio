import * as dotenv from "dotenv"
import {app} from "./app.js"
import connectDB from "./db/db.js"

dotenv.config({
    path: "./.env"
})

const PORT = process.env.PORT || 5000

connectDB()
.then(() => {
    app.listen(PORT, () => {
        console.log(`Server is runing on port ${PORT}`)
    })
})
.catch((error) => {
    console.log(`MongoDB connection Faield: ${error}`)
})

