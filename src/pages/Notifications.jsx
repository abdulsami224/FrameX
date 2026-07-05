import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, MessageCircle, UserPlus, Bell, Loader2, CheckCheck } from 'lucide-react';
import Navbar from '../components/Navbar';
import useNotifications from '../hooks/useNotifications';

const typeConfig = {
  like:    { icon: Heart,       color: 'text-red-400',  bg: 'bg-red-400/10'   },
  comment: { icon: MessageCircle, color: 'text-blue-400', bg: 'bg-blue-400/10' },
  follow:  { icon: UserPlus,    color: 'text-green-400', bg: 'bg-green-400/10' },
};

const Notifications = () => {
  const navigate = useNavigate();
  const { notifications, unreadCount, loading, markAllRead } = useNotifications();

  useEffect(() => {
    document.title = `Notifications ${unreadCount > 0 ? `(${unreadCount})` : ''} · FrameX`;
  }, [unreadCount]);

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return 'now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
    return `${Math.floor(hours / 24)}d`;
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Navbar />
      <div className="md:pl-64 pt-16 md:pt-0 pb-16 md:pb-0">
        <div className="max-w-xl mx-auto px-4 py-6">

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-white">Notifications</h1>
              {unreadCount > 0 && (
                <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition font-medium"
              >
                <CheckCheck size={14} />
                Mark all read
              </button>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 size={28} className="text-blue-500 animate-spin" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <div className="w-16 h-16 bg-[#16161f] border border-[#2a2a3a] rounded-2xl flex items-center justify-center">
                <Bell size={28} className="text-gray-500" />
              </div>
              <h2 className="text-lg font-semibold text-white">No notifications</h2>
              <p className="text-sm text-gray-400">
                When someone likes or comments on your posts, you'll see it here
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              {notifications.map((notif) => {
                const config = typeConfig[notif.type] || typeConfig.like;
                const Icon = config.icon;

                return (
                  <div
                    key={notif.id}
                    onClick={() => {
                      if (notif.post?.id) navigate(`/post/${notif.post.id}`);
                      else if (notif.type === 'follow')
                        navigate(`/profile/${notif.sender?.username}`);
                    }}
                    className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition ${
                      !notif.is_read
                        ? 'bg-blue-500/5 border border-blue-500/10 hover:bg-blue-500/10'
                        : 'hover:bg-[#16161f]'
                    }`}
                  >
                    {/* Avatar + type icon */}
                    <div className="relative flex-shrink-0">
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/profile/${notif.sender?.username}`);
                        }}
                        className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center overflow-hidden"
                      >
                        {notif.sender?.avatar_url ? (
                          <img src={notif.sender.avatar_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-white font-bold text-sm">
                            {notif.sender?.username?.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      {/* Type icon badge */}
                      <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full ${config.bg} flex items-center justify-center`}>
                        <Icon size={10} className={config.color} />
                      </div>
                    </div>

                    {/* Message */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-200">
                        <span className="font-semibold text-white">
                          {notif.sender?.username}
                        </span>{' '}
                        {notif.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {timeAgo(notif.created_at)}
                      </p>
                    </div>

                    {/* Post thumbnail */}
                    {notif.post?.image_url && (
                      <div className="w-11 h-11 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={notif.post.image_url}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {/* Unread dot */}
                    {!notif.is_read && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;