import React from 'react';
import { Zap } from 'lucide-react';
import { moodProfiles } from '../data/financialData';

const ChatMessage = ({ message, isUser, xpGained, mood }) => {
  const moodData = moodProfiles[mood] || moodProfiles.analytical;
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 animate-slide-in`}>
      <div className="relative max-w-[80%]">
        <div
          className={`p-4 rounded-2xl shadow-md ${
            isUser
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-br-none'
              : `bg-gradient-to-r ${moodData.color} text-white rounded-bl-none`
          }`}
        >
          <p className="whitespace-pre-wrap">{message}</p>
        </div>
        {xpGained && (
          <div className="absolute -top-3 -right-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full px-3 py-1 text-sm font-bold shadow-lg animate-bounce flex items-center gap-1">
            <Zap className="w-4 h-4" />
            +{xpGained} XP
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;