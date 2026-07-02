import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const CommentItem = ({ comment, onDelete }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const isOwn = user?.id === comment.user_id;

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return 'now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
    return `${Math.floor(hours / 24)}d`;
  };

  return (
    <div className="flex items-start gap-3 py-2 group">
      {/* Avatar */}
      <div
        onClick={() => navigate(`/profile/${comment.profiles?.username}`)}
        className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center flex-shrink-0 cursor-pointer overflow-hidden"
      >
        {comment.profiles?.avatar_url ? (
          <img src={comment.profiles.avatar_url} alt="" className="w-full h-full object-cover" />
        ) : (
          <span className="text-white text-xs font-bold">
            {comment.profiles?.username?.charAt(0).toUpperCase()}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-200">
          <span
            onClick={() => navigate(`/profile/${comment.profiles?.username}`)}
            className="font-semibold text-white cursor-pointer hover:underline mr-2"
          >
            {comment.profiles?.username}
          </span>
          {comment.content}
        </p>
        <div className="flex items-center gap-3 mt-1">
          <span className="text-xs text-gray-500">{timeAgo(comment.created_at)}</span>
          {isOwn && (
            <button
              onClick={() => onDelete(comment.id)}
              className="text-xs text-gray-500 hover:text-red-400 transition opacity-0 group-hover:opacity-100"
            >
              <Trash2 size={11} />
            </button>
          )}
        </div>
      </div>

      {/* Like comment */}
      <button
        onClick={() => setLiked(!liked)}
        className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition"
      >
        <Heart
          size={12}
          className={liked ? 'text-red-500 fill-red-500' : 'text-gray-500'}
        />
      </button>
    </div>
  );
};

export default CommentItem;