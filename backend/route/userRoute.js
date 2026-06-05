import express from "express"
import { createChannel, getCurrentUser, getMyChannel, updateChannel,toggleSubscribe } from "../controller/userController.js"
import isAuth from "../middleware/isAuth.js"
import upload from "../middleware/multer.js"


const userRouter = express.Router()

userRouter.get("/getuser", isAuth, getCurrentUser)
userRouter.get("/getchannel", isAuth, getMyChannel)
userRouter.post("/createchannel",isAuth,upload.fields([{name:"avatar",maxCount:1},
 {name:"banner",maxCount:1}
]),createChannel)
userRouter.post("/updatechannel",isAuth,upload.fields([{name:"avatar",maxCount:1},
 {name:"banner",maxCount:1}
]),updateChannel)
userRouter.post("/togglesubscribe",isAuth,toggleSubscribe)

export default userRouter