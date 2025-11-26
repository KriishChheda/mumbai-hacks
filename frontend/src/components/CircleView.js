import React from 'react';
import { Users, Crown, Target } from 'lucide-react';
import { circleData } from '../data/financialData';

const CircleView = () => {
  const progressPercentage = (circleData.currentProgress / circleData.totalGoal) * 100;
  
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Circle Info Card */}
      <div className="bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-2xl shadow-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Users className="w-7 h-7" />
              {circleData.name}
            </h2>
            <p className="text-sm opacity-90 mt-1">{circleData.members} members saving together</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold">₹{(circleData.currentProgress / 1000).toFixed(0)}K</p>
            <p className="text-sm opacity-90">of ₹{(circleData.totalGoal / 1000).toFixed(0)}K goal</p>
          </div>
        </div>
        <div className="w-full bg-white/30 rounded-full h-4 overflow-hidden backdrop-blur-sm">
          <div 
            className="h-full bg-gradient-to-r from-yellow-300 to-green-400 transition-all duration-500 rounded-full flex items-center justify-end pr-2"
            style={{ width: `${progressPercentage}%` }}
          >
            <span className="text-xs font-bold text-white drop-shadow">{progressPercentage.toFixed(0)}%</span>
          </div>
        </div>
      </div>

      {/* Top Savers */}
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Crown className="w-6 h-6 text-yellow-500" />
          Top Contributors
        </h3>
        <div className="space-y-3">
          {circleData.topSavers.map((saver, idx) => (
            <div
              key={idx}
              className={`flex items-center gap-4 p-4 rounded-xl ${
                saver.isUser
                  ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-400'
                  : 'bg-gray-50'
              }`}
            >
              <div className="text-4xl">{saver.avatar}</div>
              <div className="flex-1">
                <p className={`font-bold ${saver.isUser ? 'text-blue-700' : 'text-gray-800'}`}>
                  {saver.name} {saver.isUser && '(You)'}
                </p>
                <p className="text-sm text-gray-600">Contributed ₹{saver.amount.toLocaleString()}</p>
              </div>
              {idx === 0 && <Crown className="w-6 h-6 text-yellow-500" />}
            </div>
          ))}
        </div>
      </div>

      {/* Your Contribution */}
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Your Impact</h3>
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-400">
          <div>
            <p className="text-sm text-gray-600">Your contribution</p>
            <p className="text-3xl font-bold text-green-700">₹{circleData.yourContribution.toLocaleString()}</p>
          </div>
          <Target className="w-12 h-12 text-green-600" />
        </div>
      </div>
    </div>
  );
};

export default CircleView;