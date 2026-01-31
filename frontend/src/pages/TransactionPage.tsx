import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { transactionAPI } from '../api/client';
import { Transaction } from '../types';
import { Navbar } from '../components/Navbar';
import { TransactionForm } from '../components/TransactionForm';

export const TransactionPage: React.FC = () => {
  const { user, logout } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'debit' | 'credit'>('all');

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
      setTransactions([response.data, ...transactions]);
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

  const filteredTransactions = transactions.filter(t => {
    if (activeTab === 'all') return true;
    return t.type === activeTab;
  });

  const totalDebits = filteredTransactions
    .filter(t => t.type === 'debit')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalCredits = filteredTransactions
    .filter(t => t.type === 'credit')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalCredits - totalDebits;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} onLogout={logout} />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Manage Transactions</h1>

        {/* Add Transaction Form */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <TransactionForm onAdd={handleAddTransaction} />
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg shadow p-6">
            <p className="text-sm opacity-90">Total Income</p>
            <p className="text-3xl font-bold">₹{totalCredits.toFixed(2)}</p>
          </div>
          <div className="bg-gradient-to-br from-red-500 to-red-600 text-white rounded-lg shadow p-6">
            <p className="text-sm opacity-90">Total Expenses</p>
            <p className="text-3xl font-bold">₹{totalDebits.toFixed(2)}</p>
          </div>
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg shadow p-6">
            <p className="text-sm opacity-90">Balance</p>
            <p className="text-3xl font-bold">₹{balance.toFixed(2)}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-lg mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('all')}
              className={`flex-1 py-4 px-6 font-semibold transition ${
                activeTab === 'all'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              All Transactions ({transactions.length})
            </button>
            <button
              onClick={() => setActiveTab('credit')}
              className={`flex-1 py-4 px-6 font-semibold transition ${
                activeTab === 'credit'
                  ? 'border-b-2 border-green-600 text-green-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              💰 Income ({transactions.filter(t => t.type === 'credit').length})
            </button>
            <button
              onClick={() => setActiveTab('debit')}
              className={`flex-1 py-4 px-6 font-semibold transition ${
                activeTab === 'debit'
                  ? 'border-b-2 border-red-600 text-red-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              💸 Expenses ({transactions.filter(t => t.type === 'debit').length})
            </button>
          </div>

          <div className="p-6">
            {loading ? (
              <p className="text-center text-gray-600 py-8">Loading transactions...</p>
            ) : filteredTransactions.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-100 border-b">
                      <th className="px-6 py-3 text-left font-semibold text-gray-700">Date</th>
                      <th className="px-6 py-3 text-left font-semibold text-gray-700">Type</th>
                      <th className="px-6 py-3 text-left font-semibold text-gray-700">Amount</th>
                      <th className="px-6 py-3 text-left font-semibold text-gray-700">Description</th>
                      <th className="px-6 py-3 text-left font-semibold text-gray-700">Category</th>
                      <th className="px-6 py-3 text-left font-semibold text-gray-700">Payment</th>
                      <th className="px-6 py-3 text-left font-semibold text-gray-700">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.map((txn) => (
                      <tr key={txn.id} className="border-b hover:bg-gray-50">
                        <td className="px-6 py-3 text-gray-700">{txn.date}</td>
                        <td className="px-6 py-3">
                          <span
                            className={`px-3 py-1 rounded-full text-white text-sm font-semibold ${
                              txn.type === 'debit' ? 'bg-red-500' : 'bg-green-500'
                            }`}
                          >
                            {txn.type === 'debit' ? '💸 Expense' : '💰 Income'}
                          </span>
                        </td>
                        <td className="px-6 py-3 font-semibold text-gray-800">
                          ₹{txn.amount.toFixed(2)}
                        </td>
                        <td className="px-6 py-3 text-gray-700">{txn.description}</td>
                        <td className="px-6 py-3">
                          <span className="px-2 py-1 bg-gray-200 rounded text-sm">
                            {txn.category || '-'}
                          </span>
                        </td>
                        <td className="px-6 py-3">
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                            {txn.payment_method || 'cash'}
                          </span>
                        </td>
                        <td className="px-6 py-3">
                          <button
                            onClick={() => handleDeleteTransaction(txn.id)}
                            className="text-red-600 hover:text-red-800 font-semibold transition"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center text-gray-600 py-8">
                No {activeTab !== 'all' ? activeTab : ''} transactions yet
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
