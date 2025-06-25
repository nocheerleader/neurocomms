import { useState } from 'react';
import { useAuth } from './useAuth';
import { generateScriptAPI } from '../services/scriptGeneration';

export interface ScriptGenerationResult {
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

export function useScriptGeneration() {
  const { user } = useAuth();
  const [situationContext, setSituationContext] = useState('');
  const [relationshipType, setRelationshipType] = useState('');
  const [generationResult, setGenerationResult] = useState<ScriptGenerationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateScripts = async (situation: string, relationship: string) => {
    if (!user || !situation.trim() || !relationship) return;

    setLoading(true);
    setError(null);

    try {
      const startTime = Date.now();
      const result = await generateScriptAPI(situation, relationship);
      const processingTime = Date.now() - startTime;

      // Validate that we received a valid generation ID
      if (!result.id || typeof result.id !== 'string') {
        throw new Error('Server did not return a valid generation ID. Please try again.');
      }

      // Create the generation result object
      const generationResult: ScriptGenerationResult = {
        id: result.id,
        responses: result.responses,
        processing_time_ms: processingTime
      };

      setGenerationResult(generationResult);

    } catch (err: any) {
      console.error('Script generation error:', err);
      
      if (err.message?.includes('usage limit')) {
        setError('Daily usage limit reached. Upgrade to Premium for unlimited script generations or try again tomorrow.');
      } else if (err.message?.includes('content moderation')) {
        setError('This content contains inappropriate language and cannot be processed.');
      } else {
        setError('Failed to generate scripts. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setGenerationResult(null);
    setError(null);
  };

  return {
    situationContext,
    setSituationContext,
    relationshipType,
    setRelationshipType,
    generationResult,
    loading,
    error,
    generateScripts,
    clearResults
  };
}