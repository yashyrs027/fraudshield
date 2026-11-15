import app from './app.js';
import { config } from './config/env.js';
import { logger } from './utils/logger.js';
import { closePool } from './config/db.js';

const server = app.listen(config.port, () => {
  logger.info(`FraudShield Backend API Gateway running on port ${config.port}`);
  logger.info(`Environment: ${config.nodeEnv}`);
  logger.info(`API Base URL: http://localhost:${config.port}${config.apiPrefix}`);
  logger.info(`Python AI Service Gateway: ${config.aiService.url}`);
});

// Graceful Termination
const handleShutdown = async (signal) => {
  logger.info(`Received ${signal}. Gracefully terminating FraudShield server...`);
  server.close(async () => {
    await closePool();
    logger.info('Database pool drained. Process exiting.');
    process.exit(0);
  });
};

process.on('SIGTERM', () => handleShutdown('SIGTERM'));
process.on('SIGINT', () => handleShutdown('SIGINT'));
