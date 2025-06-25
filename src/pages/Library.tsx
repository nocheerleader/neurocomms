import React, { useState } from 'react';
import { BookOpenIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { ScriptGrid } from '../components/organisms/ScriptGrid';
import { LibraryFilters } from '../components/organisms/LibraryFilters';
import { CategoryManager } from '../components/organisms/CategoryManager';
import { useScriptLibrary } from '../hooks/useScriptLibrary';
import { LoadingSpinner } from '../components/atoms/LoadingSpinner';

export function Library() {
  const { scripts, categories, loading } = useScriptLibrary();
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'alphabetical'>('recent');

  const handleBackToDashboard = () => {
    window.location.href = '/profile';
  };

  // Filter and sort scripts based on current filters
  const filteredScripts = scripts
    .filter(script => {
      // Search query filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = script.title.toLowerCase().includes(query);
        const matchesContent = script.content.toLowerCase().includes(query);
        const matchesTags = script.tags?.some(tag => tag.toLowerCase().includes(query));
        if (!matchesTitle && !matchesContent && !matchesTags) {
          return false;
        }
      }

      // Category filter
      if (selectedCategory && script.category_id !== selectedCategory) {
        return false;
      }

      // Tags filter
      if (selectedTags.length > 0) {
        const scriptTags = script.tags || [];
        const hasMatchingTag = selectedTags.some(tag => 
          scriptTags.some(scriptTag => 
            scriptTag.toLowerCase().includes(tag.toLowerCase())
          )
        );
        if (!hasMatchingTag) {
          return false;
        }
      }

      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return b.usage_count - a.usage_count;
        case 'alphabetical':
          return a.title.localeCompare(b.title);
        case 'recent':
        default:
          return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
      }
    });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-700 p-2 rounded-lg">
                <BookOpenIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Script Library</h1>
                <p className="text-sm text-gray-600">
                  {scripts.length} saved script{scripts.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowCategoryManager(true)}
                className="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
              >
                Manage Categories
              </button>
              <button
                onClick={handleBackToDashboard}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <ArrowLeftIcon className="h-4 w-4" />
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Filters */}
          <LibraryFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            selectedTags={selectedTags}
            onTagsChange={setSelectedTags}
            sortBy={sortBy}
            onSortChange={setSortBy}
            categories={categories}
            availableTags={[...new Set(scripts.flatMap(s => s.tags || []))]}
          />

          {/* Scripts Grid */}
          <ScriptGrid scripts={filteredScripts} categories={categories} />

          {/* Empty State */}
          {scripts.length === 0 && (
            <div className="text-center py-12">
              <BookOpenIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No scripts saved yet</h3>
              <p className="text-gray-600 mb-6">
                Start by generating scripts and saving your favorites to build your personal library.
              </p>
              <button
                onClick={() => window.location.href = '/script-generator'}
                className="px-4 py-2 bg-blue-700 text-white rounded-lg font-medium hover:bg-blue-800 transition-colors"
              >
                Generate Your First Script
              </button>
            </div>
          )}

          {/* No Results */}
          {scripts.length > 0 && filteredScripts.length === 0 && (
            <div className="text-center py-12">
              <BookOpenIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No scripts match your filters</h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search terms or filters to find what you're looking for.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('');
                  setSelectedTags([]);
                }}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Category Manager Modal */}
      {showCategoryManager && (
        <CategoryManager onClose={() => setShowCategoryManager(false)} />
      )}
    </div>
  );
}