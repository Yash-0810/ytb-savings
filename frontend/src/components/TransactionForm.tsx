import React, { useState } from 'react';
import { Transaction } from '../types';

interface TransactionFormProps {
  onAdd: (transaction: Omit<Transaction, 'id'>) => void;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({ onAdd }) => {
  const [type, setType] = useState<'debit' | 'credit'>('debit');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState('cash');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description) {
      alert('Please fill all fields');
      return;
    }

    onAdd({
      type,
      amount: parseFloat(amount),
      description,
      category,
      date,
      payment_method: paymentMethod,
    });

    setAmount('');
    setDescription('');
    setCategory('');
    setDate(new Date().toISOString().split('T')[0]);
    setPaymentMethod('cash');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-gray-50 rounded-lg">
      <h3 className="text-lg font-semibold">Add Transaction</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as 'debit' | 'credit')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          >
            <option value="debit">Debit (Expense)</option>
            <option value="credit">Credit (Income)</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            step="0.01"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">Category</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="e.g., Groceries, Salary"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">Payment Method</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          >
            <option value="cash">Cash</option>
            <option value="upi">UPI</option>
            <option value="card">Card</option>
            <option value="bank_transfer">Bank Transfer</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-gray-700 font-semibold mb-2">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter transaction details"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          rows={2}
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition"
      >
        Add Transaction
      </button>
    </form>
  );
};
