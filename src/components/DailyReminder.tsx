import React from 'react';
import { Bell, X, Plus, Clock } from 'lucide-react';

interface DailyReminderProps {
  onClose: () => void;
  onAddRecord: () => void;
}

export const DailyReminder: React.FC<DailyReminderProps> = ({
  onClose,
  onAddRecord,
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl animate-bounce">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-2xl flex items-center justify-center">
              <Bell className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">记账提醒</h3>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Clock className="w-3 h-3" />
                <span>{new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="w-6 h-6 flex items-center justify-center rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mb-6">
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-4 mb-4">
            <p className="text-gray-800 text-sm font-medium mb-2">
              🌟 今天还没有记录哦！
            </p>
            <p className="text-gray-600 text-xs leading-relaxed">
              养成每日记账的好习惯，让财务管理更轻松。记录今天的收支情况吧～
            </p>
          </div>
          
          <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
            <span>💡</span>
            <span>坚持记账21天，养成理财好习惯</span>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-2xl hover:bg-gray-200 transition-all duration-200 text-sm font-medium"
          >
            稍后提醒
          </button>
          
          <button
            onClick={onAddRecord}
            className="flex-1 py-3 px-4 bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-2xl hover:from-yellow-500 hover:to-orange-500 transition-all duration-200 flex items-center justify-center gap-2 text-sm font-medium shadow-lg"
          >
            <Plus className="w-4 h-4" />
            立即记账
          </button>
        </div>
      </div>
    </div>
  );
};