import React, { useState } from 'react';
import { ClockIcon, TrashIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { AnalysisHistoryItem } from '../../hooks/useToneAnalysis';

interface AnalysisHistoryProps {
  history: AnalysisHistoryItem[];
  onSelectAnalysis: (analysis: AnalysisHistoryItem) => void;
  onDeleteAnalysis?: (analysisId: string) => void;
}

export function AnalysisHistory({ history, onSelectAnalysis, onDeleteAnalysis }: AnalysisHistoryProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredHistory = history.filter(item =>
    item.input_text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return date.toLocaleDateString();
  };

  const truncateText = (text: string, maxLength = 80) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  const getTopTone = (analysisResult: any) => {
    if (!analysisResult?.tones) return { name: 'Unknown', percentage: 0 };
    
    const tones = analysisResult.tones;
    const topTone = Object.entries(tones).reduce((max, [name, percentage]) => 
      (percentage as number) > max.percentage ? { name, percentage: percentage as number } : max,
      { name: '', percentage: 0 }
    );
    
    return topTone;
  };

  if (history.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-3 mb-4">
          <ClockIcon className="h-6 w-6 text-gray-700" />
          <h3 className="text-lg font-semibold text-gray-900">Analysis History</h3>
        </div>
        <div className="text-center py-8">
          <ClockIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No analyses yet</p>
          <p className="text-sm text-gray-500 mt-1">
            Your past tone analyses will appear here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <ClockIcon className="h-6 w-6 text-gray-700" />
          <h3 className="text-lg font-semibold text-gray-900">Analysis History</h3>
        </div>
        
        {/* Search */}
        <div className="relative">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search analyses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-transparent"
          />
        </div>
      </div>

      {/* History List */}
      <div className="max-h-96 overflow-y-auto">
        {filteredHistory.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-gray-600">No analyses match your search</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredHistory.map((item) => {
              const topTone = getTopTone(item.analysis_result);
              
              return (
                <div
                  key={item.id}
                  className="p-4 hover:bg-gray-50 cursor-pointer transition-colors group"
                  onClick={() => onSelectAnalysis(item)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 font-medium mb-1">
                        {truncateText(item.input_text)}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span>{formatDate(item.created_at)}</span>
                        {topTone.name !== 'Unknown' && (
                          <>
                            <span>•</span>
                            <span className="capitalize">
                              {topTone.name} ({topTone.percentage}%)
                            </span>
                          </>
                        )}
                        {item.confidence_score && (
                          <>
                            <span>•</span>
                            <span>
                              {Math.round(item.confidence_score * 100)}% confidence
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    
                    {onDeleteAnalysis && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteAnalysis(item.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-600 transition-all"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}