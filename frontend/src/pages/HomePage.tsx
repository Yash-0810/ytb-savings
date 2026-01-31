import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Logo } from '../components/Logo';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600">
      {/* Navigation */}
      <nav className="bg-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="cursor-pointer" onClick={() => navigate('/')}>
            <Logo height="50px" />
          </div>
          {token ? (
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              Go to Dashboard
            </button>
          ) : (
            <div className="flex gap-4">
              <button
                onClick={() => navigate('/login')}
                className="bg-white text-blue-600 px-6 py-2 rounded-lg hover:bg-gray-100 transition font-semibold"
              >
                Login
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center text-white mb-20">
          <h2 className="text-5xl font-bold mb-4">Manage Your Finances Effortlessly</h2>
          <p className="text-xl opacity-90 mb-8">
            Track income and expenses, generate reports, and take control of your money
          </p>
          {!token && (
            <button
              onClick={() => navigate('/signup')}
              className="bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition font-bold text-lg"
            >
              Get Started Free
            </button>
          )}
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Track Transactions</h3>
            <p className="text-gray-600">
              Record all your income and expenses with detailed descriptions and payment methods
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition">
            <div className="text-4xl mb-4">📈</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Generate Reports</h3>
            <p className="text-gray-600">
              Get daily, weekly, monthly, and annual reports with insights into your spending
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition">
            <div className="text-4xl mb-4">💳</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Multiple Payment Methods</h3>
            <p className="text-gray-600">
              Track payments via cash, UPI, card, or bank transfer for complete visibility
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-lg shadow-xl p-8 grid grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-blue-600">100%</div>
            <p className="text-gray-600 mt-2">Secure & Private</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-green-600">Instant</div>
            <p className="text-gray-600 mt-2">Report Generation</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-purple-600">Easy</div>
            <p className="text-gray-600 mt-2">CSV Export</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-20 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p>&copy; 2026 YTB Savings. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};
