import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Calendar, BookOpen, Award, Users, ShoppingBag, LogOut, Shield, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useUI } from '../../contexts/UIContext';
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
  const { logout, userProfile, currentUser } = useAuth();
  const { isSidebarOpen, closeSidebar } = useUI();
  const navigate = useNavigate();

  if (!currentUser) return null;

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm md:hidden transition-opacity"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:z-auto
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-4 h-16 border-b border-slate-100 md:hidden">
            <span className="font-bold text-ommro-green-800">Menu</span>
            <button 
              onClick={closeSidebar}
              className="p-2 rounded-md text-slate-400 hover:text-slate-500 hover:bg-slate-100"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <nav className="flex-1 px-4 space-y-2 text-sm">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  onClick={() => {
                    if (window.innerWidth < 768) closeSidebar();
                  }}
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
                  onClick={() => {
                    if (window.innerWidth < 768) closeSidebar();
                  }}
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
      </div>
    </>
  );
};

export default Sidebar;
