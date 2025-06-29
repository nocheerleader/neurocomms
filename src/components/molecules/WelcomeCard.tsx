import React from 'react';
import { SparklesIcon, ClockIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../hooks/useAuth';
import { useProfile } from '../../hooks/useProfile';
import { useSubscription } from '../../hooks/useSubscription';

export function WelcomeCard() {
  const { user } = useAuth();
  const { profile } = useProfile();
  const { isPremium, isTrialing, trialDaysRemaining } = useSubscription();

  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  
  return (
    <div className="bg-primary rounded-lg shadow p-6 text-primary-foreground">
      <div className="flex items-center gap-3 mb-4">
        <SparklesIcon className="h-8 w-8" />
        <div>
          <h2 className="text-2xl font-bold">
            {getWelcomeMessage()}, welcome!
          </h2>
          <p className="text-primary-foreground/80">
            Ready to communicate with confidence?
          </p>
        </div>
      </div>

      {/* Subscription Status */}
      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isPremium ? 'bg-chart-2' : 'bg-yellow-400'}`} />
          <span>
            {isPremium ? 'Premium Member' : 'Free Plan'}
          </span>
        </div>

        {isTrialing && trialDaysRemaining && (
          <div className="flex items-center gap-2">
            <ClockIcon className="h-4 w-4" />
            <span>
              {trialDaysRemaining} day{trialDaysRemaining !== 1 ? 's' : ''} trial remaining
            </span>
          </div>
        )}
      </div>
      
      {/* Personalize Your Experience CTA */}
      <div className="mt-6 p-4 bg-white/20 rounded-lg border border-white/30 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-white/80">
              <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="flex-grow">
            <h4 className="font-semibold text-white">Want to personalize your experience?</h4>
            <p className="text-sm text-white/80">Manage your preferences in the settings menu.</p>
          </div>
          <div className="flex-shrink-0">
            <button
              onClick={() => window.location.href = '/settings'}
              className="px-4 py-2 bg-white text-primary font-bold rounded-lg hover:bg-white/90 transition-all duration-200 shadow-md"
            >
              Go to Settings
            </button>
          </div>
        </div>
      </div>
   
    </div>
  );
}