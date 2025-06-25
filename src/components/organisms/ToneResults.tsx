import React from 'react';
import { CheckCircleIcon, ArrowPathIcon, XMarkIcon, BookmarkIcon } from '@heroicons/react/24/outline';
import { ToneCategory } from '../molecules/ToneCategory';
import { ConfidenceIndicator } from '../atoms/ConfidenceIndicator';
import { ToneAnalysisResult } from '../../hooks/useToneAnalysis';

interface ToneResultsProps {
  result: ToneAnalysisResult;
  inputText: string;
  onClear: () => void;
  onReanalyze: () => void;
}

export function ToneResults({ result, inputText, onClear, onReanalyze }: ToneResultsProps) {
  const handleSaveToLibrary = () => {
    // TODO: Implement save to library functionality
    console.log('Save to library:', { inputText, result });
  };

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <CheckCircleIcon className="h-6 w-6 text-green-500" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Analysis Complete</h3>
              <p className="text-sm text-gray-600">
                Processed in {result.processing_time_ms}ms
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleSaveToLibrary}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <BookmarkIcon className="h-4 w-4" />
              Save
            </button>
            <button
              onClick={onReanalyze}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <ArrowPathIcon className="h-4 w-4" />
              Re-analyze
            </button>
            <button
              onClick={onClear}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Confidence Score */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Analysis Confidence</span>
          <ConfidenceIndicator score={result.confidence} />
        </div>

        {/* Tone Breakdown */}
        <div>
          <h4 className="text-md font-semibold text-gray-900 mb-4">Tone Breakdown</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ToneCategory
              name="Professional"
              percentage={result.tones.professional}
              color="blue"
              description="Formal, business-like communication"
            />
            <ToneCategory
              name="Friendly"
              percentage={result.tones.friendly}
              color="green"
              description="Warm, approachable, positive"
            />
            <ToneCategory
              name="Urgent"
              percentage={result.tones.urgent}
              color="red"
              description="Time-sensitive, demanding attention"
            />
            <ToneCategory
              name="Neutral"
              percentage={result.tones.neutral}
              color="gray"
              description="Factual, emotionally neutral"
            />
          </div>
        </div>

        {/* Explanation */}
        <div>
          <h4 className="text-md font-semibold text-gray-900 mb-3">What This Means</h4>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-800 leading-relaxed">{result.explanation}</p>
          </div>
        </div>

        {/* Suggestions */}
        <div>
          <h4 className="text-md font-semibold text-gray-900 mb-3">How to Respond</h4>
          <div className="space-y-3">
            {result.suggestions.map((suggestion, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <span className="bg-blue-700 text-white text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                  {index + 1}
                </span>
                <p className="text-blue-900 text-sm">{suggestion}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Original Message */}
        <div>
          <h4 className="text-md font-semibold text-gray-900 mb-3">Original Message</h4>
          <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-gray-300">
            <p className="text-gray-800 italic">"{inputText}"</p>
          </div>
        </div>
      </div>
    </div>
  );
}