import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const useProfile = (username) => {
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (username) fetchProfile();
  }, [username]);

  const fetchProfile = async () => {
    try {
      setLoading(true);

      // fetch profile by username
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single();

      if (error) throw error;
      setProfile(profileData);

      // fetch user posts with likes and comments count
      const { data: postsData } = await supabase
        .from('posts')
        .select(`
          *,
          likes (id),
          comments (id)
        `)
        .eq('user_id', profileData.id)
        .order('created_at', { ascending: false });

      setPosts(postsData || []);
    } catch (err) {
      console.log('Profile error:', err.message);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  return { profile, posts, loading, fetchProfile };
};

export default useProfile;