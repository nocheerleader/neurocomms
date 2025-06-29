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
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <CheckCircleIcon className="h-20 w-20 text-chart-2" />
          </div>
          
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Payment Successful!
          </h2>
          
          <p className="text-lg text-muted-foreground mb-6">
            Welcome to Elucidare Premium! Your subscription has been activated and you now have access to all premium features.
          </p>

          <div className="bg-chart-2/10 border border-chart-2/20 rounded-lg p-4 mb-8">
            <h3 className="font-medium text-chart-2 mb-2">What's included:</h3>
            <ul className="text-sm text-chart-2 space-y-1 text-left">
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
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-primary-foreground bg-primary hover:bg-primary/90 transition-colors"
          >
            Continue to Dashboard
            <ArrowRightIcon className="ml-2 h-5 w-5" />
          </button>

          <p className="text-sm text-muted-foreground mt-4">
            You'll be redirected automatically in a few seconds...
          </p>
        </div>
      </div>
    </div>
  );
}
