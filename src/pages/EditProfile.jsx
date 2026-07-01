import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const EditProfile = () => {
  const { user, profile, fetchProfile } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    full_name: profile?.full_name || '',
    username: profile?.username || '',
    bio: profile?.bio || '',
    website: profile?.website || '',
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(profile?.avatar_url || null);
  const [loading, setLoading] = useState(false);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Avatar must be under 5MB');
      return;
    }
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const uploadAvatar = async () => {
    if (!avatarFile) return profile?.avatar_url;

    const ext = avatarFile.name.split('.').pop();
    const fileName = `avatars/${user.id}.${ext}`;

    const { error } = await supabase.storage
      .from('posts')
      .upload(fileName, avatarFile, { upsert: true });

    if (error) throw error;

    const { data } = supabase.storage.from('posts').getPublicUrl(fileName);
    return data.publicUrl;
  };

  const handleSubmit = async () => {
    if (!form.username.trim()) {
      toast.error('Username is required');
      return;
    }
    // username validation — only letters, numbers, underscores
    if (!/^[a-zA-Z0-9_]+$/.test(form.username)) {
      toast.error('Username can only contain letters, numbers and underscores');
      return;
    }

    setLoading(true);
    try {
      // upload new avatar if changed
      const avatarUrl = await uploadAvatar();

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: form.full_name.trim(),
          username: form.username.trim().toLowerCase(),
          bio: form.bio.trim(),
          website: form.website.trim(),
          avatar_url: avatarUrl,
        })
        .eq('id', user.id);

      if (error) {
        if (error.code === '23505') {
          toast.error('Username already taken');
          return;
        }
        throw error;
      }

      await fetchProfile(user.id);
      toast.success('Profile updated successfully');
      navigate(`/profile/${form.username.trim().toLowerCase()}`);
    } catch (err) {
      toast.error(err.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-[#1e1e2a] border border-[#2a2a3a] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition";

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Navbar />
      <div className="md:pl-64 pt-16 md:pt-0 pb-16 md:pb-0">
        <div className="max-w-xl mx-auto px-4 py-6">

          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-xl hover:bg-[#16161f] transition text-gray-400 hover:text-white"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-bold text-white">Edit Profile</h1>
          </div>

          {/* Avatar */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center overflow-hidden">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-white text-3xl font-bold">
                    {profile?.username?.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              {/* Camera button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center transition shadow-lg"
              >
                <Camera size={14} className="text-white" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="mt-3 text-sm text-blue-500 hover:text-blue-400 transition font-medium"
            >
              Change photo
            </button>
          </div>

          {/* Form */}
          <div className="flex flex-col gap-4">

            {[
              { key: 'full_name', label: 'Full Name', placeholder: 'Your full name' },
              { key: 'username', label: 'Username', placeholder: 'username' },
              { key: 'website', label: 'Website', placeholder: 'https://yourwebsite.com' },
            ].map(({ key, label, placeholder }) => (
              <div key={key} className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-400">{label}</label>
                <input
                  type="text"
                  placeholder={placeholder}
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  className={inputClass}
                />
              </div>
            ))}

            {/* Bio */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-400">Bio</label>
              <div className="relative">
                <textarea
                  rows={3}
                  placeholder="Tell people about yourself..."
                  value={form.bio}
                  onChange={(e) => {
                    if (e.target.value.length <= 150)
                      setForm({ ...form, bio: e.target.value });
                  }}
                  className={`${inputClass} resize-none`}
                />
                <p className="absolute bottom-3 right-3 text-xs text-gray-500">
                  {form.bio.length}/150
                </p>
              </div>
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-semibold py-3 rounded-xl transition flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <><Loader2 size={16} className="animate-spin" /> Saving...</>
              ) : 'Save Changes'}
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;