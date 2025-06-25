import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '../lib/supabase';
import { Database } from '../types/database.types';

type ScriptCategory = Database['public']['Tables']['script_categories']['Row'];
type PersonalScript = Database['public']['Tables']['personal_scripts']['Row'];

interface SaveScriptParams {
  title: string;
  content: string;
  categoryId: string | null;
  tags: string[];
  generationId: string;
  selectedResponse: string;
}

export function useScriptLibrary() {
  const { user } = useAuth();
  const [categories, setCategories] = useState<ScriptCategory[]>([]);
  const [scripts, setScripts] = useState<PersonalScript[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchCategories();
      fetchScripts();
    }
  }, [user]);

  const fetchCategories = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('script_categories')
        .select('*')
        .eq('user_id', user.id)
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch categories');
    }
  };

  const fetchScripts = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('personal_scripts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setScripts(data || []);
    } catch (err) {
      console.error('Error fetching scripts:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch scripts');
    }
  };

  const saveScript = async (params: SaveScriptParams): Promise<boolean> => {
    if (!user) return false;

    setLoading(true);
    setError(null);

    try {
      // First, update the generated_scripts table with user's selection
      await supabase
        .from('generated_scripts')
        .update({
          selected_response: params.selectedResponse,
          saved_to_library: true
        })
        .eq('id', params.generationId);

      // Then save to personal_scripts
      const { error: scriptError } = await supabase
        .from('personal_scripts')
        .insert({
          user_id: user.id,
          title: params.title,
          content: params.content,
          category_id: params.categoryId,
          tags: params.tags,
          usage_count: 0
        });

      if (scriptError) throw scriptError;

      // Refresh the scripts list
      await fetchScripts();
      
      return true;
    } catch (err) {
      console.error('Error saving script:', err);
      setError(err instanceof Error ? err.message : 'Failed to save script');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const incrementUsage = async (scriptId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('personal_scripts')
        .update({
          usage_count: supabase.sql`usage_count + 1`,
          last_used_at: new Date().toISOString()
        })
        .eq('id', scriptId)
        .eq('user_id', user.id);

      if (error) throw error;

      // Update local state
      setScripts(prevScripts =>
        prevScripts.map(script =>
          script.id === scriptId
            ? { 
                ...script, 
                usage_count: script.usage_count + 1,
                last_used_at: new Date().toISOString()
              }
            : script
        )
      );
    } catch (err) {
      console.error('Error incrementing usage:', err);
    }
  };

  return {
    categories,
    scripts,
    loading,
    error,
    saveScript,
    incrementUsage,
    refetchCategories: fetchCategories,
    refetchScripts: fetchScripts
  };
}