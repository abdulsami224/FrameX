import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

const useNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const channelRef = useRef(null); // ← store channel reference

  useEffect(() => {
    if (!user) return;

    fetchNotifications();
    setupChannel();

    return () => {
      // cleanup — remove channel completely before re-subscribing
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current); // ← removes it entirely
        channelRef.current = null;
      }
    };
  }, [user]);

  const setupChannel = () => {
    // remove any existing channel first
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    // create fresh channel with unique name using timestamp
    const channel = supabase
      .channel(`notifications-${user.id}-${Date.now()}`) // ← unique every time
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `recipient_id=eq.${user.id}`
        },
        () => fetchNotifications()
      )
      .subscribe();

    channelRef.current = channel;
  };

  const fetchNotifications = async () => {
    try {
      const { data } = await supabase
        .from('notifications')
        .select(`
          *,
          sender:profiles!sender_id (id, username, avatar_url),
          post:posts (id, image_url)
        `)
        .eq('recipient_id', user.id)
        .order('created_at', { ascending: false })
        .limit(30);

      setNotifications(data || []);
      setUnreadCount(data?.filter(n => !n.is_read).length || 0);
    } catch (err) {
      console.log('Notifications error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const markAllRead = async () => {
    try {
      await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('recipient_id', user.id)
        .eq('is_read', false);

      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.log('Mark read error:', err.message);
    }
  };

  const createNotification = async ({ recipientId, type, postId, message }) => {
    if (recipientId === user.id) return;
    try {
      await supabase.from('notifications').insert({
        recipient_id: recipientId,
        sender_id: user.id,
        type,
        post_id: postId || null,
        message
      });
    } catch (err) {
      console.log('Create notification error:', err.message);
    }
  };

  return {
    notifications,
    unreadCount,
    loading,
    markAllRead,
    createNotification,
    fetchNotifications
  };
};

export default useNotifications;