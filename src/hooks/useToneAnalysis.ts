import { useState } from 'react';
import { useAuth } from './useAuth';
import { analyzeToneAPI } from '../services/toneAnalysis';
import { CustomError, logError } from '../utils/errorHandling';

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
        throw new CustomError(
          'Invalid server response',
          'server',
          'The server returned an invalid response. Please try again.'
        );
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

    } catch (err) {
      console.error('Tone analysis error:', err);
      
      if (err instanceof CustomError) {
        setError(err.userMessage);
        logError(err, { action: 'analyzeTone', textLength: text.length });
      } else {
        const error = err as Error;
        setError('An unexpected error occurred. Please try again.');
        logError(error as any, { action: 'analyzeTone', textLength: text.length });
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