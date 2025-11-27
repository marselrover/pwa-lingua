import { Progress } from '@/components/ui/progress';

interface QuizProgressProps {
  current: number;
  total: number;
  correct: number;
}

export function QuizProgress({ current, total, correct }: QuizProgressProps) {
  const progressPercentage = ((current - 1) / total) * 100;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          Question {current} of {total}
        </span>
        <span className="font-medium text-success">
          {correct} correct
        </span>
      </div>
      <Progress value={progressPercentage} className="h-2" />
    </div>
  );
}
