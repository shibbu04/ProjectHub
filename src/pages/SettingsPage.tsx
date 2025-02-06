import { useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { 
  Bell, 
  Lock, 
  Moon, 
  User, 
  Shield, 
  Mail, 
  LogOut,
  Palette,
  Globe,
  Bell as BellIcon
} from 'lucide-react';
import { useThemeStore } from '../store/theme.store';
import { useAuthStore } from '../store/auth.store';
import { toast } from 'react-hot-toast';
import api from '../lib/axios';

export function SettingsPage() {
  const { isDarkMode, toggleTheme } = useThemeStore();
  const { user, logout } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [emailNotifications, setEmailNotifications] = useState(false);

  const updatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await api.put('/auth/password', {
        currentPassword,
        newPassword,
      });
      toast.success('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
    } catch (error) {
      toast.error('Failed to update password');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleNotifications = () => {
    setEmailNotifications(!emailNotifications);
    toast.success(`Email notifications ${!emailNotifications ? 'enabled' : 'disabled'}`);
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header Section */}
        {/* <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 p-8 text-white">
          <div className="relative z-10">
            <h1 className="text-3xl font-display font-bold">Settings</h1>
            <p className="mt-2 text-primary-100">
              Manage your account preferences and settings.
            </p>
          </div>
          <div className="absolute right-0 top-0 h-full w-1/2">
            <div className="absolute inset-0 bg-white/10" />
            <div className="absolute inset-0 bg-gradient-to-l from-white/20" />
          </div>
        </div> */}

        <div className="grid gap-6 md:grid-cols-2">
          {/* Profile Settings */}
          <Card variant="glass" className="p-6">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-primary-500" />
              <h2 className="text-xl font-display font-semibold">Profile</h2>
            </div>
            <div className="mt-6 space-y-4">
              <div className="flex items-center space-x-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-accent-500">
                  <span className="text-2xl font-medium text-white">
                    {user?.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="font-medium">{user?.name}</h3>
                  <p className="text-sm text-surface-500">{user?.email}</p>
                </div>
              </div>
              <div className="space-y-4 pt-4">
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300">
                    Name
                  </label>
                  <Input
                    type="text"
                    value={user?.name}
                    disabled
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300">
                    Email
                  </label>
                  <Input
                    type="email"
                    value={user?.email}
                    disabled
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Security Settings */}
          <Card variant="glass" className="p-6">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-accent-500" />
              <h2 className="text-xl font-display font-semibold">Security</h2>
            </div>
            <form onSubmit={updatePassword} className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300">
                  Current Password
                </label>
                <Input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="mt-1"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300">
                  New Password
                </label>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="mt-1"
                  required
                />
              </div>
              <Button type="submit" isLoading={isLoading}>
                <Lock className="mr-2 h-4 w-4" />
                Update Password
              </Button>
            </form>
          </Card>

          {/* Preferences */}
          <Card variant="glass" className="p-6">
            <div className="flex items-center space-x-2">
              <Palette className="h-5 w-5 text-primary-500" />
              <h2 className="text-xl font-display font-semibold">Preferences</h2>
            </div>
            <div className="mt-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Dark Mode</p>
                  <p className="text-sm text-surface-500">
                    Toggle dark mode appearance
                  </p>
                </div>
                <Button variant="outline" onClick={toggleTheme}>
                  <Moon className="mr-2 h-4 w-4" />
                  {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Language</p>
                  <p className="text-sm text-surface-500">
                    Choose your preferred language
                  </p>
                </div>
                <Button variant="outline">
                  <Globe className="mr-2 h-4 w-4" />
                  English
                </Button>
              </div>
            </div>
          </Card>

          {/* Notifications */}
          <Card variant="glass" className="p-6">
            <div className="flex items-center space-x-2">
              <BellIcon className="h-5 w-5 text-accent-500" />
              <h2 className="text-xl font-display font-semibold">Notifications</h2>
            </div>
            <div className="mt-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-surface-500">
                    Receive email notifications for important updates
                  </p>
                </div>
                <Button 
                  variant="outline"
                  onClick={toggleNotifications}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  {emailNotifications ? 'Disable' : 'Enable'}
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Push Notifications</p>
                  <p className="text-sm text-surface-500">
                    Get instant notifications in your browser
                  </p>
                </div>
                <Button variant="outline">
                  <Bell className="mr-2 h-4 w-4" />
                  Configure
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Sign Out */}
        <div className="flex justify-end">
          <Button
            variant="outline"
            onClick={() => {
              logout();
              toast.success('Logged out successfully');
            }}
            className="text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>
    </Layout>
  );
}