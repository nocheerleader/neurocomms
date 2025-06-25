import React, { useState } from 'react';
import { BookmarkIcon, ClipboardDocumentIcon } from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/24/solid';
import { CopyButton } from '../atoms/CopyButton';
import { SaveScriptDialog } from './SaveScriptDialog';
import { ConfidenceIndicator } from '../atoms/ConfidenceIndicator';

interface ScriptCardProps {
  type: 'casual' | 'professional' | 'direct';
  title: string;
  content: string;
  explanation: string;
  confidence: number;
  generationId: string;
  situationContext: string;
  relationshipType: string;
}

export function ScriptCard({ 
  type, 
  title, 
  content, 
  explanation, 
  confidence,
  generationId,
  situationContext,
  relationshipType
}: ScriptCardProps) {
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const getCardStyle = () => {
    switch (type) {
      case 'casual':
        return {
          border: 'border-green-200',
          header: 'bg-green-50',
          accent: 'text-green-700',
          button: 'text-green-600 hover:text-green-700'
        };
      case 'professional':
        return {
          border: 'border-blue-200',
          header: 'bg-blue-50',
          accent: 'text-blue-700',
          button: 'text-blue-600 hover:text-blue-700'
        };
      case 'direct':
        return {
          border: 'border-purple-200',
          header: 'bg-purple-50',
          accent: 'text-purple-700',
          button: 'text-purple-600 hover:text-purple-700'
        };
    }
  };

  const style = getCardStyle();

  const handleSaveSuccess = () => {
    setIsSaved(true);
    setShowSaveDialog(false);
  };

  return (
    <>
      <div className={`border ${style.border} rounded-lg overflow-hidden`}>
        {/* Header */}
        <div className={`${style.header} px-4 py-3 border-b ${style.border}`}>
          <div className="flex items-center justify-between">
            <h5 className={`font-semibold ${style.accent}`}>{title}</h5>
            <ConfidenceIndicator score={confidence} />
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-gray-900 text-sm leading-relaxed">{content}</p>
          </div>

          <div>
            <h6 className="text-sm font-medium text-gray-700 mb-2">Why This Works</h6>
            <p className="text-gray-600 text-sm leading-relaxed">{explanation}</p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-2">
            <CopyButton text={content} />
            
            <button
              onClick={() => setShowSaveDialog(true)}
              className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                isSaved
                  ? 'bg-gray-100 text-gray-600 cursor-default'
                  : `${style.button} hover:bg-gray-50`
              }`}
              disabled={isSaved}
            >
              {isSaved ? (
                <BookmarkSolidIcon className="h-4 w-4" />
              ) : (
                <BookmarkIcon className="h-4 w-4" />
              )}
              {isSaved ? 'Saved' : 'Save to Library'}
            </button>
          </div>
        </div>
      </div>

      {/* Save Dialog */}
      {showSaveDialog && (
        <SaveScriptDialog
          scriptContent={content}
          scriptType={type}
          generationId={generationId}
          situationContext={situationContext}
          relationshipType={relationshipType}
          onClose={() => setShowSaveDialog(false)}
          onSave={handleSaveSuccess}
        />
      )}
    </>
  );
}