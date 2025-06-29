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
  '#E05D38', // Primary Orange
  '#3B82F6', // Blue
  '#10B981', // Green
  '#8B5CF6', // Purple
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#06B6D4', // Cyan
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
        // Update
        const { error } = await supabase
          .from('script_categories')
          .update({ name: form.name.trim(), color: form.color, description: form.description.trim() || null })
          .eq('id', editingCategory)
          .eq('user_id', user.id);
        if (error) throw error;
      } else {
        // Create
        const { error } = await supabase
          .from('script_categories')
          .insert({ user_id: user.id, name: form.name.trim(), color: form.color, description: form.description.trim() || null });
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
    
    if (!confirm('Are you sure you want to delete this category? Scripts in this category will be uncategorized.')) return;

    setLoading(true);
    try {
      await supabase.from('script_categories').delete().eq('id', categoryId).eq('user_id', user.id);
      await refetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Failed to delete category. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-black/5">
          <div className="flex items-center gap-3">
            <FolderIcon className="h-6 w-6 text-primary" />
            <h3 className="text-lg font-semibold text-gray-900">Manage Categories</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          {!showForm ? (
            <button
              onClick={() => setShowForm(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 mb-6 text-sm font-bold text-primary bg-primary/10 border-2 border-dashed border-primary/20 rounded-lg hover:bg-primary/20 transition-colors"
            >
              <PlusIcon className="h-5 w-5" />
              Add New Category
            </button>
          ) : (
            <form onSubmit={handleSubmit} className="mb-6 p-4 bg-slate-50 rounded-lg border border-black/5">
              <h4 className="text-md font-medium text-gray-900 mb-4">
                {editingCategory ? 'Edit Category' : 'Create New Category'}
              </h4>
              
              <div className="space-y-4">
                <input
                  id="name"
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter category name"
                  maxLength={100}
                  required
                />

                <div className="flex flex-wrap gap-2">
                  {predefinedColors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setForm({ ...form, color })}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        form.color === color ? 'border-primary scale-110 shadow-lg' : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>

                <textarea
                  id="description"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Description (Optional)"
                  rows={2}
                  maxLength={500}
                />
              </div>

              <div className="flex items-center justify-end gap-3 mt-4">
                <button type="button" onClick={resetForm} className="px-4 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-200 transition-colors" disabled={loading}>
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!form.name.trim() || loading}
                  className="px-4 py-2 text-sm font-bold text-white bg-primary rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed min-w-[100px] flex items-center justify-center shadow-lg"
                >
                  {loading ? <LoadingSpinner /> : (editingCategory ? 'Update' : 'Create')}
                </button>
              </div>
            </form>
          )}

          <div className="space-y-3">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-white">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: category.color }} />
                  <div className="flex-1 min-w-0">
                    <h5 className="text-sm font-medium text-gray-900">{category.name}</h5>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => handleEdit(category)} className="p-2 text-gray-400 hover:text-primary transition-colors">
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button onClick={() => handleDelete(category.id)} className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}