import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Target } from 'lucide-react';
import { InvestmentTransaction } from '../types';
import { formatCurrency } from '../utils/formatters';

interface InvestmentSummaryProps {
  transactions: InvestmentTransaction[];
}

export const InvestmentSummary: React.FC<InvestmentSummaryProps> = ({ transactions }) => {
  const totalBought = transactions
    .filter(t => t.type === 'buy')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalSold = transactions
    .filter(t => t.type === 'sell')
    .reduce((sum, t) => sum + t.amount, 0);

  const netInvestment = totalBought - totalSold;

  // 计算持仓产品数量
  const productMap = new Map();
  transactions.forEach(t => {
    if (!productMap.has(t.product)) {
      productMap.set(t.product, { bought: 0, sold: 0 });
    }
    const product = productMap.get(t.product);
    if (t.type === 'buy') {
      product.bought += t.quantity;
    } else {
      product.sold += t.quantity;
    }
  });

  const holdingProducts = Array.from(productMap.entries()).filter(
    ([_, data]) => data.bought > data.sold
  ).length;

  const stats = [
    {
      title: '总买入',
      value: totalBought,
      icon: TrendingDown,
      color: '#1890FF',
      bgColor: 'bg-blue-50',
    },
    {
      title: '总卖出',
      value: totalSold,
      icon: TrendingUp,
      color: '#52C41A',
      bgColor: 'bg-green-50',
    },
    {
      title: '净投入',
      value: netInvestment,
      icon: DollarSign,
      color: netInvestment >= 0 ? '#FF4D4F' : '#52C41A',
      bgColor: netInvestment >= 0 ? 'bg-red-50' : 'bg-green-50',
    },
    {
      title: '持仓产品',
      value: holdingProducts,
      icon: Target,
      color: '#722ED1',
      bgColor: 'bg-purple-50',
      isCount: true,
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
                {stat.isCount ? stat.value : formatCurrency(stat.value)}
                {stat.isCount && <span className="text-sm ml-1">个</span>}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};