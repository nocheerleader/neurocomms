import React from 'react';

interface LoadingSpinnerProps {
  size?: string;
  color?: string;
}

export function LoadingSpinner({ 
  size = 'h-8 w-8', 
  color = 'border-blue-700' 
}: LoadingSpinnerProps) {
  return (
    <div className="flex items-center justify-center">
      <div 
        className={`animate-spin rounded-full border-b-2 ${size} ${color}`}
      ></div>
    </div>
  );
}