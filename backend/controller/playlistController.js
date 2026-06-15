import Channel from "../model/channelModel.js"
import Video from "../model/videoModel.js"
import Playlist from "../model/playlistModel.js"

export const createPlaylist = async (req, res) => {
  try {
    const { title, description = "", channelId, videoIds = [] } = req.body

    if (!title || !channelId) {
      return res.status(400).json({ message: "Playlist title and channelId are required" })
    }

    const channel = await Channel.findById(channelId)
    if (!channel) {
      return res.status(404).json({ message: "Channel not found" })
    }

    const parsedVideoIds =
      typeof videoIds === "string" ? JSON.parse(videoIds) : Array.isArray(videoIds) ? videoIds : []

    const videos = await Video.find({
      _id: { $in: parsedVideoIds },
      channel: channelId,
    })

    if (videos.length !== parsedVideoIds.length) {
      return res.status(400).json({ message: "Some videos were not found or not owned by this channel" })
    }

    const playlist = await Playlist.create({
      title,
      description,
      channel: channelId,
      videos: parsedVideoIds,
    })

    await Channel.findByIdAndUpdate(channelId, {
      $push: { playlists: playlist._id },
    })

    return res.status(201).json({ playlist })
  } catch (error) {
    return res.status(500).json({ message: `Failed to create playlist: ${error.message}` })
  }
}

export const toggleSavePlaylist = async (req, res) => {
  try {
    const { playlistId } = req.body
    const userId = req.userId

    if (!playlistId) {
      return res.status(400).json({ message: "playlistId is required" })
    }

    const playlist = await Playlist.findById(playlistId)

    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" })
    }

    if (playlist.savedBy.includes(userId)) {
      playlist.savedBy.pull(userId)
    } else {
      playlist.savedBy.push(userId)
    }

    await playlist.save()

    return res.status(200).json({ playlist })
  } catch (error) {
    return res.status(500).json({ message: `Failed to save playlist ${error.message}` })
  }
}

export const getSavedPlaylist = async (req, res) => {
  try {
    const userId = req.userId

    const savedPlaylists = await Playlist.find({ savedBy: userId })
      .populate({
        path: "videos",
        populate: { path: "channel", select: "name avatar" },
      })
      .populate("channel", "name avatar")

    return res.status(200).json({ playlists: savedPlaylists })
  } catch (error) {
    return res.status(500).json({ message: `Failed to get saved playlists ${error.message}` })
  }
}

