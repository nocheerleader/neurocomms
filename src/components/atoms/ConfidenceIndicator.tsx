import React from 'react';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';
import { InformationCircleIcon } from '@heroicons/react/24/outline'; // Import the info icon

interface ConfidenceIndicatorProps {
  score: number; // 0.0 to 1.0
}

export function ConfidenceIndicator({ score }: ConfidenceIndicatorProps) {
  // Convert 0-1 score to 1-5 stars
  const stars = Math.round(score * 5);
  const percentage = Math.round(score * 100);
  
  // 1. Changed text to be more literal and actionable
  const getConfidenceText = () => {
    if (score >= 0.9) return 'Strong Match';
    if (score >= 0.7) return 'Good Match';
    if (score >= 0.5) return 'Fair Match';
    if (score >= 0.3) return 'Needs Review';
    return 'Use with Caution';
  };

  const getConfidenceColor = () => {
    if (score >= 0.7) return 'text-green-600';
    if (score >= 0.5) return 'text-yellow-600';
    return 'text-red-600';
  };
  
  // 2. Added a clear, literal explanation for the tooltip
  const tooltipText = "This shows how confident our AI is that this response is a good fit for your situation. A higher rating means the suggestion is more likely to be effective.";

  return (
    <div className="flex items-center gap-2" title={tooltipText}>
      {/* Stars */}
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <div key={star} className="relative">
            {star <= stars ? (
              <StarIcon className="h-5 w-5 text-yellow-400" />
            ) : (
              <StarOutlineIcon className="h-5 w-5 text-gray-300" />
            )}
          </div>
        ))}
      </div>
      
      {/* Text and Percentage */}
      <div className="text-sm flex items-center">
        <span className={`font-medium ${getConfidenceColor()}`}>
          {getConfidenceText()}
        </span>
        <span className="text-gray-500 ml-1">({percentage}%)</span>
        
        {/* 3. Added the info icon with the tooltip */}
        <InformationCircleIcon 
          className="h-4 w-4 text-gray-400 ml-1.5 cursor-help"
        />
      </div>
    </div>
  );
}