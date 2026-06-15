import uploadOnCloudinary from "../config/cloudinary.js"
import Channel from "../model/channelModel.js"
import Post from "../model/postModel.js"

const getPopulatedPost = async (postId) => {
  return await Post.findById(postId)
    .populate("channel", "name avatar")
    .populate({ path: "comments.author", select: "userName photoUrl" })
    .populate({ path: "comments.replies.author", select: "userName photoUrl" })
}

// CREATE POST
// Bug fixed: condition was "if(!channelId || content)" → "if (!channel || !content)"
// Bug fixed: $push was "community" → "posts" (correct channelModel field)
// Bug fixed: returns { post: populatedPost } consistently
export const createPost = async (req, res) => {
  try {
    const { channel, content } = req.body
    const file = req.file

    if (!channel || !content) {
      return res.status(400).json({ message: "channel and content are required" })
    }

    let imageUrl = ""
    if (file) {
      imageUrl = await uploadOnCloudinary(file.path)
    }

    const post = await Post.create({ channel, content, image: imageUrl })
    await Channel.findByIdAndUpdate(channel, { $push: { posts: post._id } })

    const populatedPost = await getPopulatedPost(post._id)
    return res.status(201).json({ post: populatedPost })
  } catch (error) {
    return res.status(500).json({ message: `Failed to create Post: ${error.message}` })
  }
}

// GET ALL POSTS
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("channel", "name avatar")
      .populate({ path: "comments.author", select: "userName photoUrl" })
      .populate({ path: "comments.replies.author", select: "userName photoUrl" })

    return res.status(200).json({ posts })
  } catch (error) {
    return res.status(500).json({ message: `Failed to get posts: ${error.message}` })
  }
}

// TOGGLE LIKE
// Bug fixed: was "Post.findById(videoId)" → postId
export const toggleLikesForPost = async (req, res) => {
  try {
    const { postId } = req.body
    const userId = req.userId

    const post = await Post.findById(postId)
    if (!post) return res.status(404).json({ message: "Post not found" })

    if (post.likes.includes(userId)) {
      post.likes.pull(userId)
    } else {
      post.likes.push(userId)
    }

    await post.save()
    const populatedPost = await getPopulatedPost(postId)
    return res.status(200).json({ post: populatedPost })
  } catch (error) {
    return res.status(500).json({ message: `Failed to like post: ${error.message}` })
  }
}

// ADD COMMENT
// Bug fixed: was "Post.findById(videoId)" → postId
// Bug fixed: returns { post: populatedPost }
export const addCommentForPost = async (req, res) => {
  try {
    const { postId, message } = req.body
    const userId = req.userId

    const post = await Post.findById(postId)
    if (!post) return res.status(404).json({ message: "Post not found" })

    post.comments.push({ author: userId, message })
    await post.save()

    const populatedPost = await getPopulatedPost(postId)
    return res.status(200).json({ post: populatedPost })
  } catch (error) {
    return res.status(500).json({ message: `Error adding comment: ${error.message}` })
  }
}

// ADD REPLY
// Bug fixed: was returning undefined variable "populatedPost" when named "populated"
export const addReplyForPost = async (req, res) => {
  try {
    const { postId, commentId, message } = req.body
    const userId = req.userId

    const post = await Post.findById(postId)
    if (!post) return res.status(404).json({ message: "Post not found" })

    const comment = post.comments.id(commentId)
    if (!comment) return res.status(404).json({ message: "Comment not found" })

    comment.replies.push({ author: userId, message })
    await post.save()

    const populatedPost = await getPopulatedPost(postId)
    return res.status(200).json({ post: populatedPost })
  } catch (error) {
    return res.status(500).json({ message: `Error adding reply: ${error.message}` })
  }
}