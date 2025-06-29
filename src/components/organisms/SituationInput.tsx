import React from 'react';
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import { LoadingSpinner } from '../atoms/LoadingSpinner';
import { TemplateSelector } from '../molecules/TemplateSelector';

interface SituationInputProps {
  situationContext: string;
  onSituationChange: (value: string) => void;
  relationshipType: string;
  onRelationshipChange: (value: string) => void;
  onGenerate: (situation: string, relationship: string) => void;
  loading: boolean;
  disabled: boolean;
}

const relationshipTypes = [
  { value: 'colleague', label: 'Colleague - Same level coworker' },
  { value: 'manager', label: 'Manager - Your supervisor or boss' },
  { value: 'friend', label: 'Friend - Personal friend' },
  { value: 'family', label: 'Family - Family member' },
  { value: 'client', label: 'Client - Customer or client' },
  { value: 'acquaintance', label: 'Acquaintance - Someone you know casually' },
  { value: 'other', label: 'Other - Different relationship' },
];

export function SituationInput({ 
  situationContext, 
  onSituationChange,
  relationshipType,
  onRelationshipChange,
  onGenerate, 
  loading, 
  disabled 
}: SituationInputProps) {
  
  const maxLength = 1000;
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (situationContext.trim() && relationshipType && !loading) {
      onGenerate(situationContext, relationshipType);
    }
  };

  const canGenerate = situationContext.trim().length > 0 && relationshipType && !loading;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Template Selector */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Start with a Template (Optional)
        </label>
        <TemplateSelector onTemplateSelect={onSituationChange} />
      </div>

      {/* Situation Input */}
      <div>
        <label htmlFor="situation" className="block text-sm font-medium text-gray-700 mb-2">
          Or, Describe Your Situation
        </label>
        <div className="relative">
          <textarea
            id="situation"
            value={situationContext}
            onChange={(e) => onSituationChange(e.target.value)}
            placeholder="Example: 'My manager sent an email asking about the project deadline and it seems urgent, but I'm not sure if they're upset.'"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-slate-50/50"
            rows={4}
            maxLength={maxLength}
            disabled={disabled}
          />
          <div className="absolute bottom-3 right-3 text-sm text-gray-500">
            <span>{situationContext.length}/{maxLength}</span>
          </div>
        </div>
      </div>

      {/* Relationship Type */}
      <div>
        <label htmlFor="relationship" className="block text-sm font-medium text-gray-700 mb-2">
          Your Relationship to This Person
        </label>
        <select
          id="relationship"
          value={relationshipType}
          onChange={(e) => onRelationshipChange(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-slate-50/50"
          disabled={disabled}
        >
          <option value="">Select relationship type...</option>
          {relationshipTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      {/* Generate Button */}
      <div className="flex justify-end items-center pt-2">
        <button
          type="submit"
          disabled={!canGenerate}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg min-w-[180px] justify-center"
        >
          {loading ? (
            <LoadingSpinner />
          ) : (
            <>
              <ChatBubbleLeftRightIcon className="h-5 w-5" />
              Generate Scripts
            </>
          )}
        </button>
      </div>
    </form>
  );
}