
import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { OTPVerification } from '../components/OTPVerification';
import API from '../api/client';
import { jwtDecode } from 'jwt-decode';
import { Logo } from '../components/Logo';


export const Signup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOTPVerification, setShowOTPVerification] = useState(false);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);



    try {
      // Request OTP or create account directly
      const response = await API.post('/auth/signup', { email, name, password });
      console.log('Signup response:', response.data);
      
      // Check if account was created directly (no OTP needed)
      if (response.data.token && response.data.user) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        console.log('Direct signup successful, redirecting to dashboard...');
        // Use location.replace for a clean redirect
        window.location.replace('/dashboard');
      } else {
        // Requires OTP verification
        console.log('OTP verification required');
        setShowOTPVerification(true);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };



  const handleOTPSuccess = (token: string, user: any) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    // Use location.replace for a clean redirect
    window.location.replace('/dashboard');
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    console.log('Google signup attempt started');
    console.log('Credential response:', credentialResponse);
    
    try {
      setLoading(true);
      const decoded: any = jwtDecode(credentialResponse.credential);
      console.log('Decoded token:', decoded);

      const response = await API.post('/auth/google', {
        googleId: decoded.sub,
        email: decoded.email,
        name: decoded.name,
        picture: decoded.picture,
      });

      console.log('Backend response:', response.data);

      const { token, user } = response.data;
      
      // Store auth data synchronously
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      console.log('Auth data stored, redirecting to dashboard...');
      
      // Use location.replace for a clean redirect
      window.location.replace('/dashboard');
    } catch (err: any) {
      console.error('Google signup error:', err);
      setLoading(false);
      setError(err.response?.data?.message || 'Google signup failed');
    }
  };


  if (showOTPVerification) {
    return (
      <OTPVerification
        email={email}
        name={name}
        password={password}
        onSuccess={handleOTPSuccess}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 w-full max-w-md border border-white/20">
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-6">
          <Logo height="80px" className="mb-2" />
          <h2 className="text-2xl font-bold text-gray-800">Create Account</h2>
          <p className="text-gray-500 text-sm">Join YTB Savings today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-gray-700 font-medium mb-2 text-sm">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
              placeholder="John Doe"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2 text-sm">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
              placeholder="user@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2 text-sm">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
              placeholder="Create a strong password"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2 text-sm">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
              placeholder="Confirm your password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold py-3 rounded-lg hover:from-green-700 hover:to-emerald-700 transition disabled:opacity-50 shadow-lg shadow-green-500/30"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Creating account...
              </span>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="relative flex items-center py-4">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="flex-shrink-0 mx-4 text-gray-400 text-sm">OR</span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>

        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError('Google signup failed')}
          />
        </div>

        <p className="text-gray-600 text-center mt-6 text-sm">
          Already have an account?{' '}
          <a href="/login" className="text-green-600 font-semibold hover:text-green-800">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
};
