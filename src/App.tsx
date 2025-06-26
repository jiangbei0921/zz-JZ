import React, { useState, useEffect } from 'react';
import { Plus, BarChart3, PieChart, TrendingUp, Menu, X, Wallet, Target, Calendar, Bell } from 'lucide-react';
import { Transaction, InvestmentTransaction, Category } from './types';
import { defaultCategories } from './data/defaultCategories';
import { useLocalStorage } from './hooks/useLocalStorage';
import { TransactionForm } from './components/TransactionForm';
import { InvestmentForm } from './components/InvestmentForm';
import { TransactionList } from './components/TransactionList';
import { InvestmentList } from './components/InvestmentList';
import { Summary } from './components/Summary';
import { InvestmentSummary } from './components/InvestmentSummary';
import { CategoryStats } from './components/CategoryStats';
import { InvestmentPortfolio } from './components/InvestmentPortfolio';
import { CalendarView } from './components/CalendarView';
import { DailyReminder } from './components/DailyReminder';

function App() {
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>('transactions', []);
  const [investmentTransactions, setInvestmentTransactions] = useLocalStorage<InvestmentTransaction[]>('investmentTransactions', []);
  const [categories] = useLocalStorage<Category[]>('categories', defaultCategories);
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [showInvestmentForm, setShowInvestmentForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'stats' | 'investment' | 'portfolio' | 'calendar'>('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showReminder, setShowReminder] = useState(false);
  const [lastRecordDate, setLastRecordDate] = useLocalStorage<string>('lastRecordDate', '');

  // 检查是否需要显示提醒
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayTransactions = transactions.filter(t => t.date === today);
    
    // 如果今天没有记录且上次记录不是今天，显示提醒
    if (todayTransactions.length === 0 && lastRecordDate !== today) {
      const timer = setTimeout(() => {
        setShowReminder(true);
      }, 3000); // 3秒后显示提醒
      
      return () => clearTimeout(timer);
    }
  }, [transactions, lastRecordDate]);

  const addTransaction = (newTransaction: Omit<Transaction, 'id'>) => {
    const transaction: Transaction = {
      ...newTransaction,
      id: Date.now().toString(),
    };
    setTransactions(prev => [...prev, transaction]);
    
    // 更新最后记录日期
    const today = new Date().toISOString().split('T')[0];
    setLastRecordDate(today);
  };

  const addInvestmentTransaction = (newTransaction: Omit<InvestmentTransaction, 'id'>) => {
    const transaction: InvestmentTransaction = {
      ...newTransaction,
      id: Date.now().toString(),
    };
    setInvestmentTransactions(prev => [...prev, transaction]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const deleteInvestmentTransaction = (id: string) => {
    setInvestmentTransactions(prev => prev.filter(t => t.id !== id));
  };

  const tabs = [
    { id: 'overview', label: '总览', icon: BarChart3, color: '#FF6B6B' },
    { id: 'transactions', label: '收支', icon: Wallet, color: '#4ECDC4' },
    { id: 'stats', label: '统计', icon: PieChart, color: '#45B7D1' },
    { id: 'investment', label: '投资', icon: TrendingUp, color: '#FFA07A' },
    { id: 'portfolio', label: '组合', icon: Target, color: '#98D8C8' },
    { id: 'calendar', label: '日历', icon: Calendar, color: '#A78BFA' },
  ] as const;

  const getCurrentMonth = () => {
    const now = new Date();
    return `${now.getFullYear()}年${String(now.getMonth() + 1).padStart(2, '0')}月`;
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <Summary transactions={transactions} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-3xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-800">最近收支</h3>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {transactions.slice(-5).length} 条
                  </span>
                </div>
                <TransactionList 
                  transactions={transactions.slice(-5)} 
                  categories={categories}
                  onDelete={deleteTransaction}
                />
              </div>
              <div className="bg-white rounded-3xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-800">最近投资</h3>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {investmentTransactions.slice(-5).length} 条
                  </span>
                </div>
                <InvestmentList 
                  transactions={investmentTransactions.slice(-5)} 
                  onDelete={deleteInvestmentTransaction}
                />
              </div>
            </div>
          </div>
        );
      case 'transactions':
        return (
          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-800">收支记录</h2>
                <p className="text-sm text-gray-500 mt-1">管理您的日常收入和支出</p>
              </div>
              <div className="text-xs text-gray-500 bg-gray-100 px-3 py-2 rounded-full">
                共 {transactions.length} 条记录
              </div>
            </div>
            <TransactionList 
              transactions={transactions} 
              categories={categories}
              onDelete={deleteTransaction}
            />
          </div>
        );
      case 'stats':
        return <CategoryStats transactions={transactions} categories={categories} />;
      case 'investment':
        return (
          <div className="space-y-6">
            <InvestmentSummary transactions={investmentTransactions} />
            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">投资记录</h2>
                  <p className="text-sm text-gray-500 mt-1">管理您的投资买卖交易</p>
                </div>
                <div className="text-xs text-gray-500 bg-gray-100 px-3 py-2 rounded-full">
                  共 {investmentTransactions.length} 条记录
                </div>
              </div>
              <InvestmentList 
                transactions={investmentTransactions} 
                onDelete={deleteInvestmentTransaction}
              />
            </div>
          </div>
        );
      case 'portfolio':
        return <InvestmentPortfolio transactions={investmentTransactions} />;
      case 'calendar':
        return (
          <CalendarView 
            transactions={transactions}
            investmentTransactions={investmentTransactions}
            categories={categories}
            onDateSelect={setSelectedDate}
            selectedDate={selectedDate}
            onDeleteTransaction={deleteTransaction}
            onDeleteInvestmentTransaction={deleteInvestmentTransaction}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-red-400 rounded-xl flex items-center justify-center">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <div className="ml-3">
                <h1 className="text-lg font-bold text-gray-900">记账本</h1>
                <p className="text-xs text-gray-500">{getCurrentMonth()}</p>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-2xl transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'text-white shadow-lg'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                    style={activeTab === tab.id ? {
                      backgroundColor: tab.color
                    } : {}}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white">
            <nav className="px-4 py-3 space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-3 w-full px-3 py-3 rounded-2xl transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'text-white shadow-lg'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                    style={activeTab === tab.id ? {
                      backgroundColor: tab.color
                    } : {}}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {renderContent()}
      </main>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-30">
        {/* Investment Button */}
        <button
          onClick={() => setShowInvestmentForm(true)}
          className="w-14 h-14 bg-gradient-to-br from-orange-400 to-pink-400 hover:from-orange-500 hover:to-pink-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center"
          title="添加投资记录"
        >
          <TrendingUp className="w-6 h-6" />
        </button>
        
        {/* Transaction Button */}
        <button
          onClick={() => setShowTransactionForm(true)}
          className="w-14 h-14 bg-gradient-to-br from-pink-400 to-red-400 hover:from-pink-500 hover:to-red-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center"
          title="添加收支记录"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {/* Forms */}
      {showTransactionForm && (
        <TransactionForm
          categories={categories}
          onSubmit={addTransaction}
          onClose={() => setShowTransactionForm(false)}
        />
      )}

      {showInvestmentForm && (
        <InvestmentForm
          onSubmit={addInvestmentTransaction}
          onClose={() => setShowInvestmentForm(false)}
        />
      )}

      {/* Daily Reminder */}
      {showReminder && (
        <DailyReminder
          onClose={() => setShowReminder(false)}
          onAddRecord={() => {
            setShowReminder(false);
            setShowTransactionForm(true);
          }}
        />
      )}
    </div>
  );
}

export default App;