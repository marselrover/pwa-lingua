import { useState } from 'react';
import { Search } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Input } from '@/components/ui/input';
import { CategoryCard, categoryConfig } from '@/components/vocabulary/CategoryCard';
import { WordCard } from '@/components/vocabulary/WordCard';
import { useVocabulary } from '@/hooks/useVocabulary';
import { useFavorites } from '@/hooks/useFavorites';
import { Database } from '@/integrations/supabase/types';
import { Skeleton } from '@/components/ui/skeleton';

type WordCategory = Database['public']['Enums']['word_category'];

const Vocabulary = () => {
  const [selectedCategory, setSelectedCategory] = useState<WordCategory | null>(null);
  const [search, setSearch] = useState('');

  const { vocabulary, loading } = useVocabulary({
    category: selectedCategory || undefined,
    search: search || undefined,
  });

  const { isFavorited, toggleFavorite } = useFavorites();

  const categoryCounts = (Object.keys(categoryConfig) as WordCategory[]).map((cat) => ({
    category: cat,
    count: vocabulary.filter((v) => v.category === cat).length || 5,
  }));

  if (selectedCategory) {
    return (
      <AppLayout title={categoryConfig[selectedCategory].label} showBack>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search words..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-24 rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {vocabulary.map((word) => (
                <WordCard
                  key={word.id}
                  word={word}
                  isFavorited={isFavorited(word.id)}
                  onFavorite={() => toggleFavorite(word.id)}
                  showDetails
                />
              ))}
              {vocabulary.length === 0 && (
                <p className="text-center text-muted-foreground py-8">No words found</p>
              )}
            </div>
          )}
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Vocabulary">
      <div className="space-y-6">
        <p className="text-muted-foreground">Choose a category to start learning</p>
        <div className="grid grid-cols-2 gap-4">
          {(Object.keys(categoryConfig) as WordCategory[]).map((category) => (
            <CategoryCard
              key={category}
              category={category}
              count={categoryCounts.find((c) => c.category === category)?.count || 0}
              onClick={() => setSelectedCategory(category)}
            />
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default Vocabulary;
