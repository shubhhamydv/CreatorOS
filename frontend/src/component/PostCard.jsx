import axios from "axios";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { FaHeart, FaComment, FaTimes } from "react-icons/fa";
import { ClipLoader } from "react-spinners";
import { serverUrl } from "../App";

function PostCard({ post }) {
  const { userData } = useSelector((state) => state.user);

  const [liked, setLiked] = useState(
    post?.likes?.some(
      (uid) => uid?.toString() === userData?._id?.toString()
    ) || false
  );

  const [likeCount, setLikeCount] = useState(post?.likes?.length || 0);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState(post?.comments || []);
const [loading1,setLoading1] = useState(false)

  // Like Post
  const handleLike = async () => {
    try {
      const result = await axios.put(
        `${serverUrl}/api/content/post/toggle-like`,
        { postId: post?._id },
        { withCredentials: true }
      );

      setLikeCount(result.data?.likes?.length || 0);
      setLiked(result.data?.likes?.includes(userData?._id));
    } catch (error) {
      console.log(error);
    }
  };

  // Add Comment
  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    setLoading(true);

    try {
      const result = await axios.post(
        `${serverUrl}/api/content/post/add-comment`,
        {
          message: newComment,
          postId: post?._id,
        },
        {
          withCredentials: true,
        }
      );

      setComments(result.data?.comments || []);
      setNewComment("");
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  // Add Reply
  const handleAddReply = async ({ commentId, replyText }) => {
    if (!replyText.trim()) return;

    try {
      const result = await axios.post(
        `${serverUrl}/api/content/post/add-reply`,
        {
          postId: post?._id,
          commentId,
          message: replyText,
        },
        {
          withCredentials: true,
        }
      );

      setComments(result.data?.comments || []);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-xl p-5 shadow-lg border border-gray-700 mb-10 relative">
      {/* Post Content */}
      <p className="text-base text-gray-200">{post?.content}</p>

      {post?.image && (
        <img
          src={post?.image}
          alt="post"
          className="w-full h-80 object-cover rounded-xl mt-4 shadow-md"
        />
      )}

      {/* Actions */}
      <div className="flex justify-between items-center mt-4 text-gray-400 text-sm">
        <span className="italic text-gray-500">
          {new Date(post?.createdAt).toDateString()}
        </span>

        <div className="flex gap-6">
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 transition cursor-pointer ${
              liked ? "text-red-500" : "hover:text-red-400"
            }`}
          >
            <FaHeart />
            <span>{likeCount}</span>
          </button>

          <button
            onClick={() => setShowComments(true)}
            className="flex items-center gap-2 hover:text-blue-400 transition cursor-pointer"
          >
            <FaComment />
            <span>{comments.length}</span>
          </button>
        </div>
      </div>

      {/* Comments Modal */}
      {showComments && (
        <div className="absolute bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-md p-4 rounded-t-2xl border-t border-gray-700 max-h-[60%] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-white font-semibold">Comments</h3>

            <button onClick={() => setShowComments(false)}>
              <FaTimes />
            </button>
          </div>

          {/* Add Comment */}
          <div className="flex gap-2 items-center mb-4">
            <img
              src={userData?.photoUrl}
              alt=""
              className="w-8 h-8 rounded-full"
            />

            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 px-3 py-2 rounded-lg bg-gray-700 text-white focus:outline-none"
            />

            <button
              disabled={loading}
              onClick={handleAddComment}
              className="px-4 py-2 bg-orange-600 rounded-lg text-white"
            >
              {loading ? (
                <ClipLoader size={18} color="white" />
              ) : (
                "Post"
              )}
            </button>
          </div>

          {/* Comments List */}
          <div className="space-y-3">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div
                  key={comment._id}
                  className="bg-gray-800 p-3 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <img
                      src={comment?.author?.photoUrl}
                      alt=""
                      className="w-7 h-7 rounded-full"
                    />

                    <span className="text-white text-sm">
                      {comment?.author?.userName}
                    </span>
                  </div>

                  <p className="text-gray-300 ml-9 mt-1">
                    {comment?.message}
                  </p>

                  <ReplySection
                    comment={comment}
                    handleReply={handleAddReply}
                    loading1={loading}
                  />
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">
                No comments yet.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const ReplySection = ({ comment, handleReply, loading1 }) => {
  const [replyText, setReplyText] = useState("");
  const [showReplyInput, setShowReplyInput] = useState(false);

  return (
    <div className="mt-3">
      {showReplyInput && (
        <div className="flex gap-2 mt-2 ml-4">
          <input
            type="text"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Add a reply..."
            className="flex-1 border border-gray-700 bg-[#1a1a1a] text-white rounded-lg px-2 py-1 focus:outline-none"
          />

          <button
            disabled={loading1}
            onClick={() => {
              handleReply({
                commentId: comment._id,
                replyText,
              });

              setReplyText("");
              setShowReplyInput(false);
            }}
            className="bg-orange-600 hover:bg-orange-700 text-white px-3 rounded-lg"
          >
            {loading3 ? (
              <ClipLoader size={15} color="white" />
            ) : (
              "Reply"
            )}
          </button>
        </div>
      )}

      <button
        onClick={() => setShowReplyInput(!showReplyInput)}
        className="ml-4 text-xs text-gray-400 mt-1"
      >
        Reply
      </button>
    </div>
  );
};

export default PostCard;