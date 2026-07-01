import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, MessageCircle } from 'lucide-react';

const PostGrid = ({ posts }) => {
  const navigate = useNavigate();

  if (posts.length === 0) return (
    <div className="col-span-3 py-16 text-center">
      <p className="text-gray-500 text-sm">No posts yet</p>
    </div>
  );

  return (
    <div className="grid grid-cols-3 gap-0.5">
      {posts.map((post) => (
        <div
          key={post.id}
          onClick={() => navigate(`/post/${post.id}`)}
          className="relative aspect-square cursor-pointer group overflow-hidden bg-[#16161f]"
        >
          <img
            src={post.image_url}
            alt="post"
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-5">
            <div className="flex items-center gap-1.5">
              <Heart size={18} className="text-white fill-white" />
              <span className="text-white font-semibold text-sm">
                {post.likes?.length || 0}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <MessageCircle size={18} className="text-white fill-white" />
              <span className="text-white font-semibold text-sm">
                {post.comments?.length || 0}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PostGrid;