import { ApiError } from "../utils/ApiError.js";

const buckets = new Map();

const securityHeaders = (req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  next();
};

const rateLimiter = ({ windowMs = 60_000, max = 120 } = {}) => {
  return (req, res, next) => {
    const key = `${req.ip}:${req.path}`;
    const now = Date.now();
    const current = buckets.get(key) || { count: 0, resetAt: now + windowMs };

    if (current.resetAt < now) {
      current.count = 0;
      current.resetAt = now + windowMs;
    }

    current.count += 1;
    buckets.set(key, current);

    res.setHeader("X-RateLimit-Limit", max);
    res.setHeader("X-RateLimit-Remaining", Math.max(max - current.count, 0));

    if (current.count > max) {
      throw new ApiError(429, "Too many requests. Please slow down.");
    }

    next();
  };
};

const requireRole = (role) => {
  return (req, res, next) => {
    if (req.user?.role !== role) {
      throw new ApiError(403, "You do not have access to this resource");
    }

    next();
  };
};

export { rateLimiter, requireRole, securityHeaders };
