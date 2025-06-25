import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useProfile } from '../hooks/useProfile';
import { useSubscription } from '../hooks/useSubscription';
import { LoadingSpinner } from '../components/atoms/LoadingSpinner';
import { UserIcon, Cog6ToothIcon, ChartBarIcon, BookOpenIcon, ArrowRightOnRectangleIcon, CheckCircleIcon, XCircleIcon, ClockIcon } from '@heroicons/react/24/outline';

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

  const handleSettingsClick = () => {
    window.location.href = '/settings';
  };

  if (profileLoading || subscriptionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  const getSubscriptionStatusDisplay = () => {
    if (!subscription?.subscription_status) return 'Free';
    
    switch (subscription.subscription_status) {
      case 'active':
        return 'Premium (Active)';
      case 'trialing':
        return `Premium (Trial - ${trialDaysRemaining} days left)`;
      case 'past_due':
        return 'Premium (Past Due)';
      case 'canceled':
        return 'Premium (Canceled)';
      default:
        return 'Free';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-700 p-2 rounded-lg">
                <UserIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
                <p className="text-sm text-gray-600">Manage your ToneWise account</p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
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

        <div className="grid md:grid-cols-3 gap-8">
          {/* Welcome Card */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Welcome back!
              </h2>
              <p className="text-gray-600 mb-4">
                You're signed in as <span className="font-medium">{user?.email}</span>
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 mb-2">Getting Started</h3>
                <p className="text-blue-800 text-sm">
                  Complete your communication assessment in Settings to get personalized suggestions.
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button 
                  onClick={() => window.location.href = '/tone-analyzer'}
                  className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors text-left"
                >
                  <ChartBarIcon className="h-6 w-6 text-blue-700" />
                  <div>
                    <h4 className="font-medium text-gray-900">Analyze Tone</h4>
                    <p className="text-sm text-gray-600">Understand message sentiment</p>
                  </div>
                </button>
                <button className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors text-left">
                  <BookOpenIcon className="h-6 w-6 text-blue-700" />
                  <div>
                    <h4 className="font-medium text-gray-900">Generate Script</h4>
                    <p className="text-sm text-gray-600">Create response options</p>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Account Info Sidebar */}
          <div className="space-y-6">
            {/* Account Status */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Status</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Plan</label>
                  <p className="text-sm text-gray-900">
                    {getSubscriptionStatusDisplay()}
                  </p>
                  {isPremium && subscription?.current_period_end && (
                    <p className="text-xs text-gray-500 mt-1">
                      {isTrialing ? 'Trial ends' : 'Renews'} {new Date(subscription.current_period_end * 1000).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Onboarding</label>
                  <p className="text-sm text-gray-900">
                    {profile?.onboarding_completed ? 'Complete' : 'In Progress'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Member Since</label>
                  <p className="text-sm text-gray-900">
                    {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'Unknown'}
                  </p>
                </div>
              </div>
            </div>

            {/* Settings Link */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Settings</h3>
              <button
                onClick={handleSettingsClick}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <Cog6ToothIcon className="h-4 w-4" />
                Manage Settings
              </button>
            </div>

            {/* Usage Summary */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Usage</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Tone Analyses</span>
                  <span className="text-sm font-medium text-gray-900">
                    {isPremium ? '0 / unlimited' : '0 / 5'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Script Generations</span>
                  <span className="text-sm font-medium text-gray-900">
                    {isPremium ? '0 / unlimited' : '0 / 3'}
                  </span>
                </div>
                {isPremium && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Voice Syntheses</span>
                    <span className="text-sm font-medium text-gray-900">0 / 10</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}