import { Router } from 'express';
import prisma from '../lib/prisma';

const router = Router();

router.get('/stats', async (req: any, res, next) => {
  try {
    const [
      totalProjects,
      completedProjects,
      totalTasks,
      completedTasks,
      activeUsers,
    ] = await Promise.all([
      prisma.project.count(),
      prisma.project.count({
        where: { status: 'COMPLETED' },
      }),
      prisma.task.count(),
      prisma.task.count({
        where: { status: 'DONE' },
      }),
      prisma.user.count(),
    ]);

    res.json({
      totalProjects,
      completedProjects,
      totalTasks,
      completedTasks,
      activeUsers,
    });
  } catch (error) {
    next(error);
  }
});

router.get('/activity', async (req: any, res, next) => {
  try {
    // This is a simplified version. In a real app, you'd have an Activity model
    const recentProjects = await prisma.project.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { user: true },
    });

    const recentTasks = await prisma.task.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { assignedUser: true, project: true },
    });

    // Combine and format activities
    const activities = [
      ...recentProjects.map((project) => ({
        id: `project-${project.id}`,
        type: 'PROJECT_CREATED' as const,
        description: `${project.user.name} created project "${project.name}"`,
        timestamp: project.createdAt,
      })),
      ...recentTasks.map((task) => ({
        id: `task-${task.id}`,
        type: 'TASK_ASSIGNED' as const,
        description: `${task.assignedUser.name} was assigned to "${task.title}" in ${task.project.name}`,
        timestamp: task.createdAt,
      })),
    ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, 10);

    res.json(activities);
  } catch (error) {
    next(error);
  }
});

export { router as dashboardRouter };