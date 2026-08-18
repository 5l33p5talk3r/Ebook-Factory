import crypto from 'node:crypto';
import type { NextFunction, Request, Response } from 'express';

const buckets = new Map<string, { count: number; resetAt: number }>();

export function requestSecurity(_req: Request, res: Response, next: NextFunction) {
  const requestId = crypto.randomUUID();
  res.setHeader('X-Request-ID', requestId);
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.setHeader('Content-Security-Policy', "default-src 'self'; base-uri 'self'; frame-ancestors 'none'; object-src 'none'; img-src 'self' data: https:; style-src 'self' 'unsafe-inline' https:; script-src 'self' 'unsafe-inline' https:; connect-src 'self' https:; frame-src https://www.paypal.com https://www.sandbox.paypal.com");
  next();
}

export function apiRateLimit(windowMs = 60_000, maxRequests = 120) {
  return (req: Request, res: Response, next: NextFunction) => {
    const now = Date.now();
    const key = req.ip || req.socket.remoteAddress || 'unknown';
    const current = buckets.get(key);
    if (!current || current.resetAt <= now) {
      buckets.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }
    current.count += 1;
    if (current.count > maxRequests) {
      res.setHeader('Retry-After', Math.ceil((current.resetAt - now) / 1000));
      return res.status(429).json({ success: false, error: 'Too many requests. Please try again shortly.' });
    }
    return next();
  };
}
