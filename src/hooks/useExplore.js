import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';

const useExplore = () => {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [query, setQuery] = useState('');
  const debounceRef = useRef(null);

  useEffect(() => {
    fetchExplorePosts();
  }, []);

  // debounce search
  useEffect(() => {
    clearTimeout(debounceRef.current);
    if (query.trim()) {
      setSearchLoading(true);
      debounceRef.current = setTimeout(() => {
        searchUsers(query);
      }, 400);
    } else {
      setUsers([]);
      setSearchLoading(false);
    }
  }, [query]);

  const fetchExplorePosts = async () => {
    try {
      const { data } = await supabase
        .from('posts')
        .select(`
          id, image_url,
          likes (id),
          comments (id)
        `)
        .order('created_at', { ascending: false })
        .limit(30);

      setPosts(data || []);
    } catch (err) {
      console.log('Explore error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const searchUsers = async (searchQuery) => {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('id, username, full_name, avatar_url')
        .or(`username.ilike.%${searchQuery}%,full_name.ilike.%${searchQuery}%`)
        .limit(8);

      setUsers(data || []);
    } catch (err) {
      console.log('Search error:', err.message);
    } finally {
      setSearchLoading(false);
    }
  };

  return { posts, users, loading, searchLoading, query, setQuery };
};

export default useExplore;