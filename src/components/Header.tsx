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
    <header className="bg-white border-b-2 border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-700 p-2 rounded-lg">
              <ChatBubbleLeftRightIcon className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">ToneWise</h1>
              <p className="text-sm text-gray-600">Professional Communication Tool</p>
            </div>
          </div>
          <nav className="hidden md:flex space-x-8">
            {!user ? (
              <>
                <a href="#features" className="text-gray-700 hover:text-blue-700 font-medium transition-colors">
                  Features
                </a>
                <a href="#how-it-works" className="text-gray-700 hover:text-blue-700 font-medium transition-colors">
                  How It Works
                </a>
                <button 
                  onClick={handleGetStarted}
                  className="bg-blue-700 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-800 transition-colors"
                >
                  Get Started
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleProfileClick}
                  className="text-gray-700 hover:text-blue-700 font-medium transition-colors"
                >
                  Profile
                </button>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <ArrowRightOnRectangleIcon className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}