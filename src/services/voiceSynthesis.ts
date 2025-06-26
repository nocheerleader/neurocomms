import { supabase } from '../lib/supabase';
import { handleApiError, withRetry, CustomError, ErrorType } from '../utils/errorHandling';

export async function synthesizeVoiceAPI(text: string, voice: string, speed: number): Promise<Blob> {
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
        'Please enter some text to convert to speech.'
      );
    }

    if (text.length > 1000) {
      throw new CustomError(
        'Text too long (maximum 1000 characters)',
        ErrorType.VALIDATION,
        'The text is too long for voice synthesis. Please keep it under 1000 characters.'
      );
    }

    return await withRetry(async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout

      try {
        const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/synthesize-voice`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ 
            text,
            voice,
            speed
          }),
          signal: controller.signal,
        });
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Unknown server error' }));
          
          if (response.status === 429) {
            throw new CustomError(
              'Usage limit exceeded',
              ErrorType.RATE_LIMIT,
              'You have reached your monthly limit for voice synthesis. Your limit will reset next month.',
              429
            );
          }
          
          if (response.status === 408) {
            throw new CustomError(
              'Request timeout',
              ErrorType.NETWORK,
              'Voice synthesis took too long to complete. Please try again with shorter text.',
              408
            );
          }
          
          if (response.status === 403) {
            throw new CustomError(
              'Premium subscription required',
              ErrorType.PERMISSION,
              'Voice synthesis is a Premium feature. Please upgrade your subscription to access this feature.',
              403
            );
          }

          throw new CustomError(
            errorData.error || 'Failed to synthesize voice',
            ErrorType.SERVER,
            'The voice synthesis service is temporarily unavailable. Please try again.',
            response.status
          );
        }
        clearTimeout(timeoutId);
        // Return the audio blob
        const audioBlob = await response.blob();
        
        if (audioBlob.size === 0) {
          throw new CustomError(
            'Empty audio response',
            ErrorType.SERVER,
            'The voice synthesis service returned empty audio. Please try again.'
          );
        }
        
        return audioBlob;
      } catch (error) {
        clearTimeout(timeoutId);
        
        if (error instanceof CustomError) {
          throw error;
        }
        
        throw handleApiError(error, { 
          action: 'synthesizeVoice', 
          textLength: text.length,
          voice,
          speed 
        });
      }
    }, 2); // Retry up to 2 times for network errors
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw handleApiError(error, { action: 'synthesizeVoice' });
  }
}