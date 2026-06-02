import uploadOnCloudinary from "../config/cloudinary.js";
import Channel from "../model/channelModel.js";
import Short from "../model/shortModel.js";

// CREATE SHORT
export const createShort = async (req, res) => {
  try {
    const { title, description, tags, channelId } = req.body;

    if (!title || !channelId) {
      return res.status(400).json({
        success: false,
        message: "Short title and channelId is required",
      });
    }

    let shortUrl = "";

    if (req.file) {
      shortUrl = await uploadOnCloudinary(req.file.path);
    }

    const channelData = await Channel.findById(channelId);

    if (!channelData) {
      return res.status(404).json({
        success: false,
        message: "Channel not found",
      });
    }

    const newShort = await Short.create({
      channel: channelData._id,
      title,
      description,
      shortUrl,
      tags: tags ? JSON.parse(tags) : [],
    });

    await Channel.findByIdAndUpdate(
      channelData._id,
      {
        $push: { shorts: newShort._id },
      },
      { new: true }
    );

    return res.status(201).json({
      success: true,
      short: newShort,
    });
  } catch (error) {
    console.error("CREATE SHORT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// UPLOAD SHORT ONLY
export const uploadShort = async (req, res) => {
  try {
    const filePath = req.file?.path;

    if (!filePath) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const shortUrl = await uploadOnCloudinary(filePath);

    if (!shortUrl) {
      return res.status(500).json({
        success: false,
        message: "Upload failed",
      });
    }

    return res.status(200).json({
      success: true,
      shortUrl,
    });
  } catch (error) {
    console.error("UPLOAD SHORT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET ALL SHORTS (FIXED)
export const getAllShorts = async (req, res) => {
  try {
    const shorts = await Short.find()
      .sort({ createdAt: -1 })
      .populate("channel");

    if (shorts.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No shorts found",
      });
    }

    return res.status(200).json({
      success: true,
      shorts,
    });
  } catch (error) {
    console.error("GET ALL SHORTS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};