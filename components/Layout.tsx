import React, { useContext, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Users, GraduationCap, LogOut, Menu, X, Bell, 
  FileText, CreditCard, Settings, BookOpen, ClipboardCheck, BarChart3
} from 'lucide-react';
import { AuthContext } from '../App';
import { PERMISSIONS } from '../types';

interface LayoutProps {
  children?: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { logout, user } = useContext(AuthContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  // Define all possible menu items
  const allMenuItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Students', path: '/students', icon: Users },
    { name: 'Teachers', path: '/teachers', icon: GraduationCap },
    { name: 'Attendance', path: '/attendance', icon: ClipboardCheck },
    { name: 'Grades', path: '/grades', icon: BookOpen },
    { name: 'Fees', path: '/fees', icon: CreditCard },
    { name: 'Documents', path: '/documents', icon: FileText },
    { name: 'Reports', path: '/reports', icon: BarChart3 },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  // Filter based on Role Permissions
  const allowedModules = PERMISSIONS[user?.role || 'Student'];
  const navItems = allMenuItems.filter(item => allowedModules.includes(item.name));

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            {/* Logo Section */}
            <div className="flex items-center flex-shrink-0 cursor-pointer" onClick={() => window.location.href = '#/'}>
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl flex items-center justify-center mr-3 shadow-lg shadow-indigo-500/30">
                 <GraduationCap className="text-white" size={24} />
              </div>
              <div className="hidden md:block">
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-800 to-purple-800">
                  Mogadishu
                </h1>
                <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold">School System</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-1 overflow-x-auto max-w-2xl no-scrollbar px-4">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    className={`
                      flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                      ${isActive 
                        ? 'bg-indigo-50 text-indigo-700 shadow-sm' 
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }
                    `}
                  >
                    <item.icon size={18} className={`mr-2 ${isActive ? 'text-indigo-600' : 'text-gray-400'}`} />
                    {item.name}
                  </NavLink>
                );
              })}
            </nav>

            {/* Right Side Actions */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="flex flex-col items-end mr-2">
                 <span className="text-sm font-bold text-gray-800">{user?.name}</span>
                 <span className="text-xs text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full font-medium border border-indigo-100">
                   {user?.role}
                 </span>
              </div>
              
              <button className="relative p-2 text-gray-400 hover:text-indigo-600 transition-colors">
                <Bell size={22} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
              </button>

              <button 
                onClick={logout}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="Sign Out"
              >
                <LogOut size={22} />
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button 
                onClick={toggleMobileMenu}
                className="p-2 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 shadow-lg absolute w-full left-0 z-40">
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
               <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold mr-3">
                    {user?.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.role}</p>
                  </div>
               </div>
               <button onClick={logout} className="text-xs text-red-600 font-medium">Sign Out</button>
            </div>
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`
                      flex items-center px-3 py-3 rounded-md text-base font-medium
                      ${isActive 
                        ? 'bg-indigo-50 text-indigo-700' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }
                    `}
                  >
                    <item.icon size={20} className="mr-3" />
                    {item.name}
                  </NavLink>
                );
              })}
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        {children}
      </main>

    </div>
  );
};

export default Layout;
