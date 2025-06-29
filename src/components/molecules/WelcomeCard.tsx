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

    {/* Onboarding Status */}
      {!profile?.onboarding_completed && (
        <div className="mt-4 p-4 bg-white/20 rounded-lg border border-white/30 backdrop-blur-sm">
          <h4 className="text-md font-semibold text-white mb-2">Complete Your Setup</h4>
          <p className="text-sm text-white/90 mb-4">
            Take our quick communication assessment to get personalized suggestions for your tone and scripts.
          </p>
          <button
            onClick={() => window.location.href = '/settings'}
            className="w-full text-center px-4 py-2 bg-white text-primary font-bold rounded-lg hover:bg-white/90 transition-all duration-200 shadow-lg"
          >
            Start Communication Assessment
          </button>
        </div>
      )}
    </div>
  );
}