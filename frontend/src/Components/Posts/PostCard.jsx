import React, { useState } from "react";
import { ThumbsUp, ThumbsDown, X } from "lucide-react";
import { toggleLike, toggleDislike, deletePost } from "../../api/posts";
import { MEDIA_URL } from "../../constant/constant";

export default function PostCard({ post, token, user, onPostUpdate }) {
  const [liked, setLiked] = useState(post.is_liked || false);
  const [disliked, setDisliked] = useState(post.is_disliked || false);
  const [likeCount, setLikeCount] = useState(post.likes_count || 0);
  const [dislikeCount, setDislikeCount] = useState(post.dislikes_count || 0);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLike = async () => {
    const prevLiked = liked;
    const prevDisliked = disliked;
    const prevLikeCount = likeCount;
    const prevDislikeCount = dislikeCount;

    if (liked) {
      setLiked(false);
      setLikeCount((c) => c - 1);
    } else {
      setLiked(true);
      setLikeCount((c) => c + 1);
      if (disliked) {
        setDisliked(false);
        setDislikeCount((c) => c - 1);
      }
    }

    try {
      const res = await toggleLike(token, post.id);
      setLiked(res.liked);
      setDisliked(res.disliked);
      setLikeCount(res.likes_count);
      setDislikeCount(res.dislikes_count);
    } catch {
      setLiked(prevLiked);
      setDisliked(prevDisliked);
      setLikeCount(prevLikeCount);
      setDislikeCount(prevDislikeCount);
    }
  };

  const handleDislike = async () => {
    const prevLiked = liked;
    const prevDisliked = disliked;
    const prevLikeCount = likeCount;
    const prevDislikeCount = dislikeCount;

    if (disliked) {
      setDisliked(false);
      setDislikeCount((c) => c - 1);
    } else {
      setDisliked(true);
      setDislikeCount((c) => c + 1);
      if (liked) {
        setLiked(false);
        setLikeCount((c) => c - 1);
      }
    }

    try {
      const res = await toggleDislike(token, post.id);
      setLiked(res.liked);
      setDisliked(res.disliked);
      setLikeCount(res.likes_count);
      setDislikeCount(res.dislikes_count);
    } catch {
      setLiked(prevLiked);
      setDisliked(prevDisliked);
      setLikeCount(prevLikeCount);
      setDislikeCount(prevDislikeCount);
    }
  };

  const confirmDelete = () => setShowConfirm(true);

  const handleDelete = async () => {
    try {
      setLoading(true);
      await deletePost(token, post.id);
      onPostUpdate(token);
    } catch {
    } finally {
      setLoading(false);
      setShowConfirm(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6 transition hover:shadow-md">
        <div className="flex justify-between items-start p-4 sm:p-5 border-b border-gray-100">
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
            <div className="flex flex-col">
              <h3 className="font-semibold text-gray-800 text-sm sm:text-base">
                {post.user?.username}
              </h3>
              <p className="text-xs sm:text-sm text-gray-500">
                {new Date(post.created_at).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          {user && post.user && post.user.full_name === user.full_name && (
            <button
              onClick={confirmDelete}
              className="text-gray-400 hover:text-red-500 transition p-1"
            >
              <X size={18} />
            </button>
          )}
        </div>

        <div className="px-4 sm:px-5 py-3">
          <p className="text-gray-800 text-[15px] leading-relaxed whitespace-pre-line">
            {post.description}
          </p>
        </div>

        {post.image && (
          <div className="px-4 sm:px-5 pb-3">
            <div className="rounded-xl overflow-hidden border border-gray-100">
              <img
                src={MEDIA_URL + post.image}
                alt="Post"
                className="w-full object-cover max-h-[400px] transition-transform duration-300 hover:scale-[1.01]"
              />
            </div>
          </div>
        )}

        <div className="flex items-center gap-3 px-4 sm:px-5 py-4 border-t border-gray-100 text-sm">
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-200 ${
              liked
                ? "text-blue-600 bg-blue-50"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <ThumbsUp size={18} /> Like {likeCount}
          </button>

          <button
            onClick={handleDislike}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-200 ${
              disliked
                ? "text-red-600 bg-red-50"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <ThumbsDown size={18} /> Dislike {dislikeCount}
          </button>
        </div>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-[90%] max-w-sm animate-fadeIn">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Delete Post?
            </h2>
            <p className="text-gray-600 text-sm mb-5">
              Are you sure you want to delete this post? This action cannot be
              undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="px-4 py-2 text-sm rounded-md bg-red-600 text-white hover:bg-red-700 transition disabled:opacity-70"
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
