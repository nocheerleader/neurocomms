import React from 'react';
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
    <div className="min-h-screen bg-[#FDF6F8]">
      {/* Header */}
      <div className="bg-transparent border-b border-primary/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center gap-3">
              <div className="bg-primary p-2 rounded-lg">
                <SpeakerWaveIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-gray-900">Voice Practice</h1>
                  <div className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <StarIcon className="h-3 w-3" />
                    Premium
                  </div>
                </div>
                <p className="text-sm text-gray-600">Practice your responses with AI-generated voice</p>
              </div>
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

            {/* MOVED & IMPROVED INSTRUCTIONS - ONLY SHOWS ON INITIAL LOAD */}
            {!audioUrl && !loading && (
              <div className="bg-slate-50/50 border border-black/5 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-primary mb-4">
                  Practice Speaking with Confidence
                </h3>
                <div className="text-sm text-gray-700 space-y-3">
                    <p className="mb-4">
                        Knowing what to write is the first step. This tool helps with the next one: saying it out loud. Hearing your words spoken in a clear, confident tone can help you practice your own delivery for important calls or meetings.
                    </p>
                    <div className="flex items-start gap-3">
                        <span className="bg-primary text-white font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
                        <p>Enter the text you want to practice in the box below.</p>
                    </div>
                    <div className="flex items-start gap-3">
                        <span className="bg-primary text-white font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
                        <p>Choose a voice style (e.g., Professional, Friendly) that fits the situation.</p>
                    </div>
                    <div className="flex items-start gap-3">
                        <span className="bg-primary text-white font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
                        <p>Click "Generate Voice" to create the audio.</p>
                    </div>
                </div>
              </div>
            )}

            <div className="bg-white rounded-lg shadow-xl p-6 border border-black/5">
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

            {audioUrl && (
              <div className="bg-white rounded-lg shadow-xl p-6 border border-black/5">
                <AudioPlayer
                  audioUrl={audioUrl}
                  text={inputText}
                  playbackSpeed={playbackSpeed}
                  onClose={clearAudio}
                />
              </div>
            )}
            
          </div>
        )}
      </div>
    </div>
  );
}