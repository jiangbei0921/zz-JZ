import React from 'react';
import { Trash2, TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import { Transaction, Category } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';

interface TransactionListProps {
  transactions: Transaction[];
  categories: Category[];
  onDelete: (id: string) => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  categories,
  onDelete,
}) => {
  const getCategoryInfo = (categoryName: string) => {
    const category = categories.find(cat => cat.name === categoryName);
    return category || { color: '#6B7280', icon: '💰' };
  };

  const sortedTransactions = [...transactions].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <TrendingUp className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-600 mb-2">暂无交易记录</h3>
        <p className="text-sm text-gray-400">点击右下角按钮开始记录</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {sortedTransactions.map((transaction) => {
        const categoryInfo = getCategoryInfo(transaction.category);
        const isIncome = transaction.type === 'income';
        
        return (
          <div
            key={transaction.id}
            className="group flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all duration-200"
          >
            <div className="flex items-center space-x-3 flex-1">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                isIncome ? 'bg-green-100' : 'bg-red-100'
              }`}>
                <span className="text-lg">{categoryInfo.icon}</span>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-gray-900 text-sm">
                    {transaction.category}
                  </h3>
                  <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${
                    isIncome 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {isIncome ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {isIncome ? '收入' : '支出'}
                  </div>
                </div>
                
                {transaction.description && (
                  <p className="text-xs text-gray-500 mb-1">{transaction.description}</p>
                )}
                
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(transaction.date)}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <div className={`text-lg font-bold ${
                  isIncome ? 'text-green-600' : 'text-red-600'
                }`}>
                  {isIncome ? '+' : '-'}{formatCurrency(transaction.amount)}
                </div>
              </div>
              
              <button
                onClick={() => onDelete(transaction.id)}
                className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
                title="删除记录"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};