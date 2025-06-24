import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { HowItWorks } from './components/HowItWorks';
import { CallToAction } from './components/CallToAction';
import { Footer } from './components/Footer';
import { Login } from './pages/auth/Login';
import { Signup } from './pages/auth/Signup';
import { Settings } from './pages/Settings';
import { ProtectedRoute } from './components/ProtectedRoute';

// Simple routing based on URL path
function Router() {
  const path = window.location.pathname;

  switch (path) {
    case '/login':
      return <Login />;
    case '/signup':
      return <Signup />;
    case '/settings':
      return (
        <ProtectedRoute>
          <Settings />
        </ProtectedRoute>
      );
    default:
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