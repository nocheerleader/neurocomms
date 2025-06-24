import React, { useEffect } from 'react';
import { CheckCircleIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';

export function SuccessPage() {
  const { user } = useAuth();

  useEffect(() => {
    // Redirect to profile after 5 seconds
    const timer = setTimeout(() => {
      window.location.href = '/profile';
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleContinue = () => {
    window.location.href = '/profile';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <CheckCircleIcon className="h-20 w-20 text-green-500" />
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Payment Successful!
          </h2>
          
          <p className="text-lg text-gray-600 mb-6">
            Welcome to ToneWise Premium! Your subscription has been activated and you now have access to all premium features.
          </p>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
            <h3 className="font-medium text-green-900 mb-2">What's included:</h3>
            <ul className="text-sm text-green-800 space-y-1 text-left">
              <li>• Unlimited tone analyses</li>
              <li>• Advanced script generation</li>
              <li>• Voice synthesis (10/month)</li>
              <li>• Personal script library</li>
              <li>• Priority support</li>
              <li>• Usage analytics</li>
            </ul>
          </div>

          <button
            onClick={handleContinue}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-700 hover:bg-blue-800 transition-colors"
          >
            Continue to Dashboard
            <ArrowRightIcon className="ml-2 h-5 w-5" />
          </button>

          <p className="text-sm text-gray-500 mt-4">
            You'll be redirected automatically in a few seconds...
          </p>
        </div>
      </div>
    </div>
  );
}