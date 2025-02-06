import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { userRouter } from './routes/user.routes';
import { projectRouter } from './routes/project.routes';
import { taskRouter } from './routes/task.routes';
import { dashboardRouter } from './routes/dashboard.routes';
import { errorHandler } from './middleware/error.middleware';
import { authenticateToken } from './middleware/auth.middleware';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL;

app.use(cors({ origin: FRONTEND_URL }));
app.use(express.json());

// Public routes
app.use('/api/auth', userRouter);

// Protected routes
app.use('/api/users', authenticateToken, userRouter);
app.use('/api/dashboard', authenticateToken, dashboardRouter);
app.use('/api/projects', authenticateToken, projectRouter);
app.use('/api/tasks', authenticateToken, taskRouter);

// Add project-specific task routes
app.use('/api/projects/:projectId/tasks', authenticateToken, taskRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});