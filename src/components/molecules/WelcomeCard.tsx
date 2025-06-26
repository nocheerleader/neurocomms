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

  const getDisplayName = () => {
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'there';
  };

  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow p-6 text-white">
      <div className="flex items-center gap-3 mb-4">
        <SparklesIcon className="h-8 w-8" />
        <div>
          <h2 className="text-2xl font-bold">
            {getWelcomeMessage()}, {getDisplayName()}!
          </h2>
          <p className="text-blue-100">
            Ready to communicate with confidence?
          </p>
        </div>
      </div>

      {/* Subscription Status */}
      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isPremium ? 'bg-green-400' : 'bg-yellow-400'}`} />
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
        <div className="mt-4 p-3 bg-blue-800 bg-opacity-50 rounded-lg border border-blue-500">
          <p className="text-sm font-medium mb-2">Complete your setup</p>
          <p className="text-xs text-blue-100 mb-3">
            Take the communication assessment to get personalized suggestions.
          </p>
          <button
            onClick={() => window.location.href = '/settings'}
            className="text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded transition-colors"
          >
            Complete Assessment
          </button>
        </div>
      )}
    </div>
  );
}