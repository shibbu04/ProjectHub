import { useState, useEffect } from 'react';
import { Layout } from '../components/layout/Layout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Search, Mail, Calendar, Plus, BarChart3, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { InviteMemberDialog } from '../components/team/InviteMemberDailog';
import api from '../lib/axios';

interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  projects: {
    id: string;
    name: string;
  }[];
  tasks: {
    id: string;
    title: string;
    status: string;
  }[];
}

export function TeamPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (error) {
      toast.error('Failed to fetch team members');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header Section */}
        {/* <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 p-8 text-white">
          <div className="relative z-10">
            <h1 className="text-3xl font-display font-bold">Team</h1>
            <p className="mt-2 text-primary-100">
              Manage your team members and their roles.
            </p>
          </div>
          <div className="absolute right-0 top-0 h-full w-1/2">
            <div className="absolute inset-0 bg-white/10" />
            <div className="absolute inset-0 bg-gradient-to-l from-white/20" />
          </div>
        </div> */}

        {/* Search and Actions */}
        <Card variant="glass" className="p-6">
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-400" />
              <Input
                type="text"
                placeholder="Search team members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button onClick={() => setIsInviteDialogOpen(true)} className="whitespace-nowrap">
              <Plus className="mr-2 h-4 w-4" />
              Invite Member
            </Button>
          </div>
        </Card>

        {/* Team Members Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredUsers.map((user) => (
              <Card key={user.id} variant="glass" className="p-6 transition-all duration-200 hover:shadow-lg">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-accent-500">
                      <span className="text-lg font-medium text-white">
                        {user.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-display font-medium">{user.name}</h3>
                      <div className="mt-1 flex items-center space-x-2 text-sm text-surface-500">
                        <Mail className="h-4 w-4" />
                        <span>{user.email}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="rounded-lg bg-surface-50 p-4 dark:bg-surface-800">
                    <div className="flex items-center space-x-2">
                      <BarChart3 className="h-5 w-5 text-primary-500" />
                      <span className="text-sm text-surface-500">Projects</span>
                    </div>
                    <p className="mt-2 text-2xl font-semibold">
                      {user.projects?.length || 0}
                    </p>
                  </div>
                  <div className="rounded-lg bg-surface-50 p-4 dark:bg-surface-800">
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="h-5 w-5 text-accent-500" />
                      <span className="text-sm text-surface-500">Tasks</span>
                    </div>
                    <p className="mt-2 text-2xl font-semibold">
                      {user.tasks?.length || 0}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center space-x-2 text-sm text-surface-500">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Joined {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        )}

        <InviteMemberDialog
          isOpen={isInviteDialogOpen}
          onClose={() => setIsInviteDialogOpen(false)}
          onInvited={fetchUsers}
        />
      </div>
    </Layout>
  );
}