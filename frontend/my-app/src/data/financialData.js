// ============= DATA LAYER (Simulated Local Knowledge Graph) =============

export const financialKnowledgeGraph = {
  banks: {
    'HDFC': { monthlyFee: 0, atmFee: 20, minBalance: 10000, rating: 4.2 },
    'SBI': { monthlyFee: 0, atmFee: 15, minBalance: 5000, rating: 4.0 },
    'ICICI': { monthlyFee: 100, atmFee: 20, minBalance: 10000, rating: 4.1 },
    'Axis': { monthlyFee: 0, atmFee: 20, minBalance: 5000, rating: 4.3 },
  },
  schemes: {
    'PM Jan Dhan Yojana': { type: 'Banking', benefit: 'Zero balance account + ₹10L accident insurance', eligibility: 'All citizens' },
    'Sukanya Samriddhi': { type: 'Savings', benefit: '8.2% interest for girl child education', eligibility: 'Parents of girls < 10 years' },
    'PMMY (Mudra Loan)': { type: 'Business', benefit: 'Loans up to ₹10L for small businesses', eligibility: 'Small entrepreneurs' },
  },
  insights: {
    'entertainment': { avgSpending: 5000, recommendation: 'Try to keep it under ₹3000/month', riskLevel: 'medium' },
    'food': { avgSpending: 8000, recommendation: 'Cook at home 4x more per week saves ₹2400', riskLevel: 'low' },
  }
};

export const moodProfiles = {
  supportive: {
    greeting: "Hey friend! 💙 I noticed something in your spending...",
    tone: "warm and encouraging",
    emoji: "💙",
    color: "from-blue-400 to-cyan-400"
  },
  analytical: {
    greeting: "Let me analyze this for you 📊",
    tone: "data-driven and precise",
    emoji: "📊",
    color: "from-purple-400 to-indigo-400"
  },
  motivational: {
    greeting: "You're doing great! Let's level up! 🚀",
    tone: "energetic and inspiring",
    emoji: "🚀",
    color: "from-orange-400 to-pink-400"
  },
  concerned: {
    greeting: "I'm here to help you 🤝",
    tone: "caring and protective",
    emoji: "🤝",
    color: "from-yellow-400 to-orange-400"
  }
};

export const leaderboardData = [
  { rank: 1, name: 'Priya S.', points: 2840, level: 12, avatar: '👩‍💼', streak: 45 },
  { rank: 2, name: 'Rahul K.', points: 2650, level: 11, avatar: '👨‍💻', streak: 38 },
  { rank: 3, name: 'You', points: 2420, level: 10, avatar: '🎯', streak: 30, isUser: true },
  { rank: 4, name: 'Anjali M.', points: 2180, level: 9, avatar: '👩‍🎓', streak: 25 },
  { rank: 5, name: 'Vikram D.', points: 1950, level: 9, avatar: '👨‍🔧', streak: 22 },
];

export const circleData = {
  name: "Mumbai Savers Squad",
  members: 8,
  totalGoal: 100000,
  currentProgress: 67500,
  yourContribution: 15000,
  topSavers: [
    { name: 'Priya S.', amount: 22000, avatar: '👩‍💼' },
    { name: 'You', amount: 15000, avatar: '🎯', isUser: true },
    { name: 'Rahul K.', amount: 12500, avatar: '👨‍💻' },
  ]
};