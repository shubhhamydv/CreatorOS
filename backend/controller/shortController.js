import uploadOnCloudinary from "../config/cloudinary.js";
import Channel from "../model/channelModel.js";
import Short from "../model/shortModel.js";

export const createShort = async (req, res) => {
  try {
    const { title, description = "", tags = [], channelId } = req.body;

    if (!title || !channelId) {
      return res.status(400).json({
        success: false,
        message: "Short title and channelId are required",
      });
    }

    const channelData = await Channel.findById(channelId);

    if (!channelData) {
      return res.status(404).json({
        success: false,
        message: "Channel not found",
      });
    }

    let shortUrl = "";
    if (req.file) {
      shortUrl = await uploadOnCloudinary(req.file.path);
    }

    const parsedTags =
      typeof tags === "string"
        ? JSON.parse(tags || "[]")
        : Array.isArray(tags)
        ? tags
        : [];

    const newShort = await Short.create({
      channel: channelData._id,
      title,
      description,
      shortUrl,
      tags: parsedTags,
    });

    await Channel.findByIdAndUpdate(channelId, {
      $push: { shorts: newShort._id },
    });

    const populatedShort = await Short.findById(newShort._id).populate("channel");

    return res.status(201).json({ success: true, short: populatedShort });
  } catch (error) {
    console.error("CREATE SHORT ERROR:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllShorts = async (req, res) => {
  try {
    const shorts = await Short.find()
      .sort({ createdAt: -1 })
      .populate("channel")
      .populate({ path: "comments.author", select: "userName photoUrl" })
      .populate({ path: "comments.replies.author", select: "userName photoUrl" });

    return res.status(200).json({ success: true, shorts });
  } catch (error) {
    console.error("GET ALL SHORTS ERROR:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const toggleLikes1 = async (req, res) => {
  try {
    const { shortId } = req.params;
    const userId = req.userId;

    const short = await Short.findById(shortId);
    if (!short) {
      return res.status(404).json({ message: "Short not found" });
    }

    if (short.likes.includes(userId)) {
      short.likes.pull(userId);
    } else {
      short.likes.push(userId);
      short.dislikes.pull(userId);
    }

    await short.save();
    return res.status(200).json(short);
  } catch (error) {
    return res.status(500).json({ message: `Failed to like short ${error.message}` });
  }
};

export const toggleDislikes1 = async (req, res) => {
  try {
    const { shortId } = req.params;
    const userId = req.userId;

    const short = await Short.findById(shortId);
    if (!short) {
      return res.status(404).json({ message: "Short not found" });
    }

    if (short.dislikes.includes(userId)) {
      short.dislikes.pull(userId);
    } else {
      short.dislikes.push(userId);
      short.likes.pull(userId);
    }

    await short.save();
    return res.status(200).json(short);
  } catch (error) {
    return res.status(500).json({ message: `Failed to dislike short ${error.message}` });
  }
};

export const toggleSave1 = async (req, res) => {
  try {
    const { shortId } = req.params;
    const userId = req.userId;

    const short = await Short.findById(shortId);
    if (!short) {
      return res.status(404).json({ message: "Short not found" });
    }

    if (short.savedBy.includes(userId)) {
      short.savedBy.pull(userId);
    } else {
      short.savedBy.push(userId);
    }

    await short.save();
    return res.status(200).json(short);
  } catch (error) {
    return res.status(500).json({ message: `Failed to save short ${error.message}` });
  }
};

export const getViews1 = async (req, res) => {
  try {
    const { shortId } = req.params;
    const short = await Short.findByIdAndUpdate(
      shortId,
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!short) {
      return res.status(404).json({ message: "Short not found" });
    }

    return res.status(200).json(short);
  } catch (error) {
    return res.status(500).json({ message: `Failed to get views ${error.message}` });
  }
};

export const addComment1 = async (req, res) => {
  try {
    const { shortId } = req.params;
    const { message } = req.body;
    const userId = req.userId;

    if (!message) {
      return res.status(400).json({ message: "Comment message is required" });
    }

    const short = await Short.findById(shortId);
    if (!short) {
      return res.status(404).json({ message: "Short not found" });
    }

    short.comments.push({ author: userId, message });
    await short.save();

    const populatedShort = await Short.findById(shortId)
      .populate("channel")
      .populate({ path: "comments.author", select: "userName photoUrl" })
      .populate({ path: "comments.replies.author", select: "userName photoUrl" });

    return res.status(200).json(populatedShort);
  } catch (error) {
    return res.status(500).json({ message: `Error adding comment ${error.message}` });
  }
};

export const addReply1 = async (req, res) => {
  try {
    const { shortId, commentId } = req.params;
    const { message } = req.body;
    const userId = req.userId;

    if (!message) {
      return res.status(400).json({ message: "Reply message is required" });
    }

    const short = await Short.findById(shortId);
    if (!short) {
      return res.status(404).json({ message: "Short not found" });
    }

    const comment = short.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    comment.replies.push({ author: userId, message });
    await short.save();

    const populatedShort = await Short.findById(shortId)
      .populate("channel")
      .populate({ path: "comments.author", select: "userName photoUrl" })
      .populate({ path: "comments.replies.author", select: "userName photoUrl" });

    return res.status(200).json(populatedShort);
  } catch (error) {
    return res.status(500).json({ message: `Error adding reply ${error.message}` });
  }
};

export const getLikedShort = async (req, res) => {
  try {
    const userId = req.userId;
    const likedShorts = await Short.find({ likes: userId }).populate("channel", "name avatar");
    return res.status(200).json({ shorts: likedShorts });
  } catch (error) {
    return res.status(500).json({ message: `Error retrieving liked shorts ${error.message}` });
  }
};

export const getSavedShort = async (req, res) => {
  try {
    const userId = req.userId;
    const savedShorts = await Short.find({ savedBy: userId }).populate("channel", "name avatar");
    return res.status(200).json({ shorts: savedShorts });
  } catch (error) {
    return res.status(500).json({ message: `Error retrieving saved shorts ${error.message}` });
  }
};

