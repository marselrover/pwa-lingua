import { cn } from '@/lib/utils';
import { Database } from '@/integrations/supabase/types';

type WordCategory = Database['public']['Enums']['word_category'];

interface CategoryCardProps {
  category: WordCategory;
  count: number;
  onClick: () => void;
}

const categoryConfig: Record<WordCategory, { label: string; emoji: string; color: string }> = {
  greetings: { label: 'Greetings', emoji: '👋', color: 'category-greetings' },
  numbers: { label: 'Numbers', emoji: '🔢', color: 'category-numbers' },
  colors: { label: 'Colors', emoji: '🎨', color: 'category-colors' },
  food: { label: 'Food', emoji: '🍔', color: 'category-food' },
  animals: { label: 'Animals', emoji: '🐾', color: 'category-animals' },
  travel: { label: 'Travel', emoji: '✈️', color: 'category-travel' },
  business: { label: 'Business', emoji: '💼', color: 'category-business' },
  daily: { label: 'Daily Life', emoji: '🏠', color: 'category-daily' },
};

export function CategoryCard({ category, count, onClick }: CategoryCardProps) {
  const config = categoryConfig[category];

  return (
    <button
      onClick={onClick}
      className={cn(
        "relative overflow-hidden rounded-2xl p-5 text-left transition-all duration-300",
        "hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]",
        config.color
      )}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -top-4 -right-4 text-7xl">{config.emoji}</div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <span className="text-3xl mb-2 block">{config.emoji}</span>
        <h3 className="text-lg font-bold mb-1">{config.label}</h3>
        <p className="text-sm opacity-90">{count} words</p>
      </div>
    </button>
  );
}

export { categoryConfig };
