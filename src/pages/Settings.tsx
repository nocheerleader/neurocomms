import React, { useState } from 'react';
import { useProfile } from '../hooks/useProfile';
import { LoadingSpinner } from '../components/atoms/LoadingSpinner';
import { CommunicationAssessment } from '../components/organisms/CommunicationAssessment';
import { UserIcon, Cog6ToothIcon, BellIcon, DocumentCheckIcon, ArrowLeftIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

export function Settings() {
  const { profile, loading, updateProfile } = useProfile();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleBackToDashboard = () => {
    window.location.href = '/profile';
  };

  const handlePreferenceChange = async (key: string, value: boolean) => {
    if (!profile) return;

    setSaving(true);
    const currentPreferences = (profile.ui_preferences as any) || {};
    const newPreferences = { ...currentPreferences, [key]: value };

    const { error } = await updateProfile({
      ui_preferences: newPreferences,
    });

    if (error) {
      setMessage('Error saving preferences');
    } else {
      setMessage('Preferences saved successfully!');
    }

    setSaving(false);
    setTimeout(() => setMessage(''), 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDF6F8] flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#FDF6F8] flex items-center justify-center">
        <p>Unable to load profile.</p>
      </div>
    );
  }

  const preferences = (profile.ui_preferences as any) || {};

  return (
    <div className="min-h-screen bg-[#FDF6F8] py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-xl border border-black/5">
          {/* Header */}
          <div className="px-6 py-5 border-b border-black/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Cog6ToothIcon className="h-7 w-7 text-primary" />
                <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
              </div>
              <button
                onClick={handleBackToDashboard}
                className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors"
              >
                <ArrowLeftIcon className="h-4 w-4" />
                <span>Back to Dashboard</span>
              </button>
            </div>
          </div>

          <div className="p-6 space-y-8">
            {/* Account Information */}
            <section>
              <div className="flex items-center mb-3">
                <UserIcon className="h-5 w-5 text-primary mr-2" />
                <h2 className="text-lg font-semibold text-gray-800">Account Information</h2>
              </div>
              <div className="bg-slate-50/50 rounded-lg p-4 border border-black/5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      Subscription Plan
                    </label>
                    <p className="mt-1 text-sm font-semibold text-gray-800 capitalize">
                      {profile.subscription_tier}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      Onboarding Status
                    </label>
                    <p className="mt-1 text-sm font-semibold text-gray-800">
                      {profile.onboarding_completed ? 'Completed' : 'Pending Assessment'}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Preferences */}
            <section>
              <div className="flex items-center mb-3">
                <BellIcon className="h-5 w-5 text-primary mr-2" />
                <h2 className="text-lg font-semibold text-gray-800">Preferences</h2>
              </div>
              <div className="space-y-4 bg-slate-50/50 rounded-lg p-4 border border-black/5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-800">Auto-save scripts</h3>
                    <p className="text-sm text-gray-600">
                      Automatically save successful scripts to your library.
                    </p>
                  </div>
                  <button
                    onClick={() => handlePreferenceChange('auto_save', !preferences.auto_save)}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                      preferences.auto_save ? 'bg-primary' : 'bg-gray-300'
                    }`}
                    disabled={saving}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        preferences.auto_save ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-800">Email notifications</h3>
                    <p className="text-sm text-gray-600">
                      Receive updates about new features and product tips.
                    </p>
                  </div>
                  <button
                    onClick={() => handlePreferenceChange('notifications', !preferences.notifications)}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                      preferences.notifications ? 'bg-primary' : 'bg-gray-300'
                    }`}
                    disabled={saving}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        preferences.notifications ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </section>

            {/* Communication Assessment */}
            {!profile.onboarding_completed && (
              <section>
                <div className="flex items-center mb-3">
                    <DocumentCheckIcon className="h-5 w-5 text-primary mr-2" />
                    <h2 className="text-lg font-semibold text-gray-800">Communication Style Assessment</h2>
                </div>
                <div className="bg-slate-50/50 rounded-lg p-6 border border-black/5">
                    <p className="text-gray-600 text-sm mb-4">This short assessment helps us personalize your script and tone suggestions. Your answers will only be used to improve your experience.</p>
                    <CommunicationAssessment />
                </div>
              </section>
            )}

            {/* Success Message */}
            {message && (
              <div className="flex items-center justify-center text-sm font-semibold text-green-700 bg-green-50 p-3 rounded-lg border border-green-200">
                <CheckCircleIcon className="h-5 w-5 mr-2" />
                {message}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}