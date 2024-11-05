import mongoose from "mongoose";
import {DB_NAME} from "../constants.js"

const connectDB = async() => {
    const MONGODB_URI = process.env.MONGODB_URI
    try{
        const connectionInstance = await mongoose.connect(`${MONGODB_URI}/${DB_NAME}`)
        console.log(`MongoDB Connected !! DB HOST: ${connectionInstance.connection.host}`)
    }
    catch(error) {
        console.log(`Error in connecting...: ${error}`)
    }
}

export default connectDB