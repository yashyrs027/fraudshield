// server/src/middlewares/authMiddleware.js
// ------------------------------------------------------------
// Compatibility shim for routes that expect `requireJwtAuth`.
// ------------------------------------------------------------
// The actual JWT validation logic lives in `authenticate.js`.
// We simply re‑export it under the name used by existing route
// definitions.

import { authenticate } from './authenticate.js';

export const requireJwtAuth = authenticate;
