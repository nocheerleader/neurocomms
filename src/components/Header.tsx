import React from 'react';
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';

export function Header() {
  const { user, signOut } = useAuth();

  const handleLogin = () => {
    window.location.href = '/login';
  };

  const handleSignup = () => {
    window.location.href = '/signup';
  };

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (!error) {
      window.location.href = '/';
    }
  };

  const handleProfileClick = () => {
    window.location.href = '/profile';
  };

  return (
    <div className="fixed top-0 left-0 w-full z-50 py-4 px-6">
      <header className="max-w-7xl mx-auto rounded-full shadow-lg py-3 px-6 flex items-center justify-between border border-border" style={{ backgroundColor: '#FBDCE2' }}>
        <div className="flex items-center space-x-3">
          <img src="/logo.svg" alt="ToneWise Logo" className="h-8 w-8" />
          <div>
            <h1 className="text-xl font-bold font-funnel text-foreground">Elucidare</h1>
          </div>
        </div>
        
        <nav className="hidden md:flex items-center space-x-6">
          {!user ? (
            <>
              <a href="#features" className="text-foreground hover:text-primary font-medium transition-colors text-sm">
                Features
              </a>
              <a href="#pricing" className="text-muted-foreground hover:text-primary font-medium transition-colors text-sm">
                Pricing
              </a>
              <a href="/roadmap" className="text-muted-foreground hover:text-primary font-medium transition-colors text-sm">
                Roadmap
              </a>
              <div className="flex items-center space-x-3">
                <button 
                  onClick={handleLogin}
                  className="border border-primary text-primary px-5 py-2 rounded-full font-medium hover:bg-primary/5 hover:shadow-md transition-all duration-500 text-sm"
                >
                  Login
                </button>
                <button 
                  onClick={handleSignup}
                  className="bg-primary text-primary-foreground px-5 py-2 rounded-full font-medium hover:bg-primary/90 hover:shadow-md transition-all duration-200 text-sm"
                >
                  Signup
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center space-x-4">
              <a
                href="/tone-analyzer"
                className="text-muted-foreground hover:text-primary font-medium transition-colors text-sm"
              >
                Tone Analyzer
              </a>
              <button
                onClick={handleProfileClick}
                className="text-muted-foreground hover:text-primary font-medium transition-colors text-sm"
              >
                Profile
              </button>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground bg-secondary border border-border rounded-full hover:bg-secondary/80 hover:shadow-md transition-all duration-200"
              >
                <ArrowRightOnRectangleIcon className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          )}
        </nav>
        
        {/* Mobile menu button - simplified for now */}
        <div className="md:hidden">
          {!user ? (
            <div className="flex items-center space-x-2">
              <button 
                onClick={handleLogin}
                className="border border-primary text-primary px-3 py-1 rounded-full font-medium hover:bg-primary/5 hover:shadow-md transition-all duration-200 text-sm"
              >
                Login
              </button>
              <button 
                onClick={handleSignup}
                className="bg-primary text-primary-foreground px-3 py-1 rounded-full font-medium hover:bg-primary/90 hover:shadow-md transition-all duration-200 text-sm"
              >
                Signup
              </button>
            </div>
          ) : (
            <button
              onClick={handleProfileClick}
              className="text-muted-foreground hover:text-primary hover:shadow-md font-medium transition-all duration-200 text-sm"
            >
              Profile
            </button>
          )}
        </div>
      </header>
    </div>
  );
}