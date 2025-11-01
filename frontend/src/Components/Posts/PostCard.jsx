import React, { useState } from "react";
import { ThumbsUp, ThumbsDown, X } from "lucide-react";
import { toggleLike, toggleDislike, deletePost } from "../../api/posts";
import { MEDIA_URL } from "../../constant/constant";
import { useEffect } from "react";

export default function PostCard({ post, token, user, onPostUpdate }) {
  const [liked, setLiked] = useState(post.is_liked || false);
  const [disliked, setDisliked] = useState(post.is_disliked || false);
  const [likeCount, setLikeCount] = useState(post.likes_count || 0);
  const [dislikeCount, setDislikeCount] = useState(post.dislikes_count || 0);
  const handleLike = async () => {
    try {
      const res = await toggleLike(token, post.id);
      setLiked(res.liked);
      setLikeCount(res.likes_count);
      setDisliked(false);
      setDislikeCount(res.dislikes_count);
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleDislike = async () => {
    try {
      const res = await toggleDislike(token, post.id);
      setDisliked(res.disliked);
      setDislikeCount(res.dislikes_count);
      setLiked(false);
      setLikeCount(res.likes_count);
    } catch (error) {
      console.error("Error disliking post:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await deletePost(token, post.id);
      onPostUpdate(token);
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-4 sm:p-5 mb-5 transition hover:shadow-lg">
      <div className="flex justify-between items-start flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <img
            src={
              post.user?.profile_picture
                ? MEDIA_URL + post.user.profile_picture
                : "https://via.placeholder.com/50"
            }
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h3 className="font-semibold text-gray-800 text-sm sm:text-base">
              {post.user?.username}
            </h3>
            <p className="text-xs sm:text-sm text-gray-500">
              Posted on –{" "}
              {new Date(post.created_at).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        {user && post.user && (post.user.full_name === user.full_name) && (
          <button
            onClick={handleDelete}
            className="text-gray-400 hover:text-red-500 transition"
          >
            <X size={18} />
          </button>
        )}

        <p className="mt-3 text-gray-800 text-[15px] leading-relaxed">
          {post.description}
        </p>

        {post.image && (
          <div className="mt-3 rounded-xl overflow-hidden border border-gray-100">
            <img
              src={MEDIA_URL + post.image}
              alt="Post"
              className="w-full object-cover max-h-[400px]"
            />
          </div>
        )}

        <div className="flex items-center gap-3 mt-4 text-sm flex-wrap">
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-200 ${liked ? "text-blue-600 bg-blue-50" : "text-gray-600 hover:bg-gray-50"
              }`}
          >
            <ThumbsUp size={18} /> Like {likeCount}
          </button>

          <button
            onClick={handleDislike}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-200 ${disliked
              ? "text-red-600 bg-red-50"
              : "text-gray-600 hover:bg-gray-50"
              }`}
          >
            <ThumbsDown size={18} /> Dislike {dislikeCount}
          </button>
        </div>
      </div>
    </div>
  );
}
