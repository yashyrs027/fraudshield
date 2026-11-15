import { logger } from '../utils/logger.js';

export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const errorCode = err.code || 'INTERNAL_SERVER_ERROR';
  const requestId = req.headers['x-request-id'] || `req_${Date.now()}`;

  logger.error('Unhandled Application Error', {
    code: errorCode,
    message: err.message,
    statusCode,
    path: req.path,
    requestId,
  });

  res.status(statusCode).json({
    success: false,
    error: {
      code: errorCode,
      message: err.message || 'An unexpected internal server error occurred.',
      details: err.details || null,
      requestId,
      timestamp: new Date().toISOString(),
    },
  });
};
