import uploadOnCloudinary from "../config/cloudinary.js"
import Video from "../model/videoModel.js"
import Channel from "../model/channelModel.js"

export const createVideo = async (req, res) => {
  try {
    const { title, description = "", tags = [], channelId } = req.body

    if (!title || !req.files?.video || !req.files?.thumbnail || !channelId) {
      return res.status(400).json({ message: "title, video, thumbnail, and channelId are required" })
    }

    const channelData = await Channel.findById(channelId)
    if (!channelData) {
      return res.status(404).json({ message: "Channel not found" })
    }

    const uploadedVideo = await uploadOnCloudinary(req.files.video[0].path)
    const uploadedThumbnail = await uploadOnCloudinary(req.files.thumbnail[0].path)

    if (!uploadedVideo || !uploadedThumbnail) {
      return res.status(500).json({ message: "Failed to upload media to Cloudinary" })
    }

    const parsedTags =
      typeof tags === "string"
        ? JSON.parse(tags || "[]")
        : Array.isArray(tags)
        ? tags
        : []

    const newVideo = await Video.create({
      channel: channelData._id,
      title,
      description,
      tags: parsedTags,
      videoUrl: uploadedVideo,
      thumbnail: uploadedThumbnail,
    })

    await Channel.findByIdAndUpdate(channelData._id, {
      $push: { videos: newVideo._id },
    })

    const populatedVideo = await Video.findById(newVideo._id).populate("channel")
    return res.status(201).json({ video: populatedVideo })
  } catch (error) {
    return res.status(500).json({ message: `Failed to create video ${error.message}` })
  }
}

export const getAllVideos = async (req, res) => {
  try {
    const videos = await Video.find()
      .sort({ createdAt: -1 })
      .populate("channel")
      .populate({ path: "comments.author", select: "userName photoUrl" })
      .populate({ path: "comments.replies.author", select: "userName photoUrl" })

    return res.status(200).json({ videos })
  } catch (error) {
    return res.status(500).json({ message: `Failed to get videos ${error.message}` })
  }
}

export const toggleLikes = async (req, res) => {
  try {
    const { videoId } = req.params
    const userId = req.userId
    const video = await Video.findById(videoId)
    if (!video) return res.status(404).json({ message: "Video not found" })

    if (video.likes.includes(userId)) {
      video.likes.pull(userId)
    } else {
      video.likes.push(userId)
      video.dislikes.pull(userId)
    }

    await video.save()
    return res.status(200).json({ video })
  } catch (error) {
    return res.status(500).json({ message: `Failed to like video ${error.message}` })
  }
}

export const toggleDislikes = async (req, res) => {
  try {
    const { videoId } = req.params
    const userId = req.userId
    const video = await Video.findById(videoId)
    if (!video) return res.status(404).json({ message: "Video not found" })

    if (video.dislikes.includes(userId)) {
      video.dislikes.pull(userId)
    } else {
      video.dislikes.push(userId)
      video.likes.pull(userId)
    }

    await video.save()
    return res.status(200).json({ video })
  } catch (error) {
    return res.status(500).json({ message: `Failed to dislike video ${error.message}` })
  }
}

export const toggleSave = async (req, res) => {
  try {
    const { videoId } = req.params
    const userId = req.userId
    const video = await Video.findById(videoId)
    if (!video) return res.status(404).json({ message: "Video not found" })

    if (video.savedBy.includes(userId)) {
      video.savedBy.pull(userId)
    } else {
      video.savedBy.push(userId)
    }

    await video.save()
    return res.status(200).json({ video })
  } catch (error) {
    return res.status(500).json({ message: `Failed to save video ${error.message}` })
  }
}

export const getViews = async (req, res) => {
  try {
    const { videoId } = req.params
    const video = await Video.findByIdAndUpdate(videoId, { $inc: { views: 1 } }, { new: true })
    if (!video) return res.status(404).json({ message: "Video not found" })
    return res.status(200).json({ video })
  } catch (error) {
    return res.status(500).json({ message: `Failed to update views ${error.message}` })
  }
}

export const addComment = async (req, res) => {
  try {
    const { videoId } = req.params
    const { message } = req.body
    if (!message) return res.status(400).json({ message: "Comment message is required" })

    const video = await Video.findById(videoId)
    if (!video) return res.status(404).json({ message: "Video not found" })

    video.comments.push({ author: req.userId, message })
    await video.save()

    const populatedVideo = await Video.findById(videoId)
      .populate("channel")
      .populate({ path: "comments.author", select: "userName photoUrl" })
      .populate({ path: "comments.replies.author", select: "userName photoUrl" })

    return res.status(200).json({ video: populatedVideo })
  } catch (error) {
    return res.status(500).json({ message: `Error adding comment ${error.message}` })
  }
}

export const addReply = async (req, res) => {
  try {
    const { videoId, commentId } = req.params
    const { message } = req.body
    if (!message) return res.status(400).json({ message: "Reply message is required" })

    const video = await Video.findById(videoId)
    if (!video) return res.status(404).json({ message: "Video not found" })

    const comment = video.comments.id(commentId)
    if (!comment) return res.status(404).json({ message: "Comment not found" })

    comment.replies.push({ author: req.userId, message })
    await video.save()

    const populatedVideo = await Video.findById(videoId)
      .populate("channel")
      .populate({ path: "comments.author", select: "userName photoUrl" })
      .populate({ path: "comments.replies.author", select: "userName photoUrl" })

    return res.status(200).json({ video: populatedVideo })
  } catch (error) {
    return res.status(500).json({ message: `Error adding reply ${error.message}` })
  }
}

export const getLikedVideo = async (req, res) => {
  try {
    const userId = req.userId
    const likedVideos = await Video.find({ likes: userId }).populate("channel", "name avatar")
    return res.status(200).json({ videos: likedVideos })
  } catch (error) {
    return res.status(500).json({ message: `Error retrieving liked videos ${error.message}` })
  }
}

export const getSavedVideo = async (req, res) => {
  try {
    const userId = req.userId
    const savedVideos = await Video.find({ savedBy: userId }).populate("channel", "name avatar")
    return res.status(200).json({ videos: savedVideos })
  } catch (error) {
    return res.status(500).json({ message: `Error retrieving saved videos ${error.message}` })
  }
}


