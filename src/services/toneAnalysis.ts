import { supabase } from '../lib/supabase';

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
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.access_token) {
    throw new Error('No authentication token found');
  }

  if (!text.trim()) {
    throw new Error('Text is required');
  }

  if (text.length > 2000) {
    throw new Error('Text too long (maximum 2000 characters)');
  }

  const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-tone`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    
    if (response.status === 429) {
      throw new Error('Daily usage limit exceeded. Upgrade to Premium for unlimited analyses.');
    }
    
    if (response.status === 408) {
      throw new Error('Analysis timeout. Please try again.');
    }
    
    if (response.status === 400 && errorData.reason) {
      throw new Error(`Content moderation failed: ${errorData.reason}`);
    }
    
    throw new Error(errorData.error || 'Failed to analyze tone');
  }

  return response.json();
}