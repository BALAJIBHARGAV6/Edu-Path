import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

import roadmapRoutes from './routes/roadmap';
import videoRoutes from './routes/videos';
import userRoutes from './routes/users';
import progressRoutes from './routes/progress';
import notesRoutes from './routes/notes';
import practiceRoutes from './routes/practice';
import resourcesRoutes from './routes/resources';

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || '5000', 10);

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [
        process.env.FRONTEND_URL || 'https://edu-path.vercel.app',
        'https://edu-path.vercel.app',
        'https://edu-path-learner.vercel.app',
        'https://edu-path-balajibhargav6.vercel.app',
        'https://edu-path-learn.vercel.app'
      ]
    : 'http://localhost:3000',
  credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json());

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'EduPath API Server', 
    version: '1.1.0',
    status: 'running',
    endpoints: ['/health', '/api/roadmap', '/api/videos', '/api/users', '/api/progress', '/api/notes', '/api/practice', '/api/resources', '/api/resources/chat']
  });
});

// Health check
app.get('/health', (req, res) => {
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
  res.status(404).json({ success: false, error: 'Route not found' });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 EduPath API Server running on port ${PORT}`);
  console.log(`📚 Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
