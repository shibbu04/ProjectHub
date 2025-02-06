import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { MoreVertical, Trash2, User } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import api from '../../lib/axios';

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  assignedUser: {
    id: string;
    name: string;
    email: string;
  };
  project: {
    id: string;
    name: string;
  };
}

interface TaskCardProps {
  task: Task;
  onUpdate: () => void;
}

export function TaskCard({ task, onUpdate }: TaskCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteTask = async () => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    setIsDeleting(true);
    try {
      await api.delete(`/tasks/${task.id}`);
      toast.success('Task deleted successfully');
      onUpdate();
    } catch (error) {
      toast.error('Failed to delete task');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className="bg-white dark:bg-gray-800">
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="font-medium">{task.title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {task.description}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={deleteTask}
            disabled={isDeleting}
          >
            <Trash2 className="h-4 w-4 text-gray-500 hover:text-red-500" />
          </Button>
        </div>
        <div className="mt-4 flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4 text-gray-400" />
            <span className="text-gray-600 dark:text-gray-300">
              {task.assignedUser.name}
            </span>
          </div>
          <span className="text-xs text-gray-500">{task.project.name}</span>
        </div>
      </div>
    </Card>
  );
}