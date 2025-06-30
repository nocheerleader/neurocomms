import React from 'react';
import { CheckCircleIcon, ArrowPathIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { ToneCategory } from '../molecules/ToneCategory';
import { ConfidenceIndicator } from '../atoms/ConfidenceIndicator';
import { ToneAnalysisResult } from '../../hooks/useToneAnalysis';

interface ToneResultsProps {
  result: ToneAnalysisResult;
  inputText: string;
  onClear: () => void;
  onReanalyze: () => void;
}

export function ToneResults({ 
  result, 
  inputText, 
  onClear, 
  onReanalyze
}: ToneResultsProps) {

  // This logic is from the UX improvement for the Tone Breakdown, which is safe to keep.
  const dominantTone = Object.entries(result.tones).reduce((a, b) => a[1] > b[1] ? a : b);
  const toneDescriptions = {
    professional: 'Formal, business-like communication',
    friendly: 'Warm, approachable, positive',
    urgent: 'Time-sensitive, demanding attention',
    neutral: 'Factual, emotionally neutral'
  };
  const toneColors = {
    professional: 'text-blue-700',
    friendly: 'text-green-700',
    urgent: 'text-red-700',
    neutral: 'text-gray-700'
  };

  return (
    <>
      {/* Header */}
      <div className="px-6 py-4 border-b border-black/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <CheckCircleIcon className="h-7 w-7 text-green-500" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Analysis Complete</h3>
              <p className="text-sm text-gray-600">
                Processed in {result.processing_time_ms}ms
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={onReanalyze}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <ArrowPathIcon className="h-4 w-4" />
              Re-analyze
            </button>
            <button
              onClick={onClear}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Dominant Tone Summary */}
        <div className="bg-slate-50/50 p-4 rounded-lg border border-black/5">
            <h4 className="text-sm font-medium text-gray-700 mb-1">Primary Tone Detected:</h4>
            <p className={`text-lg font-bold capitalize ${toneColors[dominantTone[0] as keyof typeof toneColors]}`}>
                {dominantTone[0]}
            </p>
        </div>
        
        {/* Confidence Score */}
        <div className="flex items-center justify-between bg-slate-50/50 p-3 rounded-lg border border-black/5">
          <span className="text-sm font-medium text-gray-700">Analysis Confidence</span>
          <ConfidenceIndicator score={result.confidence} />
        </div>

        {/* Tone Breakdown */}
        <div>
          <h4 className="text-md font-semibold text-gray-900 mb-3">Tone Breakdown</h4>
          <div className="bg-slate-50/50 p-4 rounded-lg border border-black/5 space-y-4">
              {Object.entries(result.tones)
                  .sort((a, b) => b[1] - a[1]) 
                  .map(([name, percentage]) => (
                      <ToneCategory
                          key={name}
                          name={name.charAt(0).toUpperCase() + name.slice(1)}
                          // @ts-ignore
                          color={name === 'professional' ? 'blue' : name === 'friendly' ? 'green' : name === 'urgent' ? 'red' : 'gray'}
                          percentage={percentage}
                          description={toneDescriptions[name as keyof typeof toneDescriptions]}
                      />
                  ))}
          </div>
        </div>

        {/* REVERTED Explanation Section */}
        <div>
          <h4 className="text-md font-semibold text-gray-900 mb-3">What This Means</h4>
          <div className="bg-slate-50/50 rounded-lg p-4">
            <p className="text-gray-800 leading-relaxed">{result.explanation}</p>
          </div>
        </div>

        {/* Suggestions */}
        <div>
          <h4 className="text-md font-semibold text-gray-900 mb-3">How to Respond</h4>
          <div className="space-y-3">
            {result.suggestions.map((suggestion, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-primary/10 rounded-lg">
                <span className="bg-primary text-white text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                  {index + 1}
                </span>
                <p className="text-primary/90 text-sm font-medium">{suggestion}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Original Message */}
        <div>
          <h4 className="text-md font-semibold text-gray-900 mb-3">Original Message</h4>
          <div className="bg-gray-100 rounded-lg p-4 border-l-4 border-gray-300">
            <p className="text-gray-800 italic">"{inputText}"</p>
          </div>
        </div>
      </div>
    </>
  );
}