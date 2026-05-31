import express from "express";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

dotenv.config({
    path: fileURLToPath(new URL("./.env", import.meta.url))
});

import connectDb from "./config/db.js";
import authRouter from "./route/authRoute.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRouter from "./route/userRoute.js";
import contentRouter from "./route/contentRoute.js";



const port = process.env.PORT || 8000;

const app = express();

app.use(cookieParser());
app.use(express.json());

app.use("/public", express.static("public"));

app.use(cors({
    origin: (origin, callback) => {

        const allowedOrigins = [
            "http://localhost:5173",
            "http://localhost:5174",
            "http://localhost:5175",
            "http://127.0.0.1:5173",
            "http://127.0.0.1:5174",
            "http://127.0.0.1:5175"
        ];

        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"), false);
        }
    },
    credentials: true
}));

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/content", contentRouter);

app.listen(port, () => {
    console.log("server started");
    connectDb();
});