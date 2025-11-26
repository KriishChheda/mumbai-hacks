import React from 'react';
import { Sparkles, Trophy, Users } from 'lucide-react';

const NavigationTabs = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'chat', label: 'Coach', icon: Sparkles },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
    { id: 'circle', label: 'Circle', icon: Users },
  ];
  
  return (
    <div className="flex justify-center gap-2 mb-6">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all ${
            activeTab === tab.id
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105'
              : 'bg-white text-gray-600 hover:bg-gray-50 shadow'
          }`}
        >
          <tab.icon className="w-5 h-5" />
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default NavigationTabs;