import { useNavigate } from 'react-router-dom';
import { BookOpen, Layers, Trophy, Star, Flame, ArrowRight } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useVocabulary } from '@/hooks/useVocabulary';

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { profile } = useProfile();
  const { vocabulary } = useVocabulary({ limit: 5 });

  if (!isAuthenticated) {
    return (
      <AppLayout showStats={false} showNav={false}>
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
          <span className="text-7xl mb-6 animate-float">🌐</span>
          <h1 className="text-4xl font-bold gradient-text mb-4">LinguaLearn</h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-sm">
            Master Indonesian with fun flashcards, quizzes, and daily practice
          </p>
          <div className="flex flex-col gap-3 w-full max-w-xs">
            <Button variant="hero" size="xl" onClick={() => navigate('/auth')}>
              Get Started
            </Button>
            <Button variant="outline" size="lg" onClick={() => navigate('/auth?mode=login')}>
              I already have an account
            </Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  const xpToNextLevel = 100 - (profile?.total_xp || 0) % 100;
  const levelProgress = ((profile?.total_xp || 0) % 100);

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="text-center py-4">
          <h2 className="text-2xl font-bold text-foreground mb-1">
            Welcome back! 👋
          </h2>
          <p className="text-muted-foreground">Ready to learn today?</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-gradient-to-br from-secondary/20 to-secondary/5 border-secondary/30">
            <CardContent className="p-4 text-center">
              <Flame className="w-8 h-8 text-secondary mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">{profile?.streak_days || 0}</p>
              <p className="text-sm text-muted-foreground">Day Streak</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-accent/20 to-accent/5 border-accent/30">
            <CardContent className="p-4 text-center">
              <Star className="w-8 h-8 text-accent mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">{profile?.total_xp || 0}</p>
              <p className="text-sm text-muted-foreground">Total XP</p>
            </CardContent>
          </Card>
        </div>

        {/* Level Progress */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold">Level {profile?.current_level || 1}</span>
              <span className="text-sm text-muted-foreground">{xpToNextLevel} XP to next level</span>
            </div>
            <Progress value={levelProgress} className="h-3" />
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="space-y-3">
          <h3 className="font-semibold text-foreground">Continue Learning</h3>
          <div className="grid gap-3">
            <Button
              variant="default"
              size="lg"
              className="w-full justify-between"
              onClick={() => navigate('/vocabulary')}
            >
              <span className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Browse Vocabulary
              </span>
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button
              variant="secondary"
              size="lg"
              className="w-full justify-between"
              onClick={() => navigate('/flashcards')}
            >
              <span className="flex items-center gap-2">
                <Layers className="w-5 h-5" />
                Practice Flashcards
              </span>
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button
              variant="accent"
              size="lg"
              className="w-full justify-between"
              onClick={() => navigate('/quiz')}
            >
              <span className="flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                Take a Quiz
              </span>
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Index;
