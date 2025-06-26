import React from 'react';
import { TrendingUp, TrendingDown, Wallet, PieChart } from 'lucide-react';
import { Transaction } from '../types';
import { formatCurrency } from '../utils/formatters';

interface SummaryProps {
  transactions: Transaction[];
}

export const Summary: React.FC<SummaryProps> = ({ transactions }) => {
  const currentMonth = new Date().toISOString().slice(0, 7);
  
  const monthlyTransactions = transactions.filter(t => 
    t.date.startsWith(currentMonth)
  );

  const totalIncome = monthlyTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = monthlyTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = totalIncome - totalExpense;

  const totalBalance = transactions
    .reduce((sum, t) => {
      return t.type === 'income' ? sum + t.amount : sum - t.amount;
    }, 0);

  const stats = [
    {
      title: '总余额',
      value: totalBalance,
      icon: Wallet,
      color: '#4ECDC4',
      bgColor: 'bg-teal-50',
    },
    {
      title: '本月收入',
      value: totalIncome,
      icon: TrendingUp,
      color: '#52C41A',
      bgColor: 'bg-green-50',
    },
    {
      title: '本月支出',
      value: totalExpense,
      icon: TrendingDown,
      color: '#FF4D4F',
      bgColor: 'bg-red-50',
    },
    {
      title: '本月结余',
      value: netBalance,
      icon: PieChart,
      color: netBalance >= 0 ? '#722ED1' : '#FA8C16',
      bgColor: netBalance >= 0 ? 'bg-purple-50' : 'bg-orange-50',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="bg-white rounded-3xl p-5 shadow-sm hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-3">
              <div 
                className={`w-10 h-10 rounded-2xl ${stat.bgColor} flex items-center justify-center`}
              >
                <Icon className="w-5 h-5" style={{ color: stat.color }} />
              </div>
            </div>
            
            <div>
              <p className="text-xs text-gray-500 mb-1">{stat.title}</p>
              <p 
                className="text-lg font-bold"
                style={{ color: stat.color }}
              >
                {formatCurrency(stat.value)}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};