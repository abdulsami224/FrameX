import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Heart, MessageCircle, Loader2, X } from 'lucide-react';
import Navbar from '../components/Navbar';
import useExplore from '../hooks/useExplore';

const Explore = () => {
  const navigate = useNavigate();
  const { posts, users, loading, searchLoading, query, setQuery } = useExplore();

  useEffect(() => {
    document.title = 'Explore · FrameX';
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Navbar />
      <div className="md:pl-64 pt-16 md:pt-0 pb-16 md:pb-0">
        <div className="max-w-3xl mx-auto px-4 py-6">

          {/* Search Bar */}
          <div className="relative mb-6">
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
            />
            <input
              type="text"
              placeholder="Search users..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-[#16161f] border border-[#2a2a3a] rounded-2xl pl-11 pr-10 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Search Results */}
          {query ? (
            <div className="mb-6">
              {searchLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 size={22} className="text-blue-500 animate-spin" />
                </div>
              ) : users.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-gray-400 text-sm">No users found for "{query}"</p>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {users.map(user => (
                    <div
                      key={user.id}
                      onClick={() => navigate(`/profile/${user.username}`)}
                      className="flex items-center gap-3 p-3 bg-[#16161f] border border-[#2a2a3a] rounded-xl cursor-pointer hover:border-blue-500/40 transition"
                    >
                      {/* Avatar */}
                      <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center overflow-hidden flex-shrink-0">
                        {user.avatar_url ? (
                          <img src={user.avatar_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-white font-bold">
                            {user.username?.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      {/* Info */}
                      <div>
                        <p className="text-sm font-semibold text-white">{user.username}</p>
                        {user.full_name && (
                          <p className="text-xs text-gray-400">{user.full_name}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Explore Grid */
            <>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                Explore
              </p>

              {loading ? (
                <div className="grid grid-cols-3 gap-0.5">
                  {[...Array(9)].map((_, i) => (
                    <div key={i} className="aspect-square bg-[#16161f] animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-0.5">
                  {posts.map((post, index) => (
                    <div
                      key={post.id}
                      onClick={() => navigate(`/post/${post.id}`)}
                      className={`relative cursor-pointer group overflow-hidden bg-[#16161f] ${
                        // every 7th post is big — instagram style
                        index % 7 === 0
                          ? 'col-span-2 row-span-2'
                          : 'aspect-square'
                      }`}
                      style={index % 7 === 0 ? { aspectRatio: '1' } : {}}
                    >
                      <img
                        src={post.image_url}
                        alt="post"
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                        <div className="flex items-center gap-1.5">
                          <Heart size={16} className="text-white fill-white" />
                          <span className="text-white font-semibold text-sm">
                            {post.likes?.length || 0}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MessageCircle size={16} className="text-white fill-white" />
                          <span className="text-white font-semibold text-sm">
                            {post.comments?.length || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Explore;