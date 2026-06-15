import axios from "axios"
import React, { useState } from "react"
import { useSelector } from "react-redux"
import { FaHeart, FaComment, FaChevronDown, FaChevronUp } from "react-icons/fa"
import { ClipLoader } from "react-spinners"
import { serverUrl } from "../App"

function PostCard({ post, channelAvatar, channelName }) {
  const { userData } = useSelector((state) => state.user)

  const [liked, setLiked] = useState(
    post?.likes?.some((uid) => uid?.toString() === userData?._id?.toString()) || false
  )
  const [likeCount, setLikeCount] = useState(post?.likes?.length || 0)
  const [showComments, setShowComments] = useState(false)
  const [newComment, setNewComment] = useState("")
  const [commentLoading, setCommentLoading] = useState(false)
  const [likeLoading, setLikeLoading] = useState(false)
  const [comments, setComments] = useState(post?.comments || [])
  const [expanded, setExpanded] = useState(false)

  const avatar = channelAvatar || post?.channel?.avatar
  const name = channelName || post?.channel?.name || "Channel"
  const contentText = post?.content || ""
  const isLong = contentText.length > 200

  const handleLike = async () => {
    setLikeLoading(true)
    try {
      const result = await axios.put(
        `${serverUrl}/api/content/post/toggle-like`,
        { postId: post?._id },
        { withCredentials: true }
      )
      // Bug fixed: was reading result.data.likes directly but backend returns { post: {...} }
      const updatedPost = result.data?.post || result.data
      setLikeCount(updatedPost?.likes?.length || 0)
      setLiked(updatedPost?.likes?.some((uid) => uid?.toString() === userData?._id?.toString()))
    } catch (error) { console.log(error) }
    setLikeLoading(false)
  }

  const handleAddComment = async () => {
    if (!newComment.trim()) return
    setCommentLoading(true)
    try {
      const result = await axios.post(
        `${serverUrl}/api/content/post/add-comment`,
        { message: newComment, postId: post?._id },
        { withCredentials: true }
      )
      // Bug fixed: backend returns { post: {...} } → extract comments from post
      const updatedPost = result.data?.post || result.data
      setComments(updatedPost?.comments || [])
      setNewComment("")
    } catch (error) { console.log(error) }
    setCommentLoading(false)
  }

  const handleAddReply = async ({ commentId, replyText }) => {
    if (!replyText.trim()) return
    try {
      const result = await axios.post(
        `${serverUrl}/api/content/post/add-reply`,
        { postId: post?._id, commentId, message: replyText },
        { withCredentials: true }
      )
      const updatedPost = result.data?.post || result.data
      setComments(updatedPost?.comments || [])
    } catch (error) { console.log(error) }
  }

  return (
    <div className="w-full bg-[#1a1a1a] rounded-2xl p-5 shadow-lg border border-gray-800 mb-4">

      {/* Author */}
      <div className="flex items-center gap-3 mb-4">
        <img
          src={avatar || "https://placehold.co/40x40/1a1a1a/orange?text=CH"}
          alt="" className="w-10 h-10 rounded-full object-cover flex-shrink-0"
        />
        <div>
          <p className="font-semibold text-sm text-white">{name}</p>
          <p className="text-xs text-gray-500">
            {new Date(post?.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="mb-3">
        <p className="text-gray-200 text-sm leading-relaxed">
          {isLong && !expanded ? `${contentText.slice(0, 200)}...` : contentText}
        </p>
        {isLong && (
          <button onClick={() => setExpanded(!expanded)}
            className="text-blue-400 text-xs mt-1 flex items-center gap-1 hover:text-blue-300 transition">
            {expanded ? <><FaChevronUp size={10} /> Show less</> : <><FaChevronDown size={10} /> Read more</>}
          </button>
        )}
      </div>

      {/* Image */}
      {post?.image && (
        <img src={post.image} alt="post"
          className="w-full max-h-80 object-cover rounded-xl mb-4 border border-gray-800" />
      )}

      {/* Action buttons */}
      <div className="flex items-center gap-6 pt-3 border-t border-gray-800">
        <button onClick={handleLike} disabled={likeLoading}
          className={`flex items-center gap-2 text-sm transition ${liked ? "text-red-500" : "text-gray-400 hover:text-red-400"}`}>
          {likeLoading ? <ClipLoader size={14} color="red" /> : <FaHeart />}
          <span>{likeCount}</span>
        </button>
        <button onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-blue-400 transition">
          <FaComment /><span>{comments.length}</span>
        </button>
      </div>

      {/* Comments */}
      {showComments && (
        <div className="mt-4 border-t border-gray-800 pt-4 space-y-3">
          <div className="flex gap-2 items-center">
            <img src={userData?.photoUrl || userData?.photoURL || "https://placehold.co/32x32"}
              alt="" className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
            <input type="text" value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
              placeholder="Add a comment..."
              className="flex-1 px-3 py-2 rounded-full bg-[#272727] text-white text-sm focus:outline-none border border-gray-700 focus:border-gray-500" />
            <button disabled={commentLoading || !newComment.trim()} onClick={handleAddComment}
              className="px-4 py-2 bg-orange-600 hover:bg-orange-500 rounded-full text-white text-sm disabled:opacity-50 flex items-center gap-1">
              {commentLoading ? <ClipLoader size={14} color="white" /> : "Post"}
            </button>
          </div>

          <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
            {comments.length > 0 ? comments.map((comment) => (
              <div key={comment._id} className="bg-[#212121] p-3 rounded-xl">
                <div className="flex items-center gap-2 mb-1">
                  <img src={comment?.author?.photoUrl || "https://placehold.co/28x28"}
                    alt="" className="w-7 h-7 rounded-full object-cover" />
                  <span className="text-white text-xs font-semibold">
                    @{comment?.author?.userName?.toLowerCase() || "user"}
                  </span>
                </div>
                <p className="text-gray-300 text-sm ml-9">{comment?.message}</p>

                {comment.replies?.length > 0 && (
                  <div className="ml-9 mt-2 space-y-2">
                    {comment.replies.map((reply) => (
                      <div key={reply._id} className="bg-[#2a2a2a] p-2 rounded-lg flex items-center gap-2">
                        <img src={reply?.author?.photoUrl || "https://placehold.co/24x24"}
                          alt="" className="w-5 h-5 rounded-full object-cover" />
                        <span className="text-xs text-gray-400 font-semibold">
                          @{reply?.author?.userName?.toLowerCase() || "user"}
                        </span>
                        <span className="text-xs text-gray-300">{reply.message}</span>
                      </div>
                    ))}
                  </div>
                )}

                <ReplySection comment={comment} handleReply={handleAddReply} />
              </div>
            )) : (
              <p className="text-gray-500 text-sm text-center py-3">No comments yet. Be the first!</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// Bug fixed: was using undefined variable "loading3" → now uses local "replyLoading" state
const ReplySection = ({ comment, handleReply }) => {
  const [replyText, setReplyText] = useState("")
  const [showInput, setShowInput] = useState(false)
  const [replyLoading, setReplyLoading] = useState(false)

  const submit = async () => {
    if (!replyText.trim()) return
    setReplyLoading(true)
    await handleReply({ commentId: comment._id, replyText })
    setReplyText("")
    setShowInput(false)
    setReplyLoading(false)
  }

  return (
    <div className="ml-9 mt-2">
      {showInput && (
        <div className="flex gap-2 mb-1">
          <input type="text" value={replyText} onChange={(e) => setReplyText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder="Add a reply..."
            className="flex-1 border border-gray-700 bg-[#1a1a1a] text-white rounded-full px-3 py-1 text-xs focus:outline-none" />
          <button disabled={replyLoading} onClick={submit}
            className="bg-orange-600 hover:bg-orange-500 text-white px-3 py-1 rounded-full text-xs disabled:opacity-50">
            {replyLoading ? <ClipLoader size={12} color="white" /> : "Reply"}
          </button>
        </div>
      )}
      <button onClick={() => setShowInput(!showInput)}
        className="text-xs text-gray-500 hover:text-gray-300 transition">
        {showInput ? "Cancel" : "Reply"}
      </button>
    </div>
  )
}

export default PostCard