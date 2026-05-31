import uploadOnCloudinary from "../config/cloudinary.js";

// Upload Short / Video Controller
export const uploadShort = async (req, res) => {
  try {
    const filePath = req.file?.path;

    if (!filePath) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const shortUrl = await uploadOnCloudinary(filePath);

    if (!shortUrl) {
      return res.status(500).json({
        success: false,
        message: "Upload failed",
      });
    }

    return res.status(200).json({
      success: true,
      shortUrl,
    });
  } catch (error) {
    console.error("Controller Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};