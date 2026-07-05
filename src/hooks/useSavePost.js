import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

const useSavePost = (postId) => {
  const { user } = useAuth();
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && postId) checkIfSaved();
  }, [user, postId]);

  const checkIfSaved = async () => {
    const { data } = await supabase
      .from('saved_posts')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', user.id)
      .single();
    setIsSaved(!!data);
  };

  const toggleSave = async () => {
    if (!user) return;
    setLoading(true);

    // optimistic update
    const newSaved = !isSaved;
    setIsSaved(newSaved);

    try {
      if (newSaved) {
        await supabase
          .from('saved_posts')
          .insert({ post_id: postId, user_id: user.id });
      } else {
        await supabase
          .from('saved_posts')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id);
      }
    } catch (err) {
      setIsSaved(!newSaved); // rollback on error
    } finally {
      setLoading(false);
    }
  };

  return { isSaved, toggleSave, loading };
};

export default useSavePost;