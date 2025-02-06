import { Link } from 'react-router-dom';
import { RegisterForm } from '../components/auth/RegisterForm';
import { Navbar } from '../components/landing/Navbar';
import { Footer } from '../components/landing/Footer';
import { Card } from '../components/ui/Card';

export function RegisterPage() {
  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-900">
      <Navbar />
      
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <Card variant="glass" className="w-full max-w-md space-y-8 p-8">
          <div className="text-center">
            <h2 className="text-3xl font-display font-bold tracking-tight">Create an account</h2>
            <p className="mt-2 text-sm text-surface-600 dark:text-surface-400">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
              >
                Sign in
              </Link>
            </p>
          </div>
          <div className="mt-8">
            <RegisterForm />
          </div>
        </Card>
      </div>

      <Footer />
    </div>
  );
}