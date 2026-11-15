// src/middleware/authMiddleware.js
// ------------------------------------------------------------
// Minimal JWT authentication middleware for FraudShield backend.
// ------------------------------------------------------------
// Uses the `jsonwebtoken` package. In this scaffold we assume the
// secret is provided via the environment variable `JWT_SECRET`.
// Two variants are exported:
//   - optionalJwtAuth: attaches `req.user` if a valid token is present, but
//     does NOT reject the request when missing (used for public analysis
//     endpoints where an unauthenticated user may still get a result).
//   - requireJwtAuth: enforces presence of a valid token and returns 401
//     otherwise (used for protected resources such as user preferences).

const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'insecure-default-secret'; // should be overridden in prod

function verifyToken(token) {
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    return payload;
  } catch (err) {
    return null;
  }
}

// Middleware that makes authentication optional.
function optionalJwtAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice(7);
    const payload = verifyToken(token);
    if (payload) {
      req.user = payload; // attach decoded payload (e.g., { userId, email })
    }
  }
  next();
}

// Middleware that *requires* a valid JWT.
function requireJwtAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Missing Authorization header' });
  }
  const token = authHeader.slice(7);
  const payload = verifyToken(token);
  if (!payload) {
    return res.status(401).json({ success: false, error: 'Invalid or expired token' });
  }
  req.user = payload;
  next();
}

module.exports = { optionalJwtAuth, requireJwtAuth };
