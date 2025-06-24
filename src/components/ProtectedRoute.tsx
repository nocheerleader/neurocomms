import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LoadingSpinner } from './atoms/LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Please sign in to continue
          </h2>
          <p className="text-gray-600">
            You need to be signed in to access this feature.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}