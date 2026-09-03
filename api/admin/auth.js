import { verifyAdminPassword, signAdminToken, setSessionCookie, requireAdminSession } from '../lib/auth.js';
import { LoginInputSchema } from '../lib/schemas.js';

export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        // GET /api/admin/auth: Verify current session
        if (req.method === 'GET') {
            try {
                const session = requireAdminSession(req);
                return res.status(200).json({
                    authenticated: true,
                    role: session.role || 'admin'
                });
            } catch (err) {
                return res.status(401).json({
                    authenticated: false,
                    error: 'Not authenticated'
                });
            }
        }

        // POST /api/admin/auth: Login with password
        if (req.method === 'POST') {
            const parsed = LoginInputSchema.safeParse(req.body);
            if (!parsed.success) {
                return res.status(400).json({
                    success: false,
                    error: parsed.error.issues[0]?.message || 'Invalid request body'
                });
            }

            const { password } = parsed.data;
            const isValid = await verifyAdminPassword(password);

            if (!isValid) {
                // Return 401 with standard error
                return res.status(401).json({
                    success: false,
                    error: 'Invalid admin passcode. Please check your credentials.'
                });
            }

            // Generate JWT session token
            const token = signAdminToken({ role: 'admin' });
            setSessionCookie(res, token);

            return res.status(200).json({
                success: true,
                message: 'Admin authentication successful',
                token // provided for bearer auth clients or API callers
            });
        }

        return res.status(405).json({ success: false, error: 'Method Not Allowed' });
    } catch (error) {
        console.error('API /api/admin/auth error:', error);
        return res.status(500).json({
            success: false,
            error: error.message || 'Internal Server Error'
        });
    }
}
