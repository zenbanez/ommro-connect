import { Routes, Route } from 'react-router-dom';
import Navigation from './components/layout/Navigation';
import Sidebar from './components/layout/Sidebar';
import Footer from './components/layout/Footer';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Registration from './pages/Registration';
import Dashboard from './pages/Dashboard';
import Events from './pages/Events';
import EventDetails from './pages/EventDetails';
import Certification from './pages/Certification';
import KnowledgeHub from './pages/KnowledgeHub';
import AdminPanel from './pages/AdminPanel';
import { AuthProvider } from './contexts/AuthContext';
import { UIProvider } from './contexts/UIContext';
import ProtectedRoute from './components/layout/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <UIProvider>
        <div className="flex flex-col min-h-screen bg-slate-50">
          <Navigation />
          
          <div className="flex flex-1">
            <Sidebar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Registration />} />
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route path="/events" element={<Events />} />
                <Route path="/events/:id" element={<EventDetails />} />
                <Route path="/certification" element={<Certification />} />
                <Route path="/knowledge" element={<KnowledgeHub />} />
                <Route 
                  path="/admin" 
                  element={
                    <ProtectedRoute>
                      <AdminPanel />
                    </ProtectedRoute>
                  } 
                />
              </Routes>
            </main>
          </div>

          <Footer />
        </div>
      </UIProvider>
    </AuthProvider>
  )
}

export default App;
