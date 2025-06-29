import React from 'react';
import { ChartBarIcon, BookOpenIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';
import { useProfile } from '../../hooks/useProfile';
import { LoadingSpinner } from '../atoms/LoadingSpinner';

export function QuickStats() {
  const { profile, loading } = useProfile();

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-center">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  const memberSince = profile?.created_at 
    ? new Date(profile.created_at).toLocaleDateString('en-US', { 
        month: 'long', 
        year: 'numeric' 
      })
    : 'Unknown';

  const stats = [
    {
      icon: CalendarDaysIcon,
      label: 'Member Since',
      value: memberSince,
      color: 'text-primary'
    },
    {
      icon: ChartBarIcon,
      label: 'Assessment Status',
      value: profile?.onboarding_completed ? 'Complete' : 'Pending',
      color: profile?.onboarding_completed ? 'text-chart-2' : 'text-yellow-600'
    },
    {
      icon: BookOpenIcon,
      label: 'Account Type',
      value: profile?.subscription_tier === 'premium' ? 'Premium' : 'Free',
      color: profile?.subscription_tier === 'premium' ? 'text-primary'
    }
  ];

  return (
    <div className="bg-card rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Quick Stats</h3>
      <div className="space-y-4">
        {stats.map((stat, index) => (
          <div key={index} className="flex items-center gap-3">
            <stat.icon className={`h-5 w-5 ${stat.color}`} />
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className={`font-medium ${stat.color}`}>{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}