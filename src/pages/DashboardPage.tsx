import { useEffect, useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { Card } from '../components/ui/Card';
import { TaskCard } from '../components/tasks/TaskCard';
import { 
  BarChart3, 
  CheckCircle2, 
  Clock, 
  ListTodo,
  Users,
  TrendingUp,
  Calendar,
  Activity
} from 'lucide-react';
import { useAuthStore } from '../store/auth.store';
import api from '../lib/axios';

interface DashboardStats {
  totalProjects: number;
  completedProjects: number;
  totalTasks: number;
  completedTasks: number;
  activeUsers: number;
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  project: {
    id: string;
    name: string;
  };
  assignedUser: {
    id: string;
    name: string;
  };
}

interface RecentActivity {
  id: string;
  type: 'PROJECT_CREATED' | 'TASK_COMPLETED' | 'TASK_ASSIGNED';
  description: string;
  timestamp: string;
}

export function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    completedProjects: 0,
    totalTasks: 0,
    completedTasks: 0,
    activeUsers: 0
  });
  const [assignedTasks, setAssignedTasks] = useState<Task[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsResponse, activityResponse, tasksResponse] = await Promise.all([
          api.get('/dashboard/stats'),
          api.get('/dashboard/activity'),
          api.get(`/tasks?assignedUserId=${user?.id}`),
        ]);
        setStats(statsResponse.data);
        setRecentActivity(activityResponse.data);
        setAssignedTasks(tasksResponse.data);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.id) {
      fetchDashboardData();
    }
  }, [user?.id]);

  return (
    <Layout>
      <div className="space-y-8">
        {/* Welcome Section */}
        {/* <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 p-8 text-white">
          <div className="relative z-10">
            <h1 className="text-3xl font-display font-bold">
              Welcome back, {user?.name}!
            </h1>
            <p className="mt-2 text-primary-100">
              Here's what's happening with your projects today.
            </p>
          </div>
          <div className="absolute right-0 top-0 h-full w-1/2">
            <div className="absolute inset-0 bg-white/10" />
            <div className="absolute inset-0 bg-gradient-to-l from-white/20" />
          </div>
        </div> */}

        {/* Stats Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card variant="glass" className="p-6">
            <div className="flex items-center space-x-4">
              <div className="rounded-full bg-primary-100/10 p-3 dark:bg-primary-900/10">
                <BarChart3 className="h-6 w-6 text-primary-500" />
              </div>
              <div>
                <p className="text-sm text-surface-600 dark:text-surface-400">Projects</p>
                <p className="text-2xl font-bold">{stats.totalProjects}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center space-x-2 text-sm">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-green-500">12% increase</span>
              <span className="text-surface-400">from last month</span>
            </div>
          </Card>

          <Card variant="glass" className="p-6">
            <div className="flex items-center space-x-4">
              <div className="rounded-full bg-green-100/10 p-3 dark:bg-green-900/10">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-surface-600 dark:text-surface-400">Completed</p>
                <p className="text-2xl font-bold">{stats.completedProjects}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center space-x-2 text-sm">
              <Calendar className="h-4 w-4 text-surface-400" />
              <span className="text-surface-400">Last 30 days</span>
            </div>
          </Card>

          <Card variant="glass" className="p-6">
            <div className="flex items-center space-x-4">
              <div className="rounded-full bg-accent-100/10 p-3 dark:bg-accent-900/10">
                <ListTodo className="h-6 w-6 text-accent-500" />
              </div>
              <div>
                <p className="text-sm text-surface-600 dark:text-surface-400">Active Tasks</p>
                <p className="text-2xl font-bold">
                  {stats.totalTasks - stats.completedTasks}
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center space-x-2 text-sm">
              <Activity className="h-4 w-4 text-accent-500" />
              <span className="text-accent-500">High priority</span>
              <span className="text-surface-400">tasks pending</span>
            </div>
          </Card>

          <Card variant="glass" className="p-6">
            <div className="flex items-center space-x-4">
              <div className="rounded-full bg-blue-100/10 p-3 dark:bg-blue-900/10">
                <Users className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-surface-600 dark:text-surface-400">Team Members</p>
                <p className="text-2xl font-bold">{stats.activeUsers}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center space-x-2 text-sm">
              <Clock className="h-4 w-4 text-surface-400" />
              <span className="text-surface-400">Active now</span>
            </div>
          </Card>
        </div>

        {/* Tasks and Activity */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* My Tasks */}
          <Card variant="glass" className="p-6">
            <h2 className="text-xl font-display font-semibold mb-4">My Tasks</h2>
            <div className="space-y-4">
              {assignedTasks.map((task) => (
                <TaskCard 
                  key={task.id} 
                  task={task} 
                  onUpdate={() => {
                    api.get(`/tasks?assignedUserId=${user?.id}`)
                      .then(response => setAssignedTasks(response.data))
                      .catch(console.error);
                  }} 
                />
              ))}
              {assignedTasks.length === 0 && (
                <div className="text-center py-8">
                  <ListTodo className="h-12 w-12 mx-auto text-surface-400 mb-4" />
                  <p className="text-surface-600 dark:text-surface-400">
                    No tasks assigned yet
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Recent Activity */}
          <Card variant="glass" className="p-6">
            <h2 className="text-xl font-display font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start space-x-3 border-l-2 border-surface-200 pl-4 dark:border-surface-700"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-100 dark:bg-surface-800">
                    <Activity className="h-4 w-4 text-primary-500" />
                  </div>
                  <div>
                    <p className="text-sm text-surface-600 dark:text-surface-400">
                      {activity.description}
                    </p>
                    <p className="mt-1 text-xs text-surface-400">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
              {recentActivity.length === 0 && (
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 mx-auto text-surface-400 mb-4" />
                  <p className="text-surface-600 dark:text-surface-400">
                    No recent activity
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
}