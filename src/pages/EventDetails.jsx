import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Clock, Users, Loader2, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { fetchEventById, joinEvent, leaveEvent } from '../lib/eventService';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const loadEvent = async () => {
      try {
        const data = await fetchEventById(id);
        if (!data) navigate('/events');
        setEvent(data);
      } catch (err) {
        console.error('Failed to load event:', err);
        navigate('/events');
      } finally {
        setLoading(false);
      }
    };
    loadEvent();
  }, [id, navigate]);

  const handleJoin = async () => {
    setJoining(true);
    try {
      await joinEvent(id, currentUser.uid);
      const updated = await fetchEventById(id);
      setEvent(updated);
      setShowConfirm(true);
      setTimeout(() => setShowConfirm(false), 3000);
    } catch (err) {
      console.error('Failed to join event:', err);
    } finally {
      setJoining(false);
    }
  };

  const handleLeave = async () => {
    if (!window.confirm('Are you sure you want to leave this event?')) return;
    setJoining(true);
    try {
      await leaveEvent(id, currentUser.uid);
      const updated = await fetchEventById(id);
      setEvent(updated);
    } catch (err) {
      console.error('Failed to leave event:', err);
    } finally {
      setJoining(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-ommro-green-600" />
      </div>
    );
  }

  const isJoined = event?.attendees?.includes(currentUser?.uid);
  const isFull = event?.attendees?.length >= event?.slots;

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Link to="/events" className="inline-flex items-center text-slate-600 hover:text-ommro-green-600 mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Events
        </Link>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="h-48 md:h-64 bg-slate-200 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-6 left-6 md:left-8">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-ommro-green-100 text-ommro-green-700 uppercase tracking-wider mb-3">
                {event.type || 'Event'}
              </span>
              <h1 className="text-3xl md:text-4xl font-bold text-white font-sans">{event.title}</h1>
            </div>
          </div>

          <div className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-8">
                <section>
                  <h2 className="text-xl font-bold text-slate-900 mb-4 font-sans">About this Event</h2>
                  <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                    {event.description || 'No description provided for this event.'}
                  </p>
                </section>

                <section className="grid grid-cols-2 gap-6 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 text-ommro-green-600 mr-3 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Date</p>
                      <p className="font-medium text-slate-900">{event.date || 'TBD'}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Clock className="h-5 w-5 text-ommro-green-600 mr-3 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Time</p>
                      <p className="font-medium text-slate-900">{event.time || 'TBD'}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-ommro-green-600 mr-3 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Location</p>
                      <p className="font-medium text-slate-900">{event.location || 'TBD'}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Users className="h-5 w-5 text-ommro-green-600 mr-3 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Availability</p>
                      <p className="font-medium text-slate-900">
                        {event.slots - (event.attendees?.length || 0)} slots left of {event.slots}
                      </p>
                    </div>
                  </div>
                </section>
              </div>

              <div className="space-y-6">
                <div className="bg-white p-6 rounded-2xl border-2 border-slate-100 shadow-sm sticky top-8">
                  <div className="mb-6">
                    <p className="text-sm text-slate-500 mb-1">Registration Fee</p>
                    <p className="text-3xl font-bold text-slate-900">{event.fee || 'Free'}</p>
                  </div>

                  {isJoined ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-center p-3 bg-green-50 text-green-700 rounded-xl font-bold text-sm">
                        <CheckCircle className="h-4 w-4 mr-2" /> You are registered!
                      </div>
                      <button
                        onClick={handleLeave}
                        disabled={joining}
                        className="w-full py-3 text-slate-500 hover:text-red-600 text-sm font-medium transition-colors"
                      >
                        Cancel Registration
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={handleJoin}
                      disabled={joining || isFull}
                      className="w-full py-4 bg-ommro-green-600 hover:bg-ommro-green-700 text-white rounded-xl font-bold shadow-lg shadow-ommro-green-200 transition-all active:scale-[0.98] disabled:opacity-50 disabled:shadow-none"
                    >
                      {joining ? <Loader2 className="h-5 w-5 animate-spin mx-auto" /> : isFull ? 'Event Full' : 'Register Now'}
                    </button>
                  )}

                  <p className="mt-4 text-xs text-center text-slate-400">
                    By registering, you agree to our community guidelines and event policies.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showConfirm && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center animate-bounce">
          <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
          Successfully registered for {event.title}!
        </div>
      )}
    </div>
  );
};

export default EventDetails;
