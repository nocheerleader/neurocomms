import React from 'react';
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import { LoadingSpinner } from '../atoms/LoadingSpinner';
import { TemplateSelector } from '../molecules/TemplateSelector';
import { useProfile } from '../../hooks/useProfile';
import { useSubscription } from '../../hooks/useSubscription';

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
  const { profile } = useProfile();
  const { isPremium } = useSubscription();
  
  const maxLength = 1000;
  const remainingChars = maxLength - situationContext.length;
  
  // For demo purposes, we'll simulate usage tracking
  // In a real implementation, this would come from the daily_usage table
  const usageCount = 0; // This would be fetched from the backend
  const dailyLimit = isPremium ? 'unlimited' : 3;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (situationContext.trim() && relationshipType && !loading) {
      onGenerate(situationContext, relationshipType);
    }
  };

  const isAtLimit = !isPremium && usageCount >= 3;
  const canGenerate = situationContext.trim().length > 0 && relationshipType && !loading && !isAtLimit;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Usage Counter */}
      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-600">
          Daily Usage: {usageCount} of {dailyLimit}
        </span>
        {!isPremium && usageCount >= 2 && (
          <span className="text-amber-600 font-medium">
            {3 - usageCount} generations remaining today
          </span>
        )}
      </div>

      {/* Template Selector */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Choose a Template (Optional)
        </label>
        <TemplateSelector onTemplateSelect={onSituationChange} />
      </div>

      {/* Situation Input */}
      <div>
        <label htmlFor="situation" className="block text-sm font-medium text-gray-700 mb-2">
          Describe Your Situation
        </label>
        <div className="relative">
          <textarea
            id="situation"
            value={situationContext}
            onChange={(e) => onSituationChange(e.target.value)}
            placeholder="Describe the situation you need to respond to. For example: 'My manager sent an email asking about the project deadline and it seems urgent, but I'm not sure if they're upset.'"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-transparent"
            rows={4}
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
              <span>{situationContext.length}/{maxLength}</span>
            )}
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
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-transparent"
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
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600">
          {!isPremium && (
            <p>Free plan: {3 - usageCount} generations remaining today</p>
          )}
        </div>
        
        <button
          type="submit"
          disabled={!canGenerate}
          className="flex items-center gap-2 px-6 py-3 bg-blue-700 text-white rounded-lg font-medium hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-w-[160px] justify-center"
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

      {/* Upgrade Prompt for Free Users Near Limit */}
      {!isPremium && usageCount >= 2 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="bg-amber-100 p-2 rounded-lg">
              <ChatBubbleLeftRightIcon className="h-5 w-5 text-amber-700" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-amber-900">Running low on generations</h4>
              <p className="text-amber-800 text-sm mt-1">
                You have {3 - usageCount} script generations left today. Upgrade to Premium for unlimited generations.
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
              <ChatBubbleLeftRightIcon className="h-5 w-5 text-red-700" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-red-900">Daily limit reached</h4>
              <p className="text-red-800 text-sm mt-1">
                You've used all 3 daily script generations. Upgrade to Premium for unlimited access or try again tomorrow.
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