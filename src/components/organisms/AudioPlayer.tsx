import React, { useState, useRef, useEffect } from 'react';
import { 
  PlayIcon, 
  PauseIcon, 
  ArrowDownTrayIcon, 
  XMarkIcon,
  SpeakerWaveIcon 
} from '@heroicons/react/24/outline';
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
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentWordIndex(-1);
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    // Set playback rate
    audio.playbackRate = playbackSpeed;

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [playbackSpeed]);

  // Calculate word highlighting based on audio progress
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

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
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
    link.download = `voice-practice-${Date.now()}.mp3`;
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-purple-100 p-2 rounded-lg">
            <SpeakerWaveIcon className="h-5 w-5 text-purple-700" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Voice Practice Player</h3>
        </div>
        <button
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>

      {/* Audio Element */}
      <audio ref={audioRef} src={audioUrl} preload="metadata" />

      {/* Text with Highlighting */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Practice Text</h4>
        <TextHighlighter 
          text={text} 
          currentWordIndex={isPlaying ? currentWordIndex : -1} 
        />
      </div>

      {/* Audio Controls */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        {/* Progress Bar */}
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
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, #7c3aed 0%, #7c3aed ${progress}%, #e5e7eb ${progress}%, #e5e7eb 100%)`
            }}
          />
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Play/Pause Button */}
            <button
              onClick={togglePlayPause}
              className="flex items-center justify-center w-12 h-12 bg-purple-700 text-white rounded-full hover:bg-purple-800 transition-colors"
            >
              {isPlaying ? (
                <PauseIcon className="h-6 w-6" />
              ) : (
                <PlayIcon className="h-6 w-6 ml-1" />
              )}
            </button>

            {/* Speed Display */}
            <div className="text-sm text-gray-600">
              Speed: {playbackSpeed}x
            </div>
          </div>

          {/* Download Button */}
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <ArrowDownTrayIcon className="h-4 w-4" />
            Download
          </button>
        </div>
      </div>

      {/* Usage Tip */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">Practice Tips</h4>
        <ul className="text-blue-800 text-sm space-y-1">
          <li>• Follow along with the highlighted text as it plays</li>
          <li>• Practice speaking along with the audio</li>
          <li>• Repeat sections by dragging the progress bar</li>
          <li>• Download the audio to practice offline</li>
        </ul>
      </div>
    </div>
  );
}