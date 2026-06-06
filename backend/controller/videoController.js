import uploadOnCloudinary from "../config/cloudinary.js"
import Video from "../model/videoModel.js"
import Channel from "../model/channelModel.js"

export const createVideo = async (req, res) => {
  try {
    const { title, description, tags, channelId } = req.body

    if (!title || !req.files?.video || !req.files?.thumbnail || !channelId) {
      return res.status(400).json({
        message: "title, video, thumbnail, channelId is required"
      })
    }

    const channelData = await Channel.findById(channelId)

    if (!channelData) {
      return res.status(400).json({ message: "Channel not found" })
    }

    const uploadedVideo = await uploadOnCloudinary(req.files.video[0].path)
    const uploadedThumbnail = await uploadOnCloudinary(req.files.thumbnail[0].path)

    let parseTag = []
    if (tags) {
      try {
        parseTag = JSON.parse(tags)
      } catch (error) {
        parseTag = []
      }
    }

    const newVideo = await Video.create({
      title,
      channel: channelData._id,
      description,
      tags: parseTag,
      videoUrl: uploadedVideo,
      thumbnail: uploadedThumbnail
    })

    await Channel.findByIdAndUpdate(
      channelData._id,
      { $push: { videos: newVideo._id } },
      { new: true }
    )

    return res.status(201).json(newVideo)

  } catch (error) {
    return res.status(500).json({
      message: `failed to create video ${error}`
    })
  }
}

export const getAllVideos = async(req,res)=>{
  try {
    const videos = await Video.find().sort({createdAt : -1}).populate("channel")
    if(!videos){
      return res.status(400).json({message: "Videos are not found"})
    }
    return res.status(200).json({videos})
  } catch (error) {
    return res.status(500).json({message:`failed to get videos ${error}`})
    
  }
}
export const toggleLikes = async (req,res)=>{
  try{
   const {videoId} = req.params;
   const userId = req.userId

   const video = await Video.findById(videoId)

   if(!video){
    return res.status(400).json({message:"Video is not found"})

   }
   if(video.likes.includes(userId)){
    video.likes.pull(userId)
   }else{
    video.likes.push(userId)
    video.disLikes.pull(userId)
   }
   await video.save()
   return res.status(200).json(video)
  } catch(error){
    return res.status(500).json({message:`Failed to like video${error}`})
  }
}

export const toggleDislikes = async (req,res)=>{
  try{
   const {videoId} = req.params;
   const userId = req.userId

   const video = await Video.findById(videoId)

   if(!video){
    return res.status(400).json({message:"Video is not found"})

   }
   if(video.dislikes.includes(userId)){
    video.dislikes.pull(userId)
   }else{
    video.dislikes.push(userId)
    video.likes.pull(userId)
   }
   await video.save()
   return res.status(200).json(video)
  } catch(error){
    return res.status(500).json({message:`Failed to dislike video${error}`})
  }
}

export const toggleSave = async (req,res)=>{
  try{
     const {videoId} = req.params;
   const userId = req.userId

   const video = await Video.findById(videoId)

   if(!video){
    return res.status(400).json({message:"Video is not found"})

   }
    if(video.saveBy.includes(userId)){
    video.saveBy.pull(userId)
   }else{
    video.saveBy.push(userId)

   }
   await video.save()
   return res.status(200).json(video)

  } catch(error){
return res.status(500).json({message:`Failed to save video${error}`})
  }
}

export const getViews = async (req,res)=>{
  try{
   const {videoId} =req.params;
   const video = await Video.findByIdAndUpdate(videoId,{
    $inc:{views:1}
   },{new:true})
   if(!video){
    return res.status(400).json({message:"Video is not found"})

   }
   return res.status(500).json(video)
  } catch (error){
  return res.status(500).json({message:`Failed to get views${error}`})
  }
}

export const addComment = async (req,res)=>{
  try{
    const {videoId} =req.params;
    const {message}=req.body
    const userId = req.userId
    const video = await Video.findById(videoId)

   if(!video){
    return res.status(400).json({message:"Video is not found"})

   }
   video.comments.push({author : userId,message})
   return res.status(200).json(video)
  } catch(error){
   return res.status(500).json({message:`error adding comments ${error}`})
  }
}
export const addReply = async (req,res)=>{
  try{
   const {videoId,commentId} = req.params;
   const {message}=req.body
   const userId=req.userId
   const video = await Video.findById(videoId)

   if(!video){
    return res.status(400).json({message:"Video is not found"})

   }
   const comment = await video.comments._id(commentId)
     populatedVideo = await Video.findById(videoId)
   .populate({
    path:"commets.author",
    select:'username photoUrl email'
   })
   .populate({
    path:"comments.replies.author",
    select:"username photourl email"
   });
   return res.status(200).json(populatedVideo)
   
   if(!commment){
    return res.status(400).json({message:"Comment is not found"})

   }
   comments.replies.push({author:userId,message})
   await video.save()
   const populatedVideo = await Video.findById(videoId)
   .populate({
    path:"commets.author",
    select:'username photoUrl email'
   })
   .populate({
    path:"comments.replies.author",
    select:"username photourl email"
   });
   return res.status(200).json(populatedVideo)
  } catch(error){
   return res.status(500).json({message:`error adding reply ${error}`})
  }
}
