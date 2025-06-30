import React from 'react';
import { ChatBubbleLeftRightIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { SituationInput } from '../components/organisms/SituationInput';
import { ScriptResults } from '../components/organisms/ScriptResults';
import { useScriptGeneration } from '../hooks/useScriptGeneration';

export function ScriptGenerator() {
  const {
    situationContext,
    setSituationContext,
    relationshipType,
    setRelationshipType,
    generationResult,
    loading,
    error,
    generateScripts,
    clearResults
  } = useScriptGeneration();

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
                <ChatBubbleLeftRightIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Script Generator</h1>
                <p className="text-sm text-gray-600">Generate response options for any situation</p>
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
          {/* Input Section */}
          <div className="bg-white rounded-lg shadow-xl p-6 border border-black/5">
           <h2 className="text-lg font-semibold text-gray-900 mb-4">
  How to Get Your Scripts
</h2>
<div className="bg-slate-50/50 border border-black/5 rounded-lg p-4 mb-6 text-sm text-gray-700 space-y-3">
    <p>
        This tool helps you find the right words. Just follow these two steps to get your response suggestions.
    </p>
    <div className="flex items-start gap-3">
        <span className="bg-primary text-white font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
        <p>
            <strong>Describe the situation:</strong> In the box below, explain the message or event you need to respond to. 
            <br/><em>Example: "I need to ask my manager for a deadline extension."</em>
        </p>
    </div>
    <div className="flex items-start gap-3">
        <span className="bg-primary text-white font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
        <p>
            <strong>Select the relationship:</strong> Choose who you are talking to (e.g., 'Manager', 'Friend', 'Client').
        </p>
    </div>
    <p className="pt-2 font-medium text-gray-800">
        We will then create three clear response options for you: one Casual, one Professional, and one Direct.
    </p>
</div>
            
            <SituationInput
              situationContext={situationContext}
              onSituationChange={setSituationContext}
              relationshipType={relationshipType}
              onRelationshipChange={setRelationshipType}
              onGenerate={generateScripts}
              loading={loading}
              disabled={loading}
            />
          </div>

          {/* Results Section */}
          {generationResult && (
            <div className="bg-white rounded-lg shadow-xl border border-black/5">
                <ScriptResults
                  result={generationResult}
                  situationContext={situationContext}
                  relationshipType={relationshipType}
                  onClear={clearResults}
                  onRegenerate={() => generateScripts(situationContext, relationshipType)}
                />
            </div>
          )}

          {/* Getting Started Guide (when no results) */}
          {!generationResult && !loading && (
            <div className="bg-slate-50/50 border border-black/5 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-primary mb-4">
                How to Use the Script Generator
              </h3>
              <div className="space-y-3 text-gray-700">
                <div className="flex items-start gap-3">
                  <span className="bg-primary text-white text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
                  <p>Choose a template or describe your situation in the text box above.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="bg-primary text-white text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
                  <p>Select your relationship to the person you're responding to.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="bg-primary text-white text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
                  <p>Click "Generate Scripts" to get three response options: casual, professional, and direct.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="bg-primary text-white text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">4</span>
                  <p>Copy the response that works best or save it to your library for future use.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}