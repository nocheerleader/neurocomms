import React from 'react';
import { ChartBarIcon, ChatBubbleLeftRightIcon, SpeakerWaveIcon, ArrowUpIcon } from '@heroicons/react/24/outline';
import { useUsageData } from '../../hooks/useUsageData';
import { useSubscription } from '../../hooks/useSubscription';
import { LoadingSpinner } from '../atoms/LoadingSpinner';

export function UsageOverview() {
  const { isPremium } = useSubscription();
  const { usageData, loading, error, getUsageLimits, isNearLimit, hasHitAnyLimit } = useUsageData();

  if (loading) {
    return (
      <div className="bg-card rounded-lg shadow p-6">
        <div className="flex items-center justify-center">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-card rounded-lg shadow p-6">
        <p className="text-destructive text-sm">Failed to load usage data</p>
      </div>
    );
  }

  const limits = getUsageLimits(isPremium);
  const nearLimit = isNearLimit(isPremium);
  const hitLimit = hasHitAnyLimit(isPremium);

  const formatUsage = (used: number, limit: number | 'unlimited') => {
    if (limit === 'unlimited') return `${used} / unlimited`;
    return `${used} / ${limit}`;
  };

  const getUsageColor = (used: number, limit: number | 'unlimited') => {
    if (limit === 'unlimited') return 'text-green-600';
    const percentage = used / (limit as number);
    if (percentage >= 1) return 'text-destructive';
    if (percentage >= 0.8) return 'text-yellow-600';
    return 'text-foreground';
  };

  return (
    <div className="bg-card rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Today's Usage</h3>
        {!isPremium && (nearLimit || hitLimit) && (
          <button
            onClick={() => window.location.href = '/profile#pricing'}
            className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
          >
            <ArrowUpIcon className="h-3 w-3" />
            Upgrade
          </button>
        )}
      </div>

      <div className="space-y-4">
        {/* Tone Analyses */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ChartBarIcon className="h-5 w-5 text-primary" />
            <span className="text-sm text-muted-foreground">Tone Analyses</span>
          </div>
          <span className={`text-sm font-medium ${getUsageColor(limits.toneAnalyses.used, limits.toneAnalyses.limit)}`}>
            {formatUsage(limits.toneAnalyses.used, limits.toneAnalyses.limit)}
          </span>
        </div>

        {/* Script Generations */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ChatBubbleLeftRightIcon className="h-5 w-5 text-primary" />
            <span className="text-sm text-muted-foreground">Script Generations</span>
          </div>
          <span className={`text-sm font-medium ${getUsageColor(limits.scriptGenerations.used, limits.scriptGenerations.limit)}`}>
            {formatUsage(limits.scriptGenerations.used, limits.scriptGenerations.limit)}
          </span>
        </div>

        {/* Voice Syntheses (Premium only) */}
        {isPremium && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <SpeakerWaveIcon className="h-5 w-5 text-chart-5" />
                <span className="text-sm text-muted-foreground">Voice Syntheses</span>
              </div>
              <span className={`text-sm font-medium ${getUsageColor(limits.voiceSyntheses.usedMonthly, limits.voiceSyntheses.monthlyLimit)}`}>
                {limits.voiceSyntheses.usedMonthly} / {limits.voiceSyntheses.monthlyLimit} monthly
              </span>
            </div>
            <div className="text-xs text-muted-foreground ml-8">
              Today: {limits.voiceSyntheses.usedToday}
            </div>
          </div>
        )}
      </div>

      {/* Usage Warnings */}
      {!isPremium && nearLimit && !hitLimit && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800 text-sm font-medium">
            You're approaching your daily limits. Consider upgrading for unlimited access.
          </p>
        </div>
      )}

      {!isPremium && hitLimit && (
        <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-destructive text-sm font-medium">
            You've reached your daily limit. Upgrade to Premium for unlimited access.
          </p>
        </div>
      )}
    </div>
  );
}