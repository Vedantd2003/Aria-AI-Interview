import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import { env } from './config/env';
import { connectDB } from './config/db';
import { corsOptions } from './config/cors';
import { errorHandler } from './middleware/errorHandler';
import { apiLimiter } from './middleware/rateLimit';

import authRoutes from './routes/auth';
import interviewRoutes from './routes/interview';
import feedbackRoutes from './routes/feedback';
import userRoutes from './routes/user';
import webhookRoutes from './routes/webhook';

const app = express();

app.use(
  helmet({
    contentSecurityPolicy: env.NODE_ENV === 'production' ? undefined : false,
  })
);
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(apiLimiter);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/users', userRoutes);
app.use('/api/webhooks', webhookRoutes);

app.use(errorHandler);

const PORT = parseInt(env.PORT, 10);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} [${env.NODE_ENV}]`);
  });
});

export default app;
