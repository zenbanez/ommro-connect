import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar as CalendarIcon, MapPin, Users, Clock, Search, Filter, Plus, Loader2, Trash2, Pencil, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { fetchEvents, createEvent, updateEvent, deleteEvent } from '../lib/eventService';
import { canCreateEvents, canEditEvents, canDeleteEvents } from '../lib/userService';

const EVENT_TYPES = ['Farm Visit', 'Training', 'Certification', 'Meeting', 'Workshop'];

const typeColors = {
  'Farm Visit': 'bg-green-100 text-green-800 border-green-200',
  'Training': 'bg-blue-100 text-blue-800 border-blue-200',
  'Certification': 'bg-purple-100 text-purple-800 border-purple-200',
  'Meeting': 'bg-orange-100 text-orange-800 border-orange-200',
  'Workshop': 'bg-cyan-100 text-cyan-800 border-cyan-200',
};

const emptyForm = {
  title: '', host: '', date: '', time: '', location: '', type: 'Farm Visit', slots: 20, fee: '', description: ''
};

const Events = () => {
  const { userProfile } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const loadEvents = async () => {
    setLoading(true);
    try {
      const data = await fetchEvents();
      setEvents(data);
    } catch (err) {
      console.error('Failed to load events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadEvents(); }, []);

  const handleOpenCreate = () => {
    setEditingEvent(null);
    setFormData(emptyForm);
    setShowModal(true);
  };

  const handleOpenEdit = (event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title || '',
      host: event.host || '',
      date: event.date || '',
      time: event.time || '',
      location: event.location || '',
      type: event.type || 'Farm Visit',
      slots: event.slots || 20,
      fee: event.fee || '',
      description: event.description || '',
    });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingEvent) {
        await updateEvent(editingEvent.id, formData);
      } else {
        await createEvent(formData);
      }
      setShowModal(false);
      await loadEvents();
    } catch (err) {
      console.error('Failed to save event:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      await deleteEvent(eventId);
      await loadEvents();
    } catch (err) {
      console.error('Failed to delete event:', err);
    }
  };

  const filteredEvents = events.filter(event =>
    (event.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (event.location || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (event.host || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-sans font-bold text-slate-900">Lakbay Alay & Events</h1>
            <p className="text-slate-600 mt-1">Discover farm visits, trainings, and meetings across Region 8</p>
          </div>
          {canCreateEvents(userProfile) && (
            <button
              onClick={handleOpenCreate}
              className="bg-ommro-green-600 hover:bg-ommro-green-700 text-white font-medium px-4 py-2 rounded-lg shadow-sm transition-colors flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Event
            </button>
          )}
        </div>

        {/* Search Bar */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search events, farms, or locations..." 
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ommro-green-500 focus:border-ommro-green-500"
            />
          </div>
        </div>

        {/* Loading / Empty */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-ommro-green-600" />
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
            <CalendarIcon className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-700 mb-1">No events found</h3>
            <p className="text-slate-500 text-sm">
              {searchTerm ? 'Try a different search term.' : 'Be the first to create an event!'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => {
              const color = typeColors[event.type] || 'bg-slate-100 text-slate-800 border-slate-200';
              const attendeeCount = event.attendees?.length || 0;
              return (
                <div key={event.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-md transition-shadow group flex flex-col">
                  <div className="h-32 bg-slate-200 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                    <div className="absolute bottom-4 left-4 z-20">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold uppercase tracking-wide border ${color}`}>
                        {event.type || 'Event'}
                      </span>
                    </div>
                    {/* Admin/Officer action buttons */}
                    {(canEditEvents(userProfile) || canDeleteEvents(userProfile)) && (
                      <div className="absolute top-3 right-3 z-20 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {canEditEvents(userProfile) && (
                          <button
                            onClick={(e) => { e.preventDefault(); handleOpenEdit(event); }}
                            className="p-1.5 bg-white/90 rounded-md hover:bg-white text-slate-600 hover:text-ommro-green-700 transition-colors shadow-sm"
                            title="Edit"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                        )}
                        {canDeleteEvents(userProfile) && (
                          <button
                            onClick={(e) => { e.preventDefault(); handleDelete(event.id); }}
                            className="p-1.5 bg-white/90 rounded-md hover:bg-white text-slate-600 hover:text-red-600 transition-colors shadow-sm"
                            title="Delete"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="text-sm font-bold text-ommro-green-600 mb-2 flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-1.5" />
                      {event.date || 'TBD'}
                    </div>
                    <h3 className="text-xl font-bold font-sans text-slate-900 mb-2 group-hover:text-ommro-green-700 transition-colors">
                      {event.title}
                    </h3>
                    <div className="space-y-2 mt-auto pt-4">
                      <div className="flex items-start text-sm text-slate-600">
                        <MapPin className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0 text-slate-400" />
                        <span>{event.location || 'Location TBD'}</span>
                      </div>
                      {event.time && (
                        <div className="flex items-start text-sm text-slate-600">
                          <Clock className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0 text-slate-400" />
                          <span>{event.time}</span>
                        </div>
                      )}
                      <div className="flex items-start text-sm text-slate-600">
                        <Users className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0 text-slate-400" />
                        <span>{attendeeCount}/{event.slots || '∞'} joined</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 border-t border-slate-100 bg-slate-50">
                    <Link 
                      to={`/events/${event.id}`} 
                      className="w-full block text-center bg-white border border-slate-300 hover:border-ommro-green-500 hover:text-ommro-green-700 text-slate-700 font-medium py-2 rounded-lg transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-slate-200">
              <h2 className="text-xl font-bold font-sans text-slate-900">
                {editingEvent ? 'Edit Event' : 'Create New Event'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Event Title *</label>
                <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ommro-green-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Date *</label>
                  <input type="text" required placeholder="e.g. Mar 15, 2025" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ommro-green-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Time</label>
                  <input type="text" placeholder="e.g. 8:00 AM - 3:00 PM" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ommro-green-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Host / Farm Name *</label>
                <input type="text" required value={formData.host} onChange={e => setFormData({...formData, host: e.target.value})}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ommro-green-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Location *</label>
                <input type="text" required value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ommro-green-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                  <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-ommro-green-500">
                    {EVENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Max Slots</label>
                  <input type="number" min="1" value={formData.slots} onChange={e => setFormData({...formData, slots: parseInt(e.target.value) || 20})}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ommro-green-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Fee</label>
                <input type="text" placeholder="e.g. PHP 500 or Free" value={formData.fee} onChange={e => setFormData({...formData, fee: e.target.value})}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ommro-green-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ommro-green-500" />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button type="button" onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 font-medium">
                  Cancel
                </button>
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

export default Events;
