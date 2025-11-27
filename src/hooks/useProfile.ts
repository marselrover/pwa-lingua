import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { useAuth } from './useAuth';

type Profile = Database['public']['Tables']['profiles']['Row'];

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!user) {
      setLoading(false);
      setProfile(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (fetchError) throw fetchError;

      setProfile(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch profile');
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: 'Not authenticated' };

    try {
      const { data, error: updateError } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single();

      if (updateError) throw updateError;

      setProfile(data);
      return { data, error: null };
    } catch (err: any) {
      return { data: null, error: err.message };
    }
  };

  const addXP = async (amount: number) => {
    if (!user || !profile) return { error: 'Not authenticated' };

    const newXP = profile.total_xp + amount;
    const newLevel = Math.floor(newXP / 100) + 1;

    return updateProfile({
      total_xp: newXP,
      current_level: newLevel,
      last_activity_date: new Date().toISOString().split('T')[0],
    });
  };

  const updateStreak = async () => {
    if (!user || !profile) return { error: 'Not authenticated' };

    const today = new Date().toISOString().split('T')[0];
    const lastActivity = profile.last_activity_date;

    let newStreak = profile.streak_days;

    if (!lastActivity) {
      newStreak = 1;
    } else {
      const lastDate = new Date(lastActivity);
      const todayDate = new Date(today);
      const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        newStreak = profile.streak_days + 1;
      } else if (diffDays > 1) {
        newStreak = 1;
      }
    }

    return updateProfile({
      streak_days: newStreak,
      last_activity_date: today,
    });
  };

  return {
    profile,
    loading,
    error,
    refetch: fetchProfile,
    updateProfile,
    addXP,
    updateStreak,
  };
}
