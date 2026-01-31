import React from 'react';
import { Transaction } from '../types';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({ transactions, onDelete }) => {
  if (transactions.length === 0) {
    return <p className="text-center text-gray-600 py-8">No transactions yet</p>;
  }

  const sortedTransactions = [...transactions].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b-2 border-gray-200">
            <th className="text-left py-3 px-4">Date</th>
            <th className="text-left py-3 px-4">Type</th>
            <th className="text-left py-3 px-4">Description</th>
            <th className="text-left py-3 px-4">Category</th>
            <th className="text-right py-3 px-4">Amount</th>
            <th className="text-center py-3 px-4">Action</th>
          </tr>
        </thead>
        <tbody>
          {sortedTransactions.map((transaction) => (
            <tr key={transaction.id} className="border-b border-gray-200 hover:bg-gray-50">
              <td className="py-3 px-4">{transaction.date}</td>
              <td className="py-3 px-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    transaction.type === 'debit'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-green-100 text-green-800'
                  }`}
                >
                  {transaction.type.toUpperCase()}
                </span>
              </td>
              <td className="py-3 px-4">{transaction.description}</td>
              <td className="py-3 px-4">{transaction.category || '-'}</td>
              <td className="py-3 px-4 text-right font-semibold">
                <span className={transaction.type === 'debit' ? 'text-red-600' : 'text-green-600'}>
                  {transaction.type === 'debit' ? '-' : '+'} ₹{transaction.amount.toFixed(2)}
                </span>
              </td>
              <td className="py-3 px-4 text-center">
                <button
                  onClick={() => onDelete(transaction.id)}
                  className="text-red-600 hover:text-red-800 font-semibold text-sm"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
