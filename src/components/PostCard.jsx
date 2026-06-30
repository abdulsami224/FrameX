import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import useLikes from '../hooks/useLikes';

const PostCard = ({ post, onLikeToggle }) => {
  const { user } = useAuth();
  const { isLiked, toggleLike } = useLikes();
  const navigate = useNavigate();

  const liked = isLiked(post);
  const [likeCount, setLikeCount] = useState(post.likes?.length || 0);
  const [localLiked, setLocalLiked] = useState(liked);
  const [showHeartAnim, setShowHeartAnim] = useState(false);

  const handleLike = async () => {
    const newLiked = !localLiked;
    setLocalLiked(newLiked);
    setLikeCount(prev => newLiked ? prev + 1 : prev - 1);
    await toggleLike(post.id, localLiked);
    if (onLikeToggle) onLikeToggle();
  };

  // double tap / click image to like
  const handleDoubleClick = () => {
    if (!localLiked) {
      handleLike();
    }
    setShowHeartAnim(true);
    setTimeout(() => setShowHeartAnim(false), 800);
  };

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d`;
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="bg-[#16161f] border border-[#2a2a3a] rounded-2xl overflow-hidden mb-6">

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate(`/profile/${post.profiles?.username}`)}
        >
          {/* Avatar */}
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center flex-shrink-0 overflow-hidden">
            {post.profiles?.avatar_url ? (
              <img src={post.profiles.avatar_url} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="text-white text-sm font-bold">
                {post.profiles?.username?.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <p className="text-sm font-semibold text-white">
              {post.profiles?.username}
            </p>
            {post.location && (
              <p className="text-xs text-gray-400">{post.location}</p>
            )}
          </div>
        </div>

        <button className="text-gray-400 hover:text-white transition">
          <MoreHorizontal size={18} />
        </button>
      </div>

      {/* Image */}
      <div
        className="relative w-full aspect-square bg-[#0a0a0f] cursor-pointer"
        onDoubleClick={handleDoubleClick}
      >
        <img
          src={post.image_url}
          alt="post"
          loading="lazy"
          className="w-full h-full object-cover"
        />

        {/* Heart animation overlay */}
        {showHeartAnim && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <Heart
              size={90}
              className="text-white fill-white animate-ping-once drop-shadow-2xl"
            />
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-4">
          <button onClick={handleLike} className="transition-transform hover:scale-110">
            <Heart
              size={24}
              className={localLiked ? 'text-red-500 fill-red-500' : 'text-white'}
            />
          </button>
          <button
            onClick={() => navigate(`/post/${post.id}`)}
            className="transition-transform hover:scale-110"
          >
            <MessageCircle size={24} className="text-white" />
          </button>
          <button className="transition-transform hover:scale-110">
            <Send size={22} className="text-white" />
          </button>
        </div>
        <button className="transition-transform hover:scale-110">
          <Bookmark size={22} className="text-white" />
        </button>
      </div>

      {/* Likes count */}
      <div className="px-4 pb-1">
        <p className="text-sm font-semibold text-white">
          {likeCount} {likeCount === 1 ? 'like' : 'likes'}
        </p>
      </div>

      {/* Caption */}
      {post.caption && (
        <div className="px-4 pb-2">
          <p className="text-sm text-gray-300">
            <span className="font-semibold text-white mr-2">
              {post.profiles?.username}
            </span>
            {post.caption}
          </p>
        </div>
      )}

      {/* Comments count */}
      {post.comments?.length > 0 && (
        <button
          onClick={() => navigate(`/post/${post.id}`)}
          className="px-4 pb-2 text-sm text-gray-400 hover:text-gray-300 transition block"
        >
          View all {post.comments.length} comments
        </button>
      )}

      {/* Timestamp */}
      <div className="px-4 pb-4">
        <p className="text-xs text-gray-500 uppercase tracking-wide">
          {timeAgo(post.created_at)}
        </p>
      </div>

    </div>
  );
};

export default PostCard;