import React from 'react';
import { Mic } from 'lucide-react';
import { moodProfiles } from '../data/financialData';

const VoiceCircle = ({ isListening, onToggleListen, level, mood }) => {
  const moodData = moodProfiles[mood];
  
  return (
    <div className="flex flex-col items-center justify-center my-8">
      <div className="relative">
        {/* Outer rings */}
        <div className={`absolute inset-0 rounded-full ${isListening ? 'animate-ping' : ''}`}>
          <div className={`w-56 h-56 rounded-full bg-gradient-to-r ${moodData.color} opacity-20`}></div>
        </div>
        <div className={`absolute inset-4 rounded-full ${isListening ? 'animate-pulse' : ''}`}>
          <div className={`w-48 h-48 rounded-full bg-gradient-to-r ${moodData.color} opacity-30`}></div>
        </div>
        
        {/* Main button */}
        <button
          onClick={onToggleListen}
          className={`relative w-40 h-40 rounded-full flex items-center justify-center transition-all duration-500 ${
            isListening 
              ? `bg-gradient-to-br ${moodData.color} animate-pulse shadow-2xl scale-105` 
              : `bg-gradient-to-br ${moodData.color} hover:scale-110 shadow-xl`
          }`}
        >
          <div className="relative">
            <Mic className={`w-16 h-16 text-white transition-transform duration-300 ${isListening ? 'scale-110' : ''}`} />
            {isListening && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 border-4 border-white rounded-full animate-ping opacity-50"></div>
              </div>
            )}
          </div>
          
          {/* Level badge */}
          <div className="absolute -top-3 -right-3 bg-gradient-to-br from-yellow-400 to-orange-500 text-white rounded-full w-14 h-14 flex items-center justify-center font-bold text-xl shadow-lg border-4 border-white transform hover:rotate-12 transition-transform">
            {level}
          </div>
          
          {/* Mood indicator */}
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-white text-2xl px-3 py-1 rounded-full shadow-lg border-2 border-gray-200">
            {moodData.emoji}
          </div>
        </button>
      </div>
      
      <p className={`mt-8 text-gray-700 font-semibold text-lg transition-all duration-300 ${isListening ? 'scale-110' : ''}`}>
        {isListening ? (
          <span className="flex items-center gap-2 animate-pulse">
            <span className="inline-block w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
            Listening to you...
          </span>
        ) : (
          'Tap to speak with your coach'
        )}
      </p>
    </div>
  );
};

export default VoiceCircle;