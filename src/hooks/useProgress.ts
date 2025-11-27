import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { useAuth } from './useAuth';

type UserProgress = Database['public']['Tables']['user_progress']['Row'];

export function useProgress() {
  const { user } = useAuth();
  const [progress, setProgress] = useState<UserProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProgress = useCallback(async () => {
    if (!user) {
      setLoading(false);
      setProgress([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id);

      if (fetchError) throw fetchError;

      setProgress(data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch progress');
      setProgress([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  const updateProgress = async (vocabularyId: string, correct: boolean) => {
    if (!user) return { error: 'Not authenticated' };

    try {
      // Check if progress exists
      const existing = progress.find(p => p.vocabulary_id === vocabularyId);

      if (existing) {
        // Update existing progress
        const newTimesCorrect = correct ? existing.times_correct + 1 : existing.times_correct;
        const newTimesPracticed = existing.times_practiced + 1;
        const accuracy = newTimesCorrect / newTimesPracticed;
        const newMasteryLevel = Math.min(5, Math.floor(accuracy * 5));

        const { data, error: updateError } = await supabase
          .from('user_progress')
          .update({
            times_practiced: newTimesPracticed,
            times_correct: newTimesCorrect,
            mastery_level: newMasteryLevel,
            last_practiced_at: new Date().toISOString(),
          })
          .eq('id', existing.id)
          .select()
          .single();

        if (updateError) throw updateError;

        setProgress(prev => prev.map(p => p.id === existing.id ? data : p));
        return { data, error: null };
      } else {
        // Create new progress
        const { data, error: insertError } = await supabase
          .from('user_progress')
          .insert({
            user_id: user.id,
            vocabulary_id: vocabularyId,
            times_practiced: 1,
            times_correct: correct ? 1 : 0,
            mastery_level: correct ? 1 : 0,
            last_practiced_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (insertError) throw insertError;

        setProgress(prev => [...prev, data]);
        return { data, error: null };
      }
    } catch (err: any) {
      return { data: null, error: err.message };
    }
  };

  const getMasteryLevel = (vocabularyId: string): number => {
    const item = progress.find(p => p.vocabulary_id === vocabularyId);
    return item?.mastery_level || 0;
  };

  const getOverallProgress = () => {
    if (progress.length === 0) return { totalWords: 0, masteredWords: 0, percentage: 0 };
    
    const masteredWords = progress.filter(p => p.mastery_level >= 4).length;
    return {
      totalWords: progress.length,
      masteredWords,
      percentage: Math.round((masteredWords / progress.length) * 100),
    };
  };

  return {
    progress,
    loading,
    error,
    refetch: fetchProgress,
    updateProgress,
    getMasteryLevel,
    getOverallProgress,
  };
}
