import express from "express"
import {
  createChannel,
  getCurrentUser,
  getMyChannel,
  updateChannel,
  toggleSubscribe,
  getAllChannelData,
  getSubscribeData,
  addHistory,
  getHistory,
  getRecommendedContent,
} from "../controller/userController.js"
import isAuth from "../middleware/isAuth.js"
import upload from "../middleware/multer.js"

const userRouter = express.Router()

userRouter.get("/getuser", isAuth, getCurrentUser)
userRouter.get("/getchannel", isAuth, getMyChannel)
userRouter.post(
  "/createchannel",
  isAuth,
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "banner", maxCount: 1 },
  ]),
  createChannel
)
userRouter.post(
  "/updatechannel",
  isAuth,
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "banner", maxCount: 1 },
  ]),
  updateChannel
)
userRouter.post("/togglesubscribe", isAuth, toggleSubscribe)
userRouter.get("/allchannel", isAuth, getAllChannelData)
userRouter.get("/subscribed-data", isAuth, getSubscribeData)
userRouter.post("/add-history", isAuth, addHistory)
userRouter.get("/gethistory", isAuth, getHistory)
userRouter.get("/recommended-content", isAuth, getRecommendedContent)

export default userRouter


