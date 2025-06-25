import React, { useState } from 'react';
import { XMarkIcon, BookmarkIcon } from '@heroicons/react/24/outline';
import { useScriptLibrary } from '../../hooks/useScriptLibrary';
import { LoadingSpinner } from '../atoms/LoadingSpinner';

interface SaveScriptDialogProps {
  scriptContent: string;
  scriptType: 'casual' | 'professional' | 'direct';
  generationId: string;
  situationContext: string;
  relationshipType: string;
  onClose: () => void;
  onSave: () => void;
}

export function SaveScriptDialog({
  scriptContent,
  scriptType,
  generationId,
  situationContext,
  relationshipType,
  onClose,
  onSave
}: SaveScriptDialogProps) {
  const { categories, saveScript, loading } = useScriptLibrary();
  const [title, setTitle] = useState(generateDefaultTitle(scriptType, relationshipType));
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [tags, setTags] = useState(generateDefaultTags(scriptType, relationshipType));

  function generateDefaultTitle(type: string, relationship: string): string {
    const typeMap = {
      casual: 'Casual',
      professional: 'Professional',
      direct: 'Direct'
    };
    const relationshipMap = {
      colleague: 'Colleague',
      manager: 'Manager',
      friend: 'Friend',
      family: 'Family',
      client: 'Client',
      acquaintance: 'Acquaintance',
      other: 'General'
    };
    
    return `${typeMap[type as keyof typeof typeMap]} response to ${relationshipMap[relationship as keyof typeof relationshipMap]}`;
  }

  function generateDefaultTags(type: string, relationship: string): string {
    return [type, relationship, 'generated'].join(', ');
  }

  const handleSave = async () => {
    if (!title.trim()) return;

    const success = await saveScript({
      title: title.trim(),
      content: scriptContent,
      categoryId: selectedCategoryId || null,
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
      generationId,
      selectedResponse: scriptType
    });

    if (success) {
      onSave();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <BookmarkIcon className="h-6 w-6 text-blue-700" />
            <h3 className="text-lg font-semibold text-gray-900">Save to Library</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Script Preview */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Script Content
            </label>
            <div className="bg-gray-50 rounded-lg p-3 border">
              <p className="text-gray-900 text-sm leading-relaxed">{scriptContent}</p>
            </div>
          </div>

          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-transparent"
              placeholder="Enter a title for this script"
              maxLength={200}
            />
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Category (Optional)
            </label>
            <select
              id="category"
              value={selectedCategoryId}
              onChange={(e) => setSelectedCategoryId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-transparent"
            >
              <option value="">No category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
              Tags (Optional)
            </label>
            <input
              id="tags"
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-transparent"
              placeholder="Enter tags separated by commas"
            />
            <p className="text-xs text-gray-500 mt-1">
              Example: professional, deadline, email
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!title.trim() || loading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-700 border border-transparent rounded-lg hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-w-[80px] flex items-center justify-center"
          >
            {loading ? <LoadingSpinner /> : 'Save Script'}
          </button>
        </div>
      </div>
    </div>
  );
}