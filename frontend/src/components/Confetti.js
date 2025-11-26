import React from 'react';

const Confetti = ({ show }) => {
  if (!show) return null;
  
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          className="absolute animate-confetti"
          style={{
            left: `${Math.random() * 100}%`,
            top: '-10%',
            animationDelay: `${Math.random() * 0.5}s`,
            animationDuration: `${2 + Math.random() * 1}s`
          }}
        >
          {['🎉', '⭐', '💰', '🏆', '✨'][Math.floor(Math.random() * 5)]}
        </div>
      ))}
    </div>
  );
};

export default Confetti;