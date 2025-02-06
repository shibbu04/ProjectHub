import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FolderKanban, 
  CheckSquare, 
  Users, 
  Settings,
  Menu,
  X,
  LogOut,
  ChevronRight,
  Boxes
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useThemeStore } from '../../store/theme.store';
import { useAuthStore } from '../../store/auth.store';
import { Button } from '../ui/Button';
import { ThemeToggle } from '../ui/ThemeToggle';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Projects', href: '/projects', icon: FolderKanban },
    { name: 'Tasks', href: '/tasks', icon: CheckSquare },
    { name: 'Team', href: '/team', icon: Users },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="flex min-h-screen bg-surface-50 dark:bg-surface-900">
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 transform bg-white transition-all duration-300 ease-in-out dark:bg-surface-800 lg:static lg:translate-x-0',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
          'glass'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center px-4">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <Boxes className="h-8 w-8 text-primary-500" />
              <span className="text-xl font-display font-bold bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
                ProjectHub
              </span>
            </Link>
            <button
              className="ml-auto rounded-lg p-2 text-surface-500 hover:bg-surface-100 lg:hidden dark:text-surface-400 dark:hover:bg-surface-700"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    'group flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-primary-500 text-white dark:bg-primary-600'
                      : 'text-surface-600 hover:bg-surface-100 dark:text-surface-400 dark:hover:bg-surface-700'
                  )}
                >
                  <Icon className={cn('h-5 w-5', isActive ? 'text-white' : '')} />
                  <span>{item.name}</span>
                  {isActive && (
                    <ChevronRight className="ml-auto h-4 w-4 text-white" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User */}
          <div className="border-t border-surface-200 p-4 dark:border-surface-700">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 overflow-hidden rounded-full bg-gradient-to-br from-primary-500 to-accent-500">
                <div className="flex h-full w-full items-center justify-center text-lg font-medium text-white">
                  {user?.name.charAt(0)}
                </div>
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-sm font-medium text-surface-900 dark:text-white">
                  {user?.name}
                </p>
                <p className="truncate text-xs text-surface-500 dark:text-surface-400">
                  {user?.email}
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => logout()}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </Button>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        {/* Mobile header */}
        <header
          className={cn(
            'sticky top-0 z-40 flex h-16 items-center border-b border-surface-200 bg-white/80 backdrop-blur-md transition-all dark:border-surface-700 dark:bg-surface-800/80 lg:hidden',
            isScrolled ? 'shadow-sm' : ''
          )}
        >
          <div className="flex w-full items-center px-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="rounded-lg p-2 text-surface-500 hover:bg-surface-100 dark:text-surface-400 dark:hover:bg-surface-700"
            >
              <Menu className="h-5 w-5" />
            </button>
            <Link
              to="/dashboard"
              className="ml-4 flex items-center space-x-2"
            >
              <Boxes className="h-6 w-6 text-primary-500" />
              <span className="text-lg font-display font-bold bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
                ProjectHub
              </span>
            </Link>
            <div className="ml-auto">
              <ThemeToggle />
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-surface-200 py-4 dark:border-surface-700">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <p className="text-sm text-surface-500 dark:text-surface-400">
                © 2025 ProjectHub. All rights reserved.
              </p>
              <div className="flex items-center space-x-4">
                <a
                  href="#"
                  className="text-sm text-surface-500 hover:text-surface-900 dark:text-surface-400 dark:hover:text-white"
                >
                  Privacy Policy
                </a>
                <a
                  href="#"
                  className="text-sm text-surface-500 hover:text-surface-900 dark:text-surface-400 dark:hover:text-white"
                >
                  Terms of Service
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}