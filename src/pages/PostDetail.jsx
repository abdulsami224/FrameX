import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, MoreHorizontal, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import useLikes from '../hooks/useLikes';
import useComments from '../hooks/useComments';
import useCreatePost from '../hooks/useCreatePost';
import CommentItem from '../components/CommentItem';
import CommentInput from '../components/CommentInput';
import Navbar from '../components/Navbar';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isLiked, toggleLike } = useLikes();
  const { deletePost } = useCreatePost();
  const { comments, loading: commentsLoading, submitting, addComment, deleteComment } = useComments(id);

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [showOptions, setShowOptions] = useState(false);

  useEffect(() => {
    fetchPost();
  }, [id]);

  useEffect(() => {
    if (post) {
      setLiked(isLiked(post));
      setLikeCount(post.likes?.length || 0);
      document.title = `${post.profiles?.username}'s post · FrameX`;
    }
  }, [post]);

  const fetchPost = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles (id, username, full_name, avatar_url),
          likes (id, user_id),
          comments (id)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      setPost(data);
    } catch (err) {
      console.log('Post error:', err.message);
      setPost(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    const newLiked = !liked;
    setLiked(newLiked);
    setLikeCount(prev => newLiked ? prev + 1 : prev - 1);
    await toggleLike(post.id, liked);
  };

  const handleDelete = () => {
    setShowOptions(false);
    toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="font-medium text-sm">Delete this post?</p>
        <p className="text-xs text-gray-400">This cannot be undone.</p>
        <div className="flex gap-2">
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                await deletePost(post.id, post.image_url);
                toast.success('Post deleted');
                navigate('/');
              } catch {
                toast.error('Failed to delete');
              }
            }}
            className="flex-1 bg-red-500 text-white text-xs py-1.5 rounded-lg"
          >
            Delete
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="flex-1 border border-[#2a2a3a] text-gray-400 text-xs py-1.5 rounded-lg"
          >
            Cancel
          </button>
        </div>
      </div>
    ), { duration: Infinity });
  };

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minutes ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hours ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} days ago`;
    return new Date(date).toLocaleDateString();
  };

  if (loading) return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Navbar />
      <div className="md:pl-64 flex items-center justify-center min-h-[80vh]">
        <Loader2 size={28} className="text-blue-500 animate-spin" />
      </div>
    </div>
  );

  if (!post) return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Navbar />
      <div className="md:pl-64 flex flex-col items-center justify-center min-h-[80vh] gap-4">
        <p className="text-white text-lg font-semibold">Post not found</p>
        <button onClick={() => navigate('/')} className="text-blue-500 text-sm hover:underline">
          Go Home
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Navbar />
      <div className="md:pl-64 pt-16 md:pt-0 pb-16 md:pb-0">
        <div className="max-w-5xl mx-auto px-4 py-6">

          {/* Back */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition mb-6 text-sm"
          >
            <ArrowLeft size={18} /> Back
          </button>

          {/* Post layout — image left, comments right on desktop */}
          <div className="flex flex-col lg:flex-row bg-[#16161f] border border-[#2a2a3a] rounded-2xl overflow-hidden">

            {/* Image */}
            <div className="lg:w-3/5 bg-black flex items-center justify-center">
              <img
                src={post.image_url}
                alt="post"
                className="w-full h-full object-contain max-h-[600px]"
              />
            </div>

            {/* Right panel */}
            <div className="lg:w-2/5 flex flex-col min-h-[500px] max-h-[600px]">

              {/* Post header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#2a2a3a]">
                <div
                  className="flex items-center gap-3 cursor-pointer"
                  onClick={() => navigate(`/profile/${post.profiles?.username}`)}
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center overflow-hidden">
                    {post.profiles?.avatar_url ? (
                      <img src={post.profiles.avatar_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-white text-sm font-bold">
                        {post.profiles?.username?.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{post.profiles?.username}</p>
                    {post.location && (
                      <p className="text-xs text-gray-400">{post.location}</p>
                    )}
                  </div>
                </div>

                {/* Options */}
                {post.profiles?.id === user?.id && (
                  <div className="relative">
                    <button
                      onClick={() => setShowOptions(!showOptions)}
                      className="text-gray-400 hover:text-white transition"
                    >
                      <MoreHorizontal size={18} />
                    </button>
                    {showOptions && (
                      <div className="absolute right-0 top-8 bg-[#1e1e2a] border border-[#2a2a3a] rounded-xl overflow-hidden z-10 min-w-32">
                        <button
                          onClick={handleDelete}
                          className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-[#2a2a3a] transition"
                        >
                          Delete Post
                        </button>
                        <button
                          onClick={() => setShowOptions(false)}
                          className="w-full text-left px-4 py-3 text-sm text-gray-400 hover:bg-[#2a2a3a] transition"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Caption + Comments scrollable area */}
              <div className="flex-1 overflow-y-auto px-4 py-3">

                {/* Caption */}
                {post.caption && (
                  <div className="flex items-start gap-3 mb-4 pb-4 border-b border-[#2a2a3a]">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {post.profiles?.avatar_url ? (
                        <img src={post.profiles.avatar_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-white text-xs font-bold">
                          {post.profiles?.username?.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-200">
                      <span className="font-semibold text-white mr-2">{post.profiles?.username}</span>
                      {post.caption}
                    </p>
                  </div>
                )}

                {/* Comments */}
                {commentsLoading ? (
                  <div className="flex justify-center py-4">
                    <Loader2 size={20} className="text-blue-500 animate-spin" />
                  </div>
                ) : comments.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 text-sm">No comments yet</p>
                    <p className="text-gray-600 text-xs mt-1">Be the first to comment</p>
                  </div>
                ) : (
                  comments.map(comment => (
                    <CommentItem
                      key={comment.id}
                      comment={comment}
                      onDelete={deleteComment}
                    />
                  ))
                )}
              </div>

              {/* Actions + Comment input fixed at bottom */}
              <div className="border-t border-[#2a2a3a]">
                {/* Like + save row */}
                <div className="flex items-center justify-between px-4 py-3">
                  <button
                    onClick={handleLike}
                    className="transition-transform hover:scale-110"
                  >
                    <Heart
                      size={24}
                      className={liked ? 'text-red-500 fill-red-500' : 'text-white'}
                    />
                  </button>
                  <p className="text-sm font-semibold text-white">
                    {likeCount} {likeCount === 1 ? 'like' : 'likes'}
                  </p>
                </div>

                {/* Timestamp */}
                <p className="px-4 pb-2 text-xs text-gray-500 uppercase tracking-wide">
                  {timeAgo(post.created_at)}
                </p>

                {/* Comment input */}
                <CommentInput onSubmit={addComment} submitting={submitting} />
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;