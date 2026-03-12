import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Calendar, Shield, ChevronDown, Trash2, Pencil, Loader2, X, Plus, Search, RefreshCw } from 'lucide-react';
import Sidebar from '../components/layout/Sidebar';
import { useAuth } from '../contexts/AuthContext';
import { fetchAllUsers, updateUserRole, isAdmin, ROLES, deleteUser as deleteUserProfile } from '../lib/userService';
import { fetchEvents, createEvent, updateEvent, deleteEvent } from '../lib/eventService';

const EVENT_TYPES = ['Farm Visit', 'Training', 'Certification', 'Meeting', 'Workshop'];
const emptyEventForm = { title: '', host: '', date: '', time: '', location: '', type: 'Farm Visit', slots: 20, fee: '', description: '' };

const roleBadges = {
  member: 'bg-slate-100 text-slate-700 border-slate-200',
  officer: 'bg-blue-100 text-blue-700 border-blue-200',
  admin: 'bg-red-100 text-red-700 border-red-200',
};

const AdminPanel = () => {
  const { userProfile } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('users');

  // Users state
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [userSearch, setUserSearch] = useState('');
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(null);

  // Events state
  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [eventSearch, setEventSearch] = useState('');
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [eventForm, setEventForm] = useState(emptyEventForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (userProfile && !isAdmin(userProfile)) {
      navigate('/dashboard');
    }
  }, [userProfile, navigate]);

  useEffect(() => {
    if (activeTab === 'users') loadUsers();
    if (activeTab === 'events') loadEvents();
  }, [activeTab]);

  const loadUsers = async () => {
    setUsersLoading(true);
    try { setUsers(await fetchAllUsers()); } 
    catch (err) { console.error('Failed to load users:', err); }
    finally { setUsersLoading(false); }
  };

  const loadEvents = async () => {
    setEventsLoading(true);
    try { setEvents(await fetchEvents()); } 
    catch (err) { console.error('Failed to load events:', err); }
    finally { setEventsLoading(false); }
  };

  const handleRoleChange = async (uid, newRole) => {
    try {
      await updateUserRole(uid, newRole);
      setUsers(prev => prev.map(u => u.uid === uid ? { ...u, role: newRole } : u));
      setRoleDropdownOpen(null);
    } catch (err) { console.error('Failed to update role:', err); }
  };

  const handleDeleteUser = async (uid) => {
    if (!window.confirm('Remove this user profile? This does not delete their login account.')) return;
    try {
      await deleteUserProfile(uid);
      setUsers(prev => prev.filter(u => u.uid !== uid));
    } catch (err) { console.error('Failed to delete user:', err); }
  };

  const handleOpenCreateEvent = () => { setEditingEvent(null); setEventForm(emptyEventForm); setShowEventModal(true); };
  const handleOpenEditEvent = (event) => {
    setEditingEvent(event);
    setEventForm({ title: event.title||'', host: event.host||'', date: event.date||'', time: event.time||'', location: event.location||'', type: event.type||'Farm Visit', slots: event.slots||20, fee: event.fee||'', description: event.description||'' });
    setShowEventModal(true);
  };

  const handleSaveEvent = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      if (editingEvent) await updateEvent(editingEvent.id, eventForm);
      else await createEvent(eventForm);
      setShowEventModal(false); await loadEvents();
    } catch (err) { console.error('Failed to save event:', err); }
    finally { setSaving(false); }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Delete this event permanently?')) return;
    try { await deleteEvent(eventId); await loadEvents(); } 
    catch (err) { console.error('Failed to delete event:', err); }
  };

  const filteredUsers = users.filter(u =>
    (u.firstName || '').toLowerCase().includes(userSearch.toLowerCase()) ||
    (u.lastName || '').toLowerCase().includes(userSearch.toLowerCase()) ||
    (u.email || '').toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredEvents = events.filter(ev =>
    (ev.title || '').toLowerCase().includes(eventSearch.toLowerCase()) ||
    (ev.location || '').toLowerCase().includes(eventSearch.toLowerCase())
  );

  if (!userProfile || !isAdmin(userProfile)) return null;

  return (
    <div className="flex bg-slate-50 min-h-screen">
      <Sidebar />
      <div className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto pb-12">

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-sans font-bold text-slate-900">Admin Panel</h1>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                <Shield className="h-3 w-3 mr-1" /> Admin Only
              </span>
            </div>
            <p className="text-slate-600">Manage users, roles, and platform data.</p>
          </div>

          {/* Tabs */}
          <div className="flex items-center bg-white p-1 rounded-xl shadow-sm border border-slate-200 mb-8 w-fit">
            <button onClick={() => setActiveTab('users')}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center ${activeTab === 'users' ? 'bg-ommro-green-600 text-white shadow' : 'text-slate-600 hover:text-slate-900'}`}>
              <Users className="h-4 w-4 mr-2" /> Users ({users.length})
            </button>
            <button onClick={() => setActiveTab('events')}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center ${activeTab === 'events' ? 'bg-ommro-green-600 text-white shadow' : 'text-slate-600 hover:text-slate-900'}`}>
              <Calendar className="h-4 w-4 mr-2" /> Events ({events.length})
            </button>
          </div>

          {/* =================== USERS TAB =================== */}
          {activeTab === 'users' && (
            <div>
              <div className="flex items-center justify-between mb-4 gap-4">
                <div className="relative max-w-sm flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input type="text" value={userSearch} onChange={e => setUserSearch(e.target.value)}
                    placeholder="Search users..." className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ommro-green-500" />
                </div>
                <button onClick={loadUsers} className="p-2 text-slate-500 hover:text-ommro-green-600 border border-slate-300 rounded-lg hover:bg-slate-50">
                  <RefreshCw className="h-4 w-4" />
                </button>
              </div>

              {usersLoading ? (
                <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-ommro-green-600" /></div>
              ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-200 bg-slate-50">
                          <th className="text-left px-6 py-3 font-semibold text-slate-600">Name</th>
                          <th className="text-left px-6 py-3 font-semibold text-slate-600">Email</th>
                          <th className="text-left px-6 py-3 font-semibold text-slate-600">Province</th>
                          <th className="text-left px-6 py-3 font-semibold text-slate-600">Role</th>
                          <th className="text-left px-6 py-3 font-semibold text-slate-600">Joined</th>
                          <th className="text-right px-6 py-3 font-semibold text-slate-600">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredUsers.map(user => (
                          <tr key={user.uid} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center">
                                <div className="h-9 w-9 rounded-full bg-ommro-green-100 flex items-center justify-center text-ommro-green-700 font-bold mr-3">
                                  {(user.firstName || user.email || '?')[0].toUpperCase()}
                                </div>
                                <div>
                                  <p className="font-medium text-slate-900">{user.firstName || ''} {user.lastName || ''}</p>
                                  <p className="text-xs text-slate-500">{user.phone || ''}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-slate-600">{user.email}</td>
                            <td className="px-6 py-4 text-slate-600">{user.location || '—'}</td>
                            <td className="px-6 py-4 relative">
                              <button
                                onClick={() => setRoleDropdownOpen(roleDropdownOpen === user.uid ? null : user.uid)}
                                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border cursor-pointer hover:opacity-80 ${roleBadges[user.role] || roleBadges.member}`}
                              >
                                {user.role || 'member'}
                                <ChevronDown className="h-3 w-3 ml-1" />
                              </button>
                              {roleDropdownOpen === user.uid && (
                                <div className="absolute z-20 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg py-1 w-32">
                                  {Object.values(ROLES).map(role => (
                                    <button key={role} onClick={() => handleRoleChange(user.uid, role)}
                                      className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 ${user.role === role ? 'font-bold text-ommro-green-700' : 'text-slate-700'}`}>
                                      {role}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </td>
                            <td className="px-6 py-4 text-xs text-slate-500">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}</td>
                            <td className="px-6 py-4 text-right">
                              <button onClick={() => handleDeleteUser(user.uid)} title="Remove user profile"
                                className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {filteredUsers.length === 0 && (
                    <div className="p-8 text-center text-slate-500">No users found.</div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* =================== EVENTS TAB =================== */}
          {activeTab === 'events' && (
            <div>
              <div className="flex items-center justify-between mb-4 gap-4">
                <div className="relative max-w-sm flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input type="text" value={eventSearch} onChange={e => setEventSearch(e.target.value)}
                    placeholder="Search events..." className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ommro-green-500" />
                </div>
                <div className="flex gap-2">
                  <button onClick={loadEvents} className="p-2 text-slate-500 hover:text-ommro-green-600 border border-slate-300 rounded-lg hover:bg-slate-50">
                    <RefreshCw className="h-4 w-4" />
                  </button>
                  <button onClick={handleOpenCreateEvent}
                    className="bg-ommro-green-600 hover:bg-ommro-green-700 text-white font-medium px-4 py-2 rounded-lg shadow-sm transition-colors flex items-center text-sm">
                    <Plus className="h-4 w-4 mr-1.5" /> New Event
                  </button>
                </div>
              </div>

              {eventsLoading ? (
                <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-ommro-green-600" /></div>
              ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-200 bg-slate-50">
                          <th className="text-left px-6 py-3 font-semibold text-slate-600">Title</th>
                          <th className="text-left px-6 py-3 font-semibold text-slate-600">Type</th>
                          <th className="text-left px-6 py-3 font-semibold text-slate-600">Date</th>
                          <th className="text-left px-6 py-3 font-semibold text-slate-600">Location</th>
                          <th className="text-left px-6 py-3 font-semibold text-slate-600">Attendees</th>
                          <th className="text-right px-6 py-3 font-semibold text-slate-600">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredEvents.map(event => (
                          <tr key={event.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 font-medium text-slate-900">{event.title}</td>
                            <td className="px-6 py-4">
                              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-slate-100 text-slate-700">
                                {event.type || 'Event'}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-slate-600">{event.date || '—'}</td>
                            <td className="px-6 py-4 text-slate-600">{event.location || '—'}</td>
                            <td className="px-6 py-4 text-slate-600">{event.attendees?.length || 0}/{event.slots || '∞'}</td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex justify-end gap-1">
                                <button onClick={() => handleOpenEditEvent(event)} title="Edit"
                                  className="p-1.5 text-slate-400 hover:text-ommro-green-600 rounded-lg hover:bg-slate-100 transition-colors">
                                  <Pencil className="h-4 w-4" />
                                </button>
                                <button onClick={() => handleDeleteEvent(event.id)} title="Delete"
                                  className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {filteredEvents.length === 0 && (
                    <div className="p-8 text-center text-slate-500">No events found.</div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Event Create/Edit Modal */}
      {showEventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-slate-200">
              <h2 className="text-xl font-bold font-sans text-slate-900">{editingEvent ? 'Edit Event' : 'Create New Event'}</h2>
              <button onClick={() => setShowEventModal(false)} className="text-slate-400 hover:text-slate-600"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleSaveEvent} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Event Title *</label>
                <input type="text" required value={eventForm.title} onChange={e => setEventForm({...eventForm, title: e.target.value})}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ommro-green-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Date *</label>
                  <input type="text" required placeholder="e.g. Mar 15, 2025" value={eventForm.date} onChange={e => setEventForm({...eventForm, date: e.target.value})}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ommro-green-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Time</label>
                  <input type="text" placeholder="e.g. 8:00 AM - 3:00 PM" value={eventForm.time} onChange={e => setEventForm({...eventForm, time: e.target.value})}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ommro-green-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Host / Farm Name *</label>
                <input type="text" required value={eventForm.host} onChange={e => setEventForm({...eventForm, host: e.target.value})}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ommro-green-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Location *</label>
                <input type="text" required value={eventForm.location} onChange={e => setEventForm({...eventForm, location: e.target.value})}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ommro-green-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                  <select value={eventForm.type} onChange={e => setEventForm({...eventForm, type: e.target.value})}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-ommro-green-500">
                    {EVENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Max Slots</label>
                  <input type="number" min="1" value={eventForm.slots} onChange={e => setEventForm({...eventForm, slots: parseInt(e.target.value)||20})}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ommro-green-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Fee</label>
                <input type="text" placeholder="e.g. PHP 500 or Free" value={eventForm.fee} onChange={e => setEventForm({...eventForm, fee: e.target.value})}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ommro-green-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea rows={3} value={eventForm.description} onChange={e => setEventForm({...eventForm, description: e.target.value})}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ommro-green-500" />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button type="button" onClick={() => setShowEventModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 font-medium">Cancel</button>
                <button type="submit" disabled={saving}
                  className="px-4 py-2 bg-ommro-green-600 hover:bg-ommro-green-700 text-white rounded-lg font-medium disabled:opacity-70 flex items-center">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  {editingEvent ? 'Save Changes' : 'Create Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
