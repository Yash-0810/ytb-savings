import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { reportAPI } from '../api/client';

interface Transaction {
  id: string;
  type: 'debit' | 'credit';
  amount: number;
  description: string;
  category?: string;
  payment_method?: string;
  date: string;
}

interface WeeklyReport {
  week: string;
  totalDebits: number;
  totalCredits: number;
  balance: number;
  transactions: Transaction[];
}

export const WeeklyReportPage: React.FC = () => {
  const { user, logout } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [report, setReport] = useState<WeeklyReport | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchWeeklyReport = async () => {
    if (!selectedDate) return;
    setLoading(true);
    try {
      const response = await reportAPI.getWeekly(selectedDate);
      setReport(response.data);
    } catch (error) {
      console.error('Failed to fetch weekly report:', error);
      alert('Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  const downloadCSV = () => {
    if (!report) return;

    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Weekly Report\n';
    csvContent += `Week: ${report.week}\n`;
    csvContent += `Generated: ${new Date().toLocaleDateString()}\n\n`;
    csvContent += 'Summary\n';
    csvContent += `Total Income,Total Expenses,Balance\n`;
    csvContent += `${report.totalCredits},${report.totalDebits},${report.balance}\n\n`;
    csvContent += 'Transactions\n';
    csvContent += 'Date,Type,Amount,Description,Category,Payment Method\n';

    report.transactions.forEach((txn) => {
      csvContent += `${txn.date},"${txn.type}","${txn.amount}","${txn.description}","${txn.category || '-'}","${txn.payment_method || 'cash'}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `weekly_report_${selectedDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadPDF = () => {
    if (!report) return;
    
    // Open PDF in new window/tab
    const pdfUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}/reports/weekly/pdf?date=${selectedDate}`;
    window.open(pdfUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-purple-600">
      <Navbar user={user} onLogout={logout} />
      <div className="max-w-6xl mx-auto pt-20 p-4">
        <div className="bg-white rounded-lg shadow-2xl p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Weekly Report</h1>
          <p className="text-gray-600 mb-6">View and download weekly financial summary</p>

          <div className="bg-purple-50 p-4 rounded-lg mb-6 flex gap-4 items-end">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Select Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
              />
            </div>
            <button
              onClick={fetchWeeklyReport}
              disabled={loading}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition disabled:bg-gray-400"
            >
              {loading ? 'Loading...' : 'Generate Report'}
            </button>
            {report && (
              <div className="flex gap-2">
                <button
                  onClick={downloadPDF}
                  className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
                >
                  📄 Download PDF
                </button>
                <button
                  onClick={downloadCSV}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
                >
                  📥 Download CSV
                </button>
              </div>
            )}
          </div>

          {report && (
            <div>
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-lg">
                  <p className="text-sm opacity-90">Total Income</p>
                  <p className="text-3xl font-bold">₹{report.totalCredits.toFixed(2)}</p>
                </div>
                <div className="bg-gradient-to-br from-red-500 to-red-600 text-white p-6 rounded-lg">
                  <p className="text-sm opacity-90">Total Expenses</p>
                  <p className="text-3xl font-bold">₹{report.totalDebits.toFixed(2)}</p>
                </div>
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg">
                  <p className="text-sm opacity-90">Balance</p>
                  <p className="text-3xl font-bold">₹{report.balance.toFixed(2)}</p>
                </div>
              </div>

              <h2 className="text-xl font-bold text-gray-800 mb-4">Transactions</h2>
              {report.transactions.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border p-3 text-left">Date</th>
                        <th className="border p-3 text-left">Type</th>
                        <th className="border p-3 text-left">Amount</th>
                        <th className="border p-3 text-left">Description</th>
                        <th className="border p-3 text-left">Category</th>
                        <th className="border p-3 text-left">Payment Method</th>
                      </tr>
                    </thead>
                    <tbody>
                      {report.transactions.map((txn) => (
                        <tr key={txn.id} className="hover:bg-gray-50">
                          <td className="border p-3">{txn.date}</td>
                          <td className="border p-3">
                            <span
                              className={`px-3 py-1 rounded-full text-white text-sm font-semibold ${
                                txn.type === 'debit' ? 'bg-red-500' : 'bg-green-500'
                              }`}
                            >
                              {txn.type === 'debit' ? '💸 Expense' : '💰 Income'}
                            </span>
                          </td>
                          <td className="border p-3 font-semibold">₹{txn.amount.toFixed(2)}</td>
                          <td className="border p-3">{txn.description}</td>
                          <td className="border p-3">{txn.category || '-'}</td>
                          <td className="border p-3">
                            <span className="px-2 py-1 bg-gray-200 rounded text-sm">
                              {txn.payment_method || 'cash'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-600 text-center py-8">No transactions found for this week</p>
              )}
            </div>
          )}

          {!report && !loading && (
            <p className="text-gray-600 text-center py-8">Select a date and click "Generate Report" to view your weekly summary</p>
          )}
        </div>
      </div>
    </div>
  );
};
