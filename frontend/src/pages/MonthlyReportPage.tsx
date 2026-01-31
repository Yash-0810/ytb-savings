import React, { useState, useEffect } from 'react';
import { reportAPI } from '../api/client';
import { MonthlyReport } from '../types';
import { Navbar } from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

export const MonthlyReportPage: React.FC = () => {
  const { user, logout } = useAuth();
  const [report, setReport] = useState<MonthlyReport | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReport();
  }, [selectedMonth]);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const response = await reportAPI.getMonthly(selectedMonth);
      setReport(response.data);
    } catch (error) {
      console.error('Failed to fetch monthly report', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} onLogout={logout} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Monthly Report</h1>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <label className="block text-gray-700 font-semibold mb-2">Select Month</label>
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>

        {loading ? (
          <p className="text-center text-gray-600">Loading report...</p>
        ) : report ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600 text-sm">Month</p>
                <p className="text-2xl font-bold text-gray-800">{report.month}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600 text-sm">Total Credits</p>
                <p className="text-2xl font-bold text-green-600">₹{report.totalCredits.toFixed(2)}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600 text-sm">Total Debits</p>
                <p className="text-2xl font-bold text-red-600">₹{report.totalDebits.toFixed(2)}</p>
              </div>
              <div className="md:col-span-3 bg-white rounded-lg shadow p-6">
                <p className="text-gray-600 text-sm">Monthly Balance</p>
                <p className={`text-3xl font-bold ${report.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ₹{report.balance.toFixed(2)}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-semibold mb-4">Transactions</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Date</th>
                      <th className="text-left py-2">Type</th>
                      <th className="text-left py-2">Description</th>
                      <th className="text-right py-2">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.transactions.map((t) => (
                      <tr key={t.id} className="border-b">
                        <td className="py-2">{t.date}</td>
                        <td className="py-2">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            t.type === 'debit' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {t.type.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-2">{t.description}</td>
                        <td className="text-right py-2 font-semibold">
                          {t.type === 'debit' ? '-' : '+'} ₹{t.amount.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <p className="text-center text-gray-600">No data available</p>
        )}
      </div>
    </div>
  );
};
