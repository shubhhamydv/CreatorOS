import mongoose, { Types }  from "mongoose";

const channelSchema = new mongoose.Schema({
   owner:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
   },
   name:{
    type:String,
    required:true,
    unique:true
   },
   description:{
    type:String,
    default:""
   },
   category:{
    type:String,
    required:true
   },
   banner:{
    type:String,
    default:""
   },
   avatar:{
    type:String,
    default:""
   },
  subscribers:
    [{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    videos:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Video"
    }],
    shorts:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Short"
    }],
    playlists:[{
       type:mongoose.Schema.Types.ObjectId,
       ref:"Playlist"
    }],
    posts:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Post"
    }]


},{timestamps:true})

const Channel = mongoose.model("Channel", channelSchema)

export default Channel