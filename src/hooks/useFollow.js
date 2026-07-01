import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

const useFollow = (profileId) => {
  const { user } = useAuth();
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profileId) {
      fetchFollowData();
    }
  }, [profileId, user]);

  const fetchFollowData = async () => {
    try {
      setLoading(true);

      // check if current user follows this profile
      if (user && user.id !== profileId) {
        const { data: followData } = await supabase
          .from('follows')
          .select('id')
          .eq('follower_id', user.id)
          .eq('following_id', profileId)
          .single();
        setIsFollowing(!!followData);
      }

      // get follower count
      const { count: followers } = await supabase
        .from('follows')
        .select('*', { count: 'exact', head: true })
        .eq('following_id', profileId);

      // get following count
      const { count: following } = await supabase
        .from('follows')
        .select('*', { count: 'exact', head: true })
        .eq('follower_id', profileId);

      setFollowerCount(followers || 0);
      setFollowingCount(following || 0);
    } catch (err) {
      console.log('Follow data error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleFollow = async () => {
    if (!user || user.id === profileId) return;

    const newFollowing = !isFollowing;
    // optimistic update
    setIsFollowing(newFollowing);
    setFollowerCount(prev => newFollowing ? prev + 1 : prev - 1);

    if (newFollowing) {
      await supabase.from('follows').insert({
        follower_id: user.id,
        following_id: profileId
      });
    } else {
      await supabase.from('follows').delete()
        .eq('follower_id', user.id)
        .eq('following_id', profileId);
    }
  };

  return {
    isFollowing,
    followerCount,
    followingCount,
    loading,
    toggleFollow,
    fetchFollowData
  };
};

export default useFollow;