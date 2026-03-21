import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || (() => { throw new Error("JWT_SECRET environment variable is missing"); })();

export interface AuthRequest extends Request {
    user?: {
        id: number;
        username: string;
        role: string;
    };
}

export const authenticateJWT = (req: AuthRequest, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1]; // Format: "Bearer <token>"

        jwt.verify(token, JWT_SECRET, (err, user) => {
            if (err) {
                res.status(403).json({ success: false, error: 'Forbidden: Invalid or expired token' });
                return;
            }

            req.user = user as AuthRequest['user'];
            next();
        });
    } else {
        res.status(401).json({ success: false, error: 'Unauthorized: Missing token' });
    }
};

/**
 * Middleware to restrict access based on roles
 */
export const requireRole = (roles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction): void => {
        if (!req.user) {
             res.status(401).json({ success: false, error: 'Unauthorized' });
             return;
        }

        if (!roles.includes(req.user.role)) {
             res.status(403).json({ success: false, error: 'Forbidden: Insufficient privileges' });
             return;
        }

        next();
    };
};