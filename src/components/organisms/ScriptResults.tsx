import React from 'react';
import { CheckCircleIcon, ArrowPathIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { ScriptCard } from '../molecules/ScriptCard';
import { ScriptGenerationResult } from '../../hooks/useScriptGeneration';

interface ScriptResultsProps {
  result: ScriptGenerationResult;
  situationContext: string;
  relationshipType: string;
  onClear: () => void;
  onRegenerate: () => void;
}

export function ScriptResults({ 
  result, 
  situationContext,
  relationshipType,
  onClear, 
  onRegenerate
}: ScriptResultsProps) {
  return (
    <>
      {/* Header */}
      <div className="px-6 py-4 border-b border-black/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <CheckCircleIcon className="h-7 w-7 text-green-500" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Scripts Generated</h3>
              <p className="text-sm text-gray-600">
                Generated in {result.processing_time_ms}ms
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={onRegenerate}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <ArrowPathIcon className="h-4 w-4" />
              Regenerate
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
        {/* Context Summary */}
        <div className="bg-slate-50/50 rounded-lg p-4 border border-black/5">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">Your Situation</h4>
          <p className="text-gray-800 text-sm mb-2">"{situationContext}"</p>
          <p className="text-gray-600 text-xs">
            Relationship: <span className="capitalize font-medium">{relationshipType}</span>
          </p>
        </div>

        {/* Response Options */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Response Options</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ScriptCard
              type="casual"
              title="Casual Response"
              content={result.responses.casual.content}
              explanation={result.responses.casual.explanation}
              confidence={result.responses.casual.confidence}
              generationId={result.id}
              situationContext={situationContext}
              relationshipType={relationshipType}
            />
            <ScriptCard
              type="professional"
              title="Professional Response"
              content={result.responses.professional.content}
              explanation={result.responses.professional.explanation}
              confidence={result.responses.professional.confidence}
              generationId={result.id}
              situationContext={situationContext}
              relationshipType={relationshipType}
            />
            <ScriptCard
              type="direct"
              title="Direct Response"
              content={result.responses.direct.content}
              explanation={result.responses.direct.explanation}
              confidence={result.responses.direct.confidence}
              generationId={result.id}
              situationContext={situationContext}
              relationshipType={relationshipType}
            />
          </div>
        </div>
      </div>
    </>
  );
}