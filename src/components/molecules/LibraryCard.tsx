import React, { useState } from 'react';
import { 
  ClipboardDocumentIcon, 
  PencilIcon, 
  TrashIcon,
  ClockIcon,
  TagIcon,
  EyeIcon 
} from '@heroicons/react/24/outline';
import { CopyButton } from '../atoms/CopyButton';
import { ScriptEditor } from '../organisms/ScriptEditor';
import { useScriptLibrary } from '../../hooks/useScriptLibrary';
import { Database } from '../../types/database.types';

type PersonalScript = Database['public']['Tables']['personal_scripts']['Row'];
type ScriptCategory = Database['public']['Tables']['script_categories']['Row'];

interface LibraryCardProps {
  script: PersonalScript;
  category: ScriptCategory | null;
}

export function LibraryCard({ script, category }: LibraryCardProps) {
  const { incrementUsage } = useScriptLibrary();
  const [showEditor, setShowEditor] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleCopy = () => {
    incrementUsage(script.id);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString();
  };

  const getPreviewText = (content: string, maxLength: number = 100) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow border border-gray-200 hover:shadow-md transition-shadow">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-gray-900 truncate">
                {script.title}
              </h3>
              {category && (
                <div className="flex items-center gap-1 mt-1">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="text-xs text-gray-600">{category.name}</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-1 ml-2">
              <button
                onClick={() => setShowPreview(true)}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                title="Preview script"
              >
                <EyeIcon className="h-4 w-4" />
              </button>
              <button
                onClick={() => setShowEditor(true)}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                title="Edit script"
              >
                <PencilIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Content Preview */}
        <div className="p-4">
          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            {getPreviewText(script.content)}
          </p>

          {/* Tags */}
          {script.tags && script.tags.length > 0 && (
            <div className="flex items-center gap-1 mb-4">
              <TagIcon className="h-4 w-4 text-gray-400" />
              <div className="flex flex-wrap gap-1">
                {script.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
                {script.tags.length > 3 && (
                  <span className="px-2 py-1 text-xs bg-gray-100 text-gray-500 rounded-full">
                    +{script.tags.length - 3}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
            <div className="flex items-center gap-3">
              <span>Used {script.usage_count} times</span>
              {script.last_used_at && (
                <div className="flex items-center gap-1">
                  <ClockIcon className="h-3 w-3" />
                  <span>Last used {formatDate(script.last_used_at)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <CopyButton 
              text={script.content} 
              className="text-xs"
              onCopy={handleCopy}
            />
            
            <button
              onClick={() => setShowEditor(true)}
              className="px-3 py-1 text-xs font-medium text-blue-700 hover:text-blue-800 transition-colors"
            >
              Edit
            </button>
          </div>
        </div>
      </div>

      {/* Script Editor Modal */}
      {showEditor && (
        <ScriptEditor 
          script={script}
          onClose={() => setShowEditor(false)}
        />
      )}

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{script.title}</h3>
                  {category && (
                    <div className="flex items-center gap-2 mt-1">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="text-sm text-gray-600">{category.name}</span>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setShowPreview(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  ×
                </button>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-gray-900 leading-relaxed whitespace-pre-wrap">
                  {script.content}
                </p>
              </div>

              {script.tags && script.tags.length > 0 && (
                <div className="flex items-center gap-2 mb-4">
                  <TagIcon className="h-4 w-4 text-gray-400" />
                  <div className="flex flex-wrap gap-1">
                    {script.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Used {script.usage_count} times • Created {formatDate(script.created_at)}
                </div>
                <CopyButton text={script.content} onCopy={handleCopy} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}