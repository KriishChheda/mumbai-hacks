import React from 'react';
import { Trophy } from 'lucide-react';

const LevelUpModal = ({ level, onClose }) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
    <div className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center shadow-2xl animate-scale-in">
      <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mx-auto mb-4 flex items-center justify-center animate-bounce">
        <Trophy className="w-12 h-12 text-white" />
      </div>
      <h2 className="text-3xl font-bold text-gray-800 mb-2">Level Up!</h2>
      <p className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
        Level {level}
      </p>
      <p className="text-gray-600 mb-6">
        You're making great financial progress! Keep it up!
      </p>
      <button
        onClick={onClose}
        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform shadow-lg"
      >
        Awesome!
      </button>
    </div>
  </div>
);

export default LevelUpModal;