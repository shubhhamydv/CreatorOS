import mongoose from "mongoose"

const userSchema  = new mongoose.Schema({
    userName:{
        type:String,
        require:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
    },
    photoUrl:{
        type:String,
        default:""
    },
    channel:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Channel"
    }
},{timestamps:true})

const User = mongoose.model("User",userSchema)

export default User