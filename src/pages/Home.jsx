import { useEffect } from 'react';
import { ImageIcon } from 'lucide-react';
import usePosts from '../hooks/usePosts';
import PostCard from '../components/PostCard';
import Navbar from '../components/Navbar';

const Home = () => {
  const { posts, loading, fetchPosts } = usePosts();

  useEffect(() => {
    document.title = 'FrameX';
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Navbar />

      {/* Main content — offset for sidebar/topbar */}
      <div className="md:pl-64 pt-16 md:pt-0 pb-16 md:pb-0">
        <div className="max-w-xl mx-auto px-4 py-6">

          {loading ? (
            // Skeleton loading
            <div className="flex flex-col gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-[#16161f] border border-[#2a2a3a] rounded-2xl overflow-hidden">
                  <div className="flex items-center gap-3 px-4 py-3">
                    <div className="w-9 h-9 rounded-full bg-[#1e1e2a] animate-pulse" />
                    <div className="w-24 h-3 bg-[#1e1e2a] rounded animate-pulse" />
                  </div>
                  <div className="w-full aspect-square bg-[#1e1e2a] animate-pulse" />
                  <div className="p-4 flex flex-col gap-2">
                    <div className="w-16 h-3 bg-[#1e1e2a] rounded animate-pulse" />
                    <div className="w-full h-3 bg-[#1e1e2a] rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            // Empty state
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <div className="w-16 h-16 bg-[#16161f] border border-[#2a2a3a] rounded-2xl flex items-center justify-center">
                <ImageIcon size={28} className="text-gray-500" />
              </div>
              <h2 className="text-lg font-semibold text-white">No posts yet</h2>
              <p className="text-sm text-gray-400">
                Follow people or create your first post to see content here
              </p>
            </div>
          ) : (
            // Posts feed
            posts.map((post) => (
              <PostCard key={post.id} post={post} onLikeToggle={fetchPosts} />
            ))
          )}

        </div>
      </div>
    </div>
  );
};

export default Home;