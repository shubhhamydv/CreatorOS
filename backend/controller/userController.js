import Channel from "../model/channelModel.js"
import User from "../model/userModel.js"
import Video from "../model/videoModel.js"
import Short from "../model/shortModel.js"
import Playlist from "../model/playlistModel.js"
import Post from "../model/postModel.js"
import uploadOnCloudinary from "../config/cloudinary.js"

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("userName email photoUrl channel")
    if (!user) return res.status(404).json({ message: "User not found" })
    return res.status(200).json({ user })
  } catch (error) {
    return res.status(500).json({ message: `Failed to get current user: ${error.message}` })
  }
}

// Helper: fully populate a channel
const populateChannel = (query) =>
  query
    .populate("owner", "userName email photoUrl")
    .populate({ path: "videos", options: { sort: { createdAt: -1 } } })
    .populate({ path: "shorts", options: { sort: { createdAt: -1 } } })
    .populate({
      path: "playlists",
      populate: { path: "videos", populate: { path: "channel", select: "name avatar" } },
    })
    .populate({
      path: "posts",
      populate: [
        { path: "comments.author", select: "userName photoUrl" },
        { path: "comments.replies.author", select: "userName photoUrl" },
      ],
    })

export const getMyChannel = async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate({
      path: "channel",
      populate: [
        { path: "owner", select: "userName email photoUrl" },
        { path: "videos", options: { sort: { createdAt: -1 } } },
        { path: "shorts", options: { sort: { createdAt: -1 } } },
        {
          path: "playlists",
          populate: { path: "videos", populate: { path: "channel", select: "name avatar" } },
        },
        {
          path: "posts",
          populate: [
            { path: "comments.author", select: "userName photoUrl" },
            { path: "comments.replies.author", select: "userName photoUrl" },
          ],
        },
      ],
    })

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    return res.status(200).json({ channel: user.channel || null })
  } catch (error) {
    console.error("getMyChannel error", error)
    return res.status(500).json({ message: `Failed to get channel: ${error.message}` })
  }
}

export const createChannel = async (req, res) => {
  try {
    const { name, description = "", category } = req.body
    const avatarFile = req.files?.avatar?.[0]
    const bannerFile = req.files?.banner?.[0]

    if (!name || !category)
      return res.status(400).json({ message: "Channel name and category are required" })

    const existing = await Channel.findOne({ name })
    if (existing)
      return res.status(400).json({ message: "Channel name already exists" })

    const avatar = avatarFile ? await uploadOnCloudinary(avatarFile.path) : ""
    const banner = bannerFile ? await uploadOnCloudinary(bannerFile.path) : ""

    const channel = await Channel.create({ owner: req.userId, name, description, category, avatar, banner })
    await User.findByIdAndUpdate(req.userId, { channel: channel._id })

    return res.status(201).json({ channel })
  } catch (error) {
    return res.status(500).json({ message: `Failed to create channel: ${error.message}` })
  }
}

export const updateChannel = async (req, res) => {
  try {
    const { name, description, category } = req.body
    const avatarFile = req.files?.avatar?.[0]
    const bannerFile = req.files?.banner?.[0]

    const channel = await Channel.findOne({ owner: req.userId })
    if (!channel) return res.status(404).json({ message: "Channel not found" })

    if (name) channel.name = name
    if (description !== undefined) channel.description = description
    if (category) channel.category = category
    if (avatarFile) channel.avatar = await uploadOnCloudinary(avatarFile.path)
    if (bannerFile) channel.banner = await uploadOnCloudinary(bannerFile.path)

    await channel.save()
    return res.status(200).json({ channel })
  } catch (error) {
    return res.status(500).json({ message: `Failed to update channel: ${error.message}` })
  }
}

export const toggleSubscribe = async (req, res) => {
  try {
    const { channelId } = req.body
    const userId = req.userId

    if (!channelId) return res.status(400).json({ message: "channelId is required" })

    const channel = await Channel.findById(channelId)
    if (!channel) return res.status(404).json({ message: "Channel not found" })

    const isSubscribed = channel.subscribers.includes(userId)
    if (isSubscribed) channel.subscribers.pull(userId)
    else channel.subscribers.push(userId)
    await channel.save()

    // Bug fixed: return fully populated channel so frontend can update state instantly
    const updatedChannel = await populateChannel(Channel.findById(channelId))
    return res.status(200).json({ success: true, subscribed: !isSubscribed, channel: updatedChannel })
  } catch (error) {
    return res.status(500).json({ message: `Failed to toggle subscription: ${error.message}` })
  }
}

// Bug fixed: now fully populates playlists.videos and posts (was missing)
export const getAllChannelData = async (req, res) => {
  try {
    const channels = await populateChannel(Channel.find())
    return res.status(200).json({ channels })
  } catch (error) {
    return res.status(500).json({ message: `Failed to get channels: ${error.message}` })
  }
}

export const getSubscribeData = async (req, res) => {
  try {
    const subscribedChannels = await populateChannel(Channel.find({ subscribers: req.userId }))
    const channelIds = subscribedChannels.map((c) => c._id)

    const [subscribedVideos, subscribedShorts, subscribedPlaylists, subscribedPosts] = await Promise.all([
      Video.find({ channel: { $in: channelIds } }).populate("channel", "name avatar").sort({ createdAt: -1 }),
      Short.find({ channel: { $in: channelIds } }).populate("channel", "name avatar").sort({ createdAt: -1 }),
      Playlist.find({ channel: { $in: channelIds } })
        .populate({ path: "videos", populate: { path: "channel", select: "name avatar" } })
        .populate("channel", "name avatar"),
      // Bug fixed: subscribedPosts was not being returned
      Post.find({ channel: { $in: channelIds } })
        .populate("channel", "name avatar")
        .populate({ path: "comments.author", select: "userName photoUrl" })
        .sort({ createdAt: -1 }),
    ])

    return res.status(200).json({
      subscribedChannels,
      subscribedVideos,
      subscribedShorts,
      subscribedPlaylists,
      subscribedPosts,
    })
  } catch (error) {
    return res.status(500).json({ message: `Failed to get subscribed data: ${error.message}` })
  }
}

export const addHistory = async (req, res) => {
  try {
    const userId = req.userId
    const { contentId, contentType } = req.body

    if (!contentId || !contentType)
      return res.status(400).json({ message: "contentId and contentType are required" })

    if (!["Video", "Short"].includes(contentType))
      return res.status(400).json({ message: "Invalid contentType. Use 'Video' or 'Short'" })

    await User.findByIdAndUpdate(userId, {
      $push: {
        history: {
          $each: [{ contentId, contentType, watchedAt: new Date() }],
          $position: 0,
          $slice: 100,
        },
      },
    })

    return res.status(200).json({ message: "History added" })
  } catch (error) {
    return res.status(500).json({ message: `Failed to add history: ${error.message}` })
  }
}

export const getHistory = async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate({
      path: "history.contentId",
      populate: { path: "channel", select: "name avatar" },
    })

    const history = (user?.history || []).filter((h) => h.contentId != null)
    return res.status(200).json({ history })
  } catch (error) {
    return res.status(500).json({ message: `Failed to get history: ${error.message}` })
  }
}

export const getRecommendedContent = async (req, res) => {
  try {
    const videos = await Video.find()
      .populate("channel", "name avatar")
      .sort({ views: -1 })
      .limit(20)

    const shorts = await Short.find()
      .populate("channel", "name avatar")
      .sort({ views: -1 })
      .limit(20)

    return res.status(200).json({ videos, shorts })
  } catch (error) {
    return res.status(500).json({ message: `Failed to get recommended content: ${error.message}` })
  }
}