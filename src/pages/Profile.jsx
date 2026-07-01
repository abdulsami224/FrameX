import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Grid, Settings, ArrowLeft, Loader2, UserX } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import useProfile from '../hooks/useProfile';
import useFollow from '../hooks/useFollow';
import ProfileStats from '../components/ProfileStats';
import PostGrid from '../components/PostGrid';
import Navbar from '../components/Navbar';

const Profile = () => {
  const { username } = useParams();
  const { user, profile: myProfile } = useAuth();
  const navigate = useNavigate();

  const { profile, posts, loading } = useProfile(username);
  const {
    isFollowing,
    followerCount,
    followingCount,
    loading: followLoading,
    toggleFollow
  } = useFollow(profile?.id);

  const isOwnProfile = user?.id === profile?.id;

  useEffect(() => {
    if (profile) document.title = `${profile.username} · FrameX`;
  }, [profile]);

  if (loading) return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Navbar />
      <div className="md:pl-64 pt-16 md:pt-0 pb-16 md:pb-0 flex items-center justify-center min-h-[80vh]">
        <Loader2 size={28} className="text-blue-500 animate-spin" />
      </div>
    </div>
  );

  if (!profile) return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Navbar />
      <div className="md:pl-64 pt-16 md:pt-0 pb-16 md:pb-0 flex flex-col items-center justify-center min-h-[80vh] gap-4">
        <UserX size={48} className="text-gray-600" strokeWidth={1} />
        <h2 className="text-xl font-bold text-white">User not found</h2>
        <p className="text-sm text-gray-400">This account doesn't exist</p>
        <button
          onClick={() => navigate('/')}
          className="text-sm text-blue-500 hover:text-blue-400 transition"
        >
          Go Home
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Navbar />
      <div className="md:pl-64 pt-16 md:pt-0 pb-16 md:pb-0">
        <div className="max-w-3xl mx-auto px-4 py-6">

          {/* Back button — mobile */}
          <button
            onClick={() => navigate(-1)}
            className="md:hidden flex items-center gap-2 text-gray-400 hover:text-white transition mb-4 text-sm"
          >
            <ArrowLeft size={18} />
            Back
          </button>

          {/* Profile Header */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8">

            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center overflow-hidden ring-2 ring-[#2a2a3a]">
                {profile.avatar_url ? (
                  <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-white text-4xl font-bold">
                    {profile.username?.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 flex flex-col gap-4 text-center sm:text-left">

              {/* Username + actions */}
              <div className="flex flex-col sm:flex-row items-center sm:items-center gap-3">
                <h1 className="text-xl font-semibold text-white">
                  {profile.username}
                </h1>

                {isOwnProfile ? (
                  <Link
                    to="/edit-profile"
                    className="flex items-center gap-2 bg-[#1e1e2a] hover:bg-[#2a2a3a] border border-[#2a2a3a] text-white text-sm font-medium px-4 py-1.5 rounded-xl transition"
                  >
                    <Settings size={14} />
                    Edit Profile
                  </Link>
                ) : (
                  <button
                    onClick={toggleFollow}
                    disabled={followLoading}
                    className={`px-6 py-1.5 rounded-xl text-sm font-semibold transition ${
                      isFollowing
                        ? 'bg-[#1e1e2a] border border-[#2a2a3a] text-white hover:border-red-500 hover:text-red-400'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {followLoading ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : isFollowing ? 'Following' : 'Follow'}
                  </button>
                )}
              </div>

              {/* Stats */}
              <ProfileStats
                posts={posts.length}
                followers={followerCount}
                following={followingCount}
              />

              {/* Bio */}
              <div>
                {profile.full_name && (
                  <p className="text-sm font-semibold text-white">{profile.full_name}</p>
                )}
                {profile.bio && (
                  <p className="text-sm text-gray-300 mt-1 leading-relaxed">{profile.bio}</p>
                )}
                {profile.website && (
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-400 hover:text-blue-300 transition mt-1 block"
                  >
                    {profile.website.replace(/^https?:\/\//, '')}
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-[#2a2a3a] mb-1">
            <div className="flex items-center justify-center gap-2 py-3">
              <Grid size={14} className="text-white" />
              <span className="text-xs font-semibold text-white uppercase tracking-widest">
                Posts
              </span>
            </div>
          </div>

          {/* Posts Grid */}
          <PostGrid posts={posts} />

        </div>
      </div>
    </div>
  );
};

export default Profile;