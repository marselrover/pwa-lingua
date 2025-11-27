import { ReactNode } from 'react';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { useAuth } from '@/hooks/useAuth';

interface AppLayoutProps {
  children: ReactNode;
  title?: string;
  showBack?: boolean;
  showStats?: boolean;
  showNav?: boolean;
}

export function AppLayout({
  children,
  title,
  showBack = false,
  showStats = true,
  showNav = true,
}: AppLayoutProps) {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Header title={title} showBack={showBack} showStats={showStats} />
      <main className={`container max-w-lg mx-auto px-4 py-6 ${showNav && isAuthenticated ? 'pb-24' : 'pb-6'}`}>
        {children}
      </main>
      {showNav && isAuthenticated && <BottomNav />}
    </div>
  );
}
