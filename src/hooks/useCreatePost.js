import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

const useCreatePost = () => {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);

  const uploadImage = async (file) => {
    
    const ext = file.name.split('.').pop();
    const fileName = `${user.id}/${Date.now()}.${ext}`;

    const { data, error } = await supabase.storage
      .from('posts')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    // get public URL of uploaded image
    const { data: urlData } = supabase.storage
      .from('posts')
      .getPublicUrl(fileName);

    return urlData.publicUrl;
  };

  const createPost = async ({ file, caption, location }) => {
    if (!file) throw new Error('Please select an image');
    setUploading(true);

    try {
      // 1. upload image to storage
      const imageUrl = await uploadImage(file);

      // 2. save post to database
      const { data, error } = await supabase
        .from('posts')
        .insert({
          user_id: user.id,
          image_url: imageUrl,
          caption: caption.trim() || null,
          location: location.trim() || null,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } finally {
      setUploading(false);
    }
  };

  const deletePost = async (postId, imageUrl) => {
    try {
      // extract file path from URL to delete from storage
      const urlParts = imageUrl.split('/storage/v1/object/public/posts/');
      if (urlParts[1]) {
        await supabase.storage
          .from('posts')
          .remove([urlParts[1]]);
      }

      // delete post from database
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId)
        .eq('user_id', user.id); 

      if (error) throw error;
    } catch (err) {
      throw err;
    }
  };

  return { createPost, deletePost, uploading };
};

export default useCreatePost;