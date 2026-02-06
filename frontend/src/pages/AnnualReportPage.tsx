import React, { useState, useEffect } from 'react';
import { reportAPI } from '../api/client';
import { AnnualReport } from '../types';
import { Navbar } from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

export const AnnualReportPage: React.FC = () => {
  const { user, logout } = useAuth();
  const [report, setReport] = useState<AnnualReport | null>(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReport();
  }, [selectedYear]);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const response = await reportAPI.getAnnual(selectedYear);
      setReport(response.data);
    } catch (error) {
      console.error('Failed to fetch annual report', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    if (!report) return;
    
    // Open PDF in new window/tab
    const pdfUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}/reports/annual/pdf?year=${selectedYear}`;
    window.open(pdfUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} onLogout={logout} />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Annual Report</h1>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex gap-4 items-end">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Select Year</label>
              <select
                value={String(selectedYear)}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              >
                {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                  <option key={year} value={String(year)}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            {report && (
              <button
                onClick={downloadPDF}
                className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
              >
                📄 Download PDF
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <p className="text-center text-gray-600">Loading report...</p>
        ) : report ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600 text-sm">Year</p>
                <p className="text-2xl font-bold text-gray-800">{report.year}</p>
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
                <p className="text-gray-600 text-sm">Annual Balance</p>
                <p className={`text-3xl font-bold ${report.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ₹{report.balance.toFixed(2)}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-semibold mb-4">Monthly Breakdown</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {report.monthlyData.map((month, idx) => (
                  <div key={idx} className="p-4 border border-gray-200 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-2">{month.month}</h4>
                    <div className="space-y-1 text-sm">
                      <p className="text-green-600">Credits: ₹{month.totalCredits.toFixed(2)}</p>
                      <p className="text-red-600">Debits: ₹{month.totalDebits.toFixed(2)}</p>
                      <p className={`font-semibold ${month.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        Balance: ₹{month.balance.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
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
