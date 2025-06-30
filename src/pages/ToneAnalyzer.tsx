import React from 'react';
import { ChartBarIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { ToneInput } from '../components/organisms/ToneInput';
import { ToneResults } from '../components/organisms/ToneResults';
import { useToneAnalysis } from '../hooks/useToneAnalysis';

export function ToneAnalyzer() {
  const {
    inputText,
    setInputText,
    analysisResult,
    loading,
    error,
    analyzeTone,
    clearResults
  } = useToneAnalysis();

  const handleBackToDashboard = () => {
    window.location.href = '/profile';
  };

  return (
    <div className="min-h-screen bg-[#FDF6F8]">
      {/* Header */}
      <div className="bg-transparent border-b border-primary/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center gap-3">
              <div className="bg-primary p-2 rounded-lg">
                <ChartBarIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Tone Analyzer</h1>
                <p className="text-sm text-gray-600">Understand message tone and sentiment</p>
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
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 font-medium">{error}</p>
          </div>
        )}

        <div className="space-y-8">
        
          {/* NEW INSTRUCTION BLOCK AT THE TOP */}
          {!analysisResult && !loading && (
            <div className="bg-slate-50/50 border border-black/5 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-primary mb-4">
                How to Use the Tone Analyzer
              </h3>
              <div className="text-sm text-gray-700 space-y-3">
                 <p>This tool helps you understand the hidden meaning in messages. Just follow these steps.</p>
                <div className="flex items-start gap-3">
                  <span className="bg-primary text-white text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
                  <p>
                    <strong>Copy and paste the message</strong> you received (like an email or text) into the box below.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="bg-primary text-white text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
                  <p>
                    <strong>Click "Analyze Tone"</strong> to see a breakdown of how the message might be perceived.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="bg-primary text-white text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
                  <p>
                    <strong>Review the results</strong>, which include an explanation and suggestions for how to respond.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Input Section */}
          <div className="bg-white rounded-lg shadow-xl p-6 border border-black/5">
            {/* The title here is now simpler */}
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Paste Your Message to Analyze
            </h2>
            <p className="text-gray-600 mb-6 text-sm">
              We'll help you understand the tone and suggest how to respond. Your text is not stored.
            </p>
            
            <ToneInput
              value={inputText}
              onChange={setInputText}
              onAnalyze={analyzeTone}
              loading={loading}
              disabled={loading}
            />
          </div>

          {/* Results Section */}
          {analysisResult && (
            <div className="bg-white rounded-lg shadow-xl border border-black/5">
              <ToneResults
                result={analysisResult}
                inputText={inputText}
                onClear={clearResults}
                onReanalyze={() => analyzeTone(inputText)}
              />
            </div>
          )}

          {/* Old Getting Started Guide has been removed */}
        </div>
      </div>
    </div>
  );
}