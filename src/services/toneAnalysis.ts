import { supabase } from '../lib/supabase';
import { handleApiError, withRetry, CustomError, ErrorType } from '../utils/errorHandling';
import * as Sentry from '@sentry/react';

export interface ToneAnalysisResponse {
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

export async function analyzeToneAPI(text: string): Promise<ToneAnalysisResponse> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.access_token) {
      throw new CustomError(
        'No authentication token found',
        ErrorType.AUTH,
        'Your session has expired. Please sign in again.'
      );
    }

    if (!text.trim()) {
      throw new CustomError(
        'Text is required',
        ErrorType.VALIDATION,
        'Please enter some text to analyze.'
      );
    }

    if (text.length > 2000) {
      throw new CustomError(
        'Text too long (maximum 2000 characters)',
        ErrorType.VALIDATION,
        'The text is too long. Please keep it under 2000 characters.'
      );
    }

    return await withRetry(async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      try {
        const response = await Sentry.startSpan(
          {
            op: 'http.client',
            name: 'POST /analyze-tone',
          },
          async () => {
            return await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-tone`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.access_token}`,
              },
              body: JSON.stringify({ text }),
              signal: controller.signal,
            });
          }
        );
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Unknown server error' }));
          
          if (response.status === 429) {
            throw new CustomError(
              'Usage limit exceeded',
              ErrorType.RATE_LIMIT,
              'You have reached your daily limit for tone analysis. Upgrade to Premium for unlimited access.',
              429
            );
          }
          
          if (response.status === 408) {
            throw new CustomError(
              'Request timeout',
              ErrorType.NETWORK,
              'The analysis took too long to complete. Please try again.',
              408
            );
          }
          
          if (response.status === 400 && errorData.reason) {
            throw new CustomError(
              `Content moderation failed: ${errorData.reason}`,
              ErrorType.VALIDATION,
              'The text contains inappropriate content and cannot be analyzed. Please modify your text and try again.'
            );
          }

          throw new CustomError(
            errorData.error || 'Failed to analyze tone',
            ErrorType.SERVER,
            'The tone analysis service is temporarily unavailable. Please try again.',
            response.status
          );
        }
        clearTimeout(timeoutId);
        const result = await response.json();
        
        // Validate that the response contains a valid ID
        if (!result.id || typeof result.id !== 'string') {
          throw new CustomError(
            'Invalid server response',
            ErrorType.SERVER,
            'The server returned an invalid response. Please try again.'
          );
        }
        
        return result;
      } catch (error) {
        clearTimeout(timeoutId);
        
        if (error instanceof CustomError) {
          throw error;
        }
        
        throw handleApiError(error, { action: 'analyzeTone', textLength: text.length });
      }
    }, 2); // Retry up to 2 times for network errors
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw handleApiError(error, { action: 'analyzeTone' });
  }
}