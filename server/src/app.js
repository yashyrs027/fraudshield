import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config/env.js';
import routes from './routes/index.js';
import { errorHandler } from './middlewares/errorHandler.js';

export const app = express();

// Security Headers & Cross-Origin
app.use(helmet());
app.use(
  cors({
    origin: [config.corsOrigin, 'http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
  })
);

// Request Parsing & Logging
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (config.nodeEnv !== 'test') {
  app.use(morgan('combined'));
}

// Health Check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'FraudShield Node.js Backend Gateway',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use(config.apiPrefix, routes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'ROUTE_NOT_FOUND',
      message: `Endpoint ${req.method} ${req.originalUrl} does not exist.`,
      timestamp: new Date().toISOString(),
    },
  });
});

// Global Centralized Error Handler
app.use(errorHandler);

export default app;
