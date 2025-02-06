import { Link } from 'react-router-dom';
import { Navbar } from '../components/landing/Navbar';
import { Footer } from '../components/landing/Footer';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { 
  BarChart3, 
  Users, 
  Clock, 
  Shield,
  CheckCircle2,
  Zap,
  LineChart,
  Layout as LayoutIcon
} from 'lucide-react';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-900">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="relative z-10 flex flex-col items-center text-center">
            <h1 className="text-4xl font-display font-bold sm:text-6xl">
              <span className="bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
                Modern Project Management
              </span>
              <br />
              for Modern Teams
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-surface-600 dark:text-surface-400">
              Stay organized, collaborate effectively, and deliver results with our intuitive project management platform.
            </p>
            <div className="mt-10 flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
              <Link to="/register">
                <Button size="lg">Get Started for Free</Button>
              </Link>
              <Link to="/#features">
                <Button variant="outline" size="lg">Learn More</Button>
              </Link>
            </div>
          </div>
          <div className="relative mt-16">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-surface-200 dark:border-surface-700" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-display font-bold sm:text-4xl">
              Everything you need to manage projects effectively
            </h2>
            <p className="mt-4 text-lg text-surface-600 dark:text-surface-400">
              Powerful features to help your team stay organized and productive.
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: LayoutIcon,
                title: 'Intuitive Interface',
                description: 'Clean and modern interface thats easy to navigate and use.',
              },
              {
                icon: Users,
                title: 'Team Collaboration',
                description: 'Work together seamlessly with your team members.',
              },
              {
                icon: Clock,
                title: 'Time Tracking',
                description: 'Monitor project progress and team productivity.',
              },
              {
                icon: Shield,
                title: 'Secure Platform',
                description: 'Enterprise-grade security to protect your data.',
              },
              {
                icon: LineChart,
                title: 'Analytics',
                description: 'Detailed insights into project performance.',
              },
              {
                icon: Zap,
                title: 'Automation',
                description: 'Automate repetitive tasks and workflows.',
              },
            ].map((feature, index) => (
              <Card
                key={index}
                variant="glass"
                className="p-6 transition-all duration-200 hover:shadow-lg"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100 dark:bg-primary-900">
                  <feature.icon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="mt-4 text-lg font-display font-semibold">
                  {feature.title}
                </h3>
                <p className="mt-2 text-surface-600 dark:text-surface-400">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-24 dark:bg-surface-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Users, label: 'Active Users', value: '10,000+' },
              { icon: BarChart3, label: 'Projects Managed', value: '50,000+' },
              { icon: CheckCircle2, label: 'Tasks Completed', value: '1M+' },
              { icon: Clock, label: 'Hours Saved', value: '500,000+' },
            ].map((stat, index) => (
              <Card key={index} variant="glass" className="p-6 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100 dark:bg-primary-900">
                  <stat.icon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                </div>
                <p className="mt-4 text-3xl font-display font-bold">{stat.value}</p>
                <p className="mt-2 text-surface-600 dark:text-surface-400">
                  {stat.label}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}