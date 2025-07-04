import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useProfile } from '../hooks/useProfile';
import { useSubscription } from '../hooks/useSubscription';
import { LoadingSpinner } from '../components/atoms/LoadingSpinner';
import { WelcomeCard } from '../components/molecules/WelcomeCard';
import { UsageOverview } from '../components/molecules/UsageOverview';
import { QuickStats } from '../components/molecules/QuickStats';
import { GettingStartedCard } from '../components/organisms/GettingStartedCard';
import { HelpCard } from '../components/organisms/HelpCard'; // <-- IMPORT THE NEW CARD
import { UserIcon, Cog6ToothIcon, ChartBarIcon, BookOpenIcon, ChatBubbleLeftRightIcon, SpeakerWaveIcon, ArrowRightOnRectangleIcon, CheckCircleIcon, XCircleIcon, ClockIcon } from '@heroicons/react/24/outline';

export function Profile() {
  const { user, signOut } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const { subscription, isPremium, isTrialing, trialDaysRemaining, loading: subscriptionLoading } = useSubscription();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showCancelMessage, setShowCancelMessage] = useState(false);

  useEffect(() => {
    // Check for success/cancel parameters in URL
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true') {
      setShowSuccessMessage(true);
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    if (urlParams.get('canceled') === 'true') {
      setShowCancelMessage(true);
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (!error) {
      window.location.href = '/';
    }
  };

  if (profileLoading || subscriptionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDF6F8]">
      {/* Header */}
      <div className="bg-transparent border-b border-primary/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="bg-primary p-2 rounded-lg">
                <UserIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
                <p className="text-sm text-gray-600">Manage your Elucidare account</p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#ffffff] bg-primary rounded-lg hover:bg-chart-3 transition-colors"
            >
              <ArrowRightOnRectangleIcon className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success/Cancel Messages */}
        {showSuccessMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
              <p className="text-green-800 font-medium">
                {isTrialing 
                  ? `Welcome to your 7-day Premium trial! Enjoy full access to all features.`
                  : 'Payment successful! Your subscription has been activated.'
                }
              </p>
            </div>
          </div>
        )}

        {showCancelMessage && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center">
              <XCircleIcon className="h-5 w-5 text-yellow-500 mr-2" />
              <p className="text-yellow-800 font-medium">
                Payment was canceled. You can try again anytime.
              </p>
            </div>
          </div>
        )}

        {/* Trial Warning */}
        {isTrialing && trialDaysRemaining && trialDaysRemaining <= 3 && (
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center">
              <ClockIcon className="h-5 w-5 text-blue-500 mr-2" />
              <p className="text-blue-800 font-medium">
                Your trial ends in {trialDaysRemaining} day{trialDaysRemaining !== 1 ? 's' : ''}. 
                Your subscription will automatically start after the trial period.
              </p>
            </div>
          </div>
        )}

        {/* This is the alignment fix: added md:items-start */}
        <div className="grid md:grid-cols-3 gap-8 md:items-start">
          {/* Main Dashboard Content */}
          <div className="md:col-span-2 space-y-6">
            <WelcomeCard />

            {profile && !profile.onboarding_completed && (
              <GettingStartedCard />
            )}

            <div className="bg-white rounded-lg shadow-lg p-6 border border-black/5">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <button 
                  onClick={() => window.location.href = '/tone-analyzer'}
                  className="flex flex-col items-start gap-3 p-4 bg-slate-50/50 rounded-lg hover:bg-primary/10 hover:shadow-lg hover:-translate-y-1 border border-black/5 hover:border-primary/20 transition-all duration-300 text-left"
                >
                  <ChartBarIcon className="h-7 w-7 text-primary" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Analyze Tone</h4>
                    <p className="text-sm text-gray-600">Understand message sentiment</p>
                  </div>
                </button>
                <button 
                  onClick={() => window.location.href = '/script-generator'}
                  className="flex flex-col items-start gap-3 p-4 bg-slate-50/50 rounded-lg hover:bg-primary/10 hover:shadow-lg hover:-translate-y-1 border border-black/5 hover:border-primary/20 transition-all duration-300 text-left"
                >
                  <ChatBubbleLeftRightIcon className="h-7 w-7 text-primary" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Generate Script</h4>
                    <p className="text-sm text-gray-600">Create response options</p>
                  </div>
                </button>
                <button 
                  onClick={() => window.location.href = '/library'}
                 className="flex flex-col items-start gap-3 p-4 bg-slate-50/50 rounded-lg hover:bg-primary/10 hover:shadow-lg hover:-translate-y-1 border border-black/5 hover:border-primary/20 transition-all duration-300 text-left"
                >
                  <BookOpenIcon className="h-7 w-7 text-primary" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Script Library</h4>
                    <p className="text-sm text-gray-600">Manage saved scripts</p>
                  </div>
                </button>
                <button 
                  onClick={() => window.location.href = '/voice-practice'}
                  className="flex flex-col items-start gap-3 p-4 bg-slate-50/50 rounded-lg hover:bg-primary/10 hover:shadow-lg hover:-translate-y-1 border border-black/5 hover:border-primary/20 transition-all duration-300 text-left"
                >
                  <SpeakerWaveIcon className="h-7 w-7 text-primary" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Voice Practice</h4>
                    <p className="text-sm text-gray-600">Practice with AI voice</p>
                  </div>
                  {isPremium && (
                    <div className="absolute -top-1 -right-1 bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-medium">
                      Premium
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Account Info Sidebar */}
          <div className="space-y-6">
            <QuickStats />
            <UsageOverview />
            {/* This is the replacement for the redundant settings card */}
            <HelpCard />
          </div>
        </div>
      </div>
    </div>
  );
}