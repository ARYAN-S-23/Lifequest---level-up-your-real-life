import { useState } from 'react';
import { useStore } from '../store';
import { motion, AnimatePresence } from 'framer-motion';
import { Campaign, QuestDifficulty } from '../types';
import { Plus, ChevronRight, X, CheckCircle2, Map as MapIcon } from 'lucide-react';
import { v4 as uuid } from 'uuid';

export default function CampaignsPage() {
  const { campaigns, quests, bosses, addCampaign, updateCampaign, deleteCampaign } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [form, setForm] = useState({ title: '', description: '', emoji: '🎯', difficulty: 'medium' as QuestDifficulty, targetDate: '' });

  const createCampaign = () => {
    if (!form.title.trim()) return;
    const newCampaign: Campaign = {
      id: uuid(),
      title: form.title,
      description: form.description,
      emoji: form.emoji,
      progress: 0,
      difficulty: form.difficulty,
      milestones: [],
      questIds: [],
      startDate: new Date().toISOString().split('T')[0],
      targetDate: form.targetDate || new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0],
      completed: false,
    };
    addCampaign(newCampaign);
    setForm({ title: '', description: '', emoji: '🎯', difficulty: 'medium', targetDate: '' });
    setShowForm(false);
  };

  const emojis = ['🎯', '💻', '💪', '📚', '🎨', '🚀', '💡', '🧠', '🌟', '⚡', '🏆', '🔥'];

  return (
    <div className="page-container space-y-5">
      <div className="mb-1">
        <div className="page-header">
          <h1 className="text-2xl font-bold">Campaigns</h1>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center justify-center gap-2 px-6 py-2 min-w-[140px] rounded-lg bg-cyber-accent text-white hover:bg-cyber-accent/80 transition-colors text-sm font-medium"
          >
            <Plus size={16} /> New Campaign
          </button>
        </div>
        <p className="text-cyber-muted text-sm mt-1">Your long-term objectives and quests</p>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="glass rounded-xl p-5 border border-cyber-accent/30">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Create Campaign</h3>
              <button onClick={() => setShowForm(false)} className="text-cyber-muted hover:text-cyber-text">
                <X size={18} />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-cyber-muted mb-1 block">Title</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Become Full Stack Developer"
                  className="w-full px-3 py-2 rounded-lg bg-cyber-bg border border-cyber-border text-sm focus:border-cyber-accent focus:outline-none"
                />
              </div>
              <div>
                <label className="text-sm text-cyber-muted mb-1 block">Description</label>
                <input
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Brief description"
                  className="w-full px-3 py-2 rounded-lg bg-cyber-bg border border-cyber-border text-sm focus:border-cyber-accent focus:outline-none"
                />
              </div>
              <div>
                <label className="text-sm text-cyber-muted mb-2 block">Emoji</label>
                <div className="flex gap-2 flex-wrap">
                  {emojis.map((e) => (
                    <button
                      key={e}
                      onClick={() => setForm({ ...form, emoji: e })}
                      className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg border transition-all ${
                        form.emoji === e ? 'border-cyber-accent bg-cyber-accent/20' : 'border-cyber-border'
                      }`}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm text-cyber-muted mb-1 block">Target Date</label>
                <input
                  type="date"
                  value={form.targetDate}
                  onChange={(e) => setForm({ ...form, targetDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-cyber-bg border border-cyber-border text-sm focus:border-cyber-accent focus:outline-none"
                />
              </div>
            </div>
            <button
              onClick={createCampaign}
              className="mt-4 inline-flex items-center justify-center gap-2 px-6 py-2 min-w-[140px] rounded-lg bg-cyber-accent text-white hover:bg-cyber-accent/80 transition-colors text-sm font-medium"
            >
              Create Campaign
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {campaigns.length === 0 && (
          <div className="col-span-full glass rounded-xl p-12 text-center">
            <MapIcon size={40} className="mx-auto text-cyber-muted/30 mb-3" />
            <p className="text-sm text-cyber-muted mb-1">No campaigns yet</p>
            <p className="text-xs text-cyber-muted/60 mb-3">Create your first campaign to start your journey</p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center justify-center gap-2 px-6 py-2 min-w-[140px] rounded-lg bg-cyber-accent text-white text-sm hover:bg-cyber-accent/80"
            >
              Create Campaign
            </button>
          </div>
        )}
        {campaigns.map((c, i) => {
          const campaignQuests = quests.filter((q) => c.questIds.includes(q.id));
          const completedQuests = campaignQuests.filter((q) => q.completed).length;
          const boss = bosses.find((b) => b.campaignId === c.id);
          return (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => setSelectedCampaign(c)}
              className="glass rounded-xl p-5 hover:border-cyber-accent/30 transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{c.emoji}</span>
                  <div>
                    <h3 className="font-semibold">{c.title}</h3>
                    <p className="text-xs text-cyber-muted">{c.description}</p>
                  </div>
                </div>
                <ChevronRight size={18} className="text-cyber-muted group-hover:text-cyber-accent transition-colors" />
              </div>

              <div className="w-full bg-cyber-border rounded-full h-2.5 mb-3">
                <div
                  className="bg-gradient-to-r from-cyber-accent to-cyber-accent2 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${c.progress}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs text-cyber-muted">
                <span>{c.progress}% complete</span>
                <span>{completedQuests}/{campaignQuests.length} quests</span>
              </div>

              <div className="flex items-center gap-2 mt-3 text-xs">
                <span className={`px-2 py-0.5 rounded-full ${
                  c.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' :
                  c.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                  c.difficulty === 'hard' ? 'bg-red-500/20 text-red-400' :
                  'bg-purple-500/20 text-purple-400'
                }`}>
                  {c.difficulty}
                </span>
                {boss && !boss.defeated && (
                  <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400">
                    {boss.emoji} Boss: {boss.name}
                  </span>
                )}
                {c.completed && (
                  <span className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 flex items-center gap-1">
                    <CheckCircle2 size={12} /> Complete
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {selectedCampaign && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedCampaign(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass rounded-xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{selectedCampaign.emoji}</span>
                  <div>
                    <h2 className="text-lg font-bold">{selectedCampaign.title}</h2>
                    <p className="text-sm text-cyber-muted">{selectedCampaign.description}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedCampaign(null)} className="text-cyber-muted hover:text-cyber-text">
                  <X size={20} />
                </button>
              </div>

              <div className="w-full bg-cyber-border rounded-full h-3 mb-4">
                <div
                  className="bg-gradient-to-r from-cyber-accent to-cyber-accent2 h-3 rounded-full"
                  style={{ width: `${selectedCampaign.progress}%` }}
                />
              </div>

              <div className="space-y-2 mb-4">
                <h4 className="text-sm font-semibold text-cyber-muted">Milestones</h4>
                {selectedCampaign.milestones.map((m) => (
                  <div key={m.id} className={`flex items-center gap-3 p-2 rounded-lg ${m.completed ? 'bg-green-500/10' : 'bg-cyber-bg'}`}>
                    <CheckCircle2 size={16} className={m.completed ? 'text-green-500' : 'text-cyber-muted'} />
                    <span className={`text-sm ${m.completed ? 'line-through text-cyber-muted' : ''}`}>{m.title}</span>
                    <span className="ml-auto text-xs text-cyber-accent">+{m.xpReward} XP</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    updateCampaign(selectedCampaign.id, { completed: true, progress: 100 });
                    setSelectedCampaign(null);
                  }}
                  className="px-4 py-2 rounded-lg bg-cyber-success/20 text-cyber-success border border-cyber-success/30 text-sm hover:bg-cyber-success/30"
                >
                  Mark Complete
                </button>
                <button
                  onClick={() => {
                    deleteCampaign(selectedCampaign.id);
                    setSelectedCampaign(null);
                  }}
                  className="px-4 py-2 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30 text-sm hover:bg-red-500/30"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
