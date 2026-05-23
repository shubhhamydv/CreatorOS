import express from "express"
import dotenv from "dotenv"
import connectDb from "./config/db.js"
import authRouter from "./route/authRoute.js"
import cookieParser from "cookie-parser"
dotenv.config()
const port = process.env.PORT

const app = express()
app.use(cookieParser())
app.use(express.json())

app.use("/api/auth",authRouter)

app.listen(port, ()=>{
    console.log("server started")
    connectDb()

})