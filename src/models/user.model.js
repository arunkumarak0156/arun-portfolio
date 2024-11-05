import mongoose, {Schema} from "mongoose";

const userChema = new Schema({
    fullName: {
        type: String,
        require: [true, `Please add First Name`],
    },
    userName: {
        type: String,
        require: true,
        unique: [true, `User name can't be duplicate`],
    },
    email: {
        type: String,
    },
    mobileNo: {
        type: Number
    },
    password: {
        type: String
    }
},
{timestamps: true}
)

// userChema.pre("save", )

export const User = mongoose.model("User", userChema)