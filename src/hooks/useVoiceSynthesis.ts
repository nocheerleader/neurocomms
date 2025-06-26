import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { synthesizeVoiceAPI } from '../services/voiceSynthesis';
import { CustomError, logError } from '../utils/errorHandling';

export function useVoiceSynthesis() {
  const { user } = useAuth();
  const [inputText, setInputText] = useState('');
  const [selectedVoice, setSelectedVoice] = useState('professional');
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usageCount, setUsageCount] = useState(0);

  useEffect(() => {
    // In a real implementation, fetch current usage from backend
    // For now, simulate usage tracking
    const fetchUsage = async () => {
      // This would be replaced with actual API call
      setUsageCount(0);
    };

    if (user) {
      fetchUsage();
    }
  }, [user]);

  const synthesizeVoice = async (text: string, voice: string, speed: number) => {
    if (!user || !text.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const audioBlob = await synthesizeVoiceAPI(text, voice, speed);
      
      // Create object URL for the audio blob
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);
      
      // Update usage count
      setUsageCount(prev => prev + 1);

    } catch (err) {
      console.error('Voice synthesis error:', err);
      
      if (err instanceof CustomError) {
        setError(err.userMessage);
        logError(err, { 
          action: 'synthesizeVoice', 
          textLength: text.length,
          voice,
          speed 
        });
      } else {
        const error = err as Error;
        setError('An unexpected error occurred. Please try again.');
        logError(error as any, { 
          action: 'synthesizeVoice', 
          textLength: text.length,
          voice,
          speed 
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const clearAudio = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    setError(null);
  };

  return {
    inputText,
    setInputText,
    selectedVoice,
    setSelectedVoice,
    playbackSpeed,
    setPlaybackSpeed,
    audioUrl,
    loading,
    error,
    synthesizeVoice,
    clearAudio,
    usageCount
  };
}