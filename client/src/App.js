import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import axios from 'axios';

// Components
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Fights from './pages/Fights';
import Memories from './pages/Memories';
import LoveJar from './pages/LoveJar';
import Analytics from './pages/Analytics';
import Profile from './pages/Profile';

// Context
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';

// API configuration
axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'https://prxfm-1-0.onrender.com';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-romantic">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-romantic-500 mx-auto mb-4"></div>
          <p className="text-romantic-600 font-medium">Loading your love story...</p>
        </div>
      </div>
    );
  }
  
  return user ? children : <Navigate to="/login" />;
};

// Main App Component
const AppContent = () => {
  const { theme } = useTheme();
  
  return (
    <div className={`min-h-screen transition-all duration-300 ${theme === 'pookie' ? 'pookie-mode' : ''}`}>
      <Router>
        <div className="floating-hearts">
          <Navbar />
          <main className="pt-16">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/fights" element={
                <ProtectedRoute>
                  <Fights />
                </ProtectedRoute>
              } />
              <Route path="/memories" element={
                <ProtectedRoute>
                  <Memories />
                </ProtectedRoute>
              } />
              <Route path="/love-jar" element={
                <ProtectedRoute>
                  <LoveJar />
                </ProtectedRoute>
              } />
              <Route path="/analytics" element={
                <ProtectedRoute>
                  <Analytics />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'linear-gradient(135deg, #fef7f7 0%, #fdeaea 100%)',
                color: '#7c2323',
                border: '1px solid #fbd5d5',
                borderRadius: '12px',
                fontFamily: 'Nunito, sans-serif',
              },
              success: {
                iconTheme: {
                  primary: '#e85d5d',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#d63d3d',
                  secondary: '#fff',
                },
              },
            }}
          />
        </div>
      </Router>
    </div>
  );
};

// App with Providers
const App = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
