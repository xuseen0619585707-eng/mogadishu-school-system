import React, { useState, useContext } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Teachers from './pages/Teachers';
import Grades from './pages/Grades';
import Fees from './pages/Fees';
import Layout from './components/Layout';
import { UserRole, User } from './types';

// Auth Context
interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (role: UserRole, username: string) => void;
  logout: () => void;
}

export const AuthContext = React.createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  login: () => {},
  logout: () => {},
});

const AuthProvider = ({ children }: { children?: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  const login = (role: UserRole, username: string) => {
    setIsAuthenticated(true);
    setUser({ username, role, name: username });
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

const ProtectedRoute = ({ children }: { children?: React.ReactNode }) => {
  const { isAuthenticated } = useContext(AuthContext);
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const AppContent = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/students"
        element={
          <ProtectedRoute>
            <Layout>
              <Students />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/teachers"
        element={
          <ProtectedRoute>
            <Layout>
              <Teachers />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/grades"
        element={
          <ProtectedRoute>
            <Layout>
              <Grades />
            </Layout>
          </ProtectedRoute>
        }
      />
       <Route
        path="/fees"
        element={
          <ProtectedRoute>
            <Layout>
              <Fees />
            </Layout>
          </ProtectedRoute>
        }
      />
      {/* Placeholder routes for other modules */}
       <Route path="/attendance" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
       <Route path="/documents" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
       <Route path="/reports" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
       <Route path="/settings" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
    </Routes>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <AppContent />
      </HashRouter>
    </AuthProvider>
  );
}
