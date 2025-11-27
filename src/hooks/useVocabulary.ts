import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type Vocabulary = Database['public']['Tables']['vocabulary']['Row'];
type WordCategory = Database['public']['Enums']['word_category'];
type DifficultyLevel = Database['public']['Enums']['difficulty_level'];

interface UseVocabularyParams {
  category?: WordCategory;
  difficulty?: DifficultyLevel;
  search?: string;
  limit?: number;
}

export function useVocabulary(params: UseVocabularyParams = {}) {
  const [vocabulary, setVocabulary] = useState<Vocabulary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVocabulary = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase.from('vocabulary').select('*');

      if (params.category) {
        query = query.eq('category', params.category);
      }

      if (params.difficulty) {
        query = query.eq('difficulty', params.difficulty);
      }

      if (params.search) {
        query = query.or(`word.ilike.%${params.search}%,translation.ilike.%${params.search}%`);
      }

      if (params.limit) {
        query = query.limit(params.limit);
      }

      const { data, error: fetchError } = await query.order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      setVocabulary(data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch vocabulary');
      setVocabulary([]);
    } finally {
      setLoading(false);
    }
  }, [params.category, params.difficulty, params.search, params.limit]);

  useEffect(() => {
    fetchVocabulary();
  }, [fetchVocabulary]);

  return {
    vocabulary,
    loading,
    error,
    refetch: fetchVocabulary,
  };
}

export function useVocabularyById(id: string | null) {
  const [word, setWord] = useState<Vocabulary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWord = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from('vocabulary')
          .select('*')
          .eq('id', id)
          .maybeSingle();

        if (fetchError) throw fetchError;

        setWord(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch word');
        setWord(null);
      } finally {
        setLoading(false);
      }
    };

    fetchWord();
  }, [id]);

  return { word, loading, error };
}

export function useRandomVocabulary(category?: WordCategory, count: number = 10) {
  const [vocabulary, setVocabulary] = useState<Vocabulary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRandom = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase.from('vocabulary').select('*');

      if (category) {
        query = query.eq('category', category);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      // Shuffle and take count items
      const shuffled = (data || []).sort(() => Math.random() - 0.5);
      setVocabulary(shuffled.slice(0, count));
    } catch (err: any) {
      setError(err.message || 'Failed to fetch vocabulary');
      setVocabulary([]);
    } finally {
      setLoading(false);
    }
  }, [category, count]);

  useEffect(() => {
    fetchRandom();
  }, [fetchRandom]);

  return {
    vocabulary,
    loading,
    error,
    refetch: fetchRandom,
  };
}
