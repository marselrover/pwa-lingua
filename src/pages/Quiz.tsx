import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { QuizOption } from '@/components/quiz/QuizOption';
import { QuizProgress } from '@/components/quiz/QuizProgress';
import { QuizResult } from '@/components/quiz/QuizResult';
import { useRandomVocabulary } from '@/hooks/useVocabulary';
import { useProgress } from '@/hooks/useProgress';
import { useProfile } from '@/hooks/useProfile';
import { Loader2 } from 'lucide-react';

const Quiz = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [completed, setCompleted] = useState(false);

  const { vocabulary, loading, refetch } = useRandomVocabulary(undefined, 10);
  const { updateProgress, saveQuizResult } = useProgress();
  const { addXP, updateStreak } = useProfile();

  const currentQuestion = vocabulary[currentIndex];

  const options = useMemo(() => {
    if (!currentQuestion || vocabulary.length < 4) return [];
    
    const wrongAnswers = vocabulary
      .filter((v) => v.id !== currentQuestion.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map((v) => v.translation);

    return [...wrongAnswers, currentQuestion.translation].sort(() => Math.random() - 0.5);
  }, [currentQuestion, vocabulary]);

  const handleSelect = async (answer: string) => {
    if (selectedAnswer) return;

    setSelectedAnswer(answer);
    const isCorrect = answer === currentQuestion.translation;

    if (isCorrect) {
      setCorrect((c) => c + 1);
      await addXP(15);
    }

    await updateProgress(currentQuestion.id, isCorrect);
    setShowResult(true);

    setTimeout(async () => {
      if (currentIndex < vocabulary.length - 1) {
        setCurrentIndex((i) => i + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        const finalCorrect = isCorrect ? correct + 1 : correct;
        await saveQuizResult(finalCorrect, vocabulary.length, finalCorrect * 15);
        updateStreak();
        setCompleted(true);
      }
    }, 1500);
  };

  const handleRetry = () => {
    setCurrentIndex(0);
    setCorrect(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setCompleted(false);
    refetch();
  };

  if (loading) {
    return (
      <AppLayout title="Quiz">
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  if (completed) {
    return (
      <AppLayout title="Quiz Results">
        <QuizResult
          correct={correct}
          total={vocabulary.length}
          xpEarned={correct * 15}
          onRetry={handleRetry}
          onHome={() => navigate('/')}
        />
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Quiz">
      <div className="space-y-6">
        <QuizProgress
          current={currentIndex + 1}
          total={vocabulary.length}
          correct={correct}
        />

        {currentQuestion && (
          <div className="space-y-6">
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground mb-2">Apa terjemahan dari:</p>
              <h2 className="text-3xl font-bold text-foreground">{currentQuestion.word}</h2>
            </div>

            <div className="space-y-3">
              {options.map((option) => (
                <QuizOption
                  key={option}
                  label={option}
                  selected={selectedAnswer === option}
                  correct={showResult ? option === currentQuestion.translation : null}
                  disabled={!!selectedAnswer}
                  onClick={() => handleSelect(option)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Quiz;
