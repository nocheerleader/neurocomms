import React from 'react';
import { MagnifyingGlassIcon, FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Database } from '../../types/database.types';

type ScriptCategory = Database['public']['Tables']['script_categories']['Row'];

interface LibraryFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  sortBy: 'recent' | 'popular' | 'alphabetical';
  onSortChange: (sort: 'recent' | 'popular' | 'alphabetical') => void;
  categories: ScriptCategory[];
  availableTags: string[];
}

export function LibraryFilters({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedTags,
  onTagsChange,
  sortBy,
  onSortChange,
  categories,
  availableTags
}: LibraryFiltersProps) {
  const hasActiveFilters = searchQuery || selectedCategory || selectedTags.length > 0;

  const clearAllFilters = () => {
    onSearchChange('');
    onCategoryChange('');
    onTagsChange([]);
  };

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter(t => t !== tag));
    } else {
      onTagsChange([...selectedTags, tag]);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center gap-4 mb-4">
        <FunnelIcon className="h-5 w-5 text-gray-500" />
        <h3 className="text-sm font-medium text-gray-900">Filter & Search</h3>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 hover:text-gray-800 transition-colors"
          >
            <XMarkIcon className="h-3 w-3" />
            Clear all
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search */}
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search scripts..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-transparent"
          />
        </div>

        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-transparent"
        >
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as 'recent' | 'popular' | 'alphabetical')}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-transparent"
        >
          <option value="recent">Most recent</option>
          <option value="popular">Most used</option>
          <option value="alphabetical">Alphabetical</option>
        </select>

        {/* Active Filters Count */}
        <div className="flex items-center justify-center">
          {hasActiveFilters && (
            <span className="px-3 py-2 bg-blue-100 text-blue-700 text-sm rounded-lg">
              {[searchQuery, selectedCategory, ...selectedTags].filter(Boolean).length} active filter{[searchQuery, selectedCategory, ...selectedTags].filter(Boolean).length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>

      {/* Tag Filters */}
      {availableTags.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Filter by tags:</h4>
          <div className="flex flex-wrap gap-2">
            {availableTags.slice(0, 10).map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                  selectedTags.includes(tag)
                    ? 'bg-blue-100 border-blue-300 text-blue-700'
                    : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tag}
              </button>
            ))}
            {availableTags.length > 10 && (
              <span className="px-3 py-1 text-xs text-gray-500">
                +{availableTags.length - 10} more
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}