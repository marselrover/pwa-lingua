import { useState, useEffect, useMemo } from 'react';
import { Volume2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Database } from '@/integrations/supabase/types';
import { categoryConfig } from '../vocabulary/CategoryCard';

type Vocabulary = Database['public']['Tables']['vocabulary']['Row'];

interface FlashcardProps {
  word: Vocabulary;
  allWords: Vocabulary[];
  onCorrect?: () => void;
  onIncorrect?: () => void;
}

export function Flashcard({ word, allWords, onCorrect, onIncorrect }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showActions, setShowActions] = useState(false);

  // Generate random translation - 50% chance correct, 50% chance wrong
  const { displayedTranslation, isCorrectAnswer } = useMemo(() => {
    const showCorrect = Math.random() > 0.5;
    if (showCorrect) {
      return { displayedTranslation: word.translation, isCorrectAnswer: true };
    } else {
      const otherWords = allWords.filter(w => w.id !== word.id);
      if (otherWords.length === 0) {
        return { displayedTranslation: word.translation, isCorrectAnswer: true };
      }
      const randomWord = otherWords[Math.floor(Math.random() * otherWords.length)];
      return { displayedTranslation: randomWord.translation, isCorrectAnswer: false };
    }
  }, [word.id, allWords]);

  const categoryInfo = categoryConfig[word.category];

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    if (!isFlipped) {
      setTimeout(() => setShowActions(true), 300);
    } else {
      setShowActions(false);
    }
  };

  // User clicks ✓ (saying "this translation is correct")
  // User clicks ✗ (saying "this translation is wrong")
  const handleAction = (userSaysCorrect: boolean) => {
    const userIsRight = userSaysCorrect === isCorrectAnswer;
    if (userIsRight) {
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
            <p className="text-sm opacity-75 mb-2">Apakah ini terjemahan yang benar?</p>
            <h2 className="text-3xl font-bold mb-2">{displayedTranslation}</h2>
            <p className="text-sm opacity-60 mt-4">
              Tekan ✓ jika benar, ✗ jika salah
            </p>
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
