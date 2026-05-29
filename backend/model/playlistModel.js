import mongoose from "mongoose";




const playlistSchema = new mongoose.Schema({
    channel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Channel",
        required: true
    },
 
     title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        default:""
    },
   
     videos:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Video"
        }],
    saveBy:[{
           type:mongoose.Schema.Types.ObjectId,
           ref:"User",
   
       }]
}, { timestamps: true })

const playlistSchema = mongoose.model("playlist", playlistSchema)

export default Playlist