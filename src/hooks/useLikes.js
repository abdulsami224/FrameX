import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

const useLikes = () => {
  const { user } = useAuth();

  // check if current user already liked this post
  const isLiked = (post) => {
    return post.likes?.some(like => like.user_id === user?.id);
  };

  const toggleLike = async (postId, currentlyLiked) => {
    if (!user) return;

    if (currentlyLiked) {
      // unlike — delete the row
      await supabase
        .from('likes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', user.id);
    } else {
      // like — insert new row
      await supabase
        .from('likes')
        .insert({ post_id: postId, user_id: user.id });
    }
  };

  return { isLiked, toggleLike };
};

export default useLikes;