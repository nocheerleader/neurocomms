import { useState } from 'react';
import { useAuth } from './useAuth';
import { analyzeToneAPI } from '../services/toneAnalysis';

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

export function useToneAnalysis() {
  const { user } = useAuth();
  const [inputText, setInputText] = useState('');
  const [analysisResult, setAnalysisResult] = useState<ToneAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeTone = async (text: string) => {
    if (!user || !text.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const startTime = Date.now();
      const result = await analyzeToneAPI(text);
      const processingTime = Date.now() - startTime;

      // Validate that we received a valid analysis ID
      if (!result.id || typeof result.id !== 'string') {
        throw new Error('Server did not return a valid analysis ID. Please try again.');
      }

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

  return {
    inputText,
    setInputText,
    analysisResult,
    loading,
    error,
    analyzeTone,
    clearResults
  };
}