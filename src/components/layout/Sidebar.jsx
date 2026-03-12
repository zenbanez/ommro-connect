import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Calendar, BookOpen, Award, Users, ShoppingBag, LogOut, Shield } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { isAdmin } from '../../lib/userService';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Lakbay Alay', href: '/events', icon: Calendar },
  { name: 'Knowledge Hub', href: '/knowledge', icon: BookOpen },
  { name: 'Certification', href: '/certification', icon: Award },
  { name: 'Committees', href: '/committees', icon: Users },
  { name: 'Marketplace', href: '/marketplace', icon: ShoppingBag },
];

const Sidebar = () => {
  const { logout, userProfile } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <div className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 min-h-[calc(100vh-theme(spacing.16))]">
      <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto w-64 fixed h-[calc(100vh-theme(spacing.16))]">
        <nav className="mt-5 flex-1 px-4 space-y-2 text-sm max-h-[calc(100vh-250px)] overflow-y-auto">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
                  isActive
                    ? 'bg-ommro-green-50 text-ommro-green-800'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              <item.icon
                className="mr-3 flex-shrink-0 h-5 w-5 text-ommro-green-600"
                aria-hidden="true"
              />
              {item.name}
            </NavLink>
          ))}

          {/* Admin-only link */}
          {isAdmin(userProfile) && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
                  isActive
                    ? 'bg-red-50 text-red-800'
                    : 'text-slate-600 hover:bg-red-50 hover:text-red-700'
                }`
              }
            >
              <Shield
                className="mr-3 flex-shrink-0 h-5 w-5 text-red-500"
                aria-hidden="true"
              />
              Admin Panel
            </NavLink>
          )}
        </nav>
        
        <div className="p-4 mt-auto border-t border-slate-200">
          <button
            onClick={handleLogout}
            className="group flex w-full items-center px-4 py-3 text-sm font-medium rounded-xl text-slate-600 hover:bg-red-50 hover:text-red-700 transition-colors"
          >
            <LogOut
              className="mr-3 flex-shrink-0 h-5 w-5 text-slate-400 group-hover:text-red-600 transition-colors"
              aria-hidden="true"
            />
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
