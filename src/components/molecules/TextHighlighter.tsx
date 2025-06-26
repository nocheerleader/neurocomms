import React from 'react';

interface TextHighlighterProps {
  text: string;
  currentWordIndex: number;
}

export function TextHighlighter({ text, currentWordIndex }: TextHighlighterProps) {
  const words = text.split(/(\s+)/); // Split on whitespace but keep the whitespace
  
  return (
    <div className="text-gray-900 leading-relaxed text-lg">
      {words.map((word, index) => {
        // Only highlight actual words (not whitespace)
        const isWord = /\S/.test(word);
        const wordIndex = isWord ? Math.floor(index / 2) : -1;
        const isCurrentWord = isWord && wordIndex === currentWordIndex;
        
        return (
          <span
            key={index}
            className={`transition-all duration-200 ${
              isCurrentWord
                ? 'bg-purple-200 text-purple-900 font-medium rounded px-1'
                : ''
            }`}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
}