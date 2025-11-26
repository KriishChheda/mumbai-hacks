import React, { useState, useRef, useEffect } from 'react';
import { TrendingUp, AlertCircle, Flame, Sparkles } from 'lucide-react';

// Components
import Header from './components/Header';
import VoiceCircle from './components/VoiceCircle';
import NavigationTabs from './components/NavigationTabs';
import LeaderboardView from './components/LeaderboardView';
import CircleView from './components/CircleView';
import InputBox from './components/InputBox';
import ChatMessage from './components/ChatMessage';
import InsightCard from './components/InsightCard';
import DailyChallenge from './components/DailyChallenge';
import LevelUpModal from './components/LevelUpModal';
import Confetti from './components/Confetti';

// Utils & Data
import { moodProfiles } from './data/financialData';
import { analyzeMoodFromQuery, queryKnowledgeGraph, generateAIResponse } from './utils/helpers';

// Styles
import './styles/animations.css';

const App = () => {
  const [activeTab, setActiveTab] = useState('chat');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      text: "Hello! I'm your personal financial coach. I can help you compare banks, find government schemes, and analyze your spending. What would you like to know?",
      isUser: false
    }
  ]);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [level, setLevel] = useState(10);
  const [xp, setXp] = useState(420);
  const [maxXp, setMaxXp] = useState(600);
  const [points, setPoints] = useState(2420);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [streak] = useState(30);
  const [challengeCompleted, setChallengeCompleted] = useState(false);
  const [mood, setMood] = useState('motivational');
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addXP = (amount) => {
    const newXp = xp + amount;
    const newPoints = points + amount;
    setPoints(newPoints);
    
    if (newXp >= maxXp) {
      setLevel(level + 1);
      setXp(newXp - maxXp);
      setMaxXp(Math.floor(maxXp * 1.5));
      setShowLevelUp(true);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    } else {
      setXp(newXp);
    }
  };

  const handleToggleListen = () => {
    if (!isListening) {
      setIsListening(true);
      setTimeout(() => {
        setIsListening(false);
        setInput("Which bank has fewer fees?");
      }, 2000);
    } else {
      setIsListening(false);
    }
  };

  const handleSubmit = async () => {
    if (!input.trim() || isProcessing) return;

    const userMessage = input.trim();
    const xpGained = 10;
    const detectedMood = analyzeMoodFromQuery(userMessage);
    setMood(detectedMood);
    
    setMessages(prev => [...prev, { text: userMessage, isUser: true, xpGained }]);
    setInput('');
    setIsProcessing(true);
    addXP(xpGained);

    setTimeout(() => {
      const graphResponse = queryKnowledgeGraph(userMessage, setMood);
      const aiResponse = graphResponse || generateAIResponse(userMessage);
      setMessages(prev => [...prev, { text: aiResponse, isUser: false, mood: detectedMood }]);
      setIsProcessing(false);
    }, 1500);
  };

  const handleCompleteChallenge = () => {
    if (!challengeCompleted) {
      setChallengeCompleted(true);
      addXP(50);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Header level={level} xp={xp} maxXp={maxXp} points={points} mood={mood} />
      
      <main className="max-w-6xl mx-auto p-4">
        <NavigationTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {activeTab === 'chat' && (
          <>
            <div className="my-6">
              <DailyChallenge
                challenge="Ask about 3 financial topics today"
                completed={challengeCompleted}
                onComplete={handleCompleteChallenge}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
              <InsightCard
                icon={TrendingUp}
                title="Savings Rate"
                value="18%"
                color="border-green-600"
                onClick={() => setInput("Analyze my savings")}
              />
              <InsightCard
                icon={AlertCircle}
                title="Risk Score"
                value="Medium"
                color="border-yellow-600"
                onClick={() => setInput("How to reduce my risk?")}
              />
              <InsightCard
                icon={Flame}
                title="Daily Streak"
                value={`${streak} days`}
                color="border-orange-600"
                streak={streak}
                onClick={() => setInput("How to maintain my streak?")}
              />
            </div>

            <VoiceCircle isListening={isListening} onToggleListen={handleToggleListen} level={level} mood={mood} />

            <InputBox
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onSubmit={handleSubmit}
              disabled={isProcessing}
            />

            <div className="mt-8 bg-white rounded-2xl shadow-xl p-6 max-w-4xl mx-auto">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-purple-600" />
                AI Coach Chat
              </h2>
              <div className="max-h-96 overflow-y-auto">
                {messages.map((msg, idx) => (
                  <ChatMessage 
                    key={idx} 
                    message={msg.text} 
                    isUser={msg.isUser}
                    xpGained={msg.xpGained}
                    mood={msg.mood || mood}
                  />
                ))}
                {isProcessing && (
                  <div className="flex justify-start mb-4">
                    <div className={`bg-gradient-to-r ${moodProfiles[mood].color} text-white p-4 rounded-2xl rounded-bl-none`}>
                      <div className="flex gap-2">
                        <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
            </div>

            <div className="mt-6 max-w-4xl mx-auto">
              <p className="text-center text-gray-600 mb-3 font-medium">Try these quick queries (+10 XP each)</p>
              <div className="flex flex-wrap justify-center gap-2">
                {[
                  'Which bank has fewer fees?',
                  'Show government schemes',
                  'Analyze my spending',
                  'Investment advice'
                ].map((action) => (
                  <button
                    key={action}
                    onClick={() => setInput(action)}
                    className="px-4 py-2 bg-white text-blue-600 rounded-full text-sm font-medium hover:bg-blue-50 border-2 border-blue-200 transition-all hover:scale-105 shadow-sm"
                  >
                    {action}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === 'leaderboard' && (
          <LeaderboardView userPoints={points} userLevel={level} />
        )}

        {activeTab === 'circle' && <CircleView />}
      </main>

      <footer className="mt-12 py-6 bg-white border-t">
        <p className="text-center text-gray-500 text-sm">
          FinCoach AI - Level up your financial health! 🚀
        </p>
      </footer>

      {showLevelUp && <LevelUpModal level={level} onClose={() => setShowLevelUp(false)} />}
      <Confetti show={showConfetti} />
    </div>
  );
};

export default App;