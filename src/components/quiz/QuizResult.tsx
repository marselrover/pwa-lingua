import { Star, Trophy, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface QuizResultProps {
  correct: number;
  total: number;
  xpEarned: number;
  onRetry: () => void;
  onHome: () => void;
}

export function QuizResult({
  correct,
  total,
  xpEarned,
  onRetry,
  onHome,
}: QuizResultProps) {
  const percentage = Math.round((correct / total) * 100);

  const getEmoji = () => {
    if (percentage >= 90) return '🏆';
    if (percentage >= 70) return '🎉';
    if (percentage >= 50) return '👍';
    return '💪';
  };

  const getMessage = () => {
    if (percentage >= 90) return 'Perfect!';
    if (percentage >= 70) return 'Great job!';
    if (percentage >= 50) return 'Good effort!';
    return 'Keep practicing!';
  };

  return (
    <div className="flex flex-col items-center justify-center py-8 animate-bounce-in">
      {/* Trophy animation */}
      <div className="text-8xl mb-6">{getEmoji()}</div>

      {/* Score */}
      <h2 className="text-3xl font-bold text-foreground mb-2">
        {getMessage()}
      </h2>
      <p className="text-xl text-muted-foreground mb-6">
        You got <span className="font-bold text-primary">{correct}</span> out of{' '}
        <span className="font-bold">{total}</span> correct
      </p>

      {/* XP earned */}
      <div
        className={cn(
          "flex items-center gap-2 px-6 py-3 rounded-full mb-8",
          "bg-accent/20 text-accent"
        )}
      >
        <Star className="w-6 h-6 xp-glow" />
        <span className="text-xl font-bold">+{xpEarned} XP</span>
      </div>

      {/* Progress circle */}
      <div className="relative w-32 h-32 mb-8">
        <svg className="w-full h-full -rotate-90">
          <circle
            cx="64"
            cy="64"
            r="56"
            stroke="currentColor"
            strokeWidth="12"
            fill="none"
            className="text-muted"
          />
          <circle
            cx="64"
            cy="64"
            r="56"
            stroke="currentColor"
            strokeWidth="12"
            fill="none"
            strokeDasharray={`${(percentage / 100) * 352} 352`}
            className={cn(
              percentage >= 70 ? 'text-success' : percentage >= 50 ? 'text-warning' : 'text-destructive'
            )}
            strokeLinecap="round"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-foreground">
          {percentage}%
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 w-full max-w-xs">
        <Button
          variant="outline"
          className="flex-1"
          onClick={onHome}
        >
          <Home className="w-4 h-4 mr-2" />
          Home
        </Button>
        <Button
          variant="default"
          className="flex-1"
          onClick={onRetry}
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Retry
        </Button>
      </div>
    </div>
  );
}
