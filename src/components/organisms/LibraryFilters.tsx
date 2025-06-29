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
    <div className="bg-white rounded-lg shadow-xl p-6 border border-black/5">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Search */}
        <div className="relative lg:col-span-1">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search scripts by title or tag..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-slate-50/50"
          />
        </div>

        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-slate-50/50"
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
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-slate-50/50"
        >
          <option value="recent">Sort by: Most recent</option>
          <option value="popular">Sort by: Most used</option>
          <option value="alphabetical">Sort by: Alphabetical</option>
        </select>
      </div>

      {/* Tag Filters */}
      {availableTags.length > 0 && (
        <div className="mt-4 pt-4 border-t border-black/5">
          <div className="flex flex-wrap items-center gap-2">
             <span className="text-sm font-medium text-gray-700">Filter by tags:</span>
            {availableTags.slice(0, 10).map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1 text-xs font-medium rounded-full border transition-colors ${
                  selectedTags.includes(tag)
                    ? 'bg-primary/10 border-primary/20 text-primary'
                    : 'bg-gray-100 border-gray-200 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tag}
              </button>
            ))}
            {hasActiveFilters && (
                <button
                    onClick={clearAllFilters}
                    className="flex items-center gap-1 px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-auto"
                >
                    <XMarkIcon className="h-3 w-3" />
                    Clear all filters
                </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}