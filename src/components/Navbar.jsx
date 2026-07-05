import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, Search, PlusSquare, Heart, LogOut, Compass, Bookmark } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import useNotifications from '../hooks/useNotifications';


const Navbar = () => {
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const { unreadCount } = useNotifications();

  const handleLogout = async () => {
    await logout();
    navigate('/auth');
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <nav className="hidden md:flex flex-col fixed left-0 top-0 h-screen w-64 bg-[#0a0a0f] border-r border-[#2a2a3a] px-4 py-6 z-40">

        {/* Logo */}
        <Link to="/" className="px-3 mb-10">
          <h1 className="text-2xl font-bold tracking-tight">
            <span className="text-white">Frame</span>
            <span className="text-blue-500">X</span>
          </h1>
        </Link>

        {/* Nav links */}
        <div className="flex flex-col gap-1 flex-1">
          <NavLink icon={Home} label="Home" to="/" />
          <NavLink icon={Compass} label="Explore" to="/explore" />
          <NavLink icon={PlusSquare} label="Create" to="/create" />
          <Link
            to="/notifications"
            className="flex items-center gap-4 px-3 py-3 rounded-xl hover:bg-[#16161f] transition text-gray-300 hover:text-white relative"
          >
            <div className="relative">
              <Heart size={22} />
              {unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-blue-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </div>
            <span className="text-sm font-medium">Notifications</span>
          </Link>
          <NavLink icon={Bookmark} label="Saved" to="/saved" />

          {/* Profile link */}
          <Link
            to={`/profile/${profile?.username}`}
            className="flex items-center gap-4 px-3 py-3 rounded-xl hover:bg-[#16161f] transition text-gray-300 hover:text-white"
          >
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center overflow-hidden flex-shrink-0">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-white text-[10px] font-bold">
                  {profile?.username?.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <span className="text-sm font-medium">Profile</span>
          </Link>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-4 px-3 py-3 rounded-xl hover:bg-[#16161f] transition text-gray-300 hover:text-red-400"
        >
          <LogOut size={22} />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </nav>

      {/* Mobile Top Bar */}
      <nav className="md:hidden fixed top-0 left-0 right-0 bg-[#0a0a0f] border-b border-[#2a2a3a] px-4 py-3 z-40 flex items-center justify-between">
        <Link to="/">
          <h1 className="text-xl font-bold tracking-tight">
            <span className="text-white">Frame</span>
            <span className="text-blue-500">X</span>
          </h1>
        </Link>
        <Link to="/create">
          <PlusSquare size={24} className="text-white" />
        </Link>
      </nav>

      {/* Mobile Bottom Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0a0a0f] border-t border-[#2a2a3a] px-6 py-3 z-40 flex items-center justify-between">
        <Link to="/"><Home size={24} className="text-white" /></Link>
        <Link to="/explore"><Search size={24} className="text-white" /></Link>
        <Link to="/notifications" className="relative">
          <Heart size={24} className="text-white" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Link>
        <Link to="/saved"><Bookmark size={24} className="text-white" /></Link>
        <Link to={`/profile/${profile?.username}`}>
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center overflow-hidden">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="text-white text-[10px] font-bold">
                {profile?.username?.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
        </Link>
      </nav>
    </>
  );
};

// reusable nav link for sidebar
const NavLink = ({ icon: Icon, label, to }) => (
  <Link
    to={to}
    className="flex items-center gap-4 px-3 py-3 rounded-xl hover:bg-[#16161f] transition text-gray-300 hover:text-white"
  >
    <Icon size={22} />
    <span className="text-sm font-medium">{label}</span>
  </Link>
);

export default Navbar;