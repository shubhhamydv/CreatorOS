import { GoogleGenAI } from "@google/genai";

import Video from "../model/videoModel.js";
import Channel from "../model/channelModel.js";
import Short from "../model/shortModel.js";
import Playlist from "../model/playlistModel.js";

export const searchWithAi = async (req, res) => {
  try {
    const { input } = req.body;

    if (!input?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const prompt = `
You are a search assistant for a video streaming platform.

User query: "${input}"

Rules:
- Correct spelling mistakes.
- Extract meaningful search keywords.
- Return only keywords separated by commas.
- No explanation.
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const keywordString = (response.text || input)
      .trim()
      .replace(/[\r\n]+/g, "");

    const searchWords = keywordString
      .split(",")
      .map((word) => word.trim())
      .filter(Boolean);

    const buildRegexQuery = (fields) => ({
      $or: searchWords.flatMap((word) =>
        fields.map((field) => ({
          [field]: {
            $regex: word,
            $options: "i",
          },
        }))
      ),
    });

    const matchedChannels = await Channel.find(
      buildRegexQuery(["name"])
    ).select("_id name avatar");

    const channelIds = matchedChannels.map(
      (channel) => channel._id
    );

    const videos = await Video.find({
      $or: [
        buildRegexQuery(["title", "description", "tags"]),
        { channel: { $in: channelIds } },
      ],
    }).populate("channel");

    const shorts = await Short.find({
      $or: [
        buildRegexQuery(["title", "description", "tags"]),
        { channel: { $in: channelIds } },
      ],
    }).populate("channel");

    const playlists = await Playlist.find({
      $or: [
        buildRegexQuery(["title", "description"]),
        { channel: { $in: channelIds } },
      ],
    }).populate("channel");

    return res.status(200).json({
      success: true,
      keywords: searchWords,
      channels: matchedChannels,
      videos,
      shorts,
      playlists,
    });
  } catch (error) {
    console.error("AI Search Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const filterCategoryWithAi = async (req, res) => {
  try {
    const { input } = req.body;

    if (!input?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const categories = [
      "Music",
      "Gaming",
      "News",
      "Sports",
      "Education",
      "Comedy",
      "Pets",
      "TV Shows",
      "Movies",
      "Technology",
      "Coding",
      "Travel",
      "Food",
    ];

    const prompt = `
You are a category classifier for a video streaming platform.

The user query is: "${input}"

Your job:
- Match this query with the most relevant categories from this list:
${categories.join(", ")}

- Correct spelling mistakes.
- Extract the most relevant categories.
- If multiple categories match, return them comma-separated.
- Do NOT explain.
- Do NOT return JSON.
- Return only category names.

Examples:
"arijit singh songs" -> Music
"pubg gameplay" -> Gaming
"netflix web series" -> TV Shows
"india latest news" -> News
"funny animal videos" -> Comedy, Pets
"fitness tips" -> Education, Sports
"mern stack tutorial" -> Coding
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const keywordText =
      typeof response.text === "function"
        ? response.text()
        : response.text || input;

    const keywords = keywordText
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean);

    const videoConditions = [];
    const shortConditions = [];
    const playlistConditions = [];
    const channelConditions = [];

    keywords.forEach((kw) => {
      videoConditions.push(
        { title: { $regex: kw, $options: "i" } },
        { description: { $regex: kw, $options: "i" } },
        { tags: { $regex: kw, $options: "i" } },
        { category: { $regex: kw, $options: "i" } }
      );

      shortConditions.push(
        { title: { $regex: kw, $options: "i" } },
        { description: { $regex: kw, $options: "i" } },
        { tags: { $regex: kw, $options: "i" } },
        { category: { $regex: kw, $options: "i" } }
      );

      playlistConditions.push(
        { title: { $regex: kw, $options: "i" } },
        { description: { $regex: kw, $options: "i" } }
      );

      channelConditions.push(
        { name: { $regex: kw, $options: "i" } },
        { category: { $regex: kw, $options: "i" } },
        { description: { $regex: kw, $options: "i" } }
      );
    });

    const channels = await Channel.find({
      $or: channelConditions,
    }).select("_id name avatar category");

    const channelIds = channels.map((c) => c._id);

    const videos = await Video.find({
      $or: [
        ...videoConditions,
        { channel: { $in: channelIds } },
      ],
    }).populate("channel");

    const shorts = await Short.find({
      $or: [
        ...shortConditions,
        { channel: { $in: channelIds } },
      ],
    }).populate("channel");

    const playlists = await Playlist.find({
      $or: [
        ...playlistConditions,
        { channel: { $in: channelIds } },
      ],
    }).populate("channel");

    return res.status(200).json({
      success: true,
      keywords,
      channels,
      videos,
      shorts,
      playlists,
    });
  } catch (error) {
    console.error("AI Filter Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};