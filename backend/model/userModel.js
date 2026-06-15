import mongoose from "mongoose"

const historySchema = new mongoose.Schema(
  {
    contentId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "history.contentType",
      required: true,
    },
    contentType: {
      type: String,
      enum: ["Video", "Short"],
      required: true,
    },
    watchedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
)

const userSchema  = new mongoose.Schema({
    userName:{
        type:String,
        required:true
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
    },
    refreshTokens:[
      {
        type:String,
      }
    ],
    watchLater:[
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video"
      }
    ],
    history:[historySchema],
    resetOtp:{type:String},
    otpExpires:{type:Date},
    isOtpVerified:{type:Boolean, default:false}
},{timestamps:true})

const User = mongoose.model("User",userSchema)

export default User