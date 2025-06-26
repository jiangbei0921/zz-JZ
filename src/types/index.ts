export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
}

export interface InvestmentTransaction {
  id: string;
  type: 'buy' | 'sell';
  amount: number;
  product: string;
  quantity: number;
  unitPrice: number;
  description: string;
  date: string;
}

export interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  color: string;
  icon: string;
}

export interface InvestmentProduct {
  id: string;
  name: string;
  type: 'stock' | 'fund' | 'bond' | 'crypto' | 'other';
  totalBought: number;
  totalSold: number;
  currentHolding: number;
  averageBuyPrice: number;
  averageSellPrice: number;
}