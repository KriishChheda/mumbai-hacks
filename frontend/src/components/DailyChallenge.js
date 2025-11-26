import React from 'react';
import { Target, Gift } from 'lucide-react';

const DailyChallenge = ({ challenge, onComplete, completed }) => (
  <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white p-4 rounded-xl shadow-lg">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3 flex-1">
        <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
          <Target className="w-6 h-6" />
        </div>
        <div>
          <p className="font-bold">Daily Challenge</p>
          <p className="text-sm opacity-90">{challenge}</p>
        </div>
      </div>
      <button
        onClick={onComplete}
        disabled={completed}
        className={`px-4 py-2 rounded-lg font-bold transition-all ${
          completed 
            ? 'bg-green-400 cursor-not-allowed' 
            : 'bg-white text-purple-600 hover:scale-105 shadow-md'
        }`}
      >
        {completed ? '✓ Done' : 'Complete'}
      </button>
    </div>
    {!completed && (
      <div className="mt-2 text-sm flex items-center gap-1 bg-white/20 inline-block px-3 py-1 rounded-full backdrop-blur-sm">
        <Gift className="w-4 h-4" />
        <span>Reward: +50 XP</span>
      </div>
    )}
  </div>
);

export default DailyChallenge;