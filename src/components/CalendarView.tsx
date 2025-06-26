import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, TrendingUp, TrendingDown, Calendar as CalendarIcon } from 'lucide-react';
import { Transaction, InvestmentTransaction, Category } from '../types';
import { formatCurrency } from '../utils/formatters';
import { TransactionList } from './TransactionList';
import { InvestmentList } from './InvestmentList';

interface CalendarViewProps {
  transactions: Transaction[];
  investmentTransactions: InvestmentTransaction[];
  categories: Category[];
  onDateSelect: (date: string | null) => void;
  selectedDate: string | null;
  onDeleteTransaction: (id: string) => void;
  onDeleteInvestmentTransaction: (id: string) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  transactions,
  investmentTransactions,
  categories,
  onDateSelect,
  selectedDate,
  onDeleteTransaction,
  onDeleteInvestmentTransaction,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // 获取当月第一天和最后一天
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const firstDayOfWeek = firstDay.getDay();
  const daysInMonth = lastDay.getDate();

  // 生成日历天数数组
  const calendarDays = [];
  
  // 添加上个月的天数（填充）
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const prevDate = new Date(year, month, -i);
    calendarDays.push({
      date: prevDate.getDate(),
      dateString: prevDate.toISOString().split('T')[0],
      isCurrentMonth: false,
      isToday: false,
    });
  }

  // 添加当月的天数
  const today = new Date().toISOString().split('T')[0];
  for (let day = 1; day <= daysInMonth; day++) {
    const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    calendarDays.push({
      date: day,
      dateString,
      isCurrentMonth: true,
      isToday: dateString === today,
    });
  }

  // 添加下个月的天数（填充到42天）
  const remainingDays = 42 - calendarDays.length;
  for (let day = 1; day <= remainingDays; day++) {
    const nextDate = new Date(year, month + 1, day);
    calendarDays.push({
      date: day,
      dateString: nextDate.toISOString().split('T')[0],
      isCurrentMonth: false,
      isToday: false,
    });
  }

  // 获取指定日期的交易数据
  const getDateTransactions = (dateString: string) => {
    const dayTransactions = transactions.filter(t => t.date === dateString);
    const dayInvestments = investmentTransactions.filter(t => t.date === dateString);
    
    const income = dayTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expense = dayTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const investmentAmount = dayInvestments.reduce((sum, t) => sum + t.amount, 0);
    
    return {
      transactions: dayTransactions,
      investments: dayInvestments,
      income,
      expense,
      investmentAmount,
      hasRecords: dayTransactions.length > 0 || dayInvestments.length > 0,
    };
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const monthNames = [
    '1月', '2月', '3月', '4月', '5月', '6月',
    '7月', '8月', '9月', '10月', '11月', '12月'
  ];

  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

  const selectedDateData = selectedDate ? getDateTransactions(selectedDate) : null;

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="bg-white rounded-3xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-violet-400 rounded-2xl flex items-center justify-center">
              <CalendarIcon className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">记账日历</h2>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <h3 className="text-lg font-semibold text-gray-800 min-w-[100px] text-center">
              {year}年{monthNames[month]}
            </h3>
            
            <button
              onClick={() => navigateMonth('next')}
              className="p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Week Headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map((day) => (
            <div key={day} className="text-center py-2 text-sm font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => {
            const dayData = getDateTransactions(day.dateString);
            const isSelected = selectedDate === day.dateString;
            
            return (
              <button
                key={index}
                onClick={() => onDateSelect(isSelected ? null : day.dateString)}
                className={`
                  relative p-2 rounded-xl transition-all duration-200 min-h-[60px] flex flex-col items-center justify-center
                  ${day.isCurrentMonth 
                    ? 'text-gray-900 hover:bg-gray-100' 
                    : 'text-gray-400'
                  }
                  ${day.isToday 
                    ? 'bg-gradient-to-br from-purple-400 to-violet-400 text-white hover:from-purple-500 hover:to-violet-500' 
                    : ''
                  }
                  ${isSelected && !day.isToday
                    ? 'bg-purple-100 border-2 border-purple-300'
                    : ''
                  }
                  ${dayData.hasRecords && !day.isToday && !isSelected
                    ? 'bg-green-50 border border-green-200'
                    : ''
                  }
                `}
              >
                <span className={`text-sm font-medium ${day.isToday ? 'text-white' : ''}`}>
                  {day.date}
                </span>
                
                {/* 收支指示器 */}
                {dayData.hasRecords && (
                  <div className="flex gap-1 mt-1">
                    {dayData.income > 0 && (
                      <div className={`w-1.5 h-1.5 rounded-full ${day.isToday ? 'bg-white' : 'bg-green-400'}`} />
                    )}
                    {dayData.expense > 0 && (
                      <div className={`w-1.5 h-1.5 rounded-full ${day.isToday ? 'bg-white' : 'bg-red-400'}`} />
                    )}
                    {dayData.investmentAmount > 0 && (
                      <div className={`w-1.5 h-1.5 rounded-full ${day.isToday ? 'bg-white' : 'bg-orange-400'}`} />
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Date Details */}
      {selectedDate && selectedDateData && (
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-800">
                {new Date(selectedDate).toLocaleDateString('zh-CN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  weekday: 'long'
                })}
              </h3>
              <p className="text-sm text-gray-500 mt-1">当日记录详情</p>
            </div>
            
            <button
              onClick={() => onDateSelect(null)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Daily Summary */}
          {selectedDateData.hasRecords && (
            <div className="grid grid-cols-3 gap-4 mb-6">
              {selectedDateData.income > 0 && (
                <div className="text-center p-3 bg-green-50 rounded-2xl">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="text-xs text-green-600 font-medium">收入</span>
                  </div>
                  <p className="text-sm font-bold text-green-700">
                    {formatCurrency(selectedDateData.income)}
                  </p>
                </div>
              )}
              
              {selectedDateData.expense > 0 && (
                <div className="text-center p-3 bg-red-50 rounded-2xl">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <TrendingDown className="w-4 h-4 text-red-600" />
                    <span className="text-xs text-red-600 font-medium">支出</span>
                  </div>
                  <p className="text-sm font-bold text-red-700">
                    {formatCurrency(selectedDateData.expense)}
                  </p>
                </div>
              )}
              
              {selectedDateData.investmentAmount > 0 && (
                <div className="text-center p-3 bg-orange-50 rounded-2xl">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <TrendingUp className="w-4 h-4 text-orange-600" />
                    <span className="text-xs text-orange-600 font-medium">投资</span>
                  </div>
                  <p className="text-sm font-bold text-orange-700">
                    {formatCurrency(selectedDateData.investmentAmount)}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Transaction Lists */}
          <div className="space-y-6">
            {selectedDateData.transactions.length > 0 && (
              <div>
                <h4 className="text-md font-semibold text-gray-800 mb-3">收支记录</h4>
                <TransactionList
                  transactions={selectedDateData.transactions}
                  categories={categories}
                  onDelete={onDeleteTransaction}
                />
              </div>
            )}
            
            {selectedDateData.investments.length > 0 && (
              <div>
                <h4 className="text-md font-semibold text-gray-800 mb-3">投资记录</h4>
                <InvestmentList
                  transactions={selectedDateData.investments}
                  onDelete={onDeleteInvestmentTransaction}
                />
              </div>
            )}
          </div>

          {!selectedDateData.hasRecords && (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Plus className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-gray-500 text-sm">当日暂无记录</p>
              <p className="text-gray-400 text-xs mt-1">点击右下角按钮添加记录</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};