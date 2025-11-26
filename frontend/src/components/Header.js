import React from 'react';
import { DollarSign, Star, Trophy } from 'lucide-react';
import { moodProfiles } from '../data/financialData';

const Header = ({ level, xp, maxXp, points, mood }) => {
  const xpPercentage = (xp / maxXp) * 100;
  const moodData = moodProfiles[mood];
  
  return (
    <header className={`bg-gradient-to-r ${moodData.color} text-white p-4 shadow-lg`}>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="relative">
              <DollarSign className="w-8 h-8" />
              <div className="absolute -top-1 -right-1 text-xl">{moodData.emoji}</div>
            </div>
            <div>
              <h1 className="text-2xl font-bold">FinCoach AI</h1>
              <p className="text-xs opacity-90">{moodData.tone} mode</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
              <Star className="w-4 h-4 text-yellow-300" />
              <span className="font-bold text-sm">{points} pts</span>
            </div>
            <div className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
              <Trophy className="w-5 h-5 text-yellow-300" />
              <span className="font-bold">Lvl {level}</span>
            </div>
          </div>
        </div>
        <div className="relative w-full bg-white/30 rounded-full h-3 overflow-hidden backdrop-blur-sm">
          <div 
            className="absolute inset-0 bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 transition-all duration-500 rounded-full"
            style={{ width: `${xpPercentage}%` }}
          >
            <div className="absolute inset-0 bg-white/30 animate-shimmer"></div>
          </div>
        </div>
        <p className="text-xs mt-1 text-white/90 font-medium">{xp} / {maxXp} XP to next level</p>
      </div>
    </header>
  );
};

export default Header;