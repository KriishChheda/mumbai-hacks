import React from 'react';
import { Flame } from 'lucide-react';

const InsightCard = ({ icon: Icon, title, value, color, streak, onClick }) => (
  <button
    onClick={onClick}
    className={`bg-white p-4 rounded-xl shadow-md border-l-4 ${color} hover:scale-105 hover:shadow-xl transition-all cursor-pointer w-full text-left`}
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${color.replace('border', 'bg').replace('600', '100')}`}>
          <Icon className={`w-6 h-6 ${color.replace('border', 'text')}`} />
        </div>
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-xl font-bold text-gray-800">{value}</p>
        </div>
      </div>
      {streak && (
        <div className="flex items-center gap-1 bg-orange-100 px-2 py-1 rounded-full">
          <Flame className="w-4 h-4 text-orange-500" />
          <span className="text-sm font-bold text-orange-600">{streak}</span>
        </div>
      )}
    </div>
  </button>
);

export default InsightCard;