import React, { useState } from 'react';
import { XMarkIcon, PlusIcon, PencilIcon, TrashIcon, FolderIcon } from '@heroicons/react/24/outline';
import { useScriptLibrary } from '../../hooks/useScriptLibrary';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { LoadingSpinner } from '../atoms/LoadingSpinner';

interface CategoryManagerProps {
  onClose: () => void;
}

interface CategoryForm {
  name: string;
  color: string;
  description: string;
}

const predefinedColors = [
  '#3B82F6', // Blue
  '#10B981', // Green
  '#8B5CF6', // Purple
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#06B6D4', // Cyan
  '#84CC16', // Lime
  '#F97316', // Orange
  '#EC4899', // Pink
  '#6B7280', // Gray
];

export function CategoryManager({ onClose }: CategoryManagerProps) {
  const { user } = useAuth();
  const { categories, refetchCategories } = useScriptLibrary();
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<CategoryForm>({
    name: '',
    color: predefinedColors[0],
    description: ''
  });

  const resetForm = () => {
    setForm({
      name: '',
      color: predefinedColors[0],
      description: ''
    });
    setEditingCategory(null);
    setShowForm(false);
  };

  const handleEdit = (category: any) => {
    setForm({
      name: category.name,
      color: category.color,
      description: category.description || ''
    });
    setEditingCategory(category.id);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !form.name.trim()) return;

    setLoading(true);
    try {
      if (editingCategory) {
        // Update existing category
        const { error } = await supabase
          .from('script_categories')
          .update({
            name: form.name.trim(),
            color: form.color,
            description: form.description.trim() || null
          })
          .eq('id', editingCategory)
          .eq('user_id', user.id);

        if (error) throw error;
      } else {
        // Create new category
        const { error } = await supabase
          .from('script_categories')
          .insert({
            user_id: user.id,
            name: form.name.trim(),
            color: form.color,
            description: form.description.trim() || null
          });

        if (error) throw error;
      }

      await refetchCategories();
      resetForm();
    } catch (error) {
      console.error('Error saving category:', error);
      alert('Failed to save category. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (categoryId: string) => {
    if (!user) return;
    
    const confirmed = confirm('Are you sure you want to delete this category? Scripts in this category will be uncategorized.');
    if (!confirmed) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('script_categories')
        .delete()
        .eq('id', categoryId)
        .eq('user_id', user.id);

      if (error) throw error;
      await refetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Failed to delete category. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <FolderIcon className="h-6 w-6 text-blue-700" />
            <h3 className="text-lg font-semibold text-gray-900">Manage Categories</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Add/Edit Form */}
          {showForm ? (
            <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="text-md font-medium text-gray-900 mb-4">
                {editingCategory ? 'Edit Category' : 'Create New Category'}
              </h4>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Category Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                    placeholder="Enter category name"
                    maxLength={100}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Color
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {predefinedColors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setForm({ ...form, color })}
                        className={`w-8 h-8 rounded-full border-2 ${
                          form.color === color ? 'border-gray-900' : 'border-gray-300'
                        } transition-colors`}
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description (Optional)
                  </label>
                  <textarea
                    id="description"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                    placeholder="Enter category description"
                    rows={2}
                    maxLength={500}
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!form.name.trim() || loading}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-700 border border-transparent rounded-lg hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-w-[80px] flex items-center justify-center"
                >
                  {loading ? <LoadingSpinner /> : (editingCategory ? 'Update' : 'Create')}
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-4 py-2 mb-6 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <PlusIcon className="h-4 w-4" />
              Add New Category
            </button>
          )}

          {/* Categories List */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-700">Your Categories</h4>
            
            {categories.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FolderIcon className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p>No categories created yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: category.color }}
                      />
                      <div className="flex-1 min-w-0">
                        <h5 className="text-sm font-medium text-gray-900">{category.name}</h5>
                        {category.description && (
                          <p className="text-xs text-gray-600 truncate">{category.description}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleEdit(category)}
                        className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                        title="Edit category"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete category"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}