import { Router } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma';

const router = Router();

const TaskSchema = z.object({
  title: z.string().min(2),
  description: z.string(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']),
  projectId: z.string().uuid(),
  assignedUserId: z.string().uuid(),
});

router.post('/', async (req: any, res, next) => {
  try {
    const data = TaskSchema.parse(req.body);
    
    // Verify project exists and user has access
    const project = await prisma.project.findUnique({
      where: { id: data.projectId },
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to create tasks in this project' });
    }

    const task = await prisma.task.create({
      data,
      include: {
        assignedUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        project: true,
      },
    });
    res.json(task);
  } catch (error) {
    next(error);
  }
});

router.get('/', async (req: any, res, next) => {
  try {
    const { status, assignedUserId, projectId } = req.query;
    
    const tasks = await prisma.task.findMany({
      where: {
        status: status as any,
        assignedUserId,
        projectId,
        project: {
          userId: req.user.id,
        },
      },
      include: {
        assignedUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        project: true,
      },
    });
    res.json(tasks);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req: any, res, next) => {
  try {
    const { id } = req.params;
    const data = TaskSchema.partial().parse(req.body);
    
    const task = await prisma.task.findUnique({
      where: { id },
      include: { project: true },
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.project.userId !== req.user.id && task.assignedUserId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data,
      include: {
        assignedUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        project: true,
      },
    });
    res.json(updatedTask);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req: any, res, next) => {
  try {
    const { id } = req.params;
    
    const task = await prisma.task.findUnique({
      where: { id },
      include: { project: true },
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.project.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await prisma.task.delete({
      where: { id },
    });
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

export { router as taskRouter };