import { Link } from 'react-router-dom';
import { Boxes, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-surface-200 bg-white dark:border-surface-700 dark:bg-surface-900">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <Boxes className="h-8 w-8 text-primary-500" />
              <span className="text-xl font-display font-bold bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
                ProjectHub
              </span>
            </Link>
            <p className="text-sm text-surface-500 dark:text-surface-400">
              Modern project management for teams of all sizes. Stay organized, collaborate effectively, and deliver results.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-surface-400 hover:text-primary-500 dark:hover:text-primary-400">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-surface-400 hover:text-primary-500 dark:hover:text-primary-400">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-surface-400 hover:text-primary-500 dark:hover:text-primary-400">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-surface-400 hover:text-primary-500 dark:hover:text-primary-400">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-sm font-semibold text-surface-900 dark:text-white">Product</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/#features" className="text-sm text-surface-500 hover:text-primary-500 dark:text-surface-400">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/#pricing" className="text-sm text-surface-500 hover:text-primary-500 dark:text-surface-400">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-sm text-surface-500 hover:text-primary-500 dark:text-surface-400">
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-surface-900 dark:text-white">Company</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/#about" className="text-sm text-surface-500 hover:text-primary-500 dark:text-surface-400">
                  About
                </Link>
              </li>
              <li>
                <Link to="#" className="text-sm text-surface-500 hover:text-primary-500 dark:text-surface-400">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="#" className="text-sm text-surface-500 hover:text-primary-500 dark:text-surface-400">
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-surface-900 dark:text-white">Support</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="#" className="text-sm text-surface-500 hover:text-primary-500 dark:text-surface-400">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="#" className="text-sm text-surface-500 hover:text-primary-500 dark:text-surface-400">
                  Privacy
                </Link>
              </li>
              <li>
                <Link to="#" className="text-sm text-surface-500 hover:text-primary-500 dark:text-surface-400">
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-surface-200 pt-8 dark:border-surface-700">
          <p className="text-center text-sm text-surface-500 dark:text-surface-400">
            © {new Date().getFullYear()} ProjectHub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}