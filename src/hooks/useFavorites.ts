import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { useAuth } from './useAuth';

type Favorite = Database['public']['Tables']['favorites']['Row'];
type Vocabulary = Database['public']['Tables']['vocabulary']['Row'];

type FavoriteWithVocabulary = Favorite & {
  vocabulary: Vocabulary;
};

export function useFavorites() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteWithVocabulary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFavorites = useCallback(async () => {
    if (!user) {
      setLoading(false);
      setFavorites([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('favorites')
        .select(`
          *,
          vocabulary (*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      setFavorites((data as FavoriteWithVocabulary[]) || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch favorites');
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const toggleFavorite = async (vocabularyId: string) => {
    if (!user) return { error: 'Not authenticated' };

    try {
      // Check if already favorited
      const existing = favorites.find(f => f.vocabulary_id === vocabularyId);

      if (existing) {
        // Remove favorite
        const { error: deleteError } = await supabase
          .from('favorites')
          .delete()
          .eq('id', existing.id);

        if (deleteError) throw deleteError;

        setFavorites(prev => prev.filter(f => f.id !== existing.id));
        return { action: 'removed' as const, error: null };
      } else {
        // Add favorite
        const { data, error: insertError } = await supabase
          .from('favorites')
          .insert({
            user_id: user.id,
            vocabulary_id: vocabularyId,
          })
          .select(`
            *,
            vocabulary (*)
          `)
          .single();

        if (insertError) throw insertError;

        setFavorites(prev => [data as FavoriteWithVocabulary, ...prev]);
        return { action: 'added' as const, error: null };
      }
    } catch (err: any) {
      return { action: null, error: err.message };
    }
  };

  const isFavorited = (vocabularyId: string) => {
    return favorites.some(f => f.vocabulary_id === vocabularyId);
  };

  return {
    favorites,
    loading,
    error,
    refetch: fetchFavorites,
    toggleFavorite,
    isFavorited,
  };
}
