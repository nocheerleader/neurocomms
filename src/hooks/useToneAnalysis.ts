import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { analyzeToneAPI } from '../services/toneAnalysis';
import { supabase } from '../lib/supabase';

export interface ToneAnalysisResult {
  id: string;
  tones: {
    professional: number;
    friendly: number;
    urgent: number;
    neutral: number;
  };
  confidence: number;
  explanation: string;
  suggestions: string[];
  processing_time_ms: number;
}

export interface AnalysisHistoryItem {
  id: string;
  input_text: string;
  title: string | null;
  analysis_result: any;
  confidence_score: number | null;
  created_at: string;
}

export function useToneAnalysis() {
  const { user } = useAuth();
  const [inputText, setInputText] = useState('');
  const [analysisResult, setAnalysisResult] = useState<ToneAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisHistory, setAnalysisHistory] = useState<AnalysisHistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [savingTitle, setSavingTitle] = useState(false);

  // Fetch analysis history on component mount
  useEffect(() => {
    if (user) {
      fetchAnalysisHistory();
    }
  }, [user]);

  const fetchAnalysisHistory = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('tone_analyses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setAnalysisHistory(data || []);
    } catch (err) {
      console.error('Error fetching analysis history:', err);
    }
  };

  const analyzeTone = async (text: string) => {
    if (!user || !text.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const startTime = Date.now();
      const result = await analyzeToneAPI(text);
      const processingTime = Date.now() - startTime;

      // Create the analysis result object
      const analysisResult: ToneAnalysisResult = {
        id: result.id,
        tones: result.tones,
        confidence: result.confidence,
        explanation: result.explanation,
        suggestions: result.suggestions,
        processing_time_ms: processingTime
      };

      setAnalysisResult(analysisResult);

      // Refresh history to include the new analysis
      await fetchAnalysisHistory();

    } catch (err: any) {
      console.error('Tone analysis error:', err);
      
      if (err.message?.includes('usage limit')) {
        setError('Daily usage limit reached. Upgrade to Premium for unlimited analyses or try again tomorrow.');
      } else if (err.message?.includes('content moderation')) {
        setError('This message contains inappropriate content and cannot be analyzed.');
      } else {
        setError('Failed to analyze tone. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setAnalysisResult(null);
    setError(null);
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
      setAnalysisHistory(prev => prev.filter(item => item.id !== analysisId));
    } catch (err) {
      console.error('Error deleting analysis:', err);
    }
  };

  const saveAnalysisMetadata = async (analysisId: string, title: string) => {
    if (!user) return { error: 'No user logged in' };

    try {
      setSavingTitle(true);
      const { data, error } = await supabase
        .from('tone_analyses')
        .update({ title: title.trim() })
        .eq('id', analysisId)
        .eq('user_id', user.id)
        .select()
        .maybeSingle();

      if (error) throw error;

      // Check if the record was found and updated
      if (!data) {
        return { data: null, error: 'Analysis record not found or you do not have permission to update it' };
      }
      // Update the analysis history to reflect the new title
      setAnalysisHistory(prev => 
        prev.map(item => 
          item.id === analysisId 
            ? { ...item, title: title.trim() }
            : item
        )
      );

      return { data, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save title';
      return { data: null, error: errorMessage };
    } finally {
      setSavingTitle(false);
    }
  };

  return {
    inputText,
    setInputText,
    analysisResult,
    loading,
    error,
    analyzeTone,
    clearResults,
    analysisHistory,
    showHistory,
    setShowHistory,
    deleteAnalysis,
    refreshHistory: fetchAnalysisHistory,
    saveAnalysisMetadata,
    savingTitle
  };
}