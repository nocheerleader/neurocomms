import React, { useState, useRef, useEffect } from 'react';
import { PlayIcon, PauseIcon, ArrowDownTrayIcon, XMarkIcon, SpeakerWaveIcon } from '@heroicons/react/24/outline';
import { TextHighlighter } from '../molecules/TextHighlighter';

interface AudioPlayerProps {
  audioUrl: string;
  text: string;
  playbackSpeed: number;
  onClose: () => void;
}

export function AudioPlayer({ audioUrl, text, playbackSpeed, onClose }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => { setIsPlaying(false); setCurrentWordIndex(-1); };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);
    audio.playbackRate = playbackSpeed;

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [playbackSpeed]);

  useEffect(() => {
    if (duration > 0 && text) {
      const words = text.split(/\s+/);
      const progress = currentTime / duration;
      const wordIndex = Math.floor(progress * words.length);
      setCurrentWordIndex(Math.min(wordIndex, words.length - 1));
    }
  }, [currentTime, duration, text]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;
    isPlaying ? audio.pause() : audio.play();
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const newTime = (parseFloat(e.target.value) / 100) * duration;
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = audioUrl;
    link.download = `elucidare-voice-practice.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const primaryColor = '#E05D38';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-lg">
            <SpeakerWaveIcon className="h-5 w-5 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Your Practice Audio</h3>
        </div>
        <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full">
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>

      <audio ref={audioRef} src={audioUrl} preload="metadata" autoPlay />

      {/* IMPROVED EXPLANATION SECTION */}
      <div className="bg-slate-50/50 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Practice Text</h4>
        <p className="text-sm text-gray-600 mb-3">
          As the audio plays, the current word will be highlighted below. This helps you follow along and match your speaking pace.
        </p>
        <TextHighlighter text={text} currentWordIndex={isPlaying ? currentWordIndex : -1} />
      </div>

      <div className="bg-slate-50/50 rounded-lg p-4">
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={handleSeek}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, ${primaryColor} 0%, ${primaryColor} ${progress}%, #e5e7eb ${progress}%, #e5e7eb 100%)`
            }}
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={togglePlayPause} className="flex items-center justify-center w-12 h-12 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors shadow-lg">
              {isPlaying ? <PauseIcon className="h-6 w-6" /> : <PlayIcon className="h-6 w-6 ml-1" />}
            </button>
            <div className="text-sm text-gray-600">Speed: {playbackSpeed}x</div>
          </div>
          <button onClick={handleDownload} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
            <ArrowDownTrayIcon className="h-4 w-4" />
            Download
          </button>
        </div>
      </div>
    </div>
  );
}