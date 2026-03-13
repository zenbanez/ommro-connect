import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Calendar, Shield, ChevronDown, Trash2, Pencil, Loader2, X, Plus, Search, RefreshCw } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { fetchAllUsers, updateUserRole, isAdmin, ROLES, deleteUser as deleteUserProfile } from '../lib/userService';
import { fetchEvents, createEvent, updateEvent, deleteEvent } from '../lib/eventService';

const AdminPanel = () => {
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('users');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      if (activeTab === 'users') {
        const data = await fetchAllUsers();
        setUsers(data);
      } else {
        const data = await fetchEvents();
        setEvents(data);
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
      setError('You may not have permission to view this data or a connection error occurred.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userProfile && !isAdmin(userProfile)) {
      navigate('/dashboard');
      return;
    }
    loadData();
  }, [activeTab, userProfile, navigate]);

  const handleRoleChange = async (uid, newRole) => {
    try {
      await updateUserRole(uid, newRole);
      setUsers(users.map(u => u.uid === uid ? { ...u, role: newRole } : u));
    } catch (err) {
      alert('Failed to update role');
    }
  };

  const handleDeleteUser = async (uid) => {
    if (!window.confirm('Are you sure you want to delete this user? This cannot be undone.')) return;
    try {
      await deleteUserProfile(uid);
      setUsers(users.filter(u => u.uid !== uid));
    } catch (err) {
      alert('Failed to delete user');
    }
  };

  const filteredUsers = users.filter(u => 
    u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.lastName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredEvents = events.filter(e =>
    e.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading && users.length === 0 && events.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-ommro-green-600" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-7xl mx-auto flex flex-col h-full">
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-sans font-bold text-slate-900">Admin Control Center</h1>
            <p className="text-slate-600 mt-1">Manage OMMRO members and community events</p>
          </div>
          <button 
            onClick={loadData}
            className="flex items-center gap-2 self-start px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors text-sm font-medium"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh Data
          </button>
        </div>

        <div className="flex bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
          <button 
            onClick={() => { setActiveTab('users'); setSearchQuery(''); }}
            className={`flex-1 flex items-center justify-center gap-2 py-4 font-bold transition-colors ${activeTab === 'users' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <Users className="h-5 w-5" /> Members
          </button>
          <button 
            onClick={() => { setActiveTab('events'); setSearchQuery(''); }}
            className={`flex-1 flex items-center justify-center gap-2 py-4 font-bold transition-colors ${activeTab === 'events' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <Calendar className="h-5 w-5" /> Events
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col flex-1 overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row justify-between gap-4">
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input 
                type="text" 
                placeholder={`Search ${activeTab}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all bg-white"
              />
            </div>
            {activeTab === 'events' && (
              <button 
                onClick={() => navigate('/events')}
                className="flex items-center gap-2 px-4 py-2 bg-ommro-green-600 hover:bg-ommro-green-700 text-white rounded-xl transition-colors text-sm font-bold"
              >
                <Plus className="h-4 w-4" /> Create New Event
              </button>
            )}
          </div>

          <div className="overflow-x-auto">
            {error ? (
              <div className="p-12 text-center">
                <Shield className="h-12 w-12 text-slate-200 mx-auto mb-4" />
                <p className="text-slate-500">{error}</p>
              </div>
            ) : activeTab === 'users' ? (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Location</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map(user => (
                    <tr key={user.uid} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 font-bold">
                            {user.firstName?.[0]}{user.lastName?.[0]}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{user.firstName} {user.lastName}</p>
                            <p className="text-xs text-slate-500">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <select 
                          value={user.role || 'member'} 
                          onChange={(e) => handleRoleChange(user.uid, e.target.value)}
                          className="bg-slate-100 text-slate-700 text-xs font-bold py-1 px-3 rounded-full focus:outline-none focus:ring-2 focus:ring-slate-900 border-none appearance-none cursor-pointer hover:bg-slate-200 transition-colors"
                        >
                          {Object.values(ROLES).map(role => (
                            <option key={role} value={role}>{role.toUpperCase()}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {user.location || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => handleDeleteUser(user.uid)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete User"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                    <th className="px-6 py-4">Event</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Location</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredEvents.map(event => (
                    <tr key={event.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-900">{event.title}</p>
                        <p className="text-xs text-slate-500">{event.type}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{event.date}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{event.location}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => navigate(`/events/${event.id}`)}
                            className="p-2 text-slate-400 hover:text-ommro-green-600 hover:bg-ommro-green-50 rounded-lg transition-colors"
                            title="Edit Event"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {!loading && (activeTab === 'users' ? filteredUsers.length === 0 : filteredEvents.length === 0) && (
              <div className="p-12 text-center">
                <Search className="h-12 w-12 text-slate-100 mx-auto mb-4" />
                <p className="text-slate-400">No {activeTab} found matching your search.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
