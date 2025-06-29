import React from 'react';
import { ChartBarIcon } from '@heroicons/react/24/outline';
import { LoadingSpinner } from '../atoms/LoadingSpinner';
import { useSubscription } from '../../hooks/useSubscription';

interface ToneInputProps {
  value: string;
  onChange: (value: string) => void;
  onAnalyze: (text: string) => void;
  loading: boolean;
  disabled: boolean;
}

export function ToneInput({ value, onChange, onAnalyze, loading, disabled }: ToneInputProps) {
  const { isPremium } = useSubscription();
  
  const maxLength = 2000;
  
  // This would be fetched from the backend, but for UI purposes, this is fine
  const usageCount = 0; 
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
      {/* Text Input */}
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste the message you want to analyze here. For example: 'We need to talk about the project deadline.'"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-slate-50/50"
          rows={6}
          maxLength={maxLength}
          disabled={disabled}
        />
        
        <div className="absolute bottom-3 right-3 text-sm text-gray-500">
          <span>{value.length}/{maxLength}</span>
        </div>
      </div>

      {/* Analyze Button */}
      <div className="flex justify-end items-center">
        <button
          type="submit"
          disabled={!canAnalyze}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg min-w-[160px] justify-center"
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
    </form>
  );
}