import React from 'react';
import { SpeakerWaveIcon } from '@heroicons/react/24/outline';
import { LoadingSpinner } from '../atoms/LoadingSpinner';

interface VoiceControlsProps {
  inputText: string;
  onInputChange: (text: string) => void;
  selectedVoice: string;
  onVoiceChange: (voice: string) => void;
  playbackSpeed: number;
  onSpeedChange: (speed: number) => void;
  onSynthesize: () => void;
  loading: boolean;
  usageCount: number;
  disabled: boolean;
}

const voiceOptions = [
  { value: 'professional', label: 'Professional - Clear and confident' },
  { value: 'friendly', label: 'Friendly - Warm and approachable' },
  { value: 'clear', label: 'Clear - Neutral and articulate' },
];

const speedOptions = [
  { value: 0.75, label: '0.75x - Slower' },
  { value: 1.0, label: '1.0x - Normal' },
  { value: 1.25, label: '1.25x - Faster' },
];

export function VoiceControls({
  inputText,
  onInputChange,
  selectedVoice,
  onVoiceChange,
  playbackSpeed,
  onSpeedChange,
  onSynthesize,
  loading,
  usageCount,
  disabled
}: VoiceControlsProps) {
  const maxLength = 1000;
  const remainingChars = maxLength - inputText.length;
  const monthlyLimit = 10;
  const isAtLimit = usageCount >= monthlyLimit;
  const canSynthesize = inputText.trim().length > 0 && !loading && !isAtLimit;

  return (
    <div className="space-y-6">
      {/* Usage Counter */}
      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-600">
          Monthly Usage: {usageCount} of {monthlyLimit}
        </span>
        {usageCount >= 8 && (
          <span className="text-amber-600 font-medium">
            {monthlyLimit - usageCount} syntheses remaining this month
          </span>
        )}
      </div>

      {/* Text Input */}
      <div>
        <label htmlFor="voice-text" className="block text-sm font-medium text-gray-700 mb-2">
          Text to Practice
        </label>
        <div className="relative">
          <textarea
            id="voice-text"
            value={inputText}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder="Enter or paste the text you want to practice speaking. For example, a response you've generated or an important message you need to deliver."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-700 focus:border-transparent"
            rows={6}
            maxLength={maxLength}
            disabled={disabled}
          />
          
          {/* Character Counter */}
          <div className="absolute bottom-3 right-3 text-sm text-gray-500">
            {remainingChars < 100 && (
              <span className={remainingChars < 20 ? 'text-red-500 font-medium' : 'text-amber-500'}>
                {remainingChars} characters remaining
              </span>
            )}
            {remainingChars >= 100 && (
              <span>{inputText.length}/{maxLength}</span>
            )}
          </div>
        </div>
      </div>

      {/* Voice and Speed Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Voice Selection */}
        <div>
          <label htmlFor="voice-style" className="block text-sm font-medium text-gray-700 mb-2">
            Voice Style
          </label>
          <select
            id="voice-style"
            value={selectedVoice}
            onChange={(e) => onVoiceChange(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-700 focus:border-transparent"
            disabled={disabled}
          >
            {voiceOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Speed Control */}
        <div>
          <label htmlFor="playback-speed" className="block text-sm font-medium text-gray-700 mb-2">
            Playback Speed
          </label>
          <select
            id="playback-speed"
            value={playbackSpeed}
            onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-700 focus:border-transparent"
            disabled={disabled}
          >
            {speedOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Generate Button */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600">
          <p>{monthlyLimit - usageCount} voice syntheses remaining this month</p>
        </div>
        
        <button
          onClick={onSynthesize}
          disabled={!canSynthesize}
          className="flex items-center gap-2 px-6 py-3 bg-purple-700 text-white rounded-lg font-medium hover:bg-purple-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-w-[160px] justify-center"
        >
          {loading ? (
            <LoadingSpinner />
          ) : (
            <>
              <SpeakerWaveIcon className="h-5 w-5" />
              Generate Voice
            </>
          )}
        </button>
      </div>

      {/* Limit Reached */}
      {isAtLimit && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="bg-amber-100 p-2 rounded-lg">
              <SpeakerWaveIcon className="h-5 w-5 text-amber-700" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-amber-900">Monthly limit reached</h4>
              <p className="text-amber-800 text-sm mt-1">
                You've used all 10 monthly voice syntheses. Your limit will reset next month.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}