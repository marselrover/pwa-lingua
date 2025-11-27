import { Home, BookOpen, Layers, Trophy, User } from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/vocabulary', icon: BookOpen, label: 'Learn' },
  { to: '/flashcards', icon: Layers, label: 'Cards' },
  { to: '/quiz', icon: Trophy, label: 'Quiz' },
  { to: '/profile', icon: User, label: 'Profile' },
];

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-border/50 safe-bottom">
      <div className="container max-w-lg mx-auto">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-200"
              activeClassName="text-primary bg-primary/10"
            >
              {({ isActive }: { isActive: boolean }) => (
                <>
                  <item.icon
                    className={cn(
                      "w-6 h-6 transition-all duration-200",
                      isActive ? "text-primary scale-110" : "text-muted-foreground"
                    )}
                  />
                  <span
                    className={cn(
                      "text-xs font-medium transition-colors duration-200",
                      isActive ? "text-primary" : "text-muted-foreground"
                    )}
                  >
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}
