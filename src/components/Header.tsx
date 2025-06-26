import React from 'react';
import { ChatBubbleLeftRightIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';

export function Header() {
  const { user, signOut } = useAuth();

  const handleGetStarted = () => {
    window.location.href = '/login';
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
      <header className="max-w-7xl mx-auto bg-card rounded-full shadow-lg py-3 px-6 flex items-center justify-between border border-border">
        <div className="flex items-center space-x-3">
          <div className="bg-primary p-2 rounded-lg">
            <ChatBubbleLeftRightIcon className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">ToneWise</h1>
          </div>
        </div>
        
        <nav className="hidden md:flex items-center space-x-6">
          {!user ? (
            <>
              <a href="#features" className="text-muted-foreground hover:text-primary font-medium transition-colors text-sm">
                Features
              </a>
              <a href="#how-it-works" className="text-muted-foreground hover:text-primary font-medium transition-colors text-sm">
                How It Works
              </a>
              <button 
                onClick={handleGetStarted}
                className="bg-primary text-primary-foreground px-5 py-2 rounded-full font-medium hover:bg-primary/90 transition-colors text-sm"
              >
                Log In 
              </button>
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
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground bg-secondary border border-border rounded-full hover:bg-secondary/80 transition-colors"
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
            <button 
              onClick={handleGetStarted}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-full font-medium hover:bg-primary/90 transition-colors text-sm"
            >
              Log In 
            </button>
          ) : (
            <button
              onClick={handleProfileClick}
              className="text-muted-foreground hover:text-primary font-medium transition-colors text-sm"
            >
              Profile
            </button>
          )}
        </div>
      </header>
    </div>
  );
}