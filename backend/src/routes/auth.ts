import { Router, Response } from 'express';
import { getDatabase } from '../db/database';
import { 
  hashPassword, 
  verifyPassword, 
  generateToken,
  generateOTP,
  generateResetToken,
  getOTPExpiryTime,
  getResetTokenExpiryTime,
} from '../utils/auth';
import { sendOTPEmail, sendPasswordResetEmail } from '../utils/email';
import { AuthRequest, authenticateToken } from '../middleware/auth';
import { randomUUID } from 'crypto';

const router = Router();

// Register
router.post('/signup', async (req: AuthRequest, res: Response) => {
  const { email, name, password } = req.body;

  if (!email || !name || !password) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const db = getDatabase();

  try {
    const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Generate and send OTP
    const otp = generateOTP();
    const otpId = randomUUID();
    const expiryTime = getOTPExpiryTime();

    db.prepare(
      'INSERT INTO otp_verifications (id, email, otp, expires_at) VALUES (?, ?, ?, ?)'
    ).run(otpId, email, otp, expiryTime.toISOString());

    await sendOTPEmail(email, otp);

    res.json({
      message: 'OTP sent to email. Please verify to complete signup.',
      requiresOTP: true,
      email,
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Signup failed' });
  }
});

// Verify OTP and create account
router.post('/verify-otp', async (req: AuthRequest, res: Response) => {
  const { email, otp, name, password } = req.body;

  if (!email || !otp || !name || !password) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const db = getDatabase();

  try {
    // Check OTP
    const otpRecord = db.prepare(
      'SELECT * FROM otp_verifications WHERE email = ? AND otp = ? AND expires_at > datetime("now")'
    ).get(email, otp);

    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Check if email already registered
    const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Create user
    const userId = randomUUID();
    const hashedPassword = await hashPassword(password);

    db.prepare(
      'INSERT INTO users (id, email, name, password, is_verified) VALUES (?, ?, ?, ?, 1)'
    ).run(userId, email, name, hashedPassword);

    // Delete OTP record
    db.prepare('DELETE FROM otp_verifications WHERE email = ?').run(email);

    const token = generateToken(userId);

    res.json({
      token,
      user: { id: userId, email, name },
    });
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ message: 'OTP verification failed' });
  }
});

// Login
router.post('/login', async (req: AuthRequest, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Missing email or password' });
  }

  const db = getDatabase();

  try {
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await verifyPassword(password, (user as any).password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken((user as any).id);

    res.json({
      token,
      user: { id: (user as any).id, email: (user as any).email, name: (user as any).name },
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed' });
  }
});

// Google OAuth callback
router.post('/google', async (req: AuthRequest, res: Response) => {
  const { googleId, email, name, picture } = req.body;

  if (!googleId || !email) {
    return res.status(400).json({ message: 'Missing Google authentication data' });
  }

  const db = getDatabase();

  try {
    // Check if user exists
    let user = db.prepare('SELECT * FROM users WHERE google_id = ?').get(googleId) as any;

    if (!user) {
      // Check if email exists
      user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any;

      if (!user) {
        // Create new user
        const userId = randomUUID();
        db.prepare(
          'INSERT INTO users (id, email, name, google_id, is_verified) VALUES (?, ?, ?, ?, 1)'
        ).run(userId, email, name || 'User', googleId);

        user = { id: userId, email, name: name || 'User', google_id: googleId };
      } else {
        // Link Google ID to existing user
        db.prepare('UPDATE users SET google_id = ? WHERE id = ?').run(googleId, user.id);
      }
    }

    const token = generateToken(user.id);

    res.json({
      token,
      user: { id: user.id, email: user.email, name: user.name },
    });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({ message: 'Google authentication failed' });
  }
});

// Request password reset
router.post('/forgot-password', async (req: AuthRequest, res: Response) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  const db = getDatabase();

  try {
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any;

    if (!user) {
      // Don't reveal if email exists (security best practice)
      return res.json({ message: 'If email exists, a reset link has been sent' });
    }

    // Generate reset token
    const resetToken = generateResetToken();
    const tokenId = randomUUID();
    const expiryTime = getResetTokenExpiryTime();

    db.prepare(
      'INSERT INTO password_reset_tokens (id, user_id, token, expires_at) VALUES (?, ?, ?, ?)'
    ).run(tokenId, user.id, resetToken, expiryTime.toISOString());

    // Send email
    await sendPasswordResetEmail(email, resetToken, user.name);

    res.json({ message: 'If email exists, a reset link has been sent' });
  } catch (error) {
    console.error('Password reset request error:', error);
    res.status(500).json({ message: 'Failed to process password reset request' });
  }
});

// Verify reset token and reset password
router.post('/reset-password', async (req: AuthRequest, res: Response) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ message: 'Token and new password are required' });
  }

  const db = getDatabase();

  try {
    const resetRecord = db.prepare(
      'SELECT * FROM password_reset_tokens WHERE token = ? AND expires_at > datetime("now")'
    ).get(token) as any;

    if (!resetRecord) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    // Update password
    const hashedPassword = await hashPassword(newPassword);
    db.prepare('UPDATE users SET password = ? WHERE id = ?').run(hashedPassword, resetRecord.user_id);

    // Delete reset token
    db.prepare('DELETE FROM password_reset_tokens WHERE token = ?').run(token);

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ message: 'Failed to reset password' });
  }
});

// Get user profile
router.get('/profile/:userId', authenticateToken, async (req: AuthRequest, res: Response) => {
  const { userId } = req.params;
  const db = getDatabase();

  try {
    const profile = db.prepare('SELECT * FROM user_profiles WHERE user_id = ?').get(userId);
    if (profile) {
      res.json(profile);
    } else {
      res.json({
        phone: '',
        address: '',
        city: '',
        state: '',
        zip_code: '',
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch profile' });
  }
});

// Save user profile
router.post('/profile', authenticateToken, async (req: AuthRequest, res: Response) => {
  const { user_id, phone, address, city, state, zip_code } = req.body;
  const authenticatedUserId = req.userId;
  const db = getDatabase();

  // Security check: user can only update their own profile
  if (user_id !== authenticatedUserId) {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  try {
    const existing = db.prepare('SELECT * FROM user_profiles WHERE user_id = ?').get(user_id);

    if (existing) {
      db.prepare(
        'UPDATE user_profiles SET phone = ?, address = ?, city = ?, state = ?, zip_code = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?'
      ).run(phone || '', address || '', city || '', state || '', zip_code || '', user_id);
    } else {
      db.prepare(
        'INSERT INTO user_profiles (user_id, phone, address, city, state, zip_code) VALUES (?, ?, ?, ?, ?, ?)'
      ).run(user_id, phone || '', address || '', city || '', state || '', zip_code || '');
    }

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Profile save error:', error);
    res.status(500).json({ message: 'Failed to save profile' });
  }
});

export default router;
