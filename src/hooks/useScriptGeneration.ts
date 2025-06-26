import { useState } from 'react';
import { useAuth } from './useAuth';
import { generateScriptAPI } from '../services/scriptGeneration';
import { CustomError, logError } from '../utils/errorHandling';

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
        throw new CustomError(
          'Invalid server response',
          'server',
          'The server returned an invalid response. Please try again.'
        );
      }

      // Create the generation result object
      const generationResult: ScriptGenerationResult = {
        id: result.id,
        responses: result.responses,
        processing_time_ms: processingTime
      };

      setGenerationResult(generationResult);

    } catch (err) {
      console.error('Script generation error:', err);
      
      if (err instanceof CustomError) {
        setError(err.userMessage);
        logError(err, { 
          action: 'generateScript', 
          situationLength: situation.length,
          relationshipType: relationship 
        });
      } else {
        const error = err as Error;
        setError('An unexpected error occurred. Please try again.');
        logError(error as any, { 
          action: 'generateScript', 
          situationLength: situation.length,
          relationshipType: relationship 
        });
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