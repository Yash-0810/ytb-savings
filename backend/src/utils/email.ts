import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_EMAIL,
    pass: process.env.GMAIL_APP_PASSWORD, // Use App Password, not regular password
  },
});

export async function sendOTPEmail(email: string, otp: string): Promise<void> {
  const mailOptions = {
    from: process.env.GMAIL_EMAIL,
    to: email,
    subject: 'Your FinanceHub OTP Verification Code',
    html: `
      <h2>Welcome to FinanceHub!</h2>
      <p>Your OTP verification code is:</p>
      <h1 style="color: #ff6b35; font-size: 32px; letter-spacing: 2px;">${otp}</h1>
      <p>This code expires in 10 minutes.</p>
      <p>If you didn't request this code, please ignore this email.</p>
      <hr>
      <p><small>FinanceHub - Personal Finance Management</small></p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`OTP sent to ${email}`);
  } catch (error) {
    console.error('Error sending OTP:', error);
    throw error;
  }
}

export async function sendPasswordResetEmail(
  email: string,
  resetToken: string,
  userName: string
): Promise<void> {
  const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;

  const mailOptions = {
    from: process.env.GMAIL_EMAIL,
    to: email,
    subject: 'Password Reset Request - FinanceHub',
    html: `
      <h2>Hello ${userName},</h2>
      <p>We received a request to reset your password. Click the link below to reset it:</p>
      <p>
        <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; background-color: #ff6b35; color: white; text-decoration: none; border-radius: 5px;">
          Reset Password
        </a>
      </p>
      <p>Or copy this link: <a href="${resetLink}">${resetLink}</a></p>
      <p>This link expires in 1 hour.</p>
      <p>If you didn't request this, please ignore this email.</p>
      <hr>
      <p><small>FinanceHub - Personal Finance Management</small></p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Password reset email sent to ${email}`);
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
}
