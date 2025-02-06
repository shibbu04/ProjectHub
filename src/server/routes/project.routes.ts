import { Router } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma';

const router = Router();

const ProjectSchema = z.object({
  name: z.string().min(2),
  description: z.string(),
  status: z.enum(['PLANNED', 'ONGOING', 'COMPLETED']),
});

router.post('/', async (req: any, res, next) => {
  try {
    const data = ProjectSchema.parse(req.body);
    const project = await prisma.project.create({
      data: {
        ...data,
        userId: req.user.id,
      },
    });
    res.json(project);
  } catch (error) {
    next(error);
  }
});

router.get('/', async (req: any, res, next) => {
  try {
    const projects = await prisma.project.findMany({
      where: { userId: req.user.id },
      include: {
        tasks: true,
      },
    });
    res.json(projects);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req: any, res, next) => {
  try {
    const { id } = req.params;
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        tasks: {
          include: {
            assignedUser: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(project);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req: any, res, next) => {
  try {
    const { id } = req.params;
    const data = ProjectSchema.partial().parse(req.body);
    
    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updatedProject = await prisma.project.update({
      where: { id },
      data,
    });
    res.json(updatedProject);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req: any, res, next) => {
  try {
    const { id } = req.params;
    
    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await prisma.project.delete({
      where: { id },
    });
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

// Get project timeline
router.get('/:id/timeline', async (req: any, res, next) => {
  try {
    const { id } = req.params;
    
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        tasks: {
          include: {
            assignedUser: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Format timeline events
    const timeline = project.tasks.map(task => ({
      id: `task-${task.id}`,
      type: 'TASK_CREATED',
      description: `Task "${task.title}" was created and assigned to ${task.assignedUser.name}`,
      timestamp: task.createdAt,
      user: {
        name: task.assignedUser.name,
      },
    }));

    res.json(timeline);
  } catch (error) {
    next(error);
  }
});

// Get project users
router.get('/:id/users', async (req: any, res, next) => {
  try {
    const { id } = req.params;
    
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        tasks: {
          include: {
            assignedUser: true,
          },
        },
      },
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Get unique users from tasks
    const users = Array.from(
      new Set(project.tasks.map(task => task.assignedUser))
    ).filter(Boolean);

    res.json(users);
  } catch (error) {
    next(error);
  }
});

// Assign user to project
router.post('/:id/users', async (req: any, res, next) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Create a dummy task to associate user with project
    // In a real app, you might want a separate ProjectUser table
    await prisma.task.create({
      data: {
        title: 'Project Assignment',
        description: 'User assigned to project',
        status: 'TODO',
        projectId: id,
        assignedUserId: userId,
      },
    });

    res.status(201).json({ message: 'User assigned successfully' });
  } catch (error) {
    next(error);
  }
});

export { router as projectRouter };