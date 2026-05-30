import uploadOnCloudinary from "../config/cloudinary.js";
import Channel from "../model/channelModel.js";
import Shorts from "../model/shortModel.js";

export const createShort = async (req, res) => {
  try {
    const { title, description, tags, channelId } = req.body;

    if (!title || !channelId) {
      return res.status(400).json({
        message: "Short title and channelId is required",
      });
    }

    let shortUrl = "";

    // upload file if exists
    if (req.file) {
      shortUrl = await uploadOnCloudinary(req.file.path);
    }

    // check channel
    const channelData = await Channel.findById(channelId);

    if (!channelData) {
      return res.status(400).json({
        message: "Channel is not found by id",
      });
    }

    // create short
    const newShort = await Shorts.create({
      channel: channelData._id,
      title,
      description,
      shortUrl,
      tags: tags ? JSON.parse(tags) : [],
    });

    // update channel
    await Channel.findByIdAndUpdate(
      channelId,
      {
        $push: { shorts: newShort._id },
      },
      { new: true }
    );

    return res.status(201).json(newShort);

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to create short",
      error: error.message,
    });
  }
};