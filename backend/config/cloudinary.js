import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

dotenv.config({
  path: fileURLToPath(new URL("../.env", import.meta.url))
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = (filePath) => {
  return new Promise((resolve) => {
    if (!filePath) return resolve(null);
    cloudinary.uploader.upload(filePath, { resource_type: "auto" }, (error, result) => {
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      if (error) {
        console.log("🔥 Cloudinary Upload Error:", error.message);
        return resolve(null);
      }
      resolve(result.secure_url);
    });
  });
};

export default uploadOnCloudinary;
