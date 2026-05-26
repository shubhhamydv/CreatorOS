import express from "express"
import dotenv from "dotenv"
import { fileURLToPath } from "url"
import connectDb from "./config/db.js"
import authRouter from "./route/authRoute.js"
import cookieParser from "cookie-parser"
import cors from "cors"
import userRouter from "./route/userRoute.js"

dotenv.config({
    path: fileURLToPath(new URL("./.env", import.meta.url))
})

const port = process.env.PORT || 8000

const app = express()
app.use(cookieParser())
app.use(express.json())

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))
app.use("/api/auth",authRouter)
app.use("/api/user",userRouter)

app.listen(port, ()=>{
    console.log("server started")
    connectDb()

})