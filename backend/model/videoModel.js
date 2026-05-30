import mongoose from "mongoose"

// =====================
// Reply Schema
// =====================
const replySchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    message: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
    },
  },
  { _id: true }
)

// =====================
// Comment Schema
// =====================
const commentSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    message: {
      type: String,
      required: true,
    },
    replies: [replySchema],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
    },
  },
  { timestamps: true }
)

// =====================
// Video Schema
// =====================
const videoSchema = new mongoose.Schema(
  {
    channel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Channel",
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    videoUrl: {
      type: String,
      required: true,
    },

    thumbnail: {
      type: String,
      required: true,
    },

    tags: {
      type: [String],
      default: [],
    },

    views: {
      type: Number,
      default: 0,
    },

    like: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    dislike: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    savedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    comments: [commentSchema],
  },
  { timestamps: true }
)

// =====================
// Model Export
// =====================
const Video = mongoose.model("Video", videoSchema)

export default Video