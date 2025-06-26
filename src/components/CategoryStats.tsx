import React from 'react';
import { Transaction, Category } from '../types';
import { formatCurrency } from '../utils/formatters';

interface CategoryStatsProps {
  transactions: Transaction[];
  categories: Category[];
}

export const CategoryStats: React.FC<CategoryStatsProps> = ({ transactions, categories }) => {
  const currentMonth = new Date().toISOString().slice(0, 7);
  
  const monthlyTransactions = transactions.filter(t => 
    t.date.startsWith(currentMonth)
  );

  const categoryStats = categories.map(category => {
    const categoryTransactions = monthlyTransactions.filter(t => t.category === category.name);
    const total = categoryTransactions.reduce((sum, t) => sum + t.amount, 0);
    const count = categoryTransactions.length;
    
    return {
      ...category,
      total,
      count,
      percentage: 0,
    };
  }).filter(stat => stat.total > 0);

  // 按类型分组计算百分比
  const incomeStats = categoryStats.filter(s => s.type === 'income');
  const expenseStats = categoryStats.filter(s => s.type === 'expense');

  const totalIncome = incomeStats.reduce((sum, s) => sum + s.total, 0);
  const totalExpense = expenseStats.reduce((sum, s) => sum + s.total, 0);

  // 计算百分比
  incomeStats.forEach(stat => {
    stat.percentage = totalIncome > 0 ? (stat.total / totalIncome) * 100 : 0;
  });
  expenseStats.forEach(stat => {
    stat.percentage = totalExpense > 0 ? (stat.total / totalExpense) * 100 : 0;
  });

  // 按金额排序
  const sortedIncomeStats = incomeStats.sort((a, b) => b.total - a.total);
  const sortedExpenseStats = expenseStats.sort((a, b) => b.total - a.total);

  const renderCategorySection = (title: string, stats: typeof categoryStats, color: string) => {
    if (stats.length === 0) return null;

    return (
      <div className="bg-white rounded-3xl p-6 shadow-sm">
        <h3 className="text-lg font-bold mb-4" style={{ color }}>{title}</h3>
        <div className="space-y-3">
          {stats.map((stat) => (
            <div key={stat.id} className="p-4 bg-gray-50 rounded-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                    <span className="text-lg">{stat.icon}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{stat.name}</p>
                    <p className="text-xs text-gray-500">{stat.count} 笔交易</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold" style={{ color }}>{formatCurrency(stat.total)}</p>
                  <p className="text-xs text-gray-500">{stat.percentage.toFixed(1)}%</p>
                </div>
              </div>
              
              {/* 进度条 */}
              <div className="mt-3">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${stat.percentage}%`,
                      backgroundColor: color
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold text-gray-800 mb-2">本月分类统计</h2>
        <p className="text-sm text-gray-500">详细了解您的收支结构</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {renderCategorySection('收入分析', sortedIncomeStats, '#52C41A')}
        {renderCategorySection('支出分析', sortedExpenseStats, '#FF4D4F')}
      </div>
    </div>
  );
};