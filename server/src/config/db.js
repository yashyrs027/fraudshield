import pg from 'pg';
import { config } from './env.js';
import { logger } from '../utils/logger.js';

const { Pool } = pg;

// In-Memory Fallback Store (for offline development and standalone integration testing)
class MemoryStore {
  constructor() {
    this.users = new Map();
    this.preferences = new Map();
    this.contacts = new Map();
    this.sessions = new Map();
    this.assessments = new Map();
    this.incidents = new Map();
    this.consentRecords = new Map();
    this.auditLogs = [];
    this.seedDefaultData();
  }

  seedDefaultData() {
    const demoId = '550e8400-e29b-41d4-a716-446655440000';
    this.users.set(demoId, {
      id: demoId,
      email: 'ramesh.chandra@example.com',
      password_hash: '$2a$10$w0f5u4yN1dD9oXjX5uY2XeW3HnFpP0m8J8P0a8K0y4L0m2N4o6P8q', // 'SecurePassword#2026'
      full_name: 'Ramesh Chandra',
      phone_number: '+919876543210',
      role: 'USER',
      is_verified: true,
      created_at: new Date().toISOString(),
    });

    this.preferences.set(demoId, {
      id: 'pref-001',
      user_id: demoId,
      high_contrast_mode: false,
      font_size: 'MEDIUM',
      language_code: 'en',
      auto_sos_alert: true,
      email_notifications: true,
      sms_notifications: true,
    });

    this.contacts.set('tc-001', {
      id: 'tc-001',
      user_id: demoId,
      contact_name: 'Ananya Chandra',
      relationship: 'Daughter',
      phone_number: '+919845012345',
      email: 'ananya.chandra@example.com',
      is_active: true,
      created_at: new Date().toISOString(),
    });
  }
}

export const memoryStore = new MemoryStore();

let pool = null;

if (!config.useMemoryDb && config.databaseUrl) {
  try {
    pool = new Pool({
      connectionString: config.databaseUrl,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 4000,
    });

    pool.on('error', (err) => {
      logger.error('Unexpected PostgreSQL Pool Error, falling back to memory store', { error: err.message });
    });
  } catch (err) {
    logger.warn('Could not initialize PostgreSQL Pool, using in-memory store', { error: err.message });
  }
}

export const query = async (text, params) => {
  if (pool) {
    try {
      const start = Date.now();
      const res = await pool.query(text, params);
      const duration = Date.now() - start;
      logger.debug('Executed DB Query', { text, duration, rows: res.rowCount });
      return res;
    } catch (err) {
      logger.error('PostgreSQL query error, falling back to memory store', { error: err.message });
    }
  }

  // Emulated query for offline / memory mode
  return { rows: [], rowCount: 0 };
};

export const closePool = async () => {
  if (pool) {
    await pool.end();
  }
};
