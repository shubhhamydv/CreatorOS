import uploadOnCloudinary from "../config/cloudinary"


export const CreatePost = async (req,res) => {
    try {
        const {channelId,content} = req.body
        const file = req.file
        if(!channelId || content){
            return res.status(400).json({message:"channelId and content are required"}

            )

        }
        let imageUrl = null
        if(file){
            imageUrl = await uploadOnCloudinary(file.path)
        }
        const post = await Post.create({
            channelId,
            content,
            image:imageUrl,
        })
        await Channel.findByIdAndUpdate(channelId,{
            $push :{community : post._id}
        })
        return res.status(201).json(post)
    } catch (error) {
        return res.status(500).json({message:`failed to create Post ${error}`})
    }
} 


export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }).populate("channel comments.author comments.replies.author")
    if (!posts) return res.status(400).json({ message: "Posts are not found" })
    return res.status(200).json({ posts })
  } catch (error) {
    return res.status(500).json({ message: `failed to get posts ${error}` })
  }
}

export const toggleLikesForPost = async (req, res) => {
  try {
    const { postId } = req.body
    const userId = req.userId
    const post = await Post.findById(videoId)
    if (!post) return res.status(400).json({ message: "Post is not found" })
    if (post.likes.includes(userId)) post.likes.pull(userId)
    else { post.likes.push(userId);  }
    await post.save()
    return res.status(200).json(post)
  } catch (error) {
    return res.status(500).json({ message: `Failed to like post ${error}` })
  }
}


export const addCommentForPost = async (req, res) => {
  try {
    const { postId } = req.body
    const { message } = req.body
    const userId = req.userId
    const post = await Post.findById(videoId)
    if (!post) return res.status(400).json({ message: "post is not found" })
    post.comments.push({ author: userId, message })
    await post.save()  // FIX: was missing
    const populatePost = await Post.findById(postId)
    .populate({
        path:"comments.author",
        select:"userName photoUrl email"
    })
    .populate({
        path:"comments.replies author",
        select:"userName photoUrl email"
    })

    return res.status(200).json(populatePost)
  } catch (error) {
    return res.status(500).json({ message: `error adding comments ${error}` })
  }
}


export const addReplyForPost = async (req, res) => {
  try {
    const { postId, commentId } = req.body
    const { message } = req.body
    const userId = req.userId
    const post = await Post.findById(postId)
    if (!post) return res.status(400).json({ message: "Post is not found" })
    const comment = post.comments.id(commentId)
    if (!comment) return res.status(400).json({ message: "Comment is not found" })
    comment.replies.push({ author: userId, message })
    await post.save()
    const populated = await Post.findById(postId)
      .populate({ path: "comments.author", select: "userName photoUrl email" })
      .populate({ path: "comments.replies.author", select: "userName photoUrl email" })
    return res.status(200).json(populatedPost)
  } catch (error) {
    return res.status(500).json({ message: `error adding reply ${error}` })
  }
}

