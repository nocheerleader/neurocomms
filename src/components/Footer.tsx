import React from 'react';
import { ChatBubbleLeftRightIcon, EnvelopeIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-blue-700 p-2 rounded-lg">
                <ChatBubbleLeftRightIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h4 className="text-xl font-bold">ToneWise</h4>
                <p className="text-gray-400 text-sm">Professional Communication Tool</p>
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed mb-6">
              Empowering neurodiverse professionals with clear, confident communication tools. 
              Built with accessibility and privacy in mind.
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <ShieldCheckIcon className="h-4 w-4" />
                <span>Privacy First</span>
              </div>
              <div className="flex items-center gap-2">
                <EnvelopeIcon className="h-4 w-4" />
                <span>Support Available</span>
              </div>
            </div>
          </div>

          <div>
            <h5 className="font-semibold mb-4">Product</h5>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-white transition-colors">How It Works</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h5 className="font-semibold mb-4">Support</h5>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; 2025 ToneWise. Built for neurodiverse professionals.</p>
        </div>
      </div>
    </footer>
  );
}