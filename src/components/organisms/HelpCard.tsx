import React from 'react';
import { LifebuoyIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

export function HelpCard() {
  return (
    <div className="bg-slate-50 rounded-lg shadow-lg p-6 border border-black/5">
      <div className="flex items-center gap-3 mb-2">
        <LifebuoyIcon className="h-6 w-6 text-primary" />
        <h3 className="text-xl font-bold text-gray-800">Need Help?</h3>
      </div>
      <p className="text-gray-600 mb-4 pl-9">
        Our team is here to assist with any questions or feedback you have.
      </p>
      <button
        onClick={() => window.location.href = '/contact-us'}
        className="w-full text-center px-4 py-2 bg-primary/10 text-primary font-bold rounded-lg hover:bg-primary/20 transition-all duration-200"
      >
        <span>Contact Support</span>
      </button>
    </div>
  );
}