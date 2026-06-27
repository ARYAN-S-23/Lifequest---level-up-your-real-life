import { useState } from 'react';
import { useStore } from '../store';
import { motion, AnimatePresence } from 'framer-motion';
import { Quest, QuestType, QuestDifficulty } from '../types';
import { Plus, CheckCircle2, Clock, X, Coins, Zap, Scroll } from 'lucide-react';
import { v4 as uuid } from 'uuid';

const typeConfig: Record<QuestType, { label: string; color: string; bg: string }> = {
  daily: { label: 'Daily', color: 'text-green-400', bg: 'bg-green-500/20' },
  weekly: { label: 'Weekly', color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
  main: { label: 'Main', color: 'text-purple-400', bg: 'bg-purple-500/20' },
};

const diffConfig: Record<QuestDifficulty, { color: string; bg: string }> = {
  easy: { color: 'text-green-400', bg: 'bg-green-500/20' },
  medium: { color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
  hard: { color: 'text-red-400', bg: 'bg-red-500/20' },
  epic: { color: 'text-purple-400', bg: 'bg-purple-500/20' },
  legendary: { color: 'text-orange-400', bg: 'bg-orange-500/20' },
};

export default function QuestsPage() {
  const { quests, campaigns, completeQuest, addQuest } = useStore();
  const [filter, setFilter] = useState<'all' | QuestType>('all');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', type: 'daily' as QuestType,
    difficulty: 'medium' as QuestDifficulty, xpReward: 25, coinReward: 5,
    estimatedTime: 30, campaignId: '', tags: '',
  });

  const filtered = quests.filter((q) => filter === 'all' || q.type === filter);
  const incomplete = filtered.filter((q) => !q.completed);
  const completed = filtered.filter((q) => q.completed);

  const createQuest = () => {
    if (!form.title.trim()) return;
    const newQuest: Quest = {
      id: uuid(),
      campaignId: form.campaignId || undefined,
      type: form.type,
      title: form.title,
      description: form.description,
      difficulty: form.difficulty,
      xpReward: form.xpReward,
      coinReward: form.coinReward,
      estimatedTime: form.estimatedTime,
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      completed: false,
      skillIds: [],
    };
    addQuest(newQuest);
    setForm({ title: '', description: '', type: 'daily', difficulty: 'medium', xpReward: 25, coinReward: 5, estimatedTime: 30, campaignId: '', tags: '' });
    setShowForm(false);
  };

  return (
    <div className="page-container space-y-5">
      <div className="mb-1">
        <div className="page-header">
          <h1 className="text-2xl font-bold">Quests</h1>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center justify-center gap-2 px-6 py-2 min-w-[140px] rounded-lg bg-cyber-accent text-white hover:bg-cyber-accent/80 transition-colors text-sm font-medium"
          >
            <Plus size={16} /> New Quest
          </button>
        </div>
        <p className="text-cyber-muted text-sm mt-1">Complete quests to earn XP and coins</p>
      </div>

      <div className="flex gap-2">
        {(['all', 'daily', 'weekly', 'main'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filter === t
                ? 'bg-cyber-accent/20 text-cyber-accent border border-cyber-accent/30'
                : 'bg-cyber-card border border-cyber-border text-cyber-muted hover:text-cyber-text'
            }`}
          >
            {t === 'all' ? 'All' : typeConfig[t].label}
          </button>
        ))}
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="glass rounded-xl p-5 border border-cyber-accent/30">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Create Quest</h3>
              <button onClick={() => setShowForm(false)} className="text-cyber-muted hover:text-cyber-text"><X size={18} /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-cyber-muted mb-1 block">Title</label>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Quest title" className="w-full px-3 py-2 rounded-lg bg-cyber-bg border border-cyber-border text-sm focus:border-cyber-accent focus:outline-none" />
              </div>
              <div>
                <label className="text-sm text-cyber-muted mb-1 block">Description</label>
                <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="What needs to be done?" className="w-full px-3 py-2 rounded-lg bg-cyber-bg border border-cyber-border text-sm focus:border-cyber-accent focus:outline-none" />
              </div>
              <div>
                <label className="text-sm text-cyber-muted mb-1 block">Type</label>
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as QuestType })} className="w-full px-3 py-2 rounded-lg bg-cyber-bg border border-cyber-border text-sm focus:border-cyber-accent focus:outline-none">
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="main">Main Quest</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-cyber-muted mb-1 block">Difficulty</label>
                <select value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value as QuestDifficulty })} className="w-full px-3 py-2 rounded-lg bg-cyber-bg border border-cyber-border text-sm focus:border-cyber-accent focus:outline-none">
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                  <option value="epic">Epic</option>
                  <option value="legendary">Legendary</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-cyber-muted mb-1 block">XP Reward</label>
                <input type="number" value={form.xpReward} onChange={(e) => setForm({ ...form, xpReward: Number(e.target.value) })} className="w-full px-3 py-2 rounded-lg bg-cyber-bg border border-cyber-border text-sm focus:border-cyber-accent focus:outline-none" />
              </div>
              <div>
                <label className="text-sm text-cyber-muted mb-1 block">Coin Reward</label>
                <input type="number" value={form.coinReward} onChange={(e) => setForm({ ...form, coinReward: Number(e.target.value) })} className="w-full px-3 py-2 rounded-lg bg-cyber-bg border border-cyber-border text-sm focus:border-cyber-accent focus:outline-none" />
              </div>
              <div>
                <label className="text-sm text-cyber-muted mb-1 block">Campaign</label>
                <select value={form.campaignId} onChange={(e) => setForm({ ...form, campaignId: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-cyber-bg border border-cyber-border text-sm focus:border-cyber-accent focus:outline-none">
                  <option value="">None</option>
                  {campaigns.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm text-cyber-muted mb-1 block">Tags (comma-separated)</label>
                <input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="react, coding" className="w-full px-3 py-2 rounded-lg bg-cyber-bg border border-cyber-border text-sm focus:border-cyber-accent focus:outline-none" />
              </div>
            </div>
            <button onClick={createQuest} className="mt-4 inline-flex items-center justify-center gap-2 px-6 py-2 min-w-[140px] rounded-lg bg-cyber-accent text-white hover:bg-cyber-accent/80 transition-colors text-sm font-medium">
              Create Quest
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-cyber-muted flex items-center gap-2">
          <Clock size={14} /> Active Quests ({incomplete.length})
        </h3>
        {incomplete.length === 0 && quests.length === 0 && (
          <div className="glass rounded-xl p-10 text-center">
            <Scroll size={32} className="mx-auto text-cyber-muted/30 mb-2" />
            <p className="text-sm text-cyber-muted mb-1">No quests yet</p>
            <p className="text-xs text-cyber-muted/60">Create your first quest to start earning XP</p>
          </div>
        )}
        {incomplete.map((q, i) => (
          <motion.div
            key={q.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`glass rounded-xl p-4 flex items-center gap-4 quest-${q.type}`}
          >
            <button
              onClick={() => completeQuest(q.id)}
              className="w-8 h-8 rounded-full border-2 border-cyber-border flex items-center justify-center hover:border-cyber-success hover:bg-cyber-success/20 transition-all"
            >
              <CheckCircle2 size={16} className="text-cyber-muted" />
            </button>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-medium text-sm">{q.title}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full ${typeConfig[q.type].bg} ${typeConfig[q.type].color}`}>
                  {typeConfig[q.type].label}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${diffConfig[q.difficulty].bg} ${diffConfig[q.difficulty].color}`}>
                  {q.difficulty}
                </span>
              </div>
              <p className="text-xs text-cyber-muted mt-0.5">{q.description}</p>
              {q.tags.length > 0 && (
                <div className="flex gap-1 mt-1">
                  {q.tags.map((t) => (
                    <span key={t} className="text-xs px-1.5 py-0.5 rounded bg-cyber-border text-cyber-muted">#{t}</span>
                  ))}
                </div>
              )}
            </div>
            <div className="text-right shrink-0">
              <div className="flex items-center gap-1 text-cyber-accent text-sm font-bold">
                <Zap size={12} /> +{q.xpReward} XP
              </div>
              <div className="flex items-center gap-1 text-cyber-gold text-xs">
                <Coins size={10} /> +{q.coinReward}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {completed.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-cyber-muted">Completed ({completed.length})</h3>
          {completed.map((q) => (
            <div key={q.id} className="glass rounded-xl p-4 flex items-center gap-4 opacity-60">
              <CheckCircle2 size={18} className="text-green-500" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm line-through">{q.title}</p>
              </div>
              <span className="text-xs text-cyber-muted">+{q.xpReward} XP</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
