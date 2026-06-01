import express from "express";
import isAuth from "../middleware/isAuth.js";
import upload from "../middleware/multer.js";
import { createVideo, getAllVideos } from "../controller/videoController.js";
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

content Router.get("/getallvideos", isAuth,getAllVideos)

// short routes
contentRouter.post(
  "/create-short",
  isAuth,
  upload.single("shortUrl"),
  uploadShort
);
contentRouter.get("/getallshorts",isAuth,getAllShorts)

export default contentRouter;