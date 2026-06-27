import { useState } from 'react';
import { useStore } from '../store';
import { motion, AnimatePresence } from 'framer-motion';
import { JournalEntry, Mood } from '../types';
import { BookOpen, Plus, X, Smile } from 'lucide-react';
import { v4 as uuid } from 'uuid';

const moodConfig: Record<Mood, { emoji: string; label: string; color: string }> = {
  amazing: { emoji: '🤩', label: 'Amazing', color: 'text-green-400' },
  good: { emoji: '😊', label: 'Good', color: 'text-blue-400' },
  okay: { emoji: '😐', label: 'Okay', color: 'text-yellow-400' },
  bad: { emoji: '😔', label: 'Bad', color: 'text-orange-400' },
  terrible: { emoji: '😫', label: 'Terrible', color: 'text-red-400' },
};

export default function JournalPage() {
  const { journalEntries, addJournalEntry, quests } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ content: '', mood: 'good' as Mood, notes: '' });

  const createEntry = () => {
    if (!form.content.trim()) return;
    const today = new Date().toISOString().split('T')[0];
    const todayQuests = quests.filter((q) => q.completed && q.completedAt === today).map((q) => q.title);
    addJournalEntry({
      id: uuid(),
      date: today,
      content: form.content,
      mood: form.mood,
      completedQuests: todayQuests,
      notes: form.notes,
      images: [],
    });
    setForm({ content: '', mood: 'good', notes: '' });
    setShowForm(false);
  };

  const sorted = [...journalEntries].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="page-container space-y-5">
      <div className="mb-1">
        <div className="page-header">
          <h1 className="text-2xl font-bold">Journal</h1>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center justify-center gap-2 px-6 py-2 min-w-[140px] rounded-lg bg-cyber-accent text-white hover:bg-cyber-accent/80 transition-colors text-sm font-medium"
          >
            <Plus size={16} /> New Entry
          </button>
        </div>
        <p className="text-cyber-muted text-sm mt-1">Daily reflections and mood tracking</p>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="glass rounded-xl p-5 border border-cyber-accent/30">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Today's Reflection</h3>
              <button onClick={() => setShowForm(false)} className="text-cyber-muted hover:text-cyber-text"><X size={18} /></button>
            </div>
            <div className="mb-4">
              <label className="text-sm text-cyber-muted mb-2 block">How are you feeling?</label>
              <div className="flex gap-3">
                {(Object.keys(moodConfig) as Mood[]).map((m) => (
                  <button
                    key={m}
                    onClick={() => setForm({ ...form, mood: m })}
                    className={`flex flex-col items-center p-3 rounded-lg border transition-all ${
                      form.mood === m ? 'border-cyber-accent bg-cyber-accent/20' : 'border-cyber-border hover:border-cyber-accent/50'
                    }`}
                  >
                    <span className="text-2xl">{moodConfig[m].emoji}</span>
                    <span className="text-xs mt-1">{moodConfig[m].label}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label className="text-sm text-cyber-muted mb-1 block">What did you accomplish today?</label>
              <textarea
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                placeholder="Write about your day..."
                rows={4}
                className="w-full px-3 py-2 rounded-lg bg-cyber-bg border border-cyber-border text-sm focus:border-cyber-accent focus:outline-none resize-none"
              />
            </div>
            <div className="mb-4">
              <label className="text-sm text-cyber-muted mb-1 block">Additional notes</label>
              <input
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Any extra thoughts..."
                className="w-full px-3 py-2 rounded-lg bg-cyber-bg border border-cyber-border text-sm focus:border-cyber-accent focus:outline-none"
              />
            </div>
            <button onClick={createEntry} className="inline-flex items-center justify-center gap-2 px-6 py-2 min-w-[140px] rounded-lg bg-cyber-accent text-white hover:bg-cyber-accent/80 transition-colors text-sm font-medium">
              Save Entry
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        {sorted.length === 0 && (
          <div className="glass rounded-xl p-12 text-center">
            <BookOpen size={48} className="mx-auto text-cyber-muted mb-4" />
            <p className="text-cyber-muted">No journal entries yet. Start writing!</p>
          </div>
        )}
        {sorted.map((entry, i) => {
          const mood = moodConfig[entry.mood];
          return (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass rounded-xl p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{mood.emoji}</span>
                  <div>
                    <p className="text-sm font-medium">{entry.date}</p>
                    <p className={`text-xs ${mood.color}`}>{mood.label}</p>
                  </div>
                </div>
              </div>
              <p className="text-sm text-cyber-text whitespace-pre-wrap">{entry.content}</p>
              {entry.completedQuests.length > 0 && (
                <div className="mt-3 p-2 rounded-lg bg-cyber-bg border border-cyber-border">
                  <p className="text-xs text-cyber-muted font-semibold mb-1">Quests completed:</p>
                  <div className="flex flex-wrap gap-1">
                    {entry.completedQuests.map((q) => (
                      <span key={q} className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-400">{q}</span>
                    ))}
                  </div>
                </div>
              )}
              {entry.notes && <p className="text-xs text-cyber-muted mt-2 italic">{entry.notes}</p>}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
