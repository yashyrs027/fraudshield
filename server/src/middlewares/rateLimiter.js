// In-Memory Token Bucket Rate Limiter
const ipBuckets = new Map();

export const rateLimiter = (options = { windowMs: 60000, maxRequests: 60 }) => {
  return (req, res, next) => {
    const key = req.user?.id || req.ip || req.connection.remoteAddress || 'unknown';
    const now = Date.now();

    let bucket = ipBuckets.get(key);
    if (!bucket || now - bucket.resetTime > options.windowMs) {
      bucket = {
        count: 1,
        resetTime: now,
      };
      ipBuckets.set(key, bucket);
    } else {
      bucket.count += 1;
    }

    if (bucket.count > options.maxRequests) {
      return res.status(429).json({
        success: false,
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: 'Too many requests. Please wait before running more threat checks.',
          timestamp: new Date().toISOString(),
        },
      });
    }

    next();
  };
};
