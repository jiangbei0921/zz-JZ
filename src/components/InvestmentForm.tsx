import React, { useState } from 'react';
import { Plus, X, TrendingUp } from 'lucide-react';
import { InvestmentTransaction } from '../types';

interface InvestmentFormProps {
  onSubmit: (transaction: Omit<InvestmentTransaction, 'id'>) => void;
  onClose: () => void;
}

export const InvestmentForm: React.FC<InvestmentFormProps> = ({
  onSubmit,
  onClose,
}) => {
  const [formData, setFormData] = useState({
    type: 'buy' as InvestmentTransaction['type'],
    amount: '',
    product: '',
    quantity: '',
    unitPrice: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.amount || !formData.product || !formData.quantity || !formData.unitPrice) return;

    const transaction: Omit<InvestmentTransaction, 'id'> = {
      type: formData.type,
      amount: parseFloat(formData.amount),
      product: formData.product,
      quantity: parseFloat(formData.quantity),
      unitPrice: parseFloat(formData.unitPrice),
      description: formData.description,
      date: formData.date,
    };

    onSubmit(transaction);
    onClose();
  };

  const productTypes = [
    { value: '股票', icon: '📈', color: 'from-red-400 to-pink-400' },
    { value: '基金', icon: '📊', color: 'from-green-400 to-emerald-400' },
    { value: '债券', icon: '🏦', color: 'from-blue-400 to-cyan-400' },
    { value: '理财产品', icon: '💎', color: 'from-purple-400 to-violet-400' },
    { value: '数字货币', icon: '₿', color: 'from-orange-400 to-amber-400' },
    { value: '其他', icon: '💼', color: 'from-gray-400 to-slate-400' },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-pink-400 rounded-2xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">投资交易</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-2xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              交易类型
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'buy' })}
                className={`p-4 rounded-2xl border-2 transition-all duration-200 ${
                  formData.type === 'buy'
                    ? 'bg-blue-50 border-blue-200 text-blue-800'
                    : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <div className="text-2xl mb-2">📈</div>
                <div className="font-semibold text-sm">买入</div>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'sell' })}
                className={`p-4 rounded-2xl border-2 transition-all duration-200 ${
                  formData.type === 'sell'
                    ? 'bg-green-50 border-green-200 text-green-800'
                    : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <div className="text-2xl mb-2">📉</div>
                <div className="font-semibold text-sm">卖出</div>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              产品类型
            </label>
            <div className="grid grid-cols-2 gap-2">
              {productTypes.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, product: type.value })}
                  className={`p-3 rounded-2xl border-2 transition-all duration-200 ${
                    formData.product === type.value
                      ? 'border-orange-200 bg-orange-50'
                      : 'border-gray-200 bg-gray-50 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{type.icon}</span>
                    <span className="font-medium text-sm">{type.value}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                数量/份额
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-200 bg-gray-50"
                placeholder="0.00"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                单价
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">¥</span>
                <input
                  type="number"
                  step="0.01"
                  value={formData.unitPrice}
                  onChange={(e) => {
                    const unitPrice = e.target.value;
                    const quantity = formData.quantity;
                    const amount = unitPrice && quantity ? (parseFloat(unitPrice) * parseFloat(quantity)).toFixed(2) : '';
                    setFormData({ ...formData, unitPrice, amount });
                  }}
                  className="w-full pl-7 pr-4 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-200 bg-gray-50"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              总金额
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">¥</span>
              <input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full pl-8 pr-4 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-200 text-lg font-medium bg-gray-50"
                placeholder="0.00"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              产品名称/代码
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-200 bg-gray-50"
              placeholder="例如：招商银行(600036)"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              交易日期
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-200 bg-gray-50"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-orange-400 to-pink-400 text-white py-4 rounded-2xl hover:from-orange-500 hover:to-pink-500 transition-all duration-200 flex items-center justify-center gap-3 font-semibold text-lg shadow-lg"
          >
            <Plus className="w-5 h-5" />
            确认交易
          </button>
        </form>
      </div>
    </div>
  );
};