import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { HowItWorks } from './components/HowItWorks';
import { CallToAction } from './components/CallToAction';
import { Footer } from './components/Footer';
import { Login } from './pages/auth/Login';
import { Signup } from './pages/auth/Signup';
import { Profile } from './pages/Profile';
import { Settings } from './pages/Settings';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoadingSpinner } from './components/atoms/LoadingSpinner';

// Simple routing based on URL path
function Router() {
  const path = window.location.pathname;
  const { user, loading } = useAuth();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  switch (path) {
    case '/login':
      return <Login />;
    case '/signup':
      return <Signup />;
    case '/profile':
      return (
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      );
    case '/settings':
      return (
        <ProtectedRoute>
          <Settings />
        </ProtectedRoute>
      );
    default:
      // If user is authenticated, redirect to profile
      if (user) {
        window.location.href = '/profile';
        return (
          <div className="min-h-screen flex items-center justify-center">
            <LoadingSpinner />
          </div>
        );
      }
      
      // Show landing page for unauthenticated users
      return (
        <div className="min-h-screen bg-white">
          <Header />
          <Hero />
          <Features />
          <HowItWorks />
          <CallToAction />
          <Footer />
        </div>
      );
  }
}

function App() {
  return (
    <AuthProvider>
      <Router />
    </AuthProvider>
  );
}

export default App;