import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

import roadmapRoutes from '../src/routes/roadmap';
import videoRoutes from '../src/routes/videos';
import userRoutes from '../src/routes/users';
import progressRoutes from '../src/routes/progress';
import notesRoutes from '../src/routes/notes';
import practiceRoutes from '../src/routes/practice';
import resourcesRoutes from '../src/routes/resources';

dotenv.config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.FRONTEND_URL || 'https://edu-path.vercel.app', 'https://edu-path-balajibhargav6.vercel.app']
    : 'http://localhost:3000',
  credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/roadmap', roadmapRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/users', userRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/practice', practiceRoutes);
app.use('/api/resources', resourcesRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'EduPath API Server', status: 'running' });
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error' 
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Route not found', path: req.path });
});

export default app;
