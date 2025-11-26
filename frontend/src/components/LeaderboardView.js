import React from 'react';
import { Trophy, Flame } from 'lucide-react';
import { leaderboardData } from '../data/financialData';

const LeaderboardView = ({ userPoints, userLevel }) => (
  <div className="max-w-2xl mx-auto">
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <Trophy className="w-7 h-7 text-yellow-500" />
        Top Financial Champions
      </h2>
      <div className="space-y-3">
        {leaderboardData.map((user) => (
          <div
            key={user.rank}
            className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
              user.isUser
                ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-400 shadow-md scale-105'
                : 'bg-gray-50 hover:bg-gray-100'
            }`}
          >
            <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${
              user.rank === 1 ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white' :
              user.rank === 2 ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-white' :
              user.rank === 3 ? 'bg-gradient-to-br from-orange-400 to-orange-600 text-white' :
              'bg-gray-200 text-gray-600'
            }`}>
              {user.rank === 1 ? '🥇' : user.rank === 2 ? '🥈' : user.rank === 3 ? '🥉' : user.rank}
            </div>
            <div className="text-4xl">{user.avatar}</div>
            <div className="flex-1">
              <p className={`font-bold ${user.isUser ? 'text-blue-700' : 'text-gray-800'}`}>
                {user.name} {user.isUser && '(You)'}
              </p>
              <p className="text-sm text-gray-600">Level {user.level}</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-lg text-gray-800">{user.points}</p>
              <div className="flex items-center gap-1 text-orange-500 text-sm">
                <Flame className="w-4 h-4" />
                <span>{user.streak}d</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default LeaderboardView;