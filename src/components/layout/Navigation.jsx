import { Link, useNavigate } from 'react-router-dom';
import { Sprout, LogOut, Menu } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useUI } from '../../contexts/UIContext';

const Navigation = () => {
  const { currentUser, logout } = useAuth();
  const { toggleSidebar } = useUI();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            {currentUser && (
              <button
                onClick={toggleSidebar}
                className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-slate-500 hover:bg-slate-100 focus:outline-none md:hidden mr-2"
                aria-label="Open sidebar"
              >
                <Menu className="h-6 w-6" />
              </button>
            )}
            <Link to="/" className="flex items-center space-x-2 text-ommro-green-800 hover:text-ommro-green-600 transition-colors">
              <Sprout className="h-8 w-8" />
              <span className="font-sans font-bold text-xl tracking-tight">OMMRO Connect</span>
            </Link>
          </div>
          <div className="flex space-x-2 sm:space-x-4 items-center">
            {currentUser ? (
              <>
                <Link to="/dashboard" className="hidden sm:block text-slate-600 hover:text-ommro-green-600 font-medium px-3 py-2 transition-colors">
                  Dashboard
                </Link>
                <button 
                  onClick={handleLogout}
                  className="flex items-center text-slate-600 hover:text-red-600 font-medium px-3 py-2 transition-colors"
                >
                  <LogOut className="h-4 w-4 mr-1.5" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-slate-600 hover:text-ommro-green-600 font-medium px-3 py-2 transition-colors">
                  Log in
                </Link>
                <Link to="/register" className="bg-ommro-green-600 text-white hover:bg-ommro-green-800 px-4 py-2 rounded-lg font-medium transition-transform active:scale-95 shadow-md">
                  Join Our Movement
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
