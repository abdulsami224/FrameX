import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bookmark, Heart, MessageCircle, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const SavedPosts = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Saved · FrameX';
    fetchSavedPosts();
  }, []);

  const fetchSavedPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('saved_posts')
        .select(`
          id,
          posts (
            id, image_url, caption,
            profiles (username, avatar_url),
            likes (id),
            comments (id)
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // extract posts from nested structure
      const extracted = data
        .map(item => item.posts)
        .filter(Boolean);

      setPosts(extracted);
    } catch (err) {
      console.log('Saved posts error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Navbar />
      <div className="md:pl-64 pt-16 md:pt-0 pb-16 md:pb-0">
        <div className="max-w-3xl mx-auto px-4 py-6">

          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 bg-[#16161f] border border-[#2a2a3a] rounded-xl flex items-center justify-center">
              <Bookmark size={18} className="text-white fill-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Saved Posts</h1>
              <p className="text-xs text-gray-400 mt-0.5">
                {posts.length} saved item{posts.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 size={28} className="text-blue-500 animate-spin" />
            </div>
          ) : posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <div className="w-16 h-16 bg-[#16161f] border border-[#2a2a3a] rounded-2xl flex items-center justify-center">
                <Bookmark size={28} className="text-gray-500" />
              </div>
              <h2 className="text-lg font-semibold text-white">No saved posts</h2>
              <p className="text-sm text-gray-400 text-center">
                Save posts by tapping the bookmark icon
              </p>
              <button
                onClick={() => navigate('/')}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition"
              >
                Explore Posts
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-0.5">
              {posts.map((post) => (
                <div
                  key={post.id}
                  onClick={() => navigate(`/post/${post.id}`)}
                  className="relative aspect-square cursor-pointer group overflow-hidden bg-[#16161f]"
                >
                  <img
                    src={post.image_url}
                    alt="saved post"
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
                  {/* Saved badge */}
                  <div className="absolute top-2 right-2">
                    <Bookmark size={14} className="text-white fill-white drop-shadow" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SavedPosts;