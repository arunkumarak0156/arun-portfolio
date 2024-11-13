import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userChema = new Schema({
    fullName: {
        type: String,
        required: [true, `Please add Full Name`],
    },
    userName: {
        type: String,
        required: [true, "Username is required"],
        unique: [true, `User name can't be duplicate`],
        trim: true,
        lowercase: true,
        index: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    mobileNo: {
        type: Number,
        required: [true, "Mobile Number is required"],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    watchHistory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
    },
    token: {
        type: String,
    },
    isActive: {
        type: Boolean,
        default: true
    },
    role: {
        type: String,
        enum: ["admin", "hr", "maager", "operator", "guest"],
        default: "guest"
    }
},
{
    timestamps: true
}
)

userChema.pre("save", async function(next){
    if(!this.isModified("password")) return next()
    
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userChema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

userChema.methods.generateAccessToken = async function(){    
    return await jwt.sign(
        {
            _id: this._id,
            userName: this.userName,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRE,
        }
    )
}

export const User = mongoose.model("User", userChema)