import { Category } from '../types';

export const defaultCategories: Category[] = [
  // 收入类别
  { id: '1', name: '工资薪酬', type: 'income', color: '#10B981', icon: '💼' },
  { id: '2', name: '奖金提成', type: 'income', color: '#059669', icon: '🎯' },
  { id: '3', name: '兼职收入', type: 'income', color: '#34D399', icon: '💻' },
  { id: '4', name: '投资分红', type: 'income', color: '#6EE7B7', icon: '📈' },
  { id: '5', name: '租金收入', type: 'income', color: '#A7F3D0', icon: '🏠' },
  { id: '6', name: '其他收入', type: 'income', color: '#D1FAE5', icon: '💰' },
  
  // 支出类别
  { id: '7', name: '餐饮美食', type: 'expense', color: '#F59E0B', icon: '🍽️' },
  { id: '8', name: '交通出行', type: 'expense', color: '#EF4444', icon: '🚗' },
  { id: '9', name: '购物消费', type: 'expense', color: '#EC4899', icon: '🛍️' },
  { id: '10', name: '娱乐休闲', type: 'expense', color: '#8B5CF6', icon: '🎮' },
  { id: '11', name: '住房租金', type: 'expense', color: '#06B6D4', icon: '🏡' },
  { id: '12', name: '医疗健康', type: 'expense', color: '#10B981', icon: '🏥' },
  { id: '13', name: '教育学习', type: 'expense', color: '#F97316', icon: '📚' },
  { id: '14', name: '生活用品', type: 'expense', color: '#84CC16', icon: '🧴' },
  { id: '15', name: '通讯费用', type: 'expense', color: '#3B82F6', icon: '📱' },
  { id: '16', name: '其他支出', type: 'expense', color: '#6B7280', icon: '💸' },
];