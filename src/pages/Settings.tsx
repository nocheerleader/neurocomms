import React, { useState } from 'react';
import { useProfile } from '../hooks/useProfile';
import { LoadingSpinner } from '../components/atoms/LoadingSpinner';
import { CommunicationAssessment } from '../components/organisms/CommunicationAssessment';
import { User, Settings as SettingsIcon, Bell, Save } from 'lucide-react';

export function Settings() {
  const { profile, loading, updateProfile } = useProfile();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handlePreferenceChange = async (key: string, value: boolean) => {
    if (!profile) return;

    setSaving(true);
    const currentPreferences = profile.ui_preferences as any || {};
    const newPreferences = { ...currentPreferences, [key]: value };

    const { error } = await updateProfile({
      ui_preferences: newPreferences,
    });

    if (error) {
      setMessage('Error saving preferences');
    } else {
      setMessage('Preferences saved');
    }

    setSaving(false);
    setTimeout(() => setMessage(''), 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Unable to load profile</p>
      </div>
    );
  }

  const preferences = profile.ui_preferences as any || {};

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-6 border-b border-gray-200">
            <div className="flex items-center">
              <SettingsIcon className="h-6 w-6 text-gray-900 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            </div>
          </div>

          <div className="p-6 space-y-8">
            {/* Account Information */}
            <section>
              <div className="flex items-center mb-4">
                <User className="h-5 w-5 text-gray-900 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900">Account Information</h2>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Subscription Plan
                    </label>
                    <p className="mt-1 text-sm text-gray-900 capitalize">
                      {profile.subscription_tier}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Onboarding Status
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {profile.onboarding_completed ? 'Completed' : 'In Progress'}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Preferences */}
            <section>
              <div className="flex items-center mb-4">
                <Bell className="h-5 w-5 text-gray-900 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900">Preferences</h2>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Auto-save scripts</h3>
                    <p className="text-sm text-gray-500">
                      Automatically save successful scripts to your library
                    </p>
                  </div>
                  <button
                    onClick={() => handlePreferenceChange('auto_save', !preferences.auto_save)}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-offset-2 ${
                      preferences.auto_save ? 'bg-blue-700' : 'bg-gray-200'
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
                    <h3 className="text-sm font-medium text-gray-900">Email notifications</h3>
                    <p className="text-sm text-gray-500">
                      Receive updates about new features and tips
                    </p>
                  </div>
                  <button
                    onClick={() => handlePreferenceChange('notifications', !preferences.notifications)}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-offset-2 ${
                      preferences.notifications ? 'bg-blue-700' : 'bg-gray-200'
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
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Communication Style Assessment
                </h2>
                <CommunicationAssessment />
              </section>
            )}

            {/* Success Message */}
            {message && (
              <div className="flex items-center text-sm text-green-700 bg-green-50 p-3 rounded-lg">
                <Save className="h-4 w-4 mr-2" />
                {message}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}