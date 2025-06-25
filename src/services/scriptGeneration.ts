import { supabase } from '../lib/supabase';

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
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.access_token) {
    throw new Error('No authentication token found');
  }

  if (!situationContext.trim()) {
    throw new Error('Situation context is required');
  }

  if (!relationshipType) {
    throw new Error('Relationship type is required');
  }

  if (situationContext.length > 1000) {
    throw new Error('Situation description too long (maximum 1000 characters)');
  }

  const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-scripts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({ 
      situation_context: situationContext,
      relationship_type: relationshipType
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    
    if (response.status === 429) {
      throw new Error('Daily usage limit exceeded. Upgrade to Premium for unlimited script generations.');
    }
    
    if (response.status === 408) {
      throw new Error('Script generation timeout. Please try again.');
    }
    
    if (response.status === 400 && errorData.reason) {
      throw new Error(`Content moderation failed: ${errorData.reason}`);
    }
    
    throw new Error(errorData.error || 'Failed to generate scripts');
  }

  const result = await response.json();
  
  // Validate that the response contains a valid ID
  if (!result.id || typeof result.id !== 'string') {
    throw new Error('Server response missing valid generation ID. Please try again.');
  }
  
  return result;
}