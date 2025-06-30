import { supabase } from '../lib/supabase';
import { handleApiError, withRetry, CustomError, ErrorType } from '../utils/errorHandling';
import * as Sentry from '@sentry/react';

export interface ScriptGenerationResponse {
  id: string;
  responses: {
    casual: {
      content: string;
      explanation: string;
      confidence: number;
    };
    professional: {
      content: string;
      explanation: string;
      confidence: number;
    };
    direct: {
      content: string;
      explanation: string;
      confidence: number;
    };
  };
  processing_time_ms: number;
}

export async function generateScriptAPI(situationContext: string, relationshipType: string): Promise<ScriptGenerationResponse> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.access_token) {
      throw new CustomError(
        'No authentication token found',
        ErrorType.AUTH,
        'Your session has expired. Please sign in again.'
      );
    }

    if (!situationContext.trim()) {
      throw new CustomError(
        'Situation context is required',
        ErrorType.VALIDATION,
        'Please describe the situation you need help with.'
      );
    }

    if (!relationshipType) {
      throw new CustomError(
        'Relationship type is required',
        ErrorType.VALIDATION,
        'Please select your relationship to the person you\'re communicating with.'
      );
    }

    if (situationContext.length > 1000) {
      throw new CustomError(
        'Situation description too long (maximum 1000 characters)',
        ErrorType.VALIDATION,
        'The situation description is too long. Please keep it under 1000 characters.'
      );
    }

    return await withRetry(async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 45000); // 45 second timeout

      try {
        const response = await Sentry.startSpan(
          {
            op: 'http.client',
            name: 'POST /generate-scripts',
          },
          async () => {
            return await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-scripts`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.access_token}`,
              },
              body: JSON.stringify({ 
                situation_context: situationContext,
                relationship_type: relationshipType
              }),
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
              'You have reached your daily limit for script generation. Upgrade to Premium for unlimited access.',
              429
            );
          }
          
          if (response.status === 408) {
            throw new CustomError(
              'Request timeout',
              ErrorType.NETWORK,
              'The script generation took too long to complete. Please try again with a shorter description.',
              408
            );
          }
          
          if (response.status === 400 && errorData.reason) {
            throw new CustomError(
              `Content moderation failed: ${errorData.reason}`,
              ErrorType.VALIDATION,
              'The situation description contains inappropriate content. Please modify your text and try again.'
            );
          }

          throw new CustomError(
            errorData.error || 'Failed to generate scripts',
            ErrorType.SERVER,
            'The script generation service is temporarily unavailable. Please try again.',
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
        
        throw handleApiError(error, { 
          action: 'generateScript', 
          situationLength: situationContext.length,
          relationshipType 
        });
      }
    }, 2); // Retry up to 2 times for network errors
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw handleApiError(error, { action: 'generateScript' });
  }
}