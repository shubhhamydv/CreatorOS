import express from "express"
import isAuth from "../middleware/isAuth.js"
import upload from "../middleware/multer.js"

import {
    addComment,
    addReply,
    createVideo,
    getAllVideos,
    getLikedVideo,
    getSaveVideo,
    getViews,
    toggleDislikes,
    toggleLikes,
    toggleSave,
} from "../controller/videoController.js"

import {
    getAllShorts,
    toggleLikes1,
    toggleDislikes1,
    toggleSave1,
    getViews1,
    addComment1,
    addReply1,
    createShort,
    getLikedShort,
    getSavedShort,
} from "../controller/shortController.js"

import {
    createPlaylist,
    toggleSavePlaylist,
    getSavedPlaylist,
} from "../controller/playlistController.js"

import {
    filterCategoryWithAi,
    searchWithAi,
} from "../controller/aiController.js"

const contentRouter = express.Router()

// ── Video routes ──────────────────────────────────────────────────
contentRouter.post(
    "/create-video",
    isAuth,
    upload.fields([{ name: "video", maxCount: 1 }, { name: "thumbnail", maxCount: 1 }]),
    createVideo
)
contentRouter.get("/getallvideos", getAllVideos)
contentRouter.put("/video/:videoId/toggle-like", isAuth, toggleLikes)
contentRouter.put("/video/:videoId/toggle-dislike", isAuth, toggleDislikes)
contentRouter.put("/video/:videoId/toggle-save", isAuth, toggleSave)
contentRouter.put("/video/:videoId/add-view", getViews)
contentRouter.post("/video/:videoId/add-comment", isAuth, addComment)
contentRouter.post("/video/:videoId/:commentId/add-reply", isAuth, addReply)
contentRouter.get("/likedvideo", isAuth, getLikedVideo)
contentRouter.get("/savedvideo", isAuth, getSaveVideo)

// ── Playlist routes ───────────────────────────────────────────────
contentRouter.post("/create-playlist", isAuth, createPlaylist)
contentRouter.post("/playlist/toggle-save", isAuth, toggleSavePlaylist)
contentRouter.get("/savedplaylist", isAuth, getSavedPlaylist)

// ── Short routes ──────────────────────────────────────────────────
contentRouter.post("/create-short", isAuth, upload.single("shortUrl"), createShort)
contentRouter.get("/getallshorts", getAllShorts)
contentRouter.put("/short/:shortId/toggle-like", isAuth, toggleLikes1)
contentRouter.put("/short/:shortId/toggle-dislike", isAuth, toggleDislikes1)
contentRouter.put("/short/:shortId/toggle-save", isAuth, toggleSave1)
contentRouter.put("/short/:shortId/add-view", getViews1)
contentRouter.post("/short/:shortId/add-comment", isAuth, addComment1)
contentRouter.post("/short/:shortId/:commentId/add-reply", isAuth, addReply1)
contentRouter.get("/likedshort", isAuth, getLikedShort)
contentRouter.get("/savedshort", isAuth, getSavedShort)

// ── AI routes ─────────────────────────────────────────────────────
contentRouter.post("/search", isAuth, searchWithAi)
contentRouter.post("/filter", isAuth, filterCategoryWithAi)

export default contentRouter
