import React, { useState } from 'react';
import API from '../api/client';
import { useNavigate } from 'react-router-dom';

interface OTPVerificationProps {
  email: string;
  name: string;
  password: string;
  onSuccess: (token: string, user: any) => void;
}

export const OTPVerification: React.FC<OTPVerificationProps> = ({
  email,
  name,
  password,
  onSuccess,
}) => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await API.post('/auth/verify-otp', {
        email,
        otp,
        name,
        password,
      });

      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      onSuccess(token, user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Verify Email</h2>
        <p className="text-gray-600 mb-6">
          We've sent a 6-digit OTP to <strong>{email}</strong>
        </p>

        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Enter OTP</label>
            <input
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => {
                setOtp(e.target.value.replace(/\D/g, ''));
              }}
              placeholder="000000"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 text-center text-2xl letter-spacing tracking-widest"
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading || otp.length !== 6}
            className="w-full bg-orange-500 text-white font-semibold py-3 rounded-lg hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>

          <p className="text-sm text-gray-600 text-center">
            OTP expires in 10 minutes
          </p>
        </form>
      </div>
    </div>
  );
};
