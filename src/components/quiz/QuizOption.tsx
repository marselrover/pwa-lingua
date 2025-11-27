import { cn } from '@/lib/utils';

interface QuizOptionProps {
  label: string;
  selected: boolean;
  correct?: boolean | null;
  disabled: boolean;
  onClick: () => void;
}

export function QuizOption({
  label,
  selected,
  correct,
  disabled,
  onClick,
}: QuizOptionProps) {
  const getStyles = () => {
    if (correct === true) {
      return 'bg-success/20 border-success text-success ring-2 ring-success/30';
    }
    if (correct === false && selected) {
      return 'bg-destructive/20 border-destructive text-destructive ring-2 ring-destructive/30 animate-shake';
    }
    if (selected) {
      return 'bg-primary/20 border-primary text-primary ring-2 ring-primary/30';
    }
    return 'bg-card border-border hover:border-primary/50 hover:bg-muted/50';
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "w-full p-4 rounded-xl border-2 text-left transition-all duration-200",
        "font-medium text-base",
        disabled && !selected && 'opacity-50',
        getStyles()
      )}
    >
      {label}
    </button>
  );
}
