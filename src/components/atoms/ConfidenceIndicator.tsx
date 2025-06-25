import React from 'react';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';

interface ConfidenceIndicatorProps {
  score: number; // 0.0 to 1.0
}

export function ConfidenceIndicator({ score }: ConfidenceIndicatorProps) {
  // Convert 0-1 score to 1-5 stars
  const stars = Math.round(score * 5);
  const percentage = Math.round(score * 100);
  
  const getConfidenceText = () => {
    if (score >= 0.9) return 'Very High';
    if (score >= 0.7) return 'High';
    if (score >= 0.5) return 'Medium';
    if (score >= 0.3) return 'Low';
    return 'Very Low';
  };

  const getConfidenceColor = () => {
    if (score >= 0.7) return 'text-green-600';
    if (score >= 0.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="flex items-center gap-3">
      {/* Stars */}
      <div className="flex items-center gap-1">
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
      <div className="text-sm">
        <span className={`font-medium ${getConfidenceColor()}`}>
          {getConfidenceText()}
        </span>
        <span className="text-gray-500 ml-1">({percentage}%)</span>
      </div>
    </div>
  );
}