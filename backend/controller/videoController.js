import uploadOnCloudinary from "../config/cloudinary.js"
import Video from "../model/videoModel.js"
import Channel from "../model/channelModel.js"

// ── CREATE VIDEO ──────────────────────────────────────────────────
export const createVideo = async (req, res) => {
    try {
        const { title, description, tags, channelId } = req.body

        if (!title || !req.files?.video || !req.files?.thumbnail || !channelId) {
            return res.status(400).json({ message: "title, video, thumbnail, channelId are required" })
        }

        const channelData = await Channel.findById(channelId)
        if (!channelData) return res.status(404).json({ message: "Channel not found" })

        const uploadedVideo = await uploadOnCloudinary(req.files.video[0].path)
        const uploadedThumbnail = await uploadOnCloudinary(req.files.thumbnail[0].path)

        if (!uploadedVideo || !uploadedThumbnail) {
            return res.status(500).json({ message: "Failed to upload to Cloudinary" })
        }

        let parseTag = []
        if (tags) { try { parseTag = JSON.parse(tags) } catch { parseTag = [] } }

        const newVideo = await Video.create({
            title,
            channel: channelData._id,
            description: description || "",
            tags: parseTag,
            videoUrl: uploadedVideo,
            thumbnail: uploadedThumbnail
        })

        await Channel.findByIdAndUpdate(channelData._id, { $push: { videos: newVideo._id } })

        const populatedVideo = await Video.findById(newVideo._id).populate("channel")
        return res.status(201).json(populatedVideo)
    } catch (error) {
        return res.status(500).json({ message: `Failed to create video: ${error.message}` })
    }
}

// ── GET ALL VIDEOS ────────────────────────────────────────────────
export const getAllVideos = async (req, res) => {
    try {
        const videos = await Video.find()
            .sort({ createdAt: -1 })
            .populate("channel")
            .populate("comments.author", "userName photoUrl")
            .populate("comments.replies.author", "userName photoUrl")

        return res.status(200).json({ videos })
    } catch (error) {
        return res.status(500).json({ message: `Failed to get videos: ${error.message}` })
    }
}

// ── TOGGLE LIKE ───────────────────────────────────────────────────
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
        return res.status(200).json(video)
    } catch (error) {
        return res.status(500).json({ message: `Failed to toggle like: ${error.message}` })
    }
}

// ── TOGGLE DISLIKE ────────────────────────────────────────────────
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
        return res.status(200).json(video)
    } catch (error) {
        return res.status(500).json({ message: `Failed to toggle dislike: ${error.message}` })
    }
}

// ── TOGGLE SAVE ───────────────────────────────────────────────────
// BUG FIX: model field is "savedBy" not "saveBy"
export const toggleSave = async (req, res) => {
    try {
        const { videoId } = req.params
        const userId = req.userId

        const video = await Video.findById(videoId)
        if (!video) return res.status(404).json({ message: "Video not found" })

        // BUG FIX: was "saveBy" — correct field name is "savedBy"
        if (video.savedBy.includes(userId)) {
            video.savedBy.pull(userId)
        } else {
            video.savedBy.push(userId)
        }

        await video.save()
        return res.status(200).json(video)
    } catch (error) {
        return res.status(500).json({ message: `Failed to toggle save: ${error.message}` })
    }
}

// ── ADD VIEW ──────────────────────────────────────────────────────
// BUG FIX: was returning res.status(500) on success — changed to 200
export const getViews = async (req, res) => {
    try {
        const { videoId } = req.params
        const video = await Video.findByIdAndUpdate(
            videoId,
            { $inc: { views: 1 } },
            { new: true }
        )
        if (!video) return res.status(404).json({ message: "Video not found" })
        return res.status(200).json(video)
    } catch (error) {
        return res.status(500).json({ message: `Failed to add view: ${error.message}` })
    }
}

// ── ADD COMMENT ───────────────────────────────────────────────────
export const addComment = async (req, res) => {
    try {
        const { videoId } = req.params
        const { message } = req.body
        const userId = req.userId

        if (!message) return res.status(400).json({ message: "Message is required" })

        const video = await Video.findById(videoId)
        if (!video) return res.status(404).json({ message: "Video not found" })

        video.comments.push({ author: userId, message })
        await video.save()

        const populated = await Video.findById(videoId)
            .populate("comments.author", "userName photoUrl")
            .populate("comments.replies.author", "userName photoUrl")

        return res.status(200).json(populated)
    } catch (error) {
        return res.status(500).json({ message: `Failed to add comment: ${error.message}` })
    }
}

// ── ADD REPLY ─────────────────────────────────────────────────────
export const addReply = async (req, res) => {
    try {
        const { videoId, commentId } = req.params
        const { message } = req.body
        const userId = req.userId

        if (!message) return res.status(400).json({ message: "Message is required" })

        const video = await Video.findById(videoId)
        if (!video) return res.status(404).json({ message: "Video not found" })

        const comment = video.comments.id(commentId)
        if (!comment) return res.status(404).json({ message: "Comment not found" })

        comment.replies.push({ author: userId, message })
        await video.save()

        const populated = await Video.findById(videoId)
            .populate("comments.author", "userName photoUrl")
            .populate("comments.replies.author", "userName photoUrl")

        return res.status(200).json(populated)
    } catch (error) {
        return res.status(500).json({ message: `Failed to add reply: ${error.message}` })
    }
}

// ── GET LIKED VIDEOS ──────────────────────────────────────────────
export const getLikedVideo = async (req, res) => {
    try {
        const userId = req.userId
        const likedVideos = await Video.find({ likes: userId })
            .populate("channel", "name avatar")

        return res.status(200).json(likedVideos)
    } catch (error) {
        return res.status(500).json({ message: `Failed to get liked videos: ${error.message}` })
    }
}

// ── GET SAVED VIDEOS ──────────────────────────────────────────────
// BUG FIXES:
//  1. was querying field "saveBy" — correct is "savedBy"
//  2. return variable was "SavedVideo" (undefined) — fixed to use result directly
export const getSaveVideo = async (req, res) => {
    try {
        const userId = req.userId

        // BUG FIX: field is "savedBy" not "saveBy"
        const savedVideos = await Video.find({ savedBy: userId })
            .populate("channel", "name avatar")

        return res.status(200).json(savedVideos)
    } catch (error) {
        return res.status(500).json({ message: `Failed to get saved videos: ${error.message}` })
    }
}
