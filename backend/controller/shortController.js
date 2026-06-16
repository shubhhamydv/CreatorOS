import uploadOnCloudinary from "../config/cloudinary.js"
import Channel from "../model/channelModel.js"
import Short from "../model/shortModel.js"

// ── CREATE SHORT ──────────────────────────────────────────────────
export const createShort = async (req, res) => {
    try {
        const { title, description, tags, channelId } = req.body

        if (!title || !channelId) {
            return res.status(400).json({ message: "title and channelId are required" })
        }

        const channelData = await Channel.findById(channelId)
        if (!channelData) return res.status(404).json({ message: "Channel not found" })

        let shortUrl = ""
        if (req.file) {
            shortUrl = await uploadOnCloudinary(req.file.path)
        }

        const newShort = await Short.create({
            channel: channelData._id,
            title,
            description: description || "",
            shortUrl,
            tags: tags ? JSON.parse(tags) : []
        })

        await Channel.findByIdAndUpdate(channelData._id, {
            $push: { shorts: newShort._id }
        })

        const populatedShort = await Short.findById(newShort._id).populate("channel")
        return res.status(201).json({ success: true, short: populatedShort })
    } catch (error) {
        return res.status(500).json({ message: `Failed to create short: ${error.message}` })
    }
}

// ── GET ALL SHORTS ────────────────────────────────────────────────
export const getAllShorts = async (req, res) => {
    try {
        const shorts = await Short.find()
            .sort({ createdAt: -1 })
            .populate("channel")
            .populate("comments.author", "userName photoUrl")

        return res.status(200).json({ success: true, shorts })
    } catch (error) {
        return res.status(500).json({ message: `Failed to get shorts: ${error.message}` })
    }
}

// ── TOGGLE LIKE ───────────────────────────────────────────────────
// BUG FIXES:
//  1. was using "Video.findById" instead of "Short.findById"
//  2. used "video" variable name throughout (should be "short")
//  3. called "video.disLikes" — correct field is "dislikes"
//  4. had stray "await short.populate('channel')" inside if block
export const toggleLikes1 = async (req, res) => {
    try {
        const { shortId } = req.params
        const userId = req.userId

        // BUG FIX: was "Video.findById(videoId)" — should be Short + shortId
        const short = await Short.findById(shortId)
        if (!short) return res.status(404).json({ message: "Short not found" })

        if (short.likes.includes(userId)) {
            short.likes.pull(userId)
        } else {
            short.likes.push(userId)
            // BUG FIX: was "video.disLikes" — correct field is "dislikes"
            short.dislikes.pull(userId)
        }

        await short.save()
        return res.status(200).json(short)
    } catch (error) {
        return res.status(500).json({ message: `Failed to toggle like: ${error.message}` })
    }
}

// ── TOGGLE DISLIKE ────────────────────────────────────────────────
export const toggleDislikes1 = async (req, res) => {
    try {
        const { shortId } = req.params
        const userId = req.userId

        const short = await Short.findById(shortId)
        if (!short) return res.status(404).json({ message: "Short not found" })

        if (short.dislikes.includes(userId)) {
            short.dislikes.pull(userId)
        } else {
            short.dislikes.push(userId)
            short.likes.pull(userId)
        }

        await short.save()
        return res.status(200).json(short)
    } catch (error) {
        return res.status(500).json({ message: `Failed to toggle dislike: ${error.message}` })
    }
}

// ── TOGGLE SAVE ───────────────────────────────────────────────────
// BUG FIXES:
//  1. was querying "Video.findById" instead of "Short.findById"
//  2. field was "saveBy" — correct field in shortModel is "savedBy"
export const toggleSave1 = async (req, res) => {
    try {
        const { shortId } = req.params
        const userId = req.userId

        // BUG FIX: was "Video.findById" — should be Short
        const short = await Short.findById(shortId)
        if (!short) return res.status(404).json({ message: "Short not found" })

        // BUG FIX: was "saveBy" — correct field is "savedBy"
        if (short.savedBy.includes(userId)) {
            short.savedBy.pull(userId)
        } else {
            short.savedBy.push(userId)
        }

        await short.save()
        return res.status(200).json(short)
    } catch (error) {
        return res.status(500).json({ message: `Failed to toggle save: ${error.message}` })
    }
}

// ── ADD VIEW ──────────────────────────────────────────────────────
// BUG FIX: was returning res.status(500) on success — changed to 200
export const getViews1 = async (req, res) => {
    try {
        const { shortId } = req.params
        const short = await Short.findByIdAndUpdate(
            shortId,
            { $inc: { views: 1 } },
            { new: true }
        )
        if (!short) return res.status(404).json({ message: "Short not found" })
        // BUG FIX: was res.status(500) — should be 200
        return res.status(200).json(short)
    } catch (error) {
        return res.status(500).json({ message: `Failed to add view: ${error.message}` })
    }
}

// ── ADD COMMENT ───────────────────────────────────────────────────
export const addComment1 = async (req, res) => {
    try {
        const { shortId } = req.params
        const { message } = req.body
        const userId = req.userId

        if (!message) return res.status(400).json({ message: "Message is required" })

        const short = await Short.findById(shortId)
        if (!short) return res.status(404).json({ message: "Short not found" })

        short.comments.push({ author: userId, message })
        await short.save()

        const populated = await Short.findById(shortId)
            .populate("channel")
            .populate("comments.author", "userName photoUrl")
            .populate("comments.replies.author", "userName photoUrl")

        return res.status(200).json(populated)
    } catch (error) {
        return res.status(500).json({ message: `Failed to add comment: ${error.message}` })
    }
}

// ── ADD REPLY ─────────────────────────────────────────────────────
export const addReply1 = async (req, res) => {
    try {
        const { shortId, commentId } = req.params
        const { message } = req.body
        const userId = req.userId

        if (!message) return res.status(400).json({ message: "Message is required" })

        const short = await Short.findById(shortId)
        if (!short) return res.status(404).json({ message: "Short not found" })

        const comment = short.comments.id(commentId)
        if (!comment) return res.status(404).json({ message: "Comment not found" })

        comment.replies.push({ author: userId, message })
        await short.save()

        const populated = await Short.findById(shortId)
            .populate("channel")
            .populate("comments.author", "userName photoUrl")
            .populate("comments.replies.author", "userName photoUrl")

        return res.status(200).json(populated)
    } catch (error) {
        return res.status(500).json({ message: `Failed to add reply: ${error.message}` })
    }
}

// ── GET LIKED SHORTS ──────────────────────────────────────────────
export const getLikedShort = async (req, res) => {
    try {
        const userId = req.userId
        const likedShorts = await Short.find({ likes: userId })
            .populate("channel", "name avatar")

        return res.status(200).json(likedShorts)
    } catch (error) {
        return res.status(500).json({ message: `Failed to get liked shorts: ${error.message}` })
    }
}

// ── GET SAVED SHORTS ──────────────────────────────────────────────
// BUG FIX: was querying "savedBy" but model field is also "savedBy" — correct
// but return variable was "SavedShort" (capital S) while query result was also "SavedShort" — OK here
export const getSavedShort = async (req, res) => {
    try {
        const userId = req.userId
        const savedShorts = await Short.find({ savedBy: userId })
            .populate("channel", "name avatar")

        return res.status(200).json(savedShorts)
    } catch (error) {
        return res.status(500).json({ message: `Failed to get saved shorts: ${error.message}` })
    }
}
