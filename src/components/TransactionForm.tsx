import React, { useState } from 'react';
import { Plus, X, Sparkles } from 'lucide-react';
import { Transaction, Category } from '../types';

interface TransactionFormProps {
  categories: Category[];
  onSubmit: (transaction: Omit<Transaction, 'id'>) => void;
  onClose: () => void;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({
  categories,
  onSubmit,
  onClose,
}) => {
  const [formData, setFormData] = useState({
    type: 'expense' as Transaction['type'],
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.amount || !formData.category) return;

    const transaction: Omit<Transaction, 'id'> = {
      type: formData.type,
      amount: parseFloat(formData.amount),
      category: formData.category,
      description: formData.description,
      date: formData.date,
    };

    onSubmit(transaction);
    onClose();
  };

  const filteredCategories = categories.filter(cat => cat.type === formData.type);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-red-400 rounded-2xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">添加记录</h2>
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
                onClick={() => setFormData({ ...formData, type: 'income', category: '' })}
                className={`p-4 rounded-2xl border-2 transition-all duration-200 ${
                  formData.type === 'income'
                    ? 'bg-green-50 border-green-200 text-green-800'
                    : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <div className="text-2xl mb-2">💰</div>
                <div className="font-semibold text-sm">收入</div>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'expense', category: '' })}
                className={`p-4 rounded-2xl border-2 transition-all duration-200 ${
                  formData.type === 'expense'
                    ? 'bg-red-50 border-red-200 text-red-800'
                    : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <div className="text-2xl mb-2">💸</div>
                <div className="font-semibold text-sm">支出</div>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              金额
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">¥</span>
              <input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full pl-8 pr-4 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-200 text-lg font-medium bg-gray-50"
                placeholder="0.00"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              选择类别
            </label>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
              {filteredCategories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, category: category.name })}
                  className={`p-3 rounded-2xl border-2 transition-all duration-200 text-left ${
                    formData.category === category.name
                      ? 'border-pink-200 bg-pink-50'
                      : 'border-gray-200 bg-gray-50 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{category.icon}</span>
                    <span className="font-medium text-sm">{category.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              备注说明
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-200 bg-gray-50"
              placeholder="添加备注信息（可选）"
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
              className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-200 bg-gray-50"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-400 to-red-400 text-white py-4 rounded-2xl hover:from-pink-500 hover:to-red-500 transition-all duration-200 flex items-center justify-center gap-3 font-semibold text-lg shadow-lg"
          >
            <Plus className="w-5 h-5" />
            确认添加
          </button>
        </form>
      </div>
    </div>
  );
};