import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '../lib/supabase';

export interface AnalysisHistoryItem {
  id: string;
  input_text: string;
  title: string | null;
  analysis_result: any;
  confidence_score: number | null;
  created_at: string;
}

export function useAnalysisHistory() {
  const { user } = useAuth();
  const [history, setHistory] = useState<AnalysisHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchHistory();
    } else {
      setHistory([]);
      setLoading(false);
    }
  }, [user]);

  const fetchHistory = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('tone_analyses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setHistory(data || []);
    } catch (err) {
      console.error('Error fetching analysis history:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch history');
    } finally {
      setLoading(false);
    }
  };

  const deleteAnalysis = async (analysisId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('tone_analyses')
        .delete()
        .eq('id', analysisId)
        .eq('user_id', user.id);

      if (error) throw error;

      // Remove from local state
      setHistory(prev => prev.filter(item => item.id !== analysisId));
    } catch (err) {
      console.error('Error deleting analysis:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete analysis');
    }
  };

  const searchHistory = (searchTerm: string) => {
    if (!searchTerm.trim()) return history;
    
    return history.filter(item =>
      item.input_text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.title && item.title.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };

  const getAnalysisInsights = () => {
    if (history.length === 0) return null;

    const totalAnalyses = history.length;
    const avgConfidence = history.reduce((sum, item) => 
      sum + (item.confidence_score || 0), 0) / totalAnalyses;

    // Calculate tone distribution
    const toneDistribution = history.reduce((acc, item) => {
      const tones = item.analysis_result?.tones || {};
      Object.entries(tones).forEach(([tone, percentage]) => {
        acc[tone] = (acc[tone] || 0) + (percentage as number);
      });
      return acc;
    }, {} as Record<string, number>);

    // Average the tone percentages
    Object.keys(toneDistribution).forEach(tone => {
      toneDistribution[tone] = toneDistribution[tone] / totalAnalyses;
    });

    return {
      totalAnalyses,
      avgConfidence: Math.round(avgConfidence * 100),
      toneDistribution,
      recentAnalyses: history.slice(0, 5)
    };
  };

  return {
    history,
    loading,
    error,
    fetchHistory,
    deleteAnalysis,
    searchHistory,
    insights: getAnalysisInsights()
  };
}