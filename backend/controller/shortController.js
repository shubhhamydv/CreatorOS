import { trusted } from "mongoose";
import uploadOnCloudinary from "../config/cloudinary.js";
import Channel from "../model/channelModel.js"
import Short from "../model/shortModel.js"

//Create shorts
export const createShort = async(req,res) =>{
  try {
    const {title,description,tags,channelId} = req.body
    if(!title || !channelId){
      return res.status(400).json({message:"Short title and channelId is required"})
    }
    let shortUrl
    if(req.file){
      shortUrl = await uploadOnCloudinary(req.file.path)
    }
    const channelData = await Channel.findById(channelId)
    if(!channelData){
      return res.status(400).json({message:"Channel is not found by Id"})
    }

    const newShort = await Short.create({
      channel:channelData._id,
      title,
      description,
      shortUrl,
      tags:tags ? JSON.parse(tags) : []
    })
    await Channel.findByIdAndUpdate(channelData._id,{
      $push : {shorts : newShort._id}

    },{new:true})
    return res.status(201).json(newShort)

  } catch (error) {
    return res.status(500).json({message:`failed to create short ${error}`})
  }
}

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

export const getAllShorts = async(req,res)=>{
  try {
    const shorts = await short.find().sort({createdAt : -1})
    if(!shorts){
      return res.status(400).json({message: "Shorts are not found"})
    }
    return re.status(200).json(shorts)
  } catch (error) {
    return res.status(500).json({message:`failed to get Shorts ${error}`})
    
  }
}