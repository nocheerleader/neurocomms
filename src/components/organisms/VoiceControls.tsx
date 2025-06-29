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
  const monthlyLimit = 10;
  const isAtLimit = usageCount >= monthlyLimit;
  const canSynthesize = inputText.trim().length > 0 && !loading && !isAtLimit;

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="voice-text" className="block text-sm font-medium text-gray-700 mb-2">
          Text to Practice
        </label>
        <div className="relative">
          <textarea
            id="voice-text"
            value={inputText}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder="Enter or paste the text you want to practice speaking..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-slate-50/50"
            rows={6}
            maxLength={maxLength}
            disabled={disabled}
          />
          <div className="absolute bottom-3 right-3 text-sm text-gray-500">
            <span>{inputText.length}/{maxLength}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="voice-style" className="block text-sm font-medium text-gray-700 mb-2">
            Voice Style
          </label>
          <select
            id="voice-style"
            value={selectedVoice}
            onChange={(e) => onVoiceChange(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-slate-50/50"
            disabled={disabled}
          >
            {voiceOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="playback-speed" className="block text-sm font-medium text-gray-700 mb-2">
            Playback Speed
          </label>
          <select
            id="playback-speed"
            value={playbackSpeed}
            onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-slate-50/50"
            disabled={disabled}
          >
            {speedOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex justify-end items-center pt-2">
        <button
          onClick={onSynthesize}
          disabled={!canSynthesize}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg min-w-[180px] justify-center"
        >
          {loading ? <LoadingSpinner /> : <><SpeakerWaveIcon className="h-5 w-5" />Generate Voice</>}
        </button>
      </div>
    </div>
  );
}