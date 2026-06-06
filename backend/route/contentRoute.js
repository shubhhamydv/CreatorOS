import express from "express";
import isAuth from "../middleware/isAuth.js";
import upload from "../middleware/multer.js";
import { addComment, addReply, createVideo, getAllVideos, getViews, toggleDislikes, toggleLikes, toggleSave } from "../controller/videoController.js";
import { getAllShorts, uploadShort } from "../controller/shortController.js";

const contentRouter = express.Router();

// video routes
contentRouter.post(
  "/create-video",
  isAuth,
  upload.fields([
    { name: "video", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  createVideo
);

contentRouter.get("/getallvideos", isAuth,getAllVideos)
contentRouter.put("/video/:videoId/toggle-like",isAuth,toggleLikes)
contentRouter.put("/video/:videoId/toggle-dislike",isAuth,toggleDislikes)
contentRouter.put("/video/:videoId/toggle-save",isAuth,toggleSave)
contentRouter.put("/video/:videoId/add-view",getViews)

contentRouter.post("/video/:videoId/add-comment",isAuth,addComment)
contentRouter.post("video/:videoId/:commentId/add-reply",isAuth,addReply)

// short routes
contentRouter.post(
  "/create-short",
  isAuth,
  upload.single("shortUrl"),
  uploadShort
);
contentRouter.get("/getallshorts",isAuth,getAllShorts)

export default contentRouter;