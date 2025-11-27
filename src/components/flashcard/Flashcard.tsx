import { useState } from 'react';
import { Volume2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Database } from '@/integrations/supabase/types';
import { categoryConfig } from '../vocabulary/CategoryCard';

type Vocabulary = Database['public']['Tables']['vocabulary']['Row'];

interface FlashcardProps {
  word: Vocabulary;
  onCorrect?: () => void;
  onIncorrect?: () => void;
}

export function Flashcard({ word, onCorrect, onIncorrect }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const categoryInfo = categoryConfig[word.category];

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    if (!isFlipped) {
      setTimeout(() => setShowActions(true), 300);
    } else {
      setShowActions(false);
    }
  };

  const handleAction = (correct: boolean) => {
    if (correct) {
      onCorrect?.();
    } else {
      onIncorrect?.();
    }
    setIsFlipped(false);
    setShowActions(false);
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      {/* Card */}
      <div
        className="relative h-72 cursor-pointer perspective-1000"
        onClick={handleFlip}
      >
        <div
          className={cn(
            "absolute inset-0 preserve-3d transition-transform duration-500 ease-out",
            isFlipped && "rotate-y-180"
          )}
        >
          {/* Front */}
          <div
            className={cn(
              "absolute inset-0 backface-hidden rounded-3xl p-6",
              "bg-gradient-to-br from-card to-muted border border-border/50",
              "flex flex-col items-center justify-center text-center shadow-lg"
            )}
          >
            <span className="text-5xl mb-4">{categoryInfo.emoji}</span>
            <h2 className="text-3xl font-bold text-foreground mb-2">{word.word}</h2>
            {word.pronunciation && (
              <p className="text-lg text-muted-foreground italic">
                /{word.pronunciation}/
              </p>
            )}
            <p className="text-sm text-muted-foreground mt-4">Tap to flip</p>
          </div>

          {/* Back */}
          <div
            className={cn(
              "absolute inset-0 backface-hidden rotate-y-180 rounded-3xl p-6",
              "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground",
              "flex flex-col items-center justify-center text-center shadow-lg"
            )}
          >
            <h2 className="text-3xl font-bold mb-2">{word.translation}</h2>
            {word.example_sentence && (
              <div className="mt-4 px-4">
                <p className="text-sm opacity-90 mb-1">{word.example_sentence}</p>
                <p className="text-sm opacity-75 italic">{word.example_translation}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action buttons */}
      {showActions && (
        <div className="flex items-center justify-center gap-4 mt-6 animate-slide-up">
          <button
            onClick={() => handleAction(false)}
            className={cn(
              "w-16 h-16 rounded-full flex items-center justify-center",
              "bg-destructive/10 text-destructive border-2 border-destructive/30",
              "hover:bg-destructive/20 transition-colors text-2xl",
              "active:scale-95"
            )}
          >
            ✗
          </button>
          <button
            onClick={() => handleAction(true)}
            className={cn(
              "w-16 h-16 rounded-full flex items-center justify-center",
              "bg-success/10 text-success border-2 border-success/30",
              "hover:bg-success/20 transition-colors text-2xl",
              "active:scale-95"
            )}
          >
            ✓
          </button>
        </div>
      )}
    </div>
  );
}
