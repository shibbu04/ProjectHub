import { Link } from 'react-router-dom';
import { LoginForm } from '../components/auth/LoginForm';
import { Navbar } from '../components/landing/Navbar';
import { Footer } from '../components/landing/Footer';
import { Card } from '../components/ui/Card';

export function LoginPage() {
  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-900">
      <Navbar />
      
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <Card variant="glass" className="w-full max-w-md space-y-8 p-8">
          <div className="text-center">
            <h2 className="text-3xl font-display font-bold tracking-tight">Welcome back</h2>
            <p className="mt-2 text-sm text-surface-600 dark:text-surface-400">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
              >
                Sign up
              </Link>
            </p>
          </div>
          <div className="mt-8">
            <LoginForm />
          </div>
        </Card>
      </div>

      <Footer />
    </div>
  );
}