import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Layout } from '../components/layout/Layout';
import { TaskCard } from '../components/tasks/TaskCard';
import { CreateTaskDialog } from '../components/tasks/CreateTaskDailog';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { Plus, Search, Users, ListTodo, Clock, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../lib/axios';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
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

export function TasksPage() {
  const [tasks, setTasks] = useState<{ [key: string]: Task[] }>({
    TODO: [],
    IN_PROGRESS: [],
    DONE: [],
  });
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [assigneeFilter, setAssigneeFilter] = useState('');
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
    fetchUsers();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await api.get('/tasks');
      const groupedTasks = response.data.reduce(
        (acc: { [key: string]: Task[] }, task: Task) => {
          if (!acc[task.status]) {
            acc[task.status] = [];
          }
          acc[task.status].push(task);
          return acc;
        },
        { TODO: [], IN_PROGRESS: [], DONE: [] }
      );
      setTasks(groupedTasks);
    } catch (error) {
      toast.error('Failed to fetch tasks');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (error) {
      toast.error('Failed to fetch users');
    }
  };

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const sourceList = Array.from(tasks[source.droppableId]);
    const destList = Array.from(tasks[destination.droppableId]);
    const [removed] = sourceList.splice(source.index, 1);
    destList.splice(destination.index, 0, removed);

    setTasks({
      ...tasks,
      [source.droppableId]: sourceList,
      [destination.droppableId]: destList,
    });

    try {
      await api.put(`/tasks/${draggableId}`, {
        status: destination.droppableId,
      });
      toast.success('Task status updated');
    } catch (error) {
      toast.error('Failed to update task status');
      setTasks({
        ...tasks,
        [source.droppableId]: Array.from(tasks[source.droppableId]),
        [destination.droppableId]: Array.from(tasks[destination.droppableId]),
      });
    }
  };

  const filteredTasks = Object.entries(tasks).reduce(
    (acc: { [key: string]: Task[] }, [status, statusTasks]) => {
      acc[status] = statusTasks.filter(
        (task) =>
          task.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
          (!assigneeFilter || task.assignedUser.id === assigneeFilter)
      );
      return acc;
    },
    { TODO: [], IN_PROGRESS: [], DONE: [] }
  );

  const getColumnIcon = (status: string) => {
    switch (status) {
      case 'TODO':
        return <ListTodo className="h-5 w-5 text-primary-500" />;
      case 'IN_PROGRESS':
        return <Clock className="h-5 w-5 text-accent-500" />;
      case 'DONE':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      default:
        return null;
    }
  };

  const getColumnTitle = (status: string) => {
    switch (status) {
      case 'TODO':
        return 'To Do';
      case 'IN_PROGRESS':
        return 'In Progress';
      case 'DONE':
        return 'Done';
      default:
        return status;
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header Section */}
        {/* <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 p-8 text-white">
          <div className="relative z-10">
            <h1 className="text-3xl font-display font-bold">Tasks</h1>
            <p className="mt-2 text-primary-100">
              Organize and track your tasks with our intuitive kanban board.
            </p>
          </div>
          <div className="absolute right-0 top-0 h-full w-1/2">
            <div className="absolute inset-0 bg-white/10" />
            <div className="absolute inset-0 bg-gradient-to-l from-white/20" />
          </div>
        </div> */}

        {/* Search and Filters */}
        <Card variant="glass" className="p-6">
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-400" />
              <Input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Users className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-400" />
                <select
                  value={assigneeFilter}
                  onChange={(e) => setAssigneeFilter(e.target.value)}
                  className="h-10 rounded-lg border border-surface-200 bg-white pl-10 pr-4 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500 dark:border-surface-700 dark:bg-surface-800"
                >
                  <option value="">All Assignees</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </select>
              </div>
              <Button onClick={() => setIsCreateDialogOpen(true)} className="whitespace-nowrap">
                <Plus className="mr-2 h-4 w-4" />
                New Task
              </Button>
            </div>
          </div>
        </Card>

        {/* Kanban Board */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
          </div>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {Object.entries(filteredTasks).map(([status, statusTasks]) => (
                <Card
                  key={status}
                  variant="glass"
                  className="flex flex-col p-4"
                >
                  <div className="mb-4 flex items-center space-x-2">
                    {getColumnIcon(status)}
                    <h2 className="text-lg font-display font-semibold">
                      {getColumnTitle(status)}{' '}
                      <span className="ml-2 text-sm text-surface-500">
                        ({statusTasks.length})
                      </span>
                    </h2>
                  </div>
                  <Droppable droppableId={status}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="flex-1 space-y-4"
                      >
                        {statusTasks.map((task, index) => (
                          <Draggable
                            key={task.id}
                            draggableId={task.id}
                            index={index}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <TaskCard task={task} onUpdate={fetchTasks} />
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </Card>
              ))}
            </div>
          </DragDropContext>
        )}

        <CreateTaskDialog
          isOpen={isCreateDialogOpen}
          onClose={() => setIsCreateDialogOpen(false)}
          onTaskCreated={fetchTasks}
          users={users}
        />
      </div>
    </Layout>
  );
}