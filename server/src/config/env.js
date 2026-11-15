import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  apiPrefix: process.env.API_PREFIX || '/api/v1',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  databaseUrl: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/fraudshield',
  useMemoryDb: process.env.USE_MEMORY_DB === 'true',
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET || 'fallback_jwt_access_secret_2026',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'fallback_jwt_refresh_secret_2026',
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
  aiService: {
    url: process.env.AI_SERVICE_URL || 'http://localhost:8000/api/v1',
    token: process.env.AI_SERVICE_TOKEN || 'fraudshield_internal_ml_service_token_2026',
    timeoutMs: 5000,
  },
  helpline: process.env.CYBER_HELPLINE || '1930',
  portalUrl: process.env.CYBERCRIME_PORTAL || 'https://cybercrime.gov.in',
};
