import React from 'react';

interface ToneCategoryProps {
  name: string;
  percentage: number;
  color: 'blue' | 'green' | 'red' | 'gray';
  description: string;
}

export function ToneCategory({ name, percentage, color, description }: ToneCategoryProps) {
  const getColorClasses = () => {
    switch (color) {
      case 'blue':
        return {
          bg: 'bg-blue-500',
          lightBg: 'bg-blue-50',
          text: 'text-blue-700',
          border: 'border-blue-200',
        };
      case 'green':
        return {
          bg: 'bg-green-500',
          lightBg: 'bg-green-50',
          text: 'text-green-700',
          border: 'border-green-200',
        };
      case 'red':
        return {
          bg: 'bg-red-500',
          lightBg: 'bg-red-50',
          text: 'text-red-700',
          border: 'border-red-200',
        };
      case 'gray':
        return {
          bg: 'bg-gray-500',
          lightBg: 'bg-gray-50',
          text: 'text-gray-700',
          border: 'border-gray-200',
        };
    }
  };

  const colors = getColorClasses();

  return (
    <div className={`p-4 rounded-lg border ${colors.lightBg} ${colors.border}`}>
      <div className="flex items-center justify-between mb-2">
        <span className={`font-medium ${colors.text}`}>{name}</span>
        <span className={`text-lg font-bold ${colors.text}`}>{percentage}%</span>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
        <div 
          className={`h-2 rounded-full transition-all duration-500 ease-out ${colors.bg}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      <p className="text-xs text-gray-600">{description}</p>
    </div>
  );
}