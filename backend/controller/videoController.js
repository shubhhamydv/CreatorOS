import uploadOnCloudinary from "../config/cloudinary.js"
import Video from "../model/videoModel.js"
import Channel from "../model/channelModel.js"

export const createVideo = async (req, res) => {
  try {
    const { title, description, tags, channelId } = req.body

    if (!title || !req.files?.video || !req.files?.thumbnail || !channelId) {
      return res.status(400).json({
        message: "title, video, thumbnail, channelId is required"
      })
    }

    const channelData = await Channel.findById(channelId)

    if (!channelData) {
      return res.status(400).json({ message: "Channel not found" })
    }

    const uploadedVideo = await uploadOnCloudinary(req.files.video[0].path)
    const uploadedThumbnail = await uploadOnCloudinary(req.files.thumbnail[0].path)

    let parseTag = []
    if (tags) {
      try {
        parseTag = JSON.parse(tags)
      } catch (error) {
        parseTag = []
      }
    }

    const newVideo = await Video.create({
      title,
      channel: channelData._id,
      description,
      tags: parseTag,
      videoUrl: uploadedVideo,
      thumbnail: uploadedThumbnail
    })

    await Channel.findByIdAndUpdate(
      channelData._id,
      { $push: { videos: newVideo._id } },
      { new: true }
    )

    return res.status(201).json(newVideo)

  } catch (error) {
    return res.status(500).json({
      message: `failed to create video ${error}`
    })
  }
}