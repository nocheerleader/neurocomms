import React from 'react';
import { LibraryCard } from '../molecules/LibraryCard';
import { Database } from '../../types/database.types';

type PersonalScript = Database['public']['Tables']['personal_scripts']['Row'];
type ScriptCategory = Database['public']['Tables']['script_categories']['Row'];

interface ScriptGridProps {
  scripts: PersonalScript[];
  categories: ScriptCategory[];
}

export function ScriptGrid({ scripts, categories }: ScriptGridProps) {
  const getCategoryById = (id: string | null) => {
    if (!id) return null;
    return categories.find(cat => cat.id === id) || null;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {scripts.map((script) => (
        <LibraryCard
          key={script.id}
          script={script}
          category={getCategoryById(script.category_id)}
        />
      ))}
    </div>
  );
}