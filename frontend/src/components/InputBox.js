import React from 'react';
import { Send } from 'lucide-react';

const InputBox = ({ value, onChange, onSubmit, disabled }) => (
  <div className="max-w-2xl mx-auto px-4">
    <div className="flex gap-2 bg-white rounded-full shadow-lg p-2 border-2 border-gray-200 focus-within:border-blue-500 transition-all focus-within:shadow-xl">
      <input
        type="text"
        value={value}
        onChange={onChange}
        onKeyPress={(e) => e.key === 'Enter' && onSubmit()}
        placeholder="Ask about banks, schemes, or your spending..."
        disabled={disabled}
        className="flex-1 px-4 py-2 outline-none bg-transparent"
      />
      <button
        onClick={onSubmit}
        disabled={disabled || !value.trim()}
        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full p-3 hover:scale-105 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:scale-100 transition-all shadow-md"
      >
        <Send className="w-5 h-5" />
      </button>
    </div>
  </div>
);

export default InputBox;