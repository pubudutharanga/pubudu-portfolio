import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import cookie from 'cookie';

const SESSION_SECRET = process.env.SESSION_SECRET || process.env.API_SECRET_KEY || 'pubudu_admin_fallback_secret_key_2026';
const COOKIE_NAME = 'admin_session';

/**
 * Require valid Admin JWT session or Bearer API secret
 * Throws an Error with 401 status if invalid or missing
 */
export function requireAdminSession(req) {
    // 1. Check HTTP-only cookie first
    const cookies = req.headers.cookie ? cookie.parse(req.headers.cookie) : {};
    const sessionToken = cookies[COOKIE_NAME];

    if (sessionToken) {
        try {
            const decoded = jwt.verify(sessionToken, SESSION_SECRET);
            return decoded;
        } catch (err) {
            // Token expired or invalid signature
            const error = new Error('Invalid or expired admin session token');
            error.statusCode = 401;
            throw error;
        }
    }

    // 2. Check Authorization header (for backward compatibility with API_SECRET_KEY webhooks)
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        
        // Match raw API_SECRET_KEY
        if (process.env.API_SECRET_KEY && token === process.env.API_SECRET_KEY) {
            return { role: 'admin', authType: 'api_key' };
        }

        // Or verify if it's a bearer JWT token
        try {
            const decoded = jwt.verify(token, SESSION_SECRET);
            return decoded;
        } catch (err) {
            const error = new Error('Unauthorized: Invalid bearer token');
            error.statusCode = 401;
            throw error;
        }
    }

    const error = new Error('Unauthorized: No admin session or token provided');
    error.statusCode = 401;
    throw error;
}

/**
 * Sign a new Admin JWT session token (valid for 24 hours)
 */
export function signAdminToken(payload = { role: 'admin' }) {
    return jwt.sign(payload, SESSION_SECRET, { expiresIn: '24h' });
}

/**
 * Set HTTP-only, Secure, SameSite=Strict session cookie on response
 */
export function setSessionCookie(res, token) {
    const isProd = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';
    const cookieHeader = cookie.serialize(COOKIE_NAME, token, {
        httpOnly: true,
        secure: isProd,
        sameSite: 'strict',
        maxAge: 60 * 60 * 24, // 24 hours
        path: '/'
    });
    res.setHeader('Set-Cookie', cookieHeader);
}

/**
 * Clear session cookie on logout
 */
export function clearSessionCookie(res) {
    const isProd = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';
    const cookieHeader = cookie.serialize(COOKIE_NAME, '', {
        httpOnly: true,
        secure: isProd,
        sameSite: 'strict',
        expires: new Date(0),
        path: '/'
    });
    res.setHeader('Set-Cookie', cookieHeader);
}

/**
 * Verify given password against ADMIN_PASSWORD_HASH or ADMIN_PASSWORD or API_SECRET_KEY
 */
export async function verifyAdminPassword(password) {
    if (!password || typeof password !== 'string') return false;

    // Check ADMIN_PASSWORD_HASH first (bcrypt)
    const hash = process.env.ADMIN_PASSWORD_HASH;
    if (hash) {
        try {
            const match = await bcrypt.compare(password, hash);
            if (match) return true;
        } catch (e) {
            console.error('Bcrypt comparison error:', e);
        }
    }

    // Fallback: check ADMIN_PASSWORD or API_SECRET_KEY
    const rawPass = process.env.ADMIN_PASSWORD || process.env.API_SECRET_KEY || 'pubudu2026';
    if (password === rawPass) {
        return true;
    }

    return false;
}
