import { useEffect, useState } from 'react';
import { Clock, User, CheckCircle2 } from 'lucide-react';
import api from '../../lib/axios';

interface TimelineEvent {
  id: string;
  type: 'TASK_CREATED' | 'TASK_COMPLETED' | 'STATUS_CHANGED' | 'USER_ASSIGNED';
  description: string;
  timestamp: string;
  user: {
    name: string;
  };
}

interface ProjectTimelineProps {
  projectId: string;
}

export function ProjectTimeline({ projectId }: ProjectTimelineProps) {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTimeline();
  }, [projectId]);

  const fetchTimeline = async () => {
    try {
      const response = await api.get(`/projects/${projectId}/timeline`);
      setEvents(response.data);
    } catch (error) {
      console.error('Failed to fetch timeline:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div>Loading timeline...</div>;
  }

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'TASK_CREATED':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'TASK_COMPLETED':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'USER_ASSIGNED':
        return <User className="h-5 w-5 text-purple-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-4">
      {events.map((event) => (
        <div
          key={event.id}
          className="flex items-start space-x-3 border-l-2 border-gray-200 pl-4 dark:border-gray-700"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm dark:bg-gray-800">
            {getEventIcon(event.type)}
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {event.description}
            </p>
            <div className="mt-1 flex items-center space-x-2 text-xs text-gray-500">
              <span>{event.user.name}</span>
              <span>•</span>
              <span>{new Date(event.timestamp).toLocaleString()}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}