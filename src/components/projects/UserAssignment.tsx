import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { User, Plus, X } from 'lucide-react';
import { Button } from '../ui/Button';
import api from '../../lib/axios';

interface User {
  id: string;
  name: string;
  email: string;
}

interface UserAssignmentProps {
  projectId: string;
  onUpdate: () => void;
}

export function UserAssignment({ projectId, onUpdate }: UserAssignmentProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [assignedUsers, setAssignedUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
    fetchAssignedUsers();
  }, [projectId]);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (error) {
      toast.error('Failed to fetch users');
    }
  };

  const fetchAssignedUsers = async () => {
    try {
      const response = await api.get(`/projects/${projectId}/users`);
      setAssignedUsers(response.data);
    } catch (error) {
      toast.error('Failed to fetch assigned users');
    } finally {
      setIsLoading(false);
    }
  };

  const assignUser = async (userId: string) => {
    try {
      await api.post(`/projects/${projectId}/users`, { userId });
      toast.success('User assigned successfully');
      fetchAssignedUsers();
      onUpdate();
    } catch (error) {
      toast.error('Failed to assign user');
    }
  };

  const removeUser = async (userId: string) => {
    try {
      await api.delete(`/projects/${projectId}/users/${userId}`);
      toast.success('User removed successfully');
      fetchAssignedUsers();
      onUpdate();
    } catch (error) {
      toast.error('Failed to remove user');
    }
  };

  if (isLoading) {
    return <div>Loading team members...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        {assignedUsers.map((user) => (
          <div
            key={user.id}
            className="flex items-center space-x-2 rounded-full bg-gray-100 px-4 py-2 dark:bg-gray-800"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900">
              <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
                {user.name.charAt(0)}
              </span>
            </div>
            <span className="text-sm font-medium">{user.name}</span>
            <button
              onClick={() => removeUser(user.id)}
              className="text-gray-400 hover:text-red-500"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <select
          onChange={(e) => assignUser(e.target.value)}
          className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
          value=""
        >
          <option value="">Add team member</option>
          {users
            .filter(
              (user) =>
                !assignedUsers.find((assigned) => assigned.id === user.id)
            )
            .map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
        </select>
      </div>
    </div>
  );
}