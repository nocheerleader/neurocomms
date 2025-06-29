import React, { useState } from 'react';
import { BookOpenIcon, ArrowLeftIcon, FolderPlusIcon } from '@heroicons/react/24/outline';
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
      <div className="min-h-screen bg-[#FDF6F8] flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDF6F8]">
      {/* Header */}
      <div className="bg-transparent border-b border-primary/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center gap-3">
              <div className="bg-primary p-2 rounded-lg">
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
                className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors"
              >
                <FolderPlusIcon className="h-4 w-4" />
                <span>Manage Categories</span>
              </button>
              <button
                onClick={handleBackToDashboard}
                className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors"
              >
                <ArrowLeftIcon className="h-4 w-4" />
                <span>Back to Dashboard</span>
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

          {scripts.length > 0 ? (
            <ScriptGrid scripts={filteredScripts} categories={categories} />
          ) : (
            <div className="text-center py-16 bg-white rounded-lg shadow-xl border border-black/5">
              <BookOpenIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-800 mb-2">Your Library is Empty</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                As you analyze messages and generate responses, you can save the most effective ones here to build your personal communication toolkit.
              </p>
              <button
                onClick={() => window.location.href = '/script-generator'}
                className="px-6 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors shadow-lg"
              >
                Generate Your First Script
              </button>
            </div>
          )}

          {scripts.length > 0 && filteredScripts.length === 0 && (
            <div className="text-center py-16 bg-white rounded-lg shadow-xl border border-black/5">
              <BookOpenIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-800 mb-2">No Scripts Match Your Filters</h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search terms or filters to find what you're looking for.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('');
                  setSelectedTags([]);
                }}
                className="px-6 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors shadow-lg"
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