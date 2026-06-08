import express from "express";
import isAuth from "../middleware/isAuth.js";
import upload from "../middleware/multer.js";
import { addComment, addReply, createVideo, getAllVideos, getViews, toggleDislikes, toggleLikes, toggleSave } from "../controller/videoController.js";
import { getAllShorts, toggleLikes1, toggleDislikes1, toggleSave1, getViews1, addComment1, addReply1, uploadShort } from "../controller/shortController.js";
import CreatePlaylist from "../../frontend/src/pages/Playlist/CreatePlaylist.jsx";

const contentRouter = express.Router();

// video routes
contentRouter.post("/create-video", isAuth, upload.fields([{ name: "video", maxCount: 1 }, { name: "thumbnail", maxCount: 1 }]), createVideo);
contentRouter.get("/getallvideos", getAllVideos);
contentRouter.put("/video/:videoId/toggle-like", isAuth, toggleLikes);
contentRouter.put("/video/:videoId/toggle-dislike", isAuth, toggleDislikes);
contentRouter.put("/video/:videoId/toggle-save", isAuth, toggleSave);
contentRouter.put("/video/:videoId/add-view", getViews);
contentRouter.post("/video/:videoId/add-comment", isAuth, addComment);
contentRouter.post("/video/:videoId/:commentId/add-reply", isAuth, addReply);

//playlist routes
contentRouter.post("/create-playlist" , isAuth, CreatePlaylist);
contentRouter.post("/playlist/toggle-save", isAuth, toggleSavePlalist);

// short routes
contentRouter.post("/create-short", isAuth, upload.single("shortUrl"), uploadShort);
contentRouter.get("/getallshorts", getAllShorts);
contentRouter.put("/short/:shortId/toggle-like", isAuth, toggleLikes1);
contentRouter.put("/short/:shortId/toggle-dislike", isAuth, toggleDislikes1);
contentRouter.put("/short/:shortId/toggle-save", isAuth, toggleSave1);
contentRouter.put("/short/:shortId/add-view", getViews1);
contentRouter.post("/short/:shortId/add-comment", isAuth, addComment1);
contentRouter.post("/short/:shortId/:commentId/add-reply", isAuth, addReply1);

export default contentRouter;
