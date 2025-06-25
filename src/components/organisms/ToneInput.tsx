import React from 'react';
import { ChartBarIcon } from '@heroicons/react/24/outline';
import { LoadingSpinner } from '../atoms/LoadingSpinner';
import { useProfile } from '../../hooks/useProfile';
import { useSubscription } from '../../hooks/useSubscription';

interface ToneInputProps {
  value: string;
  onChange: (value: string) => void;
  onAnalyze: (text: string) => void;
  loading: boolean;
  disabled: boolean;
}

export function ToneInput({ value, onChange, onAnalyze, loading, disabled }: ToneInputProps) {
  const { profile } = useProfile();
  const { isPremium } = useSubscription();
  
  const maxLength = 2000;
  const remainingChars = maxLength - value.length;
  
  // For demo purposes, we'll simulate usage tracking
  // In a real implementation, this would come from the daily_usage table
  const usageCount = 0; // This would be fetched from the backend
  const dailyLimit = isPremium ? 'unlimited' : 5;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim() && !loading) {
      onAnalyze(value);
    }
  };

  const isAtLimit = !isPremium && usageCount >= 5;
  const canAnalyze = value.trim().length > 0 && !loading && !isAtLimit;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Usage Counter */}
      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-600">
          Daily Usage: {usageCount} of {dailyLimit}
        </span>
        {!isPremium && usageCount >= 3 && (
          <span className="text-amber-600 font-medium">
            {5 - usageCount} analyses remaining today
          </span>
        )}
      </div>

      {/* Text Input */}
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste the message you want to analyze here. For example: 'We need to talk about the project deadline.'"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-transparent"
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
            <span>{value.length}/{maxLength}</span>
          )}
        </div>
      </div>

      {/* Analyze Button */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600">
          {!isPremium && (
            <p>Free plan: {5 - usageCount} analyses remaining today</p>
          )}
        </div>
        
        <button
          type="submit"
          disabled={!canAnalyze}
          className="flex items-center gap-2 px-6 py-3 bg-blue-700 text-white rounded-lg font-medium hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-w-[140px] justify-center"
        >
          {loading ? (
            <LoadingSpinner />
          ) : (
            <>
              <ChartBarIcon className="h-5 w-5" />
              Analyze Tone
            </>
          )}
        </button>
      </div>

      {/* Upgrade Prompt for Free Users Near Limit */}
      {!isPremium && usageCount >= 3 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="bg-amber-100 p-2 rounded-lg">
              <ChartBarIcon className="h-5 w-5 text-amber-700" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-amber-900">Running low on analyses</h4>
              <p className="text-amber-800 text-sm mt-1">
                You have {5 - usageCount} analyses left today. Upgrade to Premium for unlimited analyses.
              </p>
              <button 
                onClick={() => window.location.href = '/profile'}
                className="mt-2 text-amber-700 hover:text-amber-800 font-medium text-sm underline"
              >
                View upgrade options
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Limit Reached */}
      {isAtLimit && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="bg-red-100 p-2 rounded-lg">
              <ChartBarIcon className="h-5 w-5 text-red-700" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-red-900">Daily limit reached</h4>
              <p className="text-red-800 text-sm mt-1">
                You've used all 5 daily analyses. Upgrade to Premium for unlimited access or try again tomorrow.
              </p>
              <button 
                onClick={() => window.location.href = '/profile'}
                className="mt-2 text-red-700 hover:text-red-800 font-medium text-sm underline"
              >
                Upgrade to Premium
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}