import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { transactionAPI } from '../api/client';
import { Transaction } from '../types';
import { Navbar } from '../components/Navbar';
import { TransactionForm } from '../components/TransactionForm';
import { TransactionList } from '../components/TransactionList';

export const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'transactions' | 'reports'>('transactions');

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await transactionAPI.getAll();
      setTransactions(response.data);
    } catch (error) {
      console.error('Failed to fetch transactions', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTransaction = async (newTransaction: Omit<Transaction, 'id'>) => {
    try {
      const response = await transactionAPI.add(newTransaction);
      setTransactions([...transactions, response.data]);
    } catch (error) {
      console.error('Failed to add transaction', error);
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    try {
      await transactionAPI.delete(id);
      setTransactions(transactions.filter(t => t.id !== id));
    } catch (error) {
      console.error('Failed to delete transaction', error);
    }
  };

  const totalDebits = transactions
    .filter(t => t.type === 'debit')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalCredits = transactions
    .filter(t => t.type === 'credit')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalCredits - totalDebits;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} onLogout={logout} />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Total Credits</p>
            <p className="text-3xl font-bold text-green-600">₹{totalCredits.toFixed(2)}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Total Debits</p>
            <p className="text-3xl font-bold text-red-600">₹{totalDebits.toFixed(2)}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Balance</p>
            <p className={`text-3xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ₹{balance.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('transactions')}
              className={`flex-1 py-4 px-6 font-semibold ${
                activeTab === 'transactions'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600'
              }`}
            >
              Transactions
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`flex-1 py-4 px-6 font-semibold ${
                activeTab === 'reports'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600'
              }`}
            >
              Reports
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'transactions' && (
              <div className="space-y-6">
                <TransactionForm onAdd={handleAddTransaction} />
                {loading ? (
                  <p className="text-center text-gray-600">Loading...</p>
                ) : (
                  <TransactionList
                    transactions={transactions}
                    onDelete={handleDeleteTransaction}
                  />
                )}
              </div>
            )}

            {activeTab === 'reports' && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Report Generation</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <a
                    href="/reports/daily"
                    className="block p-4 border-2 border-blue-300 rounded-lg hover:bg-blue-50 transition"
                  >
                    <h4 className="font-semibold text-blue-600">Daily Report</h4>
                    <p className="text-sm text-gray-600">View daily summary</p>
                  </a>
                  <a
                    href="/reports/weekly"
                    className="block p-4 border-2 border-orange-300 rounded-lg hover:bg-orange-50 transition"
                  >
                    <h4 className="font-semibold text-orange-600">Weekly Report</h4>
                    <p className="text-sm text-gray-600">View weekly summary</p>
                  </a>
                  <a
                    href="/reports/monthly"
                    className="block p-4 border-2 border-green-300 rounded-lg hover:bg-green-50 transition"
                  >
                    <h4 className="font-semibold text-green-600">Monthly Report</h4>
                    <p className="text-sm text-gray-600">View monthly analysis</p>
                  </a>
                  <a
                    href="/reports/annual"
                    className="block p-4 border-2 border-purple-300 rounded-lg hover:bg-purple-50 transition"
                  >
                    <h4 className="font-semibold text-purple-600">Annual Report</h4>
                    <p className="text-sm text-gray-600">View yearly trends</p>
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
