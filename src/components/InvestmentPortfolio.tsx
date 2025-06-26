import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Package } from 'lucide-react';
import { InvestmentTransaction } from '../types';
import { formatCurrency } from '../utils/formatters';

interface InvestmentPortfolioProps {
  transactions: InvestmentTransaction[];
}

export const InvestmentPortfolio: React.FC<InvestmentPortfolioProps> = ({ transactions }) => {
  // 按产品分组统计
  const portfolioMap = new Map<string, {
    name: string;
    totalBought: number;
    totalSold: number;
    boughtQuantity: number;
    soldQuantity: number;
    transactions: InvestmentTransaction[];
  }>();

  transactions.forEach(transaction => {
    const productName = transaction.product;
    
    if (!portfolioMap.has(productName)) {
      portfolioMap.set(productName, {
        name: productName,
        totalBought: 0,
        totalSold: 0,
        boughtQuantity: 0,
        soldQuantity: 0,
        transactions: [],
      });
    }

    const portfolio = portfolioMap.get(productName)!;
    portfolio.transactions.push(transaction);

    if (transaction.type === 'buy') {
      portfolio.totalBought += transaction.amount;
      portfolio.boughtQuantity += transaction.quantity;
    } else {
      portfolio.totalSold += transaction.amount;
      portfolio.soldQuantity += transaction.quantity;
    }
  });

  const portfolios = Array.from(portfolioMap.values()).map(portfolio => {
    const currentHolding = portfolio.boughtQuantity - portfolio.soldQuantity;
    const netInvestment = portfolio.totalBought - portfolio.totalSold;
    const averageBuyPrice = portfolio.boughtQuantity > 0 ? portfolio.totalBought / portfolio.boughtQuantity : 0;
    const averageSellPrice = portfolio.soldQuantity > 0 ? portfolio.totalSold / portfolio.soldQuantity : 0;
    
    return {
      ...portfolio,
      currentHolding,
      netInvestment,
      averageBuyPrice,
      averageSellPrice,
      profitLoss: portfolio.soldQuantity > 0 ? (averageSellPrice - averageBuyPrice) * portfolio.soldQuantity : 0,
    };
  }).sort((a, b) => Math.abs(b.netInvestment) - Math.abs(a.netInvestment));

  const getProductIcon = (product: string) => {
    if (product.includes('股票')) return '📈';
    if (product.includes('基金')) return '📊';
    if (product.includes('债券')) return '🏦';
    if (product.includes('理财')) return '💎';
    if (product.includes('数字货币')) return '₿';
    return '💼';
  };

  if (portfolios.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-800 mb-6">投资组合</h2>
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-600 mb-2">暂无投资组合</h3>
          <p className="text-sm text-gray-400">开始投资交易，建立您的投资组合</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm">
      <h2 className="text-xl font-bold text-gray-800 mb-6">投资组合</h2>
      
      <div className="space-y-4">
        {portfolios.map((portfolio, index) => (
          <div key={index} className="border border-gray-200 rounded-3xl p-5 hover:shadow-md transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center">
                  <span className="text-xl">{getProductIcon(portfolio.name)}</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{portfolio.name}</h3>
                  <p className="text-sm text-gray-500">
                    持仓: <span className="font-semibold">{portfolio.currentHolding.toFixed(2)}</span> 份
                  </p>
                </div>
              </div>
              
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                portfolio.netInvestment > 0 
                  ? 'bg-red-100 text-red-700' 
                  : portfolio.netInvestment < 0
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-700'
              }`}>
                {portfolio.netInvestment > 0 ? (
                  <TrendingDown className="w-4 h-4" />
                ) : portfolio.netInvestment < 0 ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <DollarSign className="w-4 h-4" />
                )}
                净投入
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-2xl">
                <p className="text-xs text-blue-600 font-medium mb-1">买入总额</p>
                <p className="text-sm font-bold text-blue-700">{formatCurrency(portfolio.totalBought)}</p>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-2xl">
                <p className="text-xs text-green-600 font-medium mb-1">卖出总额</p>
                <p className="text-sm font-bold text-green-700">{formatCurrency(portfolio.totalSold)}</p>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-2xl">
                <p className="text-xs text-purple-600 font-medium mb-1">净投入</p>
                <p className={`text-sm font-bold ${
                  portfolio.netInvestment > 0 ? 'text-red-700' : portfolio.netInvestment < 0 ? 'text-green-700' : 'text-gray-700'
                }`}>
                  {formatCurrency(Math.abs(portfolio.netInvestment))}
                </p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-2xl">
                <p className="text-xs text-gray-600 font-medium mb-1">平均买入价</p>
                <p className="text-sm font-bold text-gray-700">{formatCurrency(portfolio.averageBuyPrice)}</p>
              </div>
            </div>
            
            {portfolio.soldQuantity > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">平均卖出价:</span>
                    <span className="font-semibold">{formatCurrency(portfolio.averageSellPrice)}</span>
                  </div>
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                    portfolio.profitLoss > 0 
                      ? 'bg-green-100 text-green-700' 
                      : portfolio.profitLoss < 0
                      ? 'bg-red-100 text-red-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {portfolio.profitLoss > 0 ? (
                      <>
                        <TrendingUp className="w-4 h-4" />
                        盈利 {formatCurrency(portfolio.profitLoss)}
                      </>
                    ) : portfolio.profitLoss < 0 ? (
                      <>
                        <TrendingDown className="w-4 h-4" />
                        亏损 {formatCurrency(Math.abs(portfolio.profitLoss))}
                      </>
                    ) : (
                      <>
                        <DollarSign className="w-4 h-4" />
                        持平
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};