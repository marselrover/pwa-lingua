import { Heart, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Database } from '@/integrations/supabase/types';
import { categoryConfig } from './CategoryCard';

type Vocabulary = Database['public']['Tables']['vocabulary']['Row'];

interface WordCardProps {
  word: Vocabulary;
  isFavorited?: boolean;
  onFavorite?: () => void;
  onClick?: () => void;
  showDetails?: boolean;
}

const difficultyColors = {
  beginner: 'bg-success/20 text-success border-success/30',
  intermediate: 'bg-warning/20 text-warning border-warning/30',
  advanced: 'bg-destructive/20 text-destructive border-destructive/30',
};

export function WordCard({
  word,
  isFavorited = false,
  onFavorite,
  onClick,
  showDetails = false,
}: WordCardProps) {
  const categoryInfo = categoryConfig[word.category];

  return (
    <Card
      className={cn(
        "card-hover overflow-hidden cursor-pointer",
        "border-border/50 bg-card"
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          {/* Word info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">{categoryInfo.emoji}</span>
              <h3 className="text-lg font-bold text-foreground truncate">
                {word.word}
              </h3>
            </div>
            <p className="text-base text-primary font-medium mb-1">
              {word.translation}
            </p>
            {word.pronunciation && (
              <p className="text-sm text-muted-foreground italic">
                /{word.pronunciation}/
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {onFavorite && (
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                onClick={(e) => {
                  e.stopPropagation();
                  onFavorite();
                }}
              >
                <Heart
                  className={cn(
                    "w-5 h-5 transition-colors",
                    isFavorited ? "fill-secondary text-secondary" : "text-muted-foreground"
                  )}
                />
              </Button>
            )}
          </div>
        </div>

        {/* Badges */}
        <div className="flex items-center gap-2 mt-3">
          <Badge variant="outline" className={difficultyColors[word.difficulty]}>
            {word.difficulty}
          </Badge>
          <Badge variant="outline" className="bg-muted/50">
            {categoryInfo.label}
          </Badge>
        </div>

        {/* Details */}
        {showDetails && word.example_sentence && (
          <div className="mt-4 pt-4 border-t border-border/50">
            <p className="text-sm text-foreground mb-1">{word.example_sentence}</p>
            <p className="text-sm text-muted-foreground italic">
              {word.example_translation}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
