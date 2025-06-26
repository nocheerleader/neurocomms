import React from 'react';
import { 
  ExclamationTriangleIcon, 
  ArrowPathIcon, 
  HomeIcon,
  BugAntIcon 
} from '@heroicons/react/24/outline';

interface ErrorDisplayProps {
  error?: Error | null;
  onReset?: () => void;
  onRetry?: () => void;
  type?: 'boundary' | 'network' | 'auth' | 'generic';
  title?: string;
  message?: string;
  showDetails?: boolean;
}

export function ErrorDisplay({ 
  error, 
  onReset, 
  onRetry, 
  type = 'generic',
  title,
  message,
  showDetails = false
}: ErrorDisplayProps) {
  const getErrorConfig = () => {
    switch (type) {
      case 'boundary':
        return {
          title: 'Something went wrong',
          message: 'An unexpected error occurred. The page has been reset to prevent further issues.',
          icon: ExclamationTriangleIcon,
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200'
        };
      case 'network':
        return {
          title: 'Connection Problem',
          message: 'Unable to connect to our servers. Please check your internet connection and try again.',
          icon: ArrowPathIcon,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200'
        };
      case 'auth':
        return {
          title: 'Authentication Required',
          message: 'You need to sign in to continue using this feature.',
          icon: ExclamationTriangleIcon,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200'
        };
      default:
        return {
          title: 'Error',
          message: 'Something didn\'t work as expected. Please try again.',
          icon: ExclamationTriangleIcon,
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200'
        };
    }
  };

  const config = getErrorConfig();
  const IconComponent = config.icon;

  const handleGoHome = () => {
    window.location.href = '/profile';
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className={`min-h-[400px] flex items-center justify-center p-6`}>
      <div className={`max-w-md w-full ${config.bgColor} ${config.borderColor} border rounded-lg p-8 text-center`}>
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <IconComponent className={`h-12 w-12 ${config.color}`} />
        </div>

        {/* Title and Message */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {title || config.title}
        </h3>
        <p className="text-gray-600 mb-6 leading-relaxed">
          {message || config.message}
        </p>

        {/* Error Details (for development) */}
        {showDetails && error && (
          <div className="mb-6 p-3 bg-gray-100 border border-gray-200 rounded text-left">
            <h4 className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
              <BugAntIcon className="h-4 w-4" />
              Technical Details
            </h4>
            <p className="text-xs text-gray-600 font-mono break-words">
              {error.message}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          {/* Primary Action */}
          {onRetry && (
            <button
              onClick={onRetry}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-700 text-white rounded-lg font-medium hover:bg-blue-800 transition-colors"
            >
              <ArrowPathIcon className="h-4 w-4" />
              Try Again
            </button>
          )}

          {onReset && (
            <button
              onClick={onReset}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-700 text-white rounded-lg font-medium hover:bg-blue-800 transition-colors"
            >
              <ArrowPathIcon className="h-4 w-4" />
              Reset Page
            </button>
          )}

          {/* Secondary Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleGoHome}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              <HomeIcon className="h-4 w-4" />
              Go Home
            </button>
            <button
              onClick={handleRefresh}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              <ArrowPathIcon className="h-4 w-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* Help Text */}
        <p className="text-xs text-gray-500 mt-4">
          If this problem continues, please contact support with the details above.
        </p>
      </div>
    </div>
  );
}