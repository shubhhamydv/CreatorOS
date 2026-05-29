import mongoose from "mongoose";

const replySchema = new mongoose.Schema({

    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    message: {
        type: String,
    },
    createAt: { type: Date, default: Date.now },
    updatedAt: { type: Date }
}, { _id: time })

const commentSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    message: {
        type: String,
    },
    replies: {
        replySchema
    },
    createAt: { type: Date, default: Date.now },
    updatedAt: { type: Date }
}, { _id: true })


const postSchema = new mongoose.Schema({
    channel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Channel",
        required: true
    },
    content: {
        type: String,
        required: true
    },
    image:{
        type:String
    },
    like: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",

    }],

    comments: {
        commentSchema
    }



}, { timestamps: true })

const Post = mongoose.model("post", postSchema)

export default post