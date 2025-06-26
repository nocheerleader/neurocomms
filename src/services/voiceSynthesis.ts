import { supabase } from '../lib/supabase';

export async function synthesizeVoiceAPI(text: string, voice: string, speed: number): Promise<Blob> {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.access_token) {
    throw new Error('No authentication token found');
  }

  if (!text.trim()) {
    throw new Error('Text is required');
  }

  if (text.length > 1000) {
    throw new Error('Text too long (maximum 1000 characters)');
  }

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
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    
    if (response.status === 429) {
      throw new Error('Monthly usage limit exceeded.');
    }
    
    if (response.status === 408) {
      throw new Error('Voice synthesis timeout. Please try again.');
    }
    
    if (response.status === 403) {
      throw new Error('Premium subscription required for voice synthesis.');
    }
    
    throw new Error(errorData.error || 'Failed to synthesize voice');
  }

  // Return the audio blob
  const audioBlob = await response.blob();
  
  if (audioBlob.size === 0) {
    throw new Error('Received empty audio response');
  }
  
  return audioBlob;
}