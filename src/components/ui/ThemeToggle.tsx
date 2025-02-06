import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import { useThemeStore } from '../../store/theme.store';

export function ThemeToggle() {
  const { isDarkMode, toggleTheme } = useThemeStore();
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <button
      onClick={toggleTheme}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative h-10 w-10 rounded-lg bg-surface-100 p-2 text-surface-600 transition-all hover:bg-surface-200 dark:bg-surface-800 dark:text-surface-400 dark:hover:bg-surface-700"
      aria-label="Toggle theme"
    >
      <div className="relative h-full w-full">
        <Sun
          className={`absolute h-full w-full transition-all ${
            isDarkMode
              ? 'rotate-90 scale-0 opacity-0'
              : 'rotate-0 scale-100 opacity-100'
          }`}
        />
        <Moon
          className={`absolute h-full w-full transition-all ${
            isDarkMode
              ? 'rotate-0 scale-100 opacity-100'
              : '-rotate-90 scale-0 opacity-0'
          }`}
        />
      </div>
      {isHovered && (
        <div className="absolute right-0 top-full mt-2 w-32 rounded-lg bg-white p-2 text-sm shadow-lg dark:bg-surface-800">
          <p className="text-center text-surface-600 dark:text-surface-400">
            Switch to {isDarkMode ? 'light' : 'dark'} mode
          </p>
        </div>
      )}
    </button>
  );
}