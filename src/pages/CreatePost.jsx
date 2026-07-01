import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ImagePlus, MapPin, AlignLeft, X, ArrowLeft, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import ImagePreview from '../components/ImagePreview';
import useCreatePost from '../hooks/useCreatePost';

const MAX_CAPTION_LENGTH = 2200;

const CreatePost = () => {
  const navigate = useNavigate();
  const { createPost, uploading } = useCreatePost();
  const fileInputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [dragOver, setDragOver] = useState(false);

  const handleFileSelect = (selectedFile) => {
    if (!selectedFile) return;

    // validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(selectedFile.type)) {
      toast.error('Only JPG, PNG, WEBP, GIF files allowed');
      return;
    }

    // validate file size — max 10MB
    if (selectedFile.size > 10 * 1024 * 1024) {
      toast.error('Image must be under 10MB');
      return;
    }

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) handleFileSelect(dropped);
  };

  const handleRemoveImage = () => {
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async () => {
    if (!file) {
      toast.error('Please select an image first');
      return;
    }

    try {
      await createPost({ file, caption, location });
      toast.success('Post shared successfully! 🎉');
      navigate('/');
    } catch (err) {
      toast.error(err.message || 'Failed to create post');
    }
  };

  const inputClass = "w-full bg-[#1e1e2a] border border-[#2a2a3a] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition";

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Navbar />

      <div className="md:pl-64 pt-16 md:pt-0 pb-16 md:pb-0">
        <div className="max-w-xl mx-auto px-4 py-6">

          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-xl hover:bg-[#16161f] transition text-gray-400 hover:text-white"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-bold text-white">Create Post</h1>
          </div>

          <div className="flex flex-col gap-5">

            {/* Image Upload Area */}
            {!preview ? (
              <label
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                className={`flex flex-col items-center justify-center w-full aspect-square rounded-2xl border-2 border-dashed cursor-pointer transition-all ${
                  dragOver
                    ? 'border-blue-500 bg-blue-500/5'
                    : 'border-[#2a2a3a] hover:border-blue-500/50 bg-[#16161f]'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileSelect(e.target.files[0])}
                  className="hidden"
                />
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 bg-[#1e1e2a] rounded-2xl flex items-center justify-center">
                    <ImagePlus size={28} className="text-blue-500" />
                  </div>
                  <div className="text-center">
                    <p className="text-white font-semibold text-sm">
                      Drag photo here or{' '}
                      <span className="text-blue-500">browse</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      JPG, PNG, WEBP, GIF · Max 10MB
                    </p>
                  </div>
                </div>
              </label>
            ) : (
              <ImagePreview preview={preview} onRemove={handleRemoveImage} />
            )}

            {/* Caption */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-gray-400 flex items-center gap-1.5">
                <AlignLeft size={12} /> Caption
              </label>
              <div className="relative">
                <textarea
                  rows={4}
                  placeholder="Write a caption..."
                  value={caption}
                  onChange={(e) => {
                    if (e.target.value.length <= MAX_CAPTION_LENGTH)
                      setCaption(e.target.value);
                  }}
                  className={`${inputClass} resize-none`}
                />
                {/* Character count */}
                <p className={`absolute bottom-3 right-3 text-xs ${
                  caption.length > MAX_CAPTION_LENGTH - 100
                    ? 'text-red-400'
                    : 'text-gray-500'
                }`}>
                  {caption.length}/{MAX_CAPTION_LENGTH}
                </p>
              </div>
            </div>

            {/* Location */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-gray-400 flex items-center gap-1.5">
                <MapPin size={12} /> Location
              </label>
              <div className="relative">
                <MapPin
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500"
                />
                <input
                  type="text"
                  placeholder="Add location..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className={`${inputClass} pl-10`}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={uploading || !file}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition flex items-center justify-center gap-2"
            >
              {uploading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Sharing...
                </>
              ) : (
                'Share Post'
              )}
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;