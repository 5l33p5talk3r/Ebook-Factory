import type { Request, Response, NextFunction } from 'express';
import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

function getFirebaseAuth() {
  if (!getApps().length) {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    if (!projectId || !clientEmail || !privateKey) {
      throw new Error('Firebase Admin credentials are not configured.');
    }
    initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
  }
  return getAuth();
}

export type AuthenticatedRequest = Request & { user?: { uid: string; email?: string; admin: boolean } };

export async function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) return res.status(401).json({ success: false, error: 'Authentication required.' });
    const decoded = await getFirebaseAuth().verifyIdToken(header.slice(7), true);
    req.user = { uid: decoded.uid, email: decoded.email, admin: decoded.admin === true };
    next();
  } catch {
    return res.status(401).json({ success: false, error: 'Invalid or expired authentication token.' });
  }
}

export async function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  await requireAuth(req, res, () => {
    if (!req.user?.admin) return res.status(403).json({ success: false, error: 'Administrator access required.' });
    next();
  });
}
