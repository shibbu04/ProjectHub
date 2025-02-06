import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { ProjectTimeline } from '../components/projects/ProjectTimeline';
import { TaskList } from '../components/projects/TaskList';
import { UserAssignment } from '../components/projects/UserAssignment';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Edit2,
  ListTodo,
  Users,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../lib/axios';

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'PLANNED' | 'ONGOING' | 'COMPLETED';
  createdAt: string;
  user: {
    id: string;
    name: string;
  };
  tasks: any[];
}

export function ProjectDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      const response = await api.get(`/projects/${id}`);
      setProject(response.data);
    } catch (error) {
      toast.error('Failed to fetch project details');
    } finally {
      setIsLoading(false);
    }
  };

  const updateProjectStatus = async (status: string) => {
    try {
      await api.put(`/projects/${id}`, { status });
      toast.success('Project status updated');
      fetchProject();
    } catch (error) {
      toast.error('Failed to update project status');
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="p-6">Loading...</div>
      </Layout>
    );
  }

  if (!project) {
    return (
      <Layout>
        <div className="p-6">Project not found</div>
      </Layout>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PLANNED':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'ONGOING':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <Layout>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">{project.name}</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              {project.description}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <span
              className={`rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(
                project.status
              )}`}
            >
              {project.status.toLowerCase()}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditMode(true)}
            >
              <Edit2 className="mr-2 h-4 w-4" />
              Edit Project
            </Button>
          </div>
        </div>

        {/* Project Stats */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="flex items-center space-x-4 p-6">
            <div className="rounded-full bg-primary-100 p-3 dark:bg-primary-900">
              <ListTodo className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total Tasks
              </p>
              <p className="text-2xl font-bold">{project.tasks.length}</p>
            </div>
          </Card>

          <Card className="flex items-center space-x-4 p-6">
            <div className="rounded-full bg-green-100 p-3 dark:bg-green-900">
              <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Completed Tasks
              </p>
              <p className="text-2xl font-bold">
                {project.tasks.filter((task) => task.status === 'DONE').length}
              </p>
            </div>
          </Card>

          <Card className="flex items-center space-x-4 p-6">
            <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900">
              <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Team Members
              </p>
              <p className="text-2xl font-bold">
                {new Set(project.tasks.map((task) => task.assignedUserId)).size}
              </p>
            </div>
          </Card>

          <Card className="flex items-center space-x-4 p-6">
            <div className="rounded-full bg-purple-100 p-3 dark:bg-purple-900">
              <Calendar className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Created On
              </p>
              <p className="text-sm font-medium">
                {new Date(project.createdAt).toLocaleDateString()}
              </p>
            </div>
          </Card>
        </div>

        {/* Tasks and Timeline */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card className="p-6">
              <h2 className="mb-4 text-xl font-semibold">Project Tasks</h2>
              <TaskList projectId={project.id} onUpdate={fetchProject} />
            </Card>
          </div>
          <div>
            <Card className="p-6">
              <h2 className="mb-4 text-xl font-semibold">Activity Timeline</h2>
              <ProjectTimeline projectId={project.id} />
            </Card>
          </div>
        </div>

        {/* Team Members */}
        <Card className="p-6">
          <h2 className="mb-4 text-xl font-semibold">Team Members</h2>
          <UserAssignment projectId={project.id} onUpdate={fetchProject} />
        </Card>
      </div>
    </Layout>
  );
}