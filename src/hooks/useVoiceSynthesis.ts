import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { synthesizeVoiceAPI } from '../services/voiceSynthesis';

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

    } catch (err: any) {
      console.error('Voice synthesis error:', err);
      
      if (err.message?.includes('Premium subscription required')) {
        setError('Premium Plan Required: Voice Practice is a premium feature. Please upgrade to access AI-generated voice synthesis.');
      } else if (err.message?.includes('usage limit')) {
        setError('Monthly usage limit reached. Your limit will reset next month.');
      } else if (err.message?.includes('timeout')) {
        setError('Voice generation timeout. Please try again with shorter text.');
      } else {
        setError('Failed to generate voice. Please try again.');
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