import React, { useState } from 'react';
import { SpeakerWaveIcon, ArrowLeftIcon, StarIcon } from '@heroicons/react/24/outline';
import { VoiceControls } from '../components/organisms/VoiceControls';
import { AudioPlayer } from '../components/organisms/AudioPlayer';
import { PremiumGate } from '../components/molecules/PremiumGate';
import { useSubscription } from '../hooks/useSubscription';
import { useVoiceSynthesis } from '../hooks/useVoiceSynthesis';

export function VoicePractice() {
  const { isPremium } = useSubscription();
  const {
    inputText,
    setInputText,
    selectedVoice,
    setSelectedVoice,
    playbackSpeed,
    setPlaybackSpeed,
    audioUrl,
    loading,
    error,
    synthesizeVoice,
    clearAudio,
    usageCount
  } = useVoiceSynthesis();

  const handleBackToDashboard = () => {
    window.location.href = '/profile';
  };

  const handleSynthesizeVoice = () => {
    if (inputText.trim()) {
      synthesizeVoice(inputText, selectedVoice, playbackSpeed);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="bg-purple-700 p-2 rounded-lg">
                <SpeakerWaveIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-gray-900">Voice Practice</h1>
                  <div className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                    <StarIcon className="h-3 w-3" />
                    Premium
                  </div>
                </div>
                <p className="text-sm text-gray-600">Practice your responses with AI-generated voice</p>
              </div>
            </div>
            <button
              onClick={handleBackToDashboard}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!isPremium ? (
          <PremiumGate 
            feature="Voice Practice"
            description="Practice your communication scripts with AI-generated voice to build confidence before real conversations."
            benefits={[
              "10 voice syntheses per month",
              "Professional voice selection",
              "Adjustable playback speed",
              "Text synchronization while playing",
              "Download audio for offline practice"
            ]}
          />
        ) : (
          <div className="space-y-8">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 font-medium">{error}</p>
              </div>
            )}

            {/* Voice Controls */}
            <div className="bg-white rounded-lg shadow p-6">
              <VoiceControls
                inputText={inputText}
                onInputChange={setInputText}
                selectedVoice={selectedVoice}
                onVoiceChange={setSelectedVoice}
                playbackSpeed={playbackSpeed}
                onSpeedChange={setPlaybackSpeed}
                onSynthesize={handleSynthesizeVoice}
                loading={loading}
                usageCount={usageCount}
                disabled={loading}
              />
            </div>

            {/* Audio Player */}
            {audioUrl && (
              <div className="bg-white rounded-lg shadow p-6">
                <AudioPlayer
                  audioUrl={audioUrl}
                  text={inputText}
                  playbackSpeed={playbackSpeed}
                  onClose={clearAudio}
                />
              </div>
            )}

            {/* Getting Started Guide */}
            {!audioUrl && !loading && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-purple-900 mb-4">
                  How to Use Voice Practice
                </h3>
                <div className="space-y-3 text-purple-800">
                  <div className="flex items-start gap-3">
                    <span className="bg-purple-700 text-white text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
                    <p>Type or paste the text you want to practice speaking.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="bg-purple-700 text-white text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
                    <p>Choose a voice style that matches your communication goal.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="bg-purple-700 text-white text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
                    <p>Adjust the playback speed to your comfort level.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="bg-purple-700 text-white text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">4</span>
                    <p>Click "Generate Voice" to create your practice audio.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="bg-purple-700 text-white text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">5</span>
                    <p>Listen and practice along with the synchronized text highlighting.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}