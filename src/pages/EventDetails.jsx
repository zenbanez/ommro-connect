import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Clock, Users, Loader2, CheckCircle } from 'lucide-react';
import Sidebar from '../components/layout/Sidebar';
import { useAuth } from '../contexts/AuthContext';
import { fetchEventById, joinEvent, leaveEvent } from '../lib/eventService';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    loadEvent();
  }, [id]);

  const loadEvent = async () => {
    setLoading(true);
    try {
      const data = await fetchEventById(id);
      if (!data) {
        navigate('/events');
        return;
      }
      setEvent(data);
    } catch (err) {
      console.error('Failed to load event:', err);
    } finally {
      setLoading(false);
    }
  };

  const hasJoined = event?.attendees?.includes(currentUser?.uid);
  const isFull = event?.slots && (event.attendees?.length || 0) >= event.slots;

  const handleJoin = async () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    setJoining(true);
    try {
      await joinEvent(id, currentUser.uid);
      await loadEvent();
    } catch (err) {
      console.error('Failed to join event:', err);
    } finally {
      setJoining(false);
    }
  };

  const handleLeave = async () => {
    setJoining(true);
    try {
      await leaveEvent(id, currentUser.uid);
      await loadEvent();
    } catch (err) {
      console.error('Failed to leave event:', err);
    } finally {
      setJoining(false);
    }
  };

  if (loading) {
    return (
      <div className="flex bg-slate-50 min-h-screen">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-ommro-green-600" />
        </div>
      </div>
    );
  }

  if (!event) return null;

  const attendeeCount = event.attendees?.length || 0;

  return (
    <div className="flex bg-slate-50 min-h-screen">
      <Sidebar />
      <div className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto pb-12">
          
          <Link to="/events" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-ommro-green-600 mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Events
          </Link>

          {/* Hero */}
          <div className="w-full h-64 md:h-80 bg-slate-800 rounded-2xl mb-8 relative overflow-hidden shadow-md">
            <div className="absolute inset-0 bg-[url('/alde_farm_banner.jpg')] bg-cover bg-center opacity-70" />
            <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8 z-10 text-white max-w-3xl">
              <span className="inline-block px-3 py-1 bg-ommro-green-600 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
                {event.type || 'Event'}
              </span>
              <h1 className="text-3xl md:text-4xl font-sans font-bold leading-tight drop-shadow-lg">{event.title}</h1>
              <p className="text-lg md:text-xl text-slate-200 mt-2 flex items-center drop-shadow-md">
                <MapPin className="h-5 w-5 mr-2" /> {event.host || 'OMMRO'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
                <h2 className="text-xl font-bold font-sans text-slate-900 mb-4">About This Event</h2>
                <p className="text-slate-600 leading-relaxed">
                  {event.description || 'No description provided for this event yet. Check back later for more details.'}
                </p>
              </div>

              {/* Attendees */}
              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
                <h2 className="text-xl font-bold font-sans text-slate-900 mb-4 flex items-center">
                  <Users className="h-5 w-5 mr-2 text-slate-500" />
                  Attendees ({attendeeCount})
                </h2>
                {attendeeCount === 0 ? (
                  <p className="text-slate-500 text-sm">No one has joined yet. Be the first!</p>
                ) : (
                  <p className="text-slate-600 text-sm">
                    {attendeeCount} member{attendeeCount !== 1 ? 's' : ''} registered for this event.
                  </p>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6 lg:sticky lg:top-24">
              <div className="bg-white p-6 rounded-2xl shadow-md border-t-4 border-t-ommro-green-600 border border-x-slate-200 border-b-slate-200">
                <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-4">
                  <div>
                    <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Status</p>
                    <p className="font-bold text-green-600">{isFull ? 'Full' : 'Open'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Fee</p>
                    <p className="font-bold text-slate-900 text-lg">{event.fee || 'Free'}</p>
                  </div>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-center text-sm text-slate-700">
                    <Calendar className="h-5 w-5 mr-3 text-slate-400" />
                    <span className="font-medium">{event.date || 'TBD'}</span>
                  </div>
                  {event.time && (
                    <div className="flex items-center text-sm text-slate-700">
                      <Clock className="h-5 w-5 mr-3 text-slate-400" />
                      <span>{event.time}</span>
                    </div>
                  )}
                  <div className="flex items-start text-sm text-slate-700">
                    <MapPin className="h-5 w-5 mr-3 text-slate-400 mt-0.5" />
                    <span>{event.location || 'TBD'}</span>
                  </div>
                  <div className="flex items-center text-sm text-slate-700">
                    <Users className="h-5 w-5 mr-3 text-slate-400" />
                    <span>{attendeeCount}/{event.slots || '∞'} joined</span>
                  </div>
                </div>

                {hasJoined ? (
                  <div>
                    <div className="w-full bg-green-50 border border-green-200 text-green-700 font-bold py-3 px-4 rounded-xl text-center mb-3 flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 mr-2" />
                      You're Registered!
                    </div>
                    <button
                      onClick={handleLeave}
                      disabled={joining}
                      className="w-full text-sm text-slate-500 hover:text-red-600 font-medium py-2 transition-colors disabled:opacity-50"
                    >
                      {joining ? 'Processing...' : 'Cancel Registration'}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleJoin}
                    disabled={joining || isFull}
                    className="w-full bg-ommro-green-600 hover:bg-ommro-green-700 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {joining ? <Loader2 className="h-5 w-5 animate-spin" /> : (isFull ? 'Event Full' : 'Join This Event')}
                  </button>
                )}
              </div>

              {/* Host */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="font-bold font-sans text-slate-900 mb-4 pb-2 border-b border-slate-100">Host Information</h3>
                <div className="flex items-center">
                  <div className="h-12 w-12 bg-ommro-green-100 rounded-full flex items-center justify-center text-ommro-green-700 font-bold text-lg mr-4">
                    {(event.host || 'E')[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{event.host || 'OMMRO'}</p>
                    <p className="text-sm text-slate-500">Event Host</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
