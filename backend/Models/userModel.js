import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        username : {
            type: String,
            required: true,
            unique: true
        },
        fullname : {
            type: String,
            required: true,
        },
        email : {
            type : String,
            required : true,
            unique : true
        },
        password : {
            type : String,
            required : true,
            min : [8,"Password must be at least 8 characters long"]
        },
        gender : {
            type : String,
            required : true,
            islowercase : true,
            enum : ["male","female"],
        },
        profilepic : {
            type : String,
            default : ""
        },
    },
    {
        timestamps : true
    }
)

const User = mongoose.model("User", userSchema);
export default User;