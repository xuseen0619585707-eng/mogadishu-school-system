import React, { useState, useEffect, useContext } from 'react';
import { Users, GraduationCap, DollarSign, Activity, Sparkles, Loader, ArrowRight, BookOpen, Clock, FileCheck } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import StatCard from '../components/StatCard';
import { DASHBOARD_STATS, HERO_IMAGES } from '../constants';
import { generateSchoolInsights } from '../services/geminiService';
import { AuthContext } from '../App';

// Keep chart data static for now (unless you build backend routes for them later)
const data = [
  { name: 'Jan', attendance: 92 },
  { name: 'Feb', attendance: 94 },
  { name: 'Mar', attendance: 89 },
  { name: 'Apr', attendance: 96 },
  { name: 'May', attendance: 93 },
  { name: 'Jun', attendance: 98 },
];

const revenueData = [
  { name: 'Jan', revenue: 120 },
  { name: 'Feb', revenue: 132 },
  { name: 'Mar', revenue: 101 },
  { name: 'Apr', revenue: 134 },
  { name: 'May', revenue: 190 },
  { name: 'Jun', revenue: 230 },
];

const Dashboard: React.FC = () => {
  const { user } = useContext(AuthContext);
  const [aiInsights, setAiInsights] = useState<string>('');
  const [loadingAi, setLoadingAi] = useState<boolean>(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // --- NEW: State for Real Database Data ---
  const [realStats, setRealStats] = useState({
    students: 0,
    teachers: 0,
    revenue: 0
  });

  // --- NEW: Fetch Data from Backend ---
  useEffect(() => {
    fetch('http://localhost:8081/stats')
      .then(res => res.json())
      .then(data => {
        console.log("Database Data:", data);
        setRealStats(data);
      })
      .catch(err => console.error("Failed to fetch stats:", err));
  }, []);

  // Moving Image Slider Logic
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000); 
    return () => clearInterval(timer);
  }, []);

  const handleGenerateInsights = async () => {
    setLoadingAi(true);
    // We now pass the Real Stats to the AI instead of the fake ones
    const insights = await generateSchoolInsights({
        ...DASHBOARD_STATS, 
        totalStudents: realStats.students,
        totalTeachers: realStats.teachers,
        revenue: realStats.revenue
    });
    setAiInsights(insights);
    setLoadingAi(false);
  };

  const isAdminOrPrincipal = user?.role === 'Admin' || user?.role === 'Principal';
  const isFinance = user?.role === 'Accountant' || user?.role === 'Admin';
  const isTeacher = user?.role === 'Teacher';
  const isStudent = user?.role === 'Student';
  const isParent = user?.role === 'Parent';

  return (
    <div className="space-y-8 pb-10">
      
      {/* 1. Hero / Advertising Section */}
      <div className="relative w-full h-64 md:h-80 rounded-3xl overflow-hidden shadow-2xl group">
        {HERO_IMAGES.map((img, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img 
              src={img.url} 
              alt={img.title} 
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-[20s]"
            />
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/90 via-indigo-900/40 to-transparent">
              <div className="h-full flex flex-col justify-center px-8 md:px-12 max-w-2xl">
                 <span className="inline-block px-3 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold uppercase tracking-wider rounded-full w-fit mb-3">
                    Top News
                 </span>
                 <h2 className="text-3xl md:text-5xl font-bold text-white mb-2 leading-tight">
                   {img.title}
                 </h2>
                 <p className="text-indigo-100 text-lg md:text-xl font-light">
                   {img.subtitle}
                 </p>
                 <button className="mt-6 px-6 py-2 bg-white text-indigo-900 font-semibold rounded-full hover:bg-indigo-50 transition-colors w-fit flex items-center">
                    Read More <ArrowRight size={16} className="ml-2" />
                 </button>
              </div>
            </div>
          </div>
        ))}
        
        {/* Slider Indicators */}
        <div className="absolute bottom-6 left-8 md:left-12 flex space-x-2">
           {HERO_IMAGES.map((_, idx) => (
             <div 
               key={idx} 
               className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentImageIndex ? 'w-8 bg-white' : 'w-2 bg-white/40'}`}
             />
           ))}
        </div>
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">
          {user?.role === 'Student' || user?.role === 'Parent' ? `Welcome, ${user.name}` : 'Overview'}
        </h2>
        <span className="text-sm text-gray-500">Last updated: Just now</span>
      </div>

      {/* 2. Role-Based Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Common Stats */}
        <StatCard 
          title="Attendance Today" 
          value={`${DASHBOARD_STATS.avgAttendance}%`} 
          icon={<Clock size={24} />} 
          trend="0.8%" 
          trendUp={false} 
          color="orange"
        />

        {/* Admin/Principal/Teacher Stats */}
        {(isAdminOrPrincipal || isTeacher) && (
          <StatCard 
            title="Total Students" 
            // UPDATED: Using realStats from Database
            value={realStats.students} 
            icon={<Users size={24} />} 
            trend="12%" 
            trendUp={true} 
            color="blue"
          />
        )}

        {(isAdminOrPrincipal) && (
           <StatCard 
            title="Total Teachers" 
            // UPDATED: Using realStats from Database
            value={realStats.teachers} 
            icon={<GraduationCap size={24} />} 
            trend="4%" 
            trendUp={true} 
            color="emerald"
          />
        )}

        {/* Finance Stats */}
        {(isFinance || isAdminOrPrincipal) && (
           <StatCard 
            title="Revenue collected" 
            // UPDATED: Using realStats from Database
            value={`$${realStats.revenue}`} 
            icon={<DollarSign size={24} />} 
            trend="8.5%" 
            trendUp={true} 
            color="purple"
          />
        )}

        {/* Student/Parent Stats */}
        {(isStudent || isParent) && (
          <>
            <StatCard 
              title="Avg Grade" 
              value="A-" 
              icon={<BookOpen size={24} />} 
              color="indigo"
            />
            <StatCard 
              title="Fees Due" 
              value="$0.00" 
              icon={<FileCheck size={24} />} 
              color="green"
            />
          </>
        )}
      </div>

      {/* 3. AI Insight Section */}
      {(isAdminOrPrincipal || isTeacher) && (
        <div className="bg-gradient-to-br from-gray-900 to-indigo-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden border border-indigo-700/50">
           <div className="absolute top-0 right-0 p-10 opacity-20">
              <Sparkles size={180} />
           </div>
           <div className="relative z-10">
             <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                   <div className="p-2 bg-indigo-500/20 rounded-lg backdrop-blur-sm border border-indigo-400/30">
                      <Sparkles className="text-yellow-300" />
                   </div>
                   <div>
                     <h3 className="text-xl font-bold">Gemini AI Intelligence</h3>
                     <p className="text-indigo-300 text-xs">Real-time school data analysis</p>
                   </div>
                </div>
                <button 
                  onClick={handleGenerateInsights}
                  disabled={loadingAi}
                  className="px-5 py-2.5 bg-white text-indigo-900 hover:bg-indigo-50 rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-900/50 flex items-center"
                >
                  {loadingAi ? <Loader className="animate-spin mr-2" size={16} /> : <Activity className="mr-2" size={16} />}
                  {aiInsights ? 'Refresh Analysis' : 'Generate Report'}
                </button>
             </div>
             
             <div className="bg-white/5 rounded-xl p-6 backdrop-blur-md border border-white/10 min-h-[120px]">
                {aiInsights ? (
                   <div className="prose prose-invert max-w-none">
                     <p className="whitespace-pre-line leading-relaxed text-gray-100">{aiInsights}</p>
                   </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center py-4">
                     <p className="text-indigo-200 text-sm max-w-md">
                       Get AI-powered strategic insights about student performance, attendance trends, and financial health instantly.
                     </p>
                  </div>
                )}
             </div>
           </div>
        </div>
      )}

      {/* 4. Charts Section (Modules Visualization) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Attendance Module View */}
        {(isAdminOrPrincipal || isTeacher || isStudent || isParent) && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
               <h3 className="text-lg font-bold text-gray-800">Attendance Trends</h3>
               <button className="text-sm text-indigo-600 font-medium hover:underline">View Report</button>
            </div>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorAttendance" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF'}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF'}} />
                  <Tooltip 
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}} 
                  />
                  <Area type="monotone" dataKey="attendance" stroke="#6366F1" strokeWidth={3} fillOpacity={1} fill="url(#colorAttendance)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Finance/Fees Module View */}
        {(isFinance || isAdminOrPrincipal) && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
               <h3 className="text-lg font-bold text-gray-800">Financial Growth</h3>
               <button className="text-sm text-indigo-600 font-medium hover:underline">Full Details</button>
            </div>
             <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF'}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF'}} />
                  <Tooltip 
                    cursor={{fill: '#F9FAFB'}}
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}} 
                  />
                  <Bar dataKey="revenue" fill="#8B5CF6" radius={[6, 6, 0, 0]} barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;