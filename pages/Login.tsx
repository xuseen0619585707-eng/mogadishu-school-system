import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, GraduationCap, AlertCircle, Loader2 } from 'lucide-react';
import { AuthContext } from '../App';

const Login: React.FC = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // State for inputs
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
        // Send data to backend
        const response = await fetch('http://localhost:8081/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (data.status === 'Success') {
            // Login Successful: Update App Context
            // data.user.role comes from the database (e.g., "Admin")
            login(data.user.role, data.user.name);
            navigate('/');
        } else {
            // Login Failed
            setError('Invalid Username or Password');
        }
    } catch (err) {
        setError('Server error. Is the backend running?');
        console.error(err);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-indigo-900 rounded-b-[100px] md:rounded-b-[200px] z-0"></div>
      
      <div className="relative z-10 w-full max-w-5xl flex rounded-3xl shadow-2xl overflow-hidden m-4 bg-white min-h-[600px]">
        
        {/* Left Side - Image */}
        <div className="hidden md:block w-1/2 relative">
           <img 
             src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2670&auto=format&fit=crop" 
             alt="School" 
             className="absolute inset-0 w-full h-full object-cover"
           />
           <div className="absolute inset-0 bg-indigo-900/60 flex flex-col justify-end p-12 text-white">
              <h2 className="text-4xl font-bold mb-4">Welcome to MSS</h2>
              <p className="text-indigo-200">The most advanced school management system in Mogadishu.</p>
           </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <div className="mb-10">
            <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center mb-6 text-indigo-700">
               <GraduationCap size={32} />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Sign In</h1>
            <p className="text-gray-500 mt-2">Access your dashboard using your credentials.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            
            {/* Error Message Display */}
            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg flex items-center text-sm">
                    <AlertCircle size={16} className="mr-2" />
                    {error}
                </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 ml-1">Username</label>
              <div className="relative">
                 <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                 <input 
                   type="text" 
                   value={username}
                   onChange={(e) => setUsername(e.target.value)}
                   placeholder="Enter username"
                   className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                   required
                 />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 ml-1">Password</label>
              <div className="relative">
                 <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                 <input 
                   type="password" 
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
                   placeholder="••••••••"
                   className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                   required
                 />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-indigo-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-800 transition-all transform active:scale-[0.98] shadow-lg shadow-indigo-900/20 mt-4 flex justify-center items-center"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Login"}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-400">© 2025 Mogadishu School System</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;