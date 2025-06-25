import React, { useState } from 'react';
import { XMarkIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useScriptLibrary } from '../../hooks/useScriptLibrary';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import { LoadingSpinner } from '../atoms/LoadingSpinner';
import { Database } from '../../types/database.types';

type PersonalScript = Database['public']['Tables']['personal_scripts']['Row'];

interface ScriptEditorProps {
  script: PersonalScript;
  onClose: () => void;
}

export function ScriptEditor({ script, onClose }: ScriptEditorProps) {
  const { user } = useAuth();
  const { categories, refetchScripts } = useScriptLibrary();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: script.title,
    content: script.content,
    categoryId: script.category_id || '',
    tags: script.tags?.join(', ') || '',
    successRate: script.success_rate || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !form.title.trim() || !form.content.trim()) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('personal_scripts')
        .update({
          title: form.title.trim(),
          content: form.content.trim(),
          category_id: form.categoryId || null,
          tags: form.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
          success_rate: form.successRate ? parseFloat(form.successRate as string) : null
        })
        .eq('id', script.id)
        .eq('user_id', user.id);

      if (error) throw error;
      
      await refetchScripts();
      onClose();
    } catch (error) {
      console.error('Error updating script:', error);
      alert('Failed to update script. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!user) return;
    
    const confirmed = confirm('Are you sure you want to delete this script? This action cannot be undone.');
    if (!confirmed) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('personal_scripts')
        .delete()
        .eq('id', script.id)
        .eq('user_id', user.id);

      if (error) throw error;
      
      await refetchScripts();
      onClose();
    } catch (error) {
      console.error('Error deleting script:', error);
      alert('Failed to delete script. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <PencilIcon className="h-6 w-6 text-blue-700" />
            <h3 className="text-lg font-semibold text-gray-900">Edit Script</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDelete}
              className="p-2 text-gray-400 hover:text-red-600 transition-colors"
              title="Delete script"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              id="title"
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-transparent"
              placeholder="Enter script title"
              maxLength={200}
              required
            />
          </div>

          {/* Content */}
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
              Script Content
            </label>
            <textarea
              id="content"
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-transparent"
              placeholder="Enter your script content"
              rows={8}
              maxLength={10000}
              required
            />
            <div className="text-sm text-gray-500 mt-1">
              {form.content.length}/10,000 characters
            </div>
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Category (Optional)
            </label>
            <select
              id="category"
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
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
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-transparent"
              placeholder="Enter tags separated by commas"
            />
            <p className="text-xs text-gray-500 mt-1">
              Example: professional, deadline, email
            </p>
          </div>

          {/* Success Rate */}
          <div>
            <label htmlFor="successRate" className="block text-sm font-medium text-gray-700 mb-2">
              Success Rating (Optional)
            </label>
            <select
              id="successRate"
              value={form.successRate}
              onChange={(e) => setForm({ ...form, successRate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-transparent"
            >
              <option value="">Not rated</option>
              <option value="100">Excellent (100%)</option>
              <option value="75">Good (75%)</option>
              <option value="50">Fair (50%)</option>
              <option value="25">Poor (25%)</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Rate how effective this script has been for you
            </p>
          </div>

          {/* Usage Stats */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Usage Statistics</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Times used:</span>
                <span className="font-medium text-gray-900 ml-2">{script.usage_count}</span>
              </div>
              <div>
                <span className="text-gray-600">Last used:</span>
                <span className="font-medium text-gray-900 ml-2">
                  {script.last_used_at 
                    ? new Date(script.last_used_at).toLocaleDateString()
                    : 'Never'
                  }
                </span>
              </div>
              <div>
                <span className="text-gray-600">Created:</span>
                <span className="font-medium text-gray-900 ml-2">
                  {script.created_at 
                    ? new Date(script.created_at).toLocaleDateString()
                    : 'Unknown'
                  }
                </span>
              </div>
              <div>
                <span className="text-gray-600">Last updated:</span>
                <span className="font-medium text-gray-900 ml-2">
                  {script.updated_at 
                    ? new Date(script.updated_at).toLocaleDateString()
                    : 'Never'
                  }
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!form.title.trim() || !form.content.trim() || loading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-700 border border-transparent rounded-lg hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-w-[100px] flex items-center justify-center"
            >
              {loading ? <LoadingSpinner /> : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}