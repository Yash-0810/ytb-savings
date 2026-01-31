import bcryptjs from 'bcryptjs';
import jwt from 'jwt-simple';
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key_here';

export async function hashPassword(password: string): Promise<string> {
  return bcryptjs.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcryptjs.compare(password, hash);
}

export function generateToken(userId: string): string {
  return jwt.encode({ userId, iat: Math.floor(Date.now() / 1000) }, JWT_SECRET);
}

export function verifyToken(token: string): any {
  try {
    return jwt.decode(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

// Generate 6-digit OTP
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Generate password reset token
export function generateResetToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// Get OTP expiry time (10 minutes from now)
export function getOTPExpiryTime(): Date {
  const expiryTime = new Date();
  expiryTime.setMinutes(expiryTime.getMinutes() + 10);
  return expiryTime;
}

// Get reset token expiry time (1 hour from now)
export function getResetTokenExpiryTime(): Date {
  const expiryTime = new Date();
  expiryTime.setHours(expiryTime.getHours() + 1);
  return expiryTime;
}
