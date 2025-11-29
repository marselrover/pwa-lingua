import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Flashcard } from '@/components/flashcard/Flashcard';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useRandomVocabulary } from '@/hooks/useVocabulary';
import { useProgress } from '@/hooks/useProgress';
import { useProfile } from '@/hooks/useProfile';
import { Loader2, RefreshCw, Trophy } from 'lucide-react';

const Flashcards = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [completed, setCompleted] = useState(false);

  const { vocabulary, loading, refetch } = useRandomVocabulary(undefined, 10);
  const { updateProgress } = useProgress();
  const { addXP, updateStreak } = useProfile();

  const currentWord = vocabulary[currentIndex];
  const progress = ((currentIndex) / vocabulary.length) * 100;

  const handleNext = async (isCorrect: boolean) => {
    if (currentWord) {
      await updateProgress(currentWord.id, isCorrect);
      if (isCorrect) {
        setCorrect((c) => c + 1);
        await addXP(10);
      }
    }

    if (currentIndex < vocabulary.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      await updateStreak();
      setCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setCorrect(0);
    setCompleted(false);
    refetch();
  };

  if (loading) {
    return (
      <AppLayout title="Flashcards">
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  if (completed) {
    return (
      <AppLayout title="Flashcards">
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
          <Trophy className="w-16 h-16 text-warning mb-4" />
          <h2 className="text-2xl font-bold mb-2">Session Complete!</h2>
          <p className="text-muted-foreground mb-6">
            You got {correct} out of {vocabulary.length} correct
          </p>
          <Button onClick={handleRestart}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Practice Again
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Flashcards">
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Card {currentIndex + 1} of {vocabulary.length}</span>
            <span className="text-success">{correct} correct</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {currentWord && (
          <Flashcard
            word={currentWord}
            allWords={vocabulary}
            onCorrect={() => handleNext(true)}
            onIncorrect={() => handleNext(false)}
          />
        )}
      </div>
    </AppLayout>
  );
};

export default Flashcards;
