import React from 'react';
import { MessageCircle } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-white border-b-2 border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-700 p-2 rounded-lg">
              <MessageCircle className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">ToneWise</h1>
              <p className="text-sm text-gray-600">Professional Communication Tool</p>
            </div>
          </div>
          <nav className="hidden md:flex space-x-8">
            <a href="#features" className="text-gray-700 hover:text-blue-700 font-medium transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-gray-700 hover:text-blue-700 font-medium transition-colors">
              How It Works
            </a>
            <button className="bg-blue-700 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-800 transition-colors">
              Get Started
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}