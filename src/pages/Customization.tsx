import { useState } from 'react';
import { useStore } from '../store';
import { motion } from 'framer-motion';
import { Palette, Check, Plus, X } from 'lucide-react';
import { ThemeName } from '../types';

const themes: { name: ThemeName; label: string; emoji: string; colors: string[] }[] = [
  { name: 'cyberpunk', label: 'Cyberpunk', emoji: '🌃', colors: ['#8b5cf6', '#06b6d4', '#0a0e1a'] },
  { name: 'fantasy', label: 'Fantasy', emoji: '🏰', colors: ['#f59e0b', '#22c55e', '#1a1a2e'] },
  { name: 'minimal', label: 'Minimal', emoji: '⬜', colors: ['#64748b', '#94a3b8', '#f8fafc'] },
  { name: 'space', label: 'Space', emoji: '🚀', colors: ['#6366f1', '#ec4899', '#0f0524'] },
  { name: 'nature', label: 'Nature', emoji: '🌿', colors: ['#22c55e', '#10b981', '#0f1f0f'] },
  { name: 'dark', label: 'Dark', emoji: '🌑', colors: ['#6366f1', '#a855f7', '#09090b'] },
  { name: 'light', label: 'Light', emoji: '☀️', colors: ['#3b82f6', '#8b5cf6', '#ffffff'] },
];

interface XpRule {
  id: string;
  action: string;
  xp: string;
}

export default function CustomizationPage() {
  const { activeTheme, setTheme } = useStore();
  const [xpRules, setXpRules] = useState<XpRule[]>([]);
  const [customSkills, setCustomSkills] = useState<string[]>([]);
  const [newRuleAction, setNewRuleAction] = useState('');
  const [newRuleXp, setNewRuleXp] = useState('');
  const [newSkillName, setNewSkillName] = useState('');
  const [showRuleForm, setShowRuleForm] = useState(false);
  const [showSkillForm, setShowSkillForm] = useState(false);

  const addRule = () => {
    if (!newRuleAction.trim() || !newRuleXp.trim()) return;
    setXpRules((prev) => [...prev, { id: Date.now().toString(), action: newRuleAction, xp: newRuleXp }]);
    setNewRuleAction('');
    setNewRuleXp('');
    setShowRuleForm(false);
  };

  const removeRule = (id: string) => {
    setXpRules((prev) => prev.filter((r) => r.id !== id));
  };

  const addSkill = () => {
    if (!newSkillName.trim() || customSkills.includes(newSkillName)) return;
    setCustomSkills((prev) => [...prev, newSkillName]);
    setNewSkillName('');
    setShowSkillForm(false);
  };

  const removeSkill = (name: string) => {
    setCustomSkills((prev) => prev.filter((s) => s !== name));
  };

  return (
    <div className="page-container space-y-5">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold">Customization</h1>
        <p className="text-cyber-muted text-sm">Personalize your LifeQuest experience</p>
      </motion.div>

      <div className="glass rounded-xl p-5">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Palette size={18} /> Themes
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {themes.map((t) => (
            <motion.button
              key={t.name}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setTheme(t.name)}
              className={`p-4 rounded-xl border text-left transition-all ${
                activeTheme === t.name
                  ? 'border-cyber-accent bg-cyber-accent/20'
                  : 'border-cyber-border hover:border-cyber-accent/50'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{t.emoji}</span>
                <span className="text-sm font-medium">{t.label}</span>
                {activeTheme === t.name && <Check size={14} className="text-cyber-accent ml-auto" />}
              </div>
              <div className="flex gap-1">
                {t.colors.map((c, i) => (
                  <div key={i} className="w-6 h-6 rounded-full border border-white/10" style={{ backgroundColor: c }} />
                ))}
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      <div className="glass rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">XP Rules</h3>
          <button
            onClick={() => setShowRuleForm(!showRuleForm)}
            className="inline-flex items-center justify-center gap-2 px-6 py-2 min-w-[140px] rounded-lg bg-cyber-accent text-white hover:bg-cyber-accent/80 transition-colors text-sm font-medium"
          >
            <Plus size={14} /> Add Rule
          </button>
        </div>
        {showRuleForm && (
          <div className="flex gap-2 mb-3">
            <input
              value={newRuleAction}
              onChange={(e) => setNewRuleAction(e.target.value)}
              placeholder="Action (e.g. Read 20 Pages)"
              className="flex-1 px-3 py-2 rounded-lg bg-cyber-bg border border-cyber-border text-sm focus:border-cyber-accent focus:outline-none"
            />
            <input
              value={newRuleXp}
              onChange={(e) => setNewRuleXp(e.target.value)}
              placeholder="XP (e.g. 10-15 XP)"
              className="w-32 px-3 py-2 rounded-lg bg-cyber-bg border border-cyber-border text-sm focus:border-cyber-accent focus:outline-none"
            />
            <button onClick={addRule} className="px-3 py-2 rounded-lg bg-cyber-accent text-white text-sm hover:bg-cyber-accent/80 transition-colors">Add</button>
          </div>
        )}
        <div className="space-y-3">
          {xpRules.length === 0 && !showRuleForm && (
            <p className="text-sm text-cyber-muted text-center py-4">No XP rules yet. Add your first rule to customize XP rewards.</p>
          )}
          {xpRules.map((rule) => (
            <div key={rule.id} className="flex items-center gap-3 p-3 rounded-lg bg-cyber-bg border border-cyber-border">
              <span className="text-sm flex-1">{rule.action}</span>
              <span className="text-sm text-cyber-accent font-bold">{rule.xp}</span>
              <button onClick={() => removeRule(rule.id)} className="text-cyber-muted hover:text-cyber-danger transition-colors">
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="glass rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Custom Skills</h3>
          <button
            onClick={() => setShowSkillForm(!showSkillForm)}
            className="inline-flex items-center justify-center gap-2 px-6 py-2 min-w-[140px] rounded-lg bg-cyber-accent text-white hover:bg-cyber-accent/80 transition-colors text-sm font-medium"
          >
            <Plus size={14} /> Add Skill
          </button>
        </div>
        {showSkillForm && (
          <div className="flex gap-2 mb-3">
            <input
              value={newSkillName}
              onChange={(e) => setNewSkillName(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') addSkill(); }}
              placeholder="Skill name (e.g. Photography)"
              className="flex-1 px-3 py-2 rounded-lg bg-cyber-bg border border-cyber-border text-sm focus:border-cyber-accent focus:outline-none"
            />
            <button onClick={addSkill} className="px-3 py-2 rounded-lg bg-cyber-accent text-white text-sm hover:bg-cyber-accent/80 transition-colors">Add</button>
          </div>
        )}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {customSkills.length === 0 && !showSkillForm && (
            <p className="col-span-full text-sm text-cyber-muted text-center py-4">No custom skills yet. Add your first skill category.</p>
          )}
          {customSkills.map((skill) => (
            <div key={skill} className="p-3 rounded-lg bg-cyber-bg border border-cyber-border text-center flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm">{skill}</p>
                <p className="text-xs text-cyber-muted">Custom</p>
              </div>
              <button onClick={() => removeSkill(skill)} className="text-cyber-muted hover:text-cyber-danger transition-colors ml-2">
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
