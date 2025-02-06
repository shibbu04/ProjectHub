import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { TaskCard } from '../tasks/TaskCard';
import { CreateTaskDialog } from '../tasks/CreateTaskDailog';
import { Button } from '../ui/Button';
import { Plus } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../../lib/axios';

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

interface TaskListProps {
  projectId: string;
  onUpdate: () => void;
}

export function TaskList({ projectId, onUpdate }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (projectId) {
      fetchTasks();
    }
  }, [projectId]);

  const fetchTasks = async () => {
    try {
      const response = await api.get(`/projects/${projectId}/tasks`);
      setTasks(response.data);
    } catch (error) {
      toast.error('Failed to fetch tasks');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTaskCreated = () => {
    fetchTasks();
    onUpdate();
  };

  const getColumnTasks = (status: string) => {
    return tasks.filter(task => task.status === status);
  };

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    try {
      await api.put(`/tasks/${draggableId}`, {
        status: destination.droppableId,
      });

      // Optimistically update the UI
      const updatedTasks = tasks.map(task => {
        if (task.id === draggableId) {
          return { ...task, status: destination.droppableId };
        }
        return task;
      });
      setTasks(updatedTasks);
      onUpdate();
    } catch (error) {
      toast.error('Failed to update task status');
      fetchTasks(); // Refresh to get the correct state
    }
  };

  if (isLoading) {
    return <div>Loading tasks...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h3 className="text-lg font-medium">Tasks</h3>
        <Button size="sm" onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {['TODO', 'IN_PROGRESS', 'DONE'].map((status) => (
            <div
              key={status}
              className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800"
            >
              <h4 className="mb-4 text-sm font-medium text-gray-500">
                {status === 'TODO'
                  ? 'To Do'
                  : status === 'IN_PROGRESS'
                  ? 'In Progress'
                  : 'Completed'}{' '}
                ({getColumnTasks(status).length})
              </h4>
              <Droppable droppableId={status}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="space-y-2"
                  >
                    {getColumnTasks(status).map((task, index) => (
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
            </div>
          ))}
        </div>
      </DragDropContext>

      <CreateTaskDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onTaskCreated={handleTaskCreated}
        projectId={projectId}
      />
    </div>
  );
}