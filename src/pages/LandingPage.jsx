import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, Eye, HandHeart } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const LandingPage = () => {
  const { currentUser } = useAuth();
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden text-white">
        <div className="absolute inset-0 bg-black/50 z-10" />
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: 'url("/hero_banner.png")' }}
        />
        
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-sans font-extrabold tracking-tight mb-6 max-w-3xl drop-shadow-md">
            Organikong Magsasaka at Mangingisda ng Rehiyon Otso
          </h1>
          <p className="text-xl md:text-2xl font-body font-light mb-10 max-w-2xl text-ommro-green-100">
            United for Sustainable Agriculture, Food Security, and Economic Empowerment
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            {!currentUser && (
              <Link to="/register" className="bg-ommro-green-600 hover:bg-ommro-green-500 text-white font-medium px-8 py-3 rounded-lg flex items-center justify-center transition-colors text-lg shadow-lg">
                Join Our Movement
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            )}
            <a href="#impact" className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 text-white font-medium px-8 py-3 rounded-lg flex items-center justify-center transition-colors text-lg">
              Explore Our Impact
            </a>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="relative z-20 border-t border-white/20 bg-black/20 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-white/20">
              <div className="pt-4 md:pt-0">
                <div className="text-3xl font-bold font-sans">40+</div>
                <div className="text-ommro-green-100 mt-1">Learning Sites</div>
              </div>
              <div className="pt-4 md:pt-0">
                <div className="text-3xl font-bold font-sans">6</div>
                <div className="text-ommro-green-100 mt-1">Active Committees</div>
              </div>
              <div className="pt-4 md:pt-0">
                <div className="text-3xl font-bold font-sans">150+</div>
                <div className="text-ommro-green-100 mt-1">Certified Organic Farms</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission/Vision Cards */}
      <section id="impact" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold font-sans text-slate-900 mb-4">Our Core Philosophy</h2>
            <div className="w-24 h-1 bg-ommro-green-600 mx-auto rounded-full" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="h-14 w-14 bg-ommro-green-100 text-ommro-green-600 rounded-xl flex items-center justify-center mb-6">
                <Leaf className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold font-sans text-slate-900 mb-3">Our Mission</h3>
              <p className="text-slate-600 leading-relaxed">
                To empower organic farmers and fisherfolk through continuous education, rigorous certification support, and collective market access.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="h-14 w-14 bg-sky-100 text-sky-600 rounded-xl flex items-center justify-center mb-6">
                <Eye className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold font-sans text-slate-900 mb-3">Our Vision</h3>
              <p className="text-slate-600 leading-relaxed">
                A resilient and food-secure Region 8 where sustainable agriculture thrives and organic practitioners lead economically vibrant communities.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="h-14 w-14 bg-sunset-100 text-sunset-600 rounded-xl flex items-center justify-center mb-6">
                <HandHeart className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold font-sans text-slate-900 mb-3">Core Values</h3>
              <p className="text-slate-600 leading-relaxed">
                Community solidarity, environmental stewardship, unwavering integrity in organic practices, and inclusive economic growth.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Visual Placeholder for Interactive Map & Certification Pathway */}
      <section className="py-20 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold font-sans text-slate-900 mb-6">Our Community in Action</h2>
          <div className="aspect-video bg-slate-100 rounded-3xl overflow-hidden shadow-lg border border-slate-200 mb-10">
            <img 
              src="/ommro_group.jpg" 
              alt="OMMRO Group" 
              className="w-full h-full object-cover"
            />
          </div>
          
          <h2 className="text-3xl font-bold font-sans text-slate-900 mb-6 mt-20">The Certification Pathway</h2>
          <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-slate-100 mb-20">
            <iframe 
              src="/organic_farm_certification_ph.html" 
              title="Certification Pathway Infographic"
              className="w-full h-[800px] border-none"
            />
          </div>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;
