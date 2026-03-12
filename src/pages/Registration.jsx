import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sprout, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Registration = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    location: 'Leyte'
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { email, password, ...userData } = formData;
      await register(email, password, userData);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to create an account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-theme(spacing.16))] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-2xl w-full space-y-8 bg-white p-10 rounded-2xl shadow-lg border border-slate-100">
        <div className="text-center">
          <Sprout className="mx-auto h-12 w-12 text-ommro-green-600" />
          <h2 className="mt-6 text-3xl font-extrabold text-slate-900 font-sans">
            Join the Movement
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Already a member?{' '}
            <Link to="/login" className="font-medium text-ommro-green-600 hover:text-ommro-green-500">
              Sign in here
            </Link>
          </p>
        </div>
        
        {/* Registration Steps Indicator */}
        <div className="flex items-center justify-center space-x-4 mb-8">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-ommro-green-600 text-white flex items-center justify-center font-bold">1</div>
            <div className="ml-2 text-sm font-medium text-slate-900">Personal Info</div>
          </div>
          <div className="w-12 h-px bg-slate-200"></div>
          <div className="flex items-center opacity-50">
            <div className="h-8 w-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-bold">2</div>
            <div className="ml-2 text-sm font-medium text-slate-600">Farm Details</div>
          </div>
          <div className="w-12 h-px bg-slate-200"></div>
          <div className="flex items-center opacity-50">
            <div className="h-8 w-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-bold">3</div>
            <div className="ml-2 text-sm font-medium text-slate-600">Payment</div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-slate-700">First name</label>
                <div className="mt-1">
                  <input 
                    type="text" 
                    name="firstName" 
                    id="firstName" 
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-ommro-green-500 focus:border-ommro-green-500 block w-full sm:text-sm border-slate-300 rounded-md py-2 px-3 border" 
                  />
                </div>
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-slate-700">Last name</label>
                <div className="mt-1">
                  <input 
                    type="text" 
                    name="lastName" 
                    id="lastName" 
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-ommro-green-500 focus:border-ommro-green-500 block w-full sm:text-sm border-slate-300 rounded-md py-2 px-3 border" 
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email address</label>
              <div className="mt-1">
                <input 
                  id="email" 
                  name="email" 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-ommro-green-500 focus:border-ommro-green-500 block w-full sm:text-sm border-slate-300 rounded-md py-2 px-3 border" 
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700">Password</label>
              <div className="mt-1">
                <input 
                  id="password" 
                  name="password" 
                  type="password" 
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-ommro-green-500 focus:border-ommro-green-500 block w-full sm:text-sm border-slate-300 rounded-md py-2 px-3 border" 
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-slate-700">Phone Number</label>
              <div className="mt-1">
                <input 
                  id="phone" 
                  name="phone" 
                  type="text" 
                  value={formData.phone}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-ommro-green-500 focus:border-ommro-green-500 block w-full sm:text-sm border-slate-300 rounded-md py-2 px-3 border" 
                />
              </div>
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-slate-700">Province in Region 8</label>
              <div className="mt-1">
                <select 
                  id="location" 
                  name="location" 
                  value={formData.location}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-ommro-green-500 focus:border-ommro-green-500 block w-full sm:text-sm border-slate-300 rounded-md py-2 px-3 border bg-white"
                >
                  <option value="Leyte">Leyte</option>
                  <option value="Southern Leyte">Southern Leyte</option>
                  <option value="Samar">Samar</option>
                  <option value="Northern Samar">Northern Samar</option>
                  <option value="Eastern Samar">Eastern Samar</option>
                  <option value="Biliran">Biliran</option>
                </select>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-ommro-green-600 hover:bg-ommro-green-700 shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ommro-green-500 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="animate-spin h-5 w-5" />
              ) : (
                'Create Account & Continue'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Registration;
