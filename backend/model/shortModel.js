import mongoose from "mongoose";

const replySchema = new mongoose.Schema({

     author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
      },
      message:{
        type:String,
        required:true
      },
      createAt:{type:Date,default:Date.now},
      updatedAt:{type:Date}
},{_id:time})

const commentSchema  = new mongoose.Schema({
      author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
      },
      message:{
        type:String,
        required:true
      },
      replies:{
        replySchema
      },
      createAt:{type:Date,default:Date.now},
      updatedAt:{type:Date}
},{_id:true})


const shorrtSchema  =new mongoose.Schema({
    channel:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Channel",
        required:true
    },
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        default:""
    },
    shortUrl:{
        type:String,
        required:true
    },
    tags:{
        type:String
    },
    views:{
        tpe:String,
        default:0
    },
    like:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",

    }],
    dislike:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",

    }],
     saveBy:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",

    }],
    comments:{
     commentSchema
    }



},{timestamps:true})

const Short = mongoose.model("Short", shortSchema)

export default Short