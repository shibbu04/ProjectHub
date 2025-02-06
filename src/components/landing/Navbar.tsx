import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Boxes, Menu, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { ThemeToggle } from '../ui/ThemeToggle';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-surface-200 bg-white/80 backdrop-blur-md dark:border-surface-700 dark:bg-surface-900/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Boxes className="h-8 w-8 text-primary-500" />
            <span className="text-xl font-display font-bold bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
              ProjectHub
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center space-x-8 md:flex">
            <Link to="/#features" className="text-surface-600 hover:text-primary-500 dark:text-surface-400">
              Features
            </Link>
            <Link to="/#pricing" className="text-surface-600 hover:text-primary-500 dark:text-surface-400">
              Pricing
            </Link>
            <Link to="/#about" className="text-surface-600 hover:text-primary-500 dark:text-surface-400">
              About
            </Link>
            <ThemeToggle />
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="outline">Sign In</Button>
              </Link>
              <Link to="/register">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-4 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="rounded-lg p-2 text-surface-500 hover:bg-surface-100 dark:text-surface-400 dark:hover:bg-surface-800"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="border-t border-surface-200 bg-white dark:border-surface-700 dark:bg-surface-900 md:hidden">
          <div className="space-y-1 px-4 py-3">
            <Link
              to="/#features"
              className="block rounded-lg px-3 py-2 text-base font-medium text-surface-600 hover:bg-surface-100 dark:text-surface-400 dark:hover:bg-surface-800"
            >
              Features
            </Link>
            <Link
              to="/#pricing"
              className="block rounded-lg px-3 py-2 text-base font-medium text-surface-600 hover:bg-surface-100 dark:text-surface-400 dark:hover:bg-surface-800"
            >
              Pricing
            </Link>
            <Link
              to="/#about"
              className="block rounded-lg px-3 py-2 text-base font-medium text-surface-600 hover:bg-surface-100 dark:text-surface-400 dark:hover:bg-surface-800"
            >
              About
            </Link>
            <div className="mt-4 space-y-2">
              <Link to="/login" className="block w-full">
                <Button variant="outline" className="w-full">Sign In</Button>
              </Link>
              <Link to="/register" className="block w-full">
                <Button className="w-full">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}