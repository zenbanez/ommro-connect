import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Award, Users, TrendingUp, Clock, MapPin, ChevronRight, Loader2, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { fetchEvents } from '../lib/eventService';

const Dashboard = () => {
  const { currentUser, userProfile } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState('Good day');

  const greetings = [
    'Good day',         // English
    'Magandang araw',   // Tagalog
    'Maayong adlaw',    // Bisaya
    'Maupay nga adlaw'  // Waray
  ];

  useEffect(() => {
    loadData();
    const randomIdx = Math.floor(Math.random() * greetings.length);
    setGreeting(greetings[randomIdx]);
  }, []);

  const loadData = async () => {
    try {
      const allEvents = await fetchEvents();
      setEvents(allEvents);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const displayName = userProfile?.firstName || currentUser?.email?.split('@')[0] || 'Member';
  const userRole = userProfile?.role || 'member';
  const myEvents = events.filter(e => e.attendees?.includes(currentUser?.uid));
  const upcomingEvents = events.slice(0, 4);

  const roleBadge = {
    member: { label: 'Member', color: 'bg-slate-100 text-slate-700' },
    officer: { label: 'Officer', color: 'bg-blue-100 text-blue-700' },
    admin: { label: 'Admin', color: 'bg-red-100 text-red-700' },
  };

  const badge = roleBadge[userRole] || roleBadge.member;

  return (
    <div className="p-4 md:p-8 overflow-y-auto">
      <div className="max-w-6xl mx-auto pb-12">

        {/* Greeting */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-sans font-bold text-slate-900">
              {greeting}, {displayName}! 👋
            </h1>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${badge.color}`}>
              <Shield className="h-3 w-3 mr-1" />
              {badge.label}
            </span>
          </div>
          <p className="text-slate-600">Here's what's happening in your OMMRO community.</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-ommro-green-600" />
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-12 w-12 bg-ommro-green-100 rounded-xl flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-ommro-green-600" />
                  </div>
                  <TrendingUp className="h-4 w-4 text-green-500" />
                </div>
                <p className="text-2xl font-bold text-slate-900">{myEvents.length}</p>
                <p className="text-sm text-slate-600">My Events</p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-12 w-12 bg-sky-100 rounded-xl flex items-center justify-center">
                    <Users className="h-6 w-6 text-sky-600" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-slate-900">{events.length}</p>
                <p className="text-sm text-slate-600">Total Events</p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-12 w-12 bg-amber-100 rounded-xl flex items-center justify-center">
                    <Award className="h-6 w-6 text-amber-600" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-slate-900">In Progress</p>
                <p className="text-sm text-slate-600">Certification Status</p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-12 w-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Clock className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-slate-900">{userProfile?.location || 'Region 8'}</p>
                <p className="text-sm text-slate-600">Province</p>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Upcoming Events */}
              <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                  <h2 className="font-bold font-sans text-slate-900 flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-ommro-green-600" />
                    Upcoming Events
                  </h2>
                  <Link to="/events" className="text-sm text-ommro-green-600 hover:text-ommro-green-700 font-medium flex items-center">
                    View all <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </div>
                {upcomingEvents.length === 0 ? (
                  <div className="p-8 text-center">
                    <Calendar className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500 text-sm">No upcoming events. Check back later!</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {upcomingEvents.map(event => {
                      const joined = event.attendees?.includes(currentUser?.uid);
                      return (
                        <Link key={event.id} to={`/events/${event.id}`} className="flex items-center px-6 py-4 hover:bg-slate-50 transition-colors">
                          <div className="h-12 w-12 bg-ommro-green-100 rounded-xl flex items-center justify-center mr-4 shrink-0">
                            <Calendar className="h-6 w-6 text-ommro-green-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-slate-900 truncate">{event.title}</p>
                            <div className="flex items-center text-xs text-slate-500 mt-1 gap-3">
                              <span className="flex items-center"><Clock className="h-3 w-3 mr-1" />{event.date || 'TBD'}</span>
                              <span className="flex items-center"><MapPin className="h-3 w-3 mr-1" />{event.location || 'TBD'}</span>
                            </div>
                          </div>
                          {joined && (
                            <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full ml-3">
                              Joined
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Profile Summary */}
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                  <h2 className="font-bold font-sans text-slate-900 mb-4 pb-2 border-b border-slate-100">My Profile</h2>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Name</span>
                      <span className="font-medium text-slate-900">{userProfile?.firstName} {userProfile?.lastName}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Email</span>
                      <span className="font-medium text-slate-900 truncate ml-4">{currentUser?.email}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Province</span>
                      <span className="font-medium text-slate-900">{userProfile?.location || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Role</span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${badge.color}`}>
                        {badge.label}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Phone</span>
                      <span className="font-medium text-slate-900">{userProfile?.phone || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                  <h2 className="font-bold font-sans text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center">
                    <Award className="h-5 w-5 mr-2 text-amber-500" />
                    Certification
                  </h2>
                  <div className="mb-3">
                    <div className="flex justify-between text-sm font-medium text-slate-700 mb-1.5">
                      <span>Conversion Progress</span>
                      <span>35%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div className="bg-gradient-to-r from-ommro-green-500 to-ommro-green-400 h-2 rounded-full" style={{ width: '35%' }} />
                    </div>
                  </div>
                  <Link to="/certification" className="text-sm text-ommro-green-600 hover:text-ommro-green-700 font-medium flex items-center">
                    View Certification Tracker <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
