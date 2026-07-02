import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

const useComments = (postId) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!postId) return;

        fetchComments();
        const channel = subscribeToComments(); // ← store reference

        return () => {
            if (channel) channel.unsubscribe(); // ← cleanup correct channel
        };
    }, [postId]);

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          profiles (id, username, avatar_url)
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setComments(data || []);
    } catch (err) {
      console.log('Comments error:', err.message);
    } finally {
      setLoading(false);
    }
  };

    const subscribeToComments = () => {
        const channel = supabase
            .channel(`comments-${postId}`)  
            .on(
            'postgres_changes',
            {
                event: 'INSERT',
                schema: 'public',
                table: 'comments',
                filter: `post_id=eq.${postId}`
            },
                () => {
                    fetchComments();
                }
            );

        channel.subscribe();
        return channel;
    };

    const addComment = async (content) => {
        if (!content.trim() || !user) return;
        setSubmitting(true);
        try {
        const { error } = await supabase
            .from('comments')
            .insert({
            post_id: postId,
            user_id: user.id,
            content: content.trim()
            });
        if (error) throw error;
        await fetchComments();
        } catch (err) {
        throw err;
        } finally {
        setSubmitting(false);
        }
    };

    const deleteComment = async (commentId) => {
        try {
        await supabase
            .from('comments')
            .delete()
            .eq('id', commentId)
            .eq('user_id', user.id);
        setComments(prev => prev.filter(c => c.id !== commentId));
        } catch (err) {
        throw err;
        }
    };

    return { comments, loading, submitting, addComment, deleteComment };
};

export default useComments;