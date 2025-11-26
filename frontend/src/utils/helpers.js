import { financialKnowledgeGraph } from '../data/financialData';

export const analyzeMoodFromQuery = (query) => {
  const lowerQ = query.toLowerCase();
  if (lowerQ.includes('overspend') || lowerQ.includes('debt') || lowerQ.includes('problem')) {
    return 'supportive';
  } else if (lowerQ.includes('invest') || lowerQ.includes('goal') || lowerQ.includes('save')) {
    return 'motivational';
  } else if (lowerQ.includes('bank') || lowerQ.includes('scheme') || lowerQ.includes('compare')) {
    return 'analytical';
  }
  return 'motivational';
};

export const queryKnowledgeGraph = (query, setMood) => {
  const lowerQ = query.toLowerCase();
  
  // Bank comparison queries
  if (lowerQ.includes('bank') && (lowerQ.includes('fee') || lowerQ.includes('cheap') || lowerQ.includes('fewer'))) {
    const banks = Object.entries(financialKnowledgeGraph.banks)
      .sort((a, b) => (a[1].monthlyFee + a[1].atmFee) - (b[1].monthlyFee + b[1].atmFee));
    
    let response = "📊 Based on my analysis:\n\n";
    banks.slice(0, 3).forEach((bank, idx) => {
      const [name, data] = bank;
      response += `${idx + 1}. ${name}\n   • Monthly fee: ₹${data.monthlyFee}\n   • ATM fee: ₹${data.atmFee}\n   • Min balance: ₹${data.minBalance}\n\n`;
    });
    response += `💡 ${banks[0][0]} has the lowest total fees!`;
    return response;
  }
  
  // Government scheme queries
  if (lowerQ.includes('scheme') || lowerQ.includes('government') || lowerQ.includes('yojana')) {
    let response = "🏛️ Government Schemes for You:\n\n";
    Object.entries(financialKnowledgeGraph.schemes).forEach(([name, data]) => {
      response += `• ${name}\n  Type: ${data.type}\n  Benefit: ${data.benefit}\n  Eligibility: ${data.eligibility}\n\n`;
    });
    return response;
  }
  
  // Spending analysis
  if (lowerQ.includes('spending') || lowerQ.includes('entertainment') || lowerQ.includes('food')) {
    if (setMood) setMood('concerned');
    return "⚠️ I noticed your entertainment spending is 25% higher than average!\n\n💡 Here's what I recommend:\n• Set a monthly budget of ₹3000\n• Try free activities 2x per week\n• Use the 50/30/20 rule\n\n📈 This could save you ₹2000/month = ₹24,000/year!";
  }
  
  return null;
};

export const generateAIResponse = (question) => {
  const lowerQ = question.toLowerCase();
  
  if (lowerQ.includes('save') || lowerQ.includes('saving')) {
    return "🎯 Great question! Here are personalized recommendations:\n\n1. Track expenses for 30 days (+15 XP when done)\n2. Set up automatic transfers to savings\n3. Reduce unused subscriptions\n4. Cook at home 3-4 more times per week\n\n💡 Complete these tasks to level up faster!";
  }
  
  if (lowerQ.includes('invest') || lowerQ.includes('investment')) {
    return "🚀 Smart thinking! For informal sector workers:\n\n1. Build emergency fund first (3-6 months)\n2. Consider low-cost index funds\n3. Start small with SIPs\n4. Diversify across assets\n\n🏆 Starting investments earns you 100 bonus XP!";
  }
  
  if (lowerQ.includes('budget')) {
    return "📊 Let's create a smart budget:\n\n✅ Action Plan:\n• 50% Needs (rent, food, utilities)\n• 30% Wants (entertainment, dining)\n• 20% Savings & Investments\n\n🎮 Track your budget for 7 days to unlock 'Budget Master' badge!";
  }
  
  return "👋 I'm here to help! Try asking:\n• 'Which bank has fewer fees?'\n• 'Show me government schemes'\n• 'Analyze my spending'\n• 'How can I save more?'\n\n💎 Each question earns you XP!";
};