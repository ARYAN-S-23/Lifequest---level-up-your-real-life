import { useState } from 'react';
import { useStore } from '../store';
import { motion } from 'framer-motion';
import { Bot, Send, Sparkles, Lightbulb, Target, TrendingUp } from 'lucide-react';
import { v4 as uuid } from 'uuid';
import { Campaign, Quest, QuestDifficulty } from '../types';

const suggestions = [
  { icon: Target, text: 'Create a roadmap to become a frontend developer', color: 'text-cyber-accent' },
  { icon: TrendingUp, text: 'I missed quests for 5 days. Help me get back on track.', color: 'text-cyber-success' },
  { icon: Lightbulb, text: 'Suggest new campaigns based on my current skills', color: 'text-cyber-gold' },
  { icon: Sparkles, text: 'How can I improve my daily routine?', color: 'text-cyber-accent2' },
];

export default function CoachPage() {
  const { character, skills, campaigns, addCampaign, addQuest, addSkill } = useStore();
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([]);
  const [input, setInput] = useState('');

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    setMessages((prev) => [...prev, { role: 'user', text }]);

    setTimeout(() => {
      let response = '';
      const lower = text.toLowerCase();

      if (lower.includes('frontend') || lower.includes('developer')) {
        const newCampaign: Campaign = {
          id: uuid(), title: 'Become Frontend Developer', description: 'AI-generated roadmap for frontend development',
          emoji: '💻', progress: 0, difficulty: 'hard', milestones: [
            { id: uuid(), title: 'HTML & CSS', completed: false, xpReward: 200 },
            { id: uuid(), title: 'JavaScript', completed: false, xpReward: 300 },
            { id: uuid(), title: 'React', completed: false, xpReward: 500 },
            { id: uuid(), title: 'Portfolio', completed: false, xpReward: 400 },
          ], questIds: [], startDate: new Date().toISOString().split('T')[0],
          targetDate: new Date(Date.now() + 180 * 86400000).toISOString().split('T')[0], completed: false,
        };
        addCampaign(newCampaign);
        response = "I've created a new campaign: 'Become Frontend Developer' with 4 milestones. Start with HTML & CSS, then progress to JavaScript, React, and build your portfolio. Check your Campaigns page!";
      } else if (lower.includes('back on track') || lower.includes('missed')) {
        response = "Don't worry about missing a few days! Here's my advice:\n\n1. Start with easy daily quests to rebuild momentum\n2. Focus on 1-2 quests per day at first\n3. Set a reminder for your quest time\n4. Remember your streak can start fresh today!\n\nI've added some easy quests to get you started.";
        const easyQuests = ['Drink 8 glasses of water', 'Read for 15 minutes', 'Take a 10-minute walk'].map((title) => ({
          id: uuid(), type: 'daily' as const, title, description: 'Easy quest to rebuild momentum',
          difficulty: 'easy' as QuestDifficulty, xpReward: 10, coinReward: 2, estimatedTime: 15,
          tags: ['easy', 'momentum'], completed: false, skillIds: [],
        }));
        easyQuests.forEach((q) => addQuest(q));
      } else if (lower.includes('improve') || lower.includes('routine')) {
        const stats = character.stats;
        const sortedStats = Object.entries(stats).sort((a, b) => b[1] - a[1]);
        const weakest = sortedStats[sortedStats.length - 1];
        const strongest = sortedStats[0];
        response = `Based on your current stats, here are my recommendations:\n\n${sortedStats.map(([name, val]) =>
          `- **${name.charAt(0).toUpperCase() + name.slice(1)} (${val})**: ${val < 30 ? 'Needs attention' : val < 60 ? 'Room for improvement' : 'Looking good!'}`
        ).join('\n')}\n\nYour strongest area is ${strongest[0]} (${strongest[1]}) and your weakest is ${weakest[0]} (${weakest[1]}). I'd suggest focusing on building up ${weakest[0]}!`;
      } else {
        response = `Based on your Level ${character.level} character with ${skills.length} skills, I can help you create new campaigns, quests, or skills. Try asking me to:\n\n- Create a new campaign\n- Suggest quests for a skill\n- Help you get back on track\n- Analyze your progress`;
      }

      setMessages((prev) => [...prev, { role: 'ai', text: response }]);
    }, 1000);
  };

  return (
    <div className="page-container space-y-5 flex flex-col">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold">AI Coach</h1>
        <p className="text-cyber-muted text-sm">Your personal growth assistant</p>
      </motion.div>

      {messages.length === 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {suggestions.map((s, i) => (
            <motion.button
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => handleSend(s.text)}
              className="glass rounded-xl p-4 text-left hover:border-cyber-accent/30 transition-all"
            >
              <s.icon size={18} className={`${s.color} mb-2`} />
              <p className="text-sm">{s.text}</p>
            </motion.button>
          ))}
        </div>
      )}

      <div className="flex-1 overflow-y-auto space-y-4">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[80%] rounded-xl px-4 py-3 ${
              msg.role === 'user'
                ? 'bg-cyber-accent/20 border border-cyber-accent/30'
                : 'glass border border-cyber-border'
            }`}>
              {msg.role === 'ai' && <Bot size={16} className="text-cyber-accent mb-1" />}
              <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex gap-2 shrink-0">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { handleSend(input); setInput(''); } }}
          placeholder="Ask your AI coach..."
          className="flex-1 px-4 py-3 rounded-xl bg-cyber-card border border-cyber-border text-sm focus:border-cyber-accent focus:outline-none"
        />
        <button
          onClick={() => { handleSend(input); setInput(''); }}
          className="px-4 py-3 rounded-xl bg-cyber-accent text-white hover:bg-cyber-accent/80 transition-colors"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
