import { Flame, Star, ChevronLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/hooks/useAuth';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  showStats?: boolean;
}

export function Header({ title, showBack = false, showStats = true }: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile } = useProfile();
  const { isAuthenticated } = useAuth();

  const isHome = location.pathname === '/';

  return (
    <header className="sticky top-0 z-40 glass border-b border-border/50">
      <div className="container max-w-lg mx-auto">
        <div className="flex items-center justify-between h-16 px-4">
          {/* Left section */}
          <div className="flex items-center gap-3">
            {showBack && !isHome ? (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(-1)}
                className="shrink-0"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
            ) : null}
            {title ? (
              <h1 className="text-lg font-bold text-foreground">{title}</h1>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-2xl">🌐</span>
                <span className="text-xl font-bold gradient-text">LinguaLearn</span>
              </div>
            )}
          </div>

          {/* Right section - Stats */}
          {showStats && isAuthenticated && profile && (
            <div className="flex items-center gap-4">
              {/* Streak */}
              <div className="flex items-center gap-1.5">
                <Flame className="w-5 h-5 text-secondary streak-fire" />
                <span className="text-sm font-bold text-foreground">
                  {profile.streak_days}
                </span>
              </div>

              {/* XP */}
              <div className="flex items-center gap-1.5">
                <Star className="w-5 h-5 text-accent xp-glow" />
                <span className="text-sm font-bold text-foreground">
                  {profile.total_xp}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
