import Playlist from "../model/playlistModel.js"
import Channel from "../model/channelModel.js"
import Video from "../model/videoModel.js"

// ── CREATE PLAYLIST ───────────────────────────────────────────────
// BUG FIXES:
//  1. param was named "requestAnimationFrame" instead of "req"
//  2. missing Playlist import
//  3. Channel.findByIdAndUpdate syntax had closing paren in wrong place
//  4. videos.length !== videoIds.length compared same value (always false)
export const createPlaylist = async (req, res) => {
    try {
        const { title, description, channelId, videoIds } = req.body

        if (!title || !channelId) {
            return res.status(400).json({ message: "title and channelId are required" })
        }

        const channel = await Channel.findById(channelId)
        if (!channel) {
            return res.status(404).json({ message: "Channel not found" })
        }

        // Validate videoIds only if provided
        let validVideoIds = []
        if (videoIds && videoIds.length > 0) {
            const videos = await Video.find({ _id: { $in: videoIds } })
            validVideoIds = videos.map(v => v._id)
        }

        const playlist = await Playlist.create({
            title,
            description: description || "",
            channel: channelId,
            videos: validVideoIds
        })

        // BUG FIX: was Channel.findByIdAndUpdate(channelId),{ ... }
        // closing paren was before the update object, not after it
        await Channel.findByIdAndUpdate(channelId, {
            $push: { playlists: playlist._id }
        })

        return res.status(201).json(playlist)
    } catch (error) {
        return res.status(500).json({ message: `Failed to create playlist: ${error.message}` })
    }
}

// ── TOGGLE SAVE PLAYLIST ──────────────────────────────────────────
// BUG FIX: model field is "saveBy" (matches schema)
export const toggleSavePlaylist = async (req, res) => {
    try {
        const { playlistId } = req.body
        const userId = req.userId

        const playlist = await Playlist.findById(playlistId)
        if (!playlist) return res.status(404).json({ message: "Playlist not found" })

        if (playlist.saveBy.includes(userId)) {
            playlist.saveBy.pull(userId)
        } else {
            playlist.saveBy.push(userId)
        }

        await playlist.save()
        return res.status(200).json(playlist)
    } catch (error) {
        return res.status(500).json({ message: `Failed to save playlist: ${error.message}` })
    }
}

// ── GET SAVED PLAYLISTS ───────────────────────────────────────────
// BUG FIXES:
//  1. was querying Short model instead of Playlist
//  2. undefined Short reference
export const getSavedPlaylist = async (req, res) => {
    try {
        const userId = req.userId

        const savedPlaylists = await Playlist.find({ saveBy: userId })
            .populate({
                path: "videos",
                populate: { path: "channel", select: "name avatar" }
            })
            .populate("channel", "name avatar")

        return res.status(200).json(savedPlaylists)
    } catch (error) {
        return res.status(500).json({ message: `Failed to get saved playlists: ${error.message}` })
    }
}
