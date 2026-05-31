import express from "express";
import isAuth from "../middleware/isAuth.js";
import upload from "../middleware/multer.js";
import { createVideo } from "../controller/videoController.js";
import { uploadShort } from "../controller/shortController.js";

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

// short routes
contentRouter.post(
  "/create-short",
  isAuth,
  upload.single("shortUrl"),
  uploadShort
);

export default contentRouter;