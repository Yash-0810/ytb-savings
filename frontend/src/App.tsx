import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider, useAuth } from './context/AuthContext';
import { HomePage } from './pages/HomePage';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { ForgotPassword } from './pages/ForgotPassword';
import { ResetPassword } from './pages/ResetPassword';
import { Dashboard } from './pages/Dashboard';
import { TransactionPage } from './pages/TransactionPage';
import { DailyReportPage } from './pages/DailyReportPage';
import { MonthlyReportPage } from './pages/MonthlyReportPage';
import { AnnualReportPage } from './pages/AnnualReportPage';
import { Account } from './pages/Account';
import { WeeklyReportPage } from './pages/WeeklyReportPage';
import './index.css';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token } = useAuth();
  return token ? <>{children}</> : <Navigate to="/login" />;
};

function AppContent() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/transactions"
        element={
          <PrivateRoute>
            <TransactionPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/reports/daily"
        element={
          <PrivateRoute>
            <DailyReportPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/reports/monthly"
        element={
          <PrivateRoute>
            <MonthlyReportPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/reports/annual"
        element={
          <PrivateRoute>
            <AnnualReportPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/reports/weekly"
        element={
          <PrivateRoute>
            <WeeklyReportPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/account"
        element={
          <PrivateRoute>
            <Account />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Router>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
