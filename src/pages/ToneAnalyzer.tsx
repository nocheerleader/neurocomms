import React from 'react';
import { ChartBarIcon, ArrowLeftIcon, ClockIcon } from '@heroicons/react/24/outline';
import { ToneInput } from '../components/organisms/ToneInput';
import { ToneResults } from '../components/organisms/ToneResults';
import { AnalysisHistory } from '../components/organisms/AnalysisHistory';
import { useToneAnalysis } from '../hooks/useToneAnalysis';

export function ToneAnalyzer() {
  const {
    inputText,
    setInputText,
    analysisResult,
    loading,
    error,
    analyzeTone,
    clearResults,
    analysisHistory,
    showHistory,
    setShowHistory,
    saveAnalysisMetadata,
    savingTitle
  } = useToneAnalysis();

  const handleBackToDashboard = () => {
    window.location.href = '/profile';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-700 p-2 rounded-lg">
                <ChartBarIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Tone Analyzer</h1>
                <p className="text-sm text-gray-600">Understand message tone and sentiment</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <ClockIcon className="h-4 w-4" />
                {showHistory ? 'Hide History' : 'Show History'}
              </button>
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
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 font-medium">{error}</p>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Analysis Section */}
          <div className="lg:col-span-2 space-y-8">
            {/* Input Section */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Analyze Message Tone
              </h2>
              <p className="text-gray-600 mb-6">
                Paste the message you want to analyze below. We'll help you understand 
                the tone and suggest how to respond appropriately.
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
              <ToneResults
                result={analysisResult}
                inputText={inputText}
                onClear={clearResults}
                onReanalyze={() => analyzeTone(inputText)}
                onSaveAnalysis={saveAnalysisMetadata}
                savingTitle={savingTitle}
              />
            )}

            {/* Getting Started Guide (when no results) */}
            {!analysisResult && !loading && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-4">
                  How to Use the Tone Analyzer
                </h3>
                <div className="space-y-3 text-blue-800">
                  <div className="flex items-start gap-3">
                    <span className="bg-blue-700 text-white text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
                    <p>Copy and paste the message you want to analyze into the text box above.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="bg-blue-700 text-white text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
                    <p>Click "Analyze Tone" to see how the message might be perceived.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="bg-blue-700 text-white text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
                    <p>Review the tone breakdown and use this information to craft your response.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* History Sidebar */}
          <div className="lg:col-span-1">
            {showHistory && (
              <AnalysisHistory
                history={analysisHistory}
                onSelectAnalysis={(analysis) => {
                  setInputText(analysis.input_text);
                  // Could also auto-load the previous results here
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}