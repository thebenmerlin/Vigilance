import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pgPool } from '../data/db/index.js';
import { authenticateJWT, AuthRequest } from '../middleware/auth.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || (() => { throw new Error("JWT_SECRET environment variable is missing"); })();

/**
 * POST /api/auth/login
 * Authenticates user and returns a JWT
 */
router.post('/login', async (req: Request, res: Response): Promise<void> => {
    const { username, password } = req.body;

    if (!username || !password) {
        res.status(400).json({ success: false, error: 'Username and password required' });
        return;
    }

    try {
        const client = await pgPool.connect();
        try {
            const result = await client.query('SELECT * FROM users WHERE username = $1', [username]);

            if (result.rows.length === 0) {
                 res.status(401).json({ success: false, error: 'Invalid credentials' });
                 return;
            }

            const user = result.rows[0];
            const isMatch = await bcrypt.compare(password, user.password_hash);

            if (!isMatch) {
                 res.status(401).json({ success: false, error: 'Invalid credentials' });
                 return;
            }

            // Update last login
            await client.query('UPDATE users SET last_login = $1 WHERE id = $2', [new Date().toISOString(), user.id]);

            // Create JWT Payload
            const payload = {
                id: user.id,
                username: user.username,
                role: user.role,
                name: user.name
            };

            const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '8h' });

            res.json({
                success: true,
                data: {
                     token,
                     user: payload
                }
            });

        } finally {
             client.release();
        }
    } catch (err: any) {
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

/**
 * GET /api/auth/me
 * Returns the current authenticated user details
 */
router.get('/me', authenticateJWT, (req: AuthRequest, res: Response) => {
    res.json({
         success: true,
         data: req.user
    });
});

export default router;