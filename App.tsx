
import React, { useState, useEffect, createContext, useContext } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { User, Bill, AppState } from './types';
import { loadState, saveState, addLog } from './utils/storage';
import { ADMIN_EMAIL } from './constants';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Dashboard from './pages/Dashboard';
import BillsPage from './pages/BillsPage';
import PricingPage from './pages/PricingPage';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';

// Context
interface AuthContextType {
  currentUser: User | null;
  login: (email: string, pass: string) => boolean;
  logout: () => void;
  signup: (data: Partial<User>) => boolean;
  refreshUser: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('billminder_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const refreshUser = () => {
    if (!currentUser) return;
    const state = loadState();
    const updated = state.users.find(u => u.id === currentUser.id);
    if (updated) {
      setCurrentUser(updated);
      localStorage.setItem('billminder_current_user', JSON.stringify(updated));
    }
  };

  const login = (email: string, pass: string) => {
    const state = loadState();
    const user = state.users.find(u => u.email === email);
    if (user && user.isActive) {
      const loggedUser = { ...user, lastLoginAt: new Date().toISOString() };
      setCurrentUser(loggedUser);
      localStorage.setItem('billminder_current_user', JSON.stringify(loggedUser));
      
      const userIndex = state.users.findIndex(u => u.id === user.id);
      state.users[userIndex] = loggedUser;
      saveState(state);
      addLog('LOGIN', user.id, 'User logged in successfully');
      return true;
    }
    return false;
  };

  const logout = () => {
    if (currentUser) {
      addLog('LOGOUT', currentUser.id, 'User logged out');
    }
    setCurrentUser(null);
    localStorage.removeItem('billminder_current_user');
  };

  const signup = (data: Partial<User>) => {
    const state = loadState();
    if (state.users.find(u => u.email === data.email)) return false;

    const isActualAdmin = data.email === ADMIN_EMAIL;
    const adminSlug = isActualAdmin ? Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) : undefined;

    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      fullName: data.fullName || '',
      email: data.email || '',
      phone: data.phone || '',
      role: isActualAdmin ? 'admin' : 'user',
      tier: 'free',
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      isActive: true,
      adminSlug
    };

    state.users.push(newUser);
    saveState(state);
    addLog('SIGNUP', newUser.id, `User registered as ${newUser.role}`);
    
    setCurrentUser(newUser);
    localStorage.setItem('billminder_current_user', JSON.stringify(newUser));
    return true;
  };

  const isAdmin = currentUser?.role === 'admin' && currentUser?.email === ADMIN_EMAIL;

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, signup, refreshUser, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

const ProtectedRoute: React.FC<{ children: React.ReactNode, requireAdmin?: boolean }> = ({ children, requireAdmin = false }) => {
  const { currentUser, isAdmin } = useAuth();
  const location = useLocation();

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/404" replace />;
  }

  return <>{children}</>;
};

const AdminRouteGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, isAdmin } = useAuth();
  const { pathname } = useLocation();

  const slugInUrl = pathname.split('/').pop();
  const isCorrectSlug = isAdmin && currentUser?.adminSlug === slugInUrl;

  if (!isAdmin || !isCorrectSlug) {
    return <Navigate to="/404" replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/bills" element={
            <ProtectedRoute>
              <BillsPage />
            </ProtectedRoute>
          } />

          <Route path="/secure-admin/:slug" element={
            <AdminRouteGuard>
              <AdminDashboard />
            </AdminRouteGuard>
          } />

          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
