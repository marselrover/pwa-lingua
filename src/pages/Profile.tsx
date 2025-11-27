import { useNavigate } from 'react-router-dom';
import { LogOut, Star, Flame, Trophy, BookOpen } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useProgress } from '@/hooks/useProgress';
import { toast } from '@/hooks/use-toast';

const Profile = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { profile } = useProfile();
  const { getOverallProgress } = useProgress();

  const progress = getOverallProgress();

  const handleSignOut = async () => {
    await signOut();
    toast({ title: 'Signed out successfully' });
    navigate('/');
  };

  return (
    <AppLayout title="Profile">
      <div className="space-y-6">
        {/* Profile Header */}
        <div className="flex flex-col items-center text-center py-6">
          <Avatar className="w-24 h-24 mb-4">
            <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
              {profile?.username?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <h2 className="text-xl font-bold">{profile?.username || 'Learner'}</h2>
          <p className="text-muted-foreground">{user?.email}</p>
          <div className="flex items-center gap-1 mt-2 text-accent">
            <Trophy className="w-4 h-4" />
            <span className="font-medium">Level {profile?.current_level || 1}</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <Flame className="w-8 h-8 text-secondary mx-auto mb-2" />
              <p className="text-2xl font-bold">{profile?.streak_days || 0}</p>
              <p className="text-sm text-muted-foreground">Day Streak</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Star className="w-8 h-8 text-accent mx-auto mb-2" />
              <p className="text-2xl font-bold">{profile?.total_xp || 0}</p>
              <p className="text-sm text-muted-foreground">Total XP</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <BookOpen className="w-8 h-8 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold">{progress.totalWords}</p>
              <p className="text-sm text-muted-foreground">Words Learned</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Trophy className="w-8 h-8 text-success mx-auto mb-2" />
              <p className="text-2xl font-bold">{progress.masteredWords}</p>
              <p className="text-sm text-muted-foreground">Mastered</p>
            </CardContent>
          </Card>
        </div>

        {/* Sign Out */}
        <Button variant="outline" className="w-full" onClick={handleSignOut}>
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </AppLayout>
  );
};

export default Profile;
