import uploadOnCloudinary from "../config/cloudinary.js";
import Channel from "../model/channelModel.js";
import Short from "../model/shortModel.js";

export const createShort = async (req, res) => {
  try {
    const { title, description, tags, channelId } = req.body;
    if (!title || !channelId) return res.status(400).json({ success: false, message: "Short title and channelId is required" });
    let shortUrl = "";
    if (req.file) shortUrl = await uploadOnCloudinary(req.file.path);
    const channelData = await Channel.findById(channelId);
    if (!channelData) return res.status(404).json({ success: false, message: "Channel not found" });
    const newShort = await Short.create({ channel: channelData._id, title, description, shortUrl, tags: tags ? JSON.parse(tags) : [] });
    await Channel.findByIdAndUpdate(channelData._id, { $push: { shorts: newShort._id } }, { new: true });
    return res.status(201).json({ success: true, short: newShort });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const uploadShort = async (req, res) => {
  try {
    const filePath = req.file?.path;
    if (!filePath) return res.status(400).json({ success: false, message: "No file uploaded" });
    const shortUrl = await uploadOnCloudinary(filePath);
    if (!shortUrl) return res.status(500).json({ success: false, message: "Upload failed" });
    return res.status(200).json({ success: true, shortUrl });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllShorts = async (req, res) => {
  try {
    const shorts = await Short.find().sort({ createdAt: -1 }).populate("channel");
    return res.status(200).json({ success: true, shorts });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// FIX: was using Video model instead of Short, wrong param name (videoId→shortId)
export const toggleLikes1 = async (req, res) => {
  try {
    const { shortId } = req.params;
    const userId = req.userId;
    const short = await Short.findById(shortId);
    if (!short) return res.status(400).json({ message: "Short is not found" });
    if (short.likes.includes(userId)) short.likes.pull(userId);
    else { short.likes.push(userId); short.dislikes.pull(userId); }
    await short.save();
    return res.status(200).json(short);
  } catch (error) {
    return res.status(500).json({ message: `Failed to like short: ${error}` });
  }
};

export const toggleDislikes1 = async (req, res) => {
  try {
    const { shortId } = req.params;
    const userId = req.userId;
    const short = await Short.findById(shortId);
    if (!short) return res.status(400).json({ message: "Short is not found" });
    if (short.dislikes.includes(userId)) short.dislikes.pull(userId);
    else { short.dislikes.push(userId); short.likes.pull(userId); }
    await short.save();
    return res.status(200).json(short);
  } catch (error) {
    return res.status(500).json({ message: `Failed to dislike short: ${error}` });
  }
};

// FIX: was using Video.findById instead of Short.findById
export const toggleSave1 = async (req, res) => {
  try {
    const { shortId } = req.params;
    const userId = req.userId;
    const short = await Short.findById(shortId);
    if (!short) return res.status(400).json({ message: "Short is not found" });
    if (short.saveBy.includes(userId)) short.saveBy.pull(userId);
    else short.saveBy.push(userId);
    await short.save();
    return res.status(200).json(short);
  } catch (error) {
    return res.status(500).json({ message: `Failed to save short: ${error}` });
  }
};

// FIX: was returning status 500 on success
export const getViews1 = async (req, res) => {
  try {
    const { shortId } = req.params;
    const short = await Short.findByIdAndUpdate(shortId, { $inc: { views: 1 } }, { new: true });
    if (!short) return res.status(400).json({ message: "Short is not found" });
    return res.status(200).json(short);  // FIX: 500 → 200
  } catch (error) {
    return res.status(500).json({ message: `Failed to get views: ${error}` });
  }
};

// FIX: was missing await short.save()
export const addComment1 = async (req, res) => {
  try {
    const { shortId } = req.params;
    const { message } = req.body;
    const userId = req.userId;
    const short = await Short.findById(shortId);
    if (!short) return res.status(400).json({ message: "Short is not found" });
    short.comments.push({ author: userId, message });
    await short.save();  // FIX: was missing
    return res.status(200).json(short);
  } catch (error) {
    return res.status(500).json({ message: `Error adding comment: ${error}` });
  }
};

// FIX: completely rewritten - had unreachable code, wrong model, wrong var names
export const addReply1 = async (req, res) => {
  try {
    const { shortId, commentId } = req.params;
    const { message } = req.body;
    const userId = req.userId;
    const short = await Short.findById(shortId);
    if (!short) return res.status(400).json({ message: "Short is not found" });
    const comment = short.comments.id(commentId);
    if (!comment) return res.status(400).json({ message: "Comment is not found" });
    comment.replies.push({ author: userId, message });
    await short.save();
    return res.status(200).json(short);
  } catch (error) {
    return res.status(500).json({ message: `Error adding reply: ${error}` });
  }
};
