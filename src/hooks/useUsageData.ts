import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '../lib/supabase';

interface UsageData {
  toneAnalysesCount: number;
  scriptGenerationsCount: number;
  voiceSynthesesCount: number;
  voiceSynthesesMonthly: number;
  date: string;
}

interface UsageLimits {
  toneAnalyses: {
    used: number;
    limit: number | 'unlimited';
    remaining: number | 'unlimited';
  };
  scriptGenerations: {
    used: number;
    limit: number | 'unlimited';
    remaining: number | 'unlimited';
  };
  voiceSyntheses: {
    usedToday: number;
    usedMonthly: number;
    monthlyLimit: number;
    remainingMonthly: number;
  };
}

export function useUsageData() {
  const { user } = useAuth();
  const [usageData, setUsageData] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchUsageData();
    } else {
      setUsageData(null);
      setLoading(false);
    }
  }, [user]);

  const fetchUsageData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      // Get today's date
      const today = new Date().toISOString().split('T')[0];

      // Fetch today's usage data
      const { data, error: usageError } = await supabase
        .from('daily_usage')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .maybeSingle();

      if (usageError) throw usageError;

      // If no record exists for today, create default data
      const defaultUsage: UsageData = {
        toneAnalysesCount: 0,
        scriptGenerationsCount: 0,
        voiceSynthesesCount: 0,
        voiceSynthesesMonthly: 0,
        date: today
      };

      setUsageData(data ? {
        toneAnalysesCount: data.tone_analyses_count,
        scriptGenerationsCount: data.script_generations_count,
        voiceSynthesesCount: data.voice_syntheses_count,
        voiceSynthesesMonthly: data.voice_syntheses_monthly,
        date: data.date
      } : defaultUsage);

    } catch (err) {
      console.error('Error fetching usage data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch usage data');
    } finally {
      setLoading(false);
    }
  };

  const getUsageLimits = (isPremium: boolean): UsageLimits => {
    if (!usageData) {
      return {
        toneAnalyses: { used: 0, limit: isPremium ? 'unlimited' : 5, remaining: isPremium ? 'unlimited' : 5 },
        scriptGenerations: { used: 0, limit: isPremium ? 'unlimited' : 3, remaining: isPremium ? 'unlimited' : 3 },
        voiceSyntheses: { usedToday: 0, usedMonthly: 0, monthlyLimit: isPremium ? 10 : 0, remainingMonthly: isPremium ? 10 : 0 }
      };
    }

    return {
      toneAnalyses: {
        used: usageData.toneAnalysesCount,
        limit: isPremium ? 'unlimited' : 5,
        remaining: isPremium ? 'unlimited' : Math.max(0, 5 - usageData.toneAnalysesCount)
      },
      scriptGenerations: {
        used: usageData.scriptGenerationsCount,
        limit: isPremium ? 'unlimited' : 3,
        remaining: isPremium ? 'unlimited' : Math.max(0, 3 - usageData.scriptGenerationsCount)
      },
      voiceSyntheses: {
        usedToday: usageData.voiceSynthesesCount,
        usedMonthly: usageData.voiceSynthesesMonthly,
        monthlyLimit: isPremium ? 10 : 0,
        remainingMonthly: isPremium ? Math.max(0, 10 - usageData.voiceSynthesesMonthly) : 0
      }
    };
  };

  const isNearLimit = (isPremium: boolean): boolean => {
    if (isPremium) return false;
    
    if (!usageData) return false;

    const toneAnalysesNearLimit = usageData.toneAnalysesCount >= 4; // 4 out of 5
    const scriptGenerationsNearLimit = usageData.scriptGenerationsCount >= 2; // 2 out of 3

    return toneAnalysesNearLimit || scriptGenerationsNearLimit;
  };

  const hasHitAnyLimit = (isPremium: boolean): boolean => {
    if (isPremium) {
      // Premium users can only hit voice synthesis limit
      return usageData ? usageData.voiceSynthesesMonthly >= 10 : false;
    }
    
    if (!usageData) return false;

    return usageData.toneAnalysesCount >= 5 || usageData.scriptGenerationsCount >= 3;
  };

  return {
    usageData,
    loading,
    error,
    getUsageLimits,
    isNearLimit,
    hasHitAnyLimit,
    refetch: fetchUsageData
  };
}