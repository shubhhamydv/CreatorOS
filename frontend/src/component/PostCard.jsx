import axios from "axios"
import React, { useState } from "react"
import { useSelector } from "react-redux"
import { FaHeart, FaComment, FaChevronDown, FaChevronUp, FaPaperPlane } from "react-icons/fa"
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

  const dateStr = post?.createdAt
    ? new Date(post.createdAt).toLocaleDateString("en-US", {
        year: "numeric", month: "short", day: "numeric",
      })
    : ""

  const handleLike = async () => {
    setLikeLoading(true)
    try {
      const result = await axios.put(
        `${serverUrl}/api/content/post/toggle-like`,
        { postId: post?._id },
        { withCredentials: true }
      )
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
    <div className="w-full bg-[#1f1f1f] rounded-2xl overflow-hidden shadow-xl border border-gray-800/60 mb-5 transition-all hover:border-gray-700">

      {/* ── Header ── */}
      <div className="flex items-center gap-3 px-5 pt-5 pb-3">
        <img
          src={avatar || "https://placehold.co/40x40/1a1a1a/orange?text=CH"}
          alt=""
          className="w-10 h-10 rounded-full object-cover ring-2 ring-orange-500/40 flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-white leading-tight">{name}</p>
          <p className="text-xs text-gray-500 mt-0.5">{dateStr}</p>
        </div>
      </div>

      {/* ── Content text ── */}
      {contentText && (
        <div className="px-5 pb-3">
          <p className="text-gray-200 text-sm leading-relaxed">
            {isLong && !expanded ? `${contentText.slice(0, 200)}...` : contentText}
          </p>
          {isLong && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-orange-400 text-xs mt-1.5 flex items-center gap-1 hover:text-orange-300 transition"
            >
              {expanded
                ? <><FaChevronUp size={9} /> Show less</>
                : <><FaChevronDown size={9} /> Read more</>}
            </button>
          )}
        </div>
      )}

      {/* ── Post image ── */}
      {post?.image && (
        <div className="mx-5 mb-4 rounded-xl overflow-hidden border border-gray-800">
          <img
            src={post.image}
            alt="post"
            className="w-full max-h-80 object-cover"
          />
        </div>
      )}

      {/* ── Action bar ── */}
      <div className="flex items-center gap-1 px-5 pb-4 pt-1 border-t border-gray-800/60">
        <button
          onClick={handleLike}
          disabled={likeLoading}
          className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full transition
            ${liked
              ? "text-red-400 bg-red-500/10 hover:bg-red-500/20"
              : "text-gray-400 hover:text-red-400 hover:bg-red-500/10"}`}
        >
          {likeLoading ? <ClipLoader size={13} color="#f87171" /> : <FaHeart size={13} />}
          <span className="font-medium">{likeCount}</span>
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full transition
            ${showComments
              ? "text-blue-400 bg-blue-500/10"
              : "text-gray-400 hover:text-blue-400 hover:bg-blue-500/10"}`}
        >
          <FaComment size={13} />
          <span className="font-medium">{comments.length}</span>
        </button>
      </div>

      {/* ── Comments section ── */}
      {showComments && (
        <div className="border-t border-gray-800 bg-[#181818] px-5 py-4">

          {/* Add comment input */}
          <div className="flex gap-2.5 items-center mb-4">
            <img
              src={userData?.photoUrl || userData?.photoURL || "https://placehold.co/32x32/222/aaa"}
              alt=""
              className="w-8 h-8 rounded-full object-cover flex-shrink-0 ring-1 ring-gray-700"
            />
            <div className="flex-1 flex gap-2 items-center bg-[#242424] rounded-full border border-gray-700 focus-within:border-gray-500 px-4 py-2 transition">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
                placeholder="Add a comment..."
                className="flex-1 bg-transparent text-white text-sm focus:outline-none placeholder-gray-600"
              />
              <button
                disabled={commentLoading || !newComment.trim()}
                onClick={handleAddComment}
                className="text-orange-500 hover:text-orange-400 disabled:opacity-30 transition flex-shrink-0"
              >
                {commentLoading
                  ? <ClipLoader size={14} color="#f97316" />
                  : <FaPaperPlane size={13} />}
              </button>
            </div>
          </div>

          {/* Comment list */}
          <div className="space-y-3 max-h-72 overflow-y-auto pr-1 custom-scrollbar">
            {comments.length === 0 ? (
              <p className="text-gray-600 text-sm text-center py-4">
                No comments yet. Be the first!
              </p>
            ) : (
              comments.map((comment) => (
                <div key={comment._id} className="bg-[#212121] rounded-xl p-3.5">
                  {/* Comment author */}
                  <div className="flex items-center gap-2 mb-1.5">
                    <img
                      src={comment?.author?.photoUrl || "https://placehold.co/28x28/222/aaa"}
                      alt=""
                      className="w-7 h-7 rounded-full object-cover"
                    />
                    <span className="text-white text-xs font-semibold">
                      @{comment?.author?.userName?.toLowerCase() || "user"}
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm ml-9">{comment?.message}</p>

                  {/* Replies */}
                  {comment.replies?.length > 0 && (
                    <div className="ml-9 mt-2 space-y-1.5">
                      {comment.replies.map((reply) => (
                        <div
                          key={reply._id}
                          className="bg-[#2a2a2a] rounded-lg px-3 py-2 flex items-start gap-2"
                        >
                          <img
                            src={reply?.author?.photoUrl || "https://placehold.co/24x24/222/aaa"}
                            alt=""
                            className="w-5 h-5 rounded-full object-cover flex-shrink-0 mt-0.5"
                          />
                          <div className="min-w-0">
                            <span className="text-xs text-orange-400 font-semibold">
                              @{reply?.author?.userName?.toLowerCase() || "user"}
                            </span>
                            <p className="text-xs text-gray-300 mt-0.5">{reply.message}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <ReplySection comment={comment} handleReply={handleAddReply} />
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

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
        <div className="flex gap-2 mb-1.5">
          <input
            type="text"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder="Write a reply..."
            className="flex-1 border border-gray-700 bg-[#1a1a1a] text-white rounded-full px-3 py-1.5 text-xs focus:outline-none focus:border-gray-600 placeholder-gray-600"
          />
          <button
            disabled={replyLoading}
            onClick={submit}
            className="bg-orange-600 hover:bg-orange-500 text-white px-3 py-1.5 rounded-full text-xs disabled:opacity-50 transition"
          >
            {replyLoading ? <ClipLoader size={11} color="white" /> : "Reply"}
          </button>
        </div>
      )}
      <button
        onClick={() => setShowInput(!showInput)}
        className="text-xs text-gray-500 hover:text-orange-400 transition font-medium"
      >
        {showInput ? "Cancel" : "↩ Reply"}
      </button>
    </div>
  )
}

export default PostCard