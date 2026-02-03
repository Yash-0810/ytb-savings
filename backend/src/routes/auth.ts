import { Router, Response } from 'express';
import { query } from '../db/database';
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

  try {
    const existingUser = await query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Check if email is configured
    const emailConfigured = process.env.GMAIL_EMAIL && process.env.GMAIL_APP_PASSWORD;

    if (emailConfigured) {
      // Generate and send OTP
      const otp = generateOTP();
      const otpId = randomUUID();
      const expiryTime = getOTPExpiryTime();

      await query(
        'INSERT INTO otp_verifications (id, email, otp, expires_at) VALUES ($1, $2, $3, $4)',
        [otpId, email, otp, expiryTime.toISOString()]
      );

      try {
        await sendOTPEmail(email, otp);
        res.json({
          message: 'OTP sent to email. Please verify to complete signup.',
          requiresOTP: true,
          email,
        });
      } catch (emailError) {
        console.error('Email sending failed, creating account without verification:', emailError);
        // If email fails, create account directly
        await query('DELETE FROM otp_verifications WHERE email = $1', [email]);
        
        const userId = randomUUID();
        const hashedPassword = await hashPassword(password);
        await query(
          'INSERT INTO users (id, email, name, password, is_verified) VALUES ($1, $2, $3, $4, TRUE)',
          [userId, email, name, hashedPassword]
        );

        const token = generateToken(userId);
        res.json({
          token,
          user: { id: userId, email, name },
          message: 'Account created successfully (email verification unavailable)',
        });
      }
    } else {
      // No email configured, create account directly
      const userId = randomUUID();
      const hashedPassword = await hashPassword(password);
      await query(
        'INSERT INTO users (id, email, name, password, is_verified) VALUES ($1, $2, $3, $4, TRUE)',
        [userId, email, name, hashedPassword]
      );

      const token = generateToken(userId);
      res.json({
        token,
        user: { id: userId, email, name },
        message: 'Account created successfully',
      });
    }
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

  try {
    // Check OTP
    const otpRecord = await query(
      'SELECT * FROM otp_verifications WHERE email = $1 AND otp = $2 AND expires_at > NOW()',
      [email, otp]
    );

    if (otpRecord.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Check if email already registered
    const existingUser = await query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Create user
    const userId = randomUUID();
    const hashedPassword = await hashPassword(password);

    await query(
      'INSERT INTO users (id, email, name, password, is_verified) VALUES ($1, $2, $3, $4, 1)',
      [userId, email, name, hashedPassword]
    );

    // Delete OTP record
    await query('DELETE FROM otp_verifications WHERE email = $1', [email]);

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

  try {
    const userResult = await query('SELECT * FROM users WHERE email = $1', [email]);
    const user = userResult.rows[0];

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user.id);

    res.json({
      token,
      user: { id: user.id, email: user.email, name: user.name },
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed' });
  }
});

// Google OAuth callback
router.post('/google', async (req: AuthRequest, res: Response) => {
  const { googleId, email, name } = req.body;

  if (!googleId || !email) {
    return res.status(400).json({ message: 'Missing Google authentication data' });
  }

  try {
    // Check if user exists
    let userResult = await query('SELECT * FROM users WHERE google_id = $1', [googleId]);
    let user = userResult.rows[0];

    if (!user) {
      // Check if email exists
      userResult = await query('SELECT * FROM users WHERE email = $1', [email]);
      user = userResult.rows[0];

      if (!user) {
        // Create new user
        const userId = randomUUID();
        await query(
          'INSERT INTO users (id, email, name, google_id, is_verified) VALUES ($1, $2, $3, $4, 1)',
          [userId, email, name || 'User', googleId]
        );

        user = { id: userId, email, name: name || 'User' };
      } else {
        // Link Google ID to existing user
        await query('UPDATE users SET google_id = $1 WHERE id = $2', [googleId, user.id]);
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

  try {
    const userResult = await query('SELECT * FROM users WHERE email = $1', [email]);
    const user = userResult.rows[0];

    if (!user) {
      // Don't reveal if email exists (security best practice)
      return res.json({ message: 'If email exists, a reset link has been sent' });
    }

    // Generate reset token
    const resetToken = generateResetToken();
    const tokenId = randomUUID();
    const expiryTime = getResetTokenExpiryTime();

    await query(
      'INSERT INTO password_reset_tokens (id, user_id, token, expires_at) VALUES ($1, $2, $3, $4)',
      [tokenId, user.id, resetToken, expiryTime.toISOString()]
    );

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

  try {
    const resetResult = await query(
      'SELECT * FROM password_reset_tokens WHERE token = $1 AND expires_at > NOW()',
      [token]
    );
    const resetRecord = resetResult.rows[0];

    if (!resetRecord) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    // Update password
    const hashedPassword = await hashPassword(newPassword);
    await query('UPDATE users SET password = $1 WHERE id = $2', [hashedPassword, resetRecord.user_id]);

    // Delete reset token
    await query('DELETE FROM password_reset_tokens WHERE token = $1', [token]);

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ message: 'Failed to reset password' });
  }
});

// Get user profile
router.get('/profile/:userId', authenticateToken, async (req: AuthRequest, res: Response) => {
  const { userId } = req.params;

  try {
    const profileResult = await query('SELECT * FROM user_profiles WHERE user_id = $1', [userId]);
    const profile = profileResult.rows[0];

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

  // Security check: user can only update their own profile
  if (user_id !== authenticatedUserId) {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  try {
    const existing = await query('SELECT * FROM user_profiles WHERE user_id = $1', [user_id]);

    if (existing.rows.length > 0) {
      await query(
        'UPDATE user_profiles SET phone = $1, address = $2, city = $3, state = $4, zip_code = $5, updated_at = NOW() WHERE user_id = $6',
        [phone || '', address || '', city || '', state || '', zip_code || '', user_id]
      );
    } else {
      await query(
        'INSERT INTO user_profiles (user_id, phone, address, city, state, zip_code) VALUES ($1, $2, $3, $4, $5, $6)',
        [user_id, phone || '', address || '', city || '', state || '', zip_code || '']
      );
    }

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Profile save error:', error);
    res.status(500).json({ message: 'Failed to save profile' });
  }
});

export default router;

