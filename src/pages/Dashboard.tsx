import { useStore } from '../store';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Zap, Flame, TrendingUp, CheckCircle2, Clock, Star,
  Swords, ArrowUpRight, Map as MapIcon, Plus, Scroll,
  GitBranch, Trophy, BookOpen
} from 'lucide-react';

export default function Dashboard() {
  const { character, campaigns, quests, bosses } = useStore();
  const navigate = useNavigate();
  const todayQuests = quests.filter((q) => q.type === 'daily' && !q.completed).slice(0, 5);
  const activeCampaigns = campaigns.filter((c) => !c.completed).slice(0, 3);
  const activeBoss = bosses.find((b) => !b.defeated);
  const totalCompleted = quests.filter((q) => q.completed).length;
  const xpPercent = (character.xp / character.xpToNext) * 100;

  const statColors: Record<string, string> = {
    productivity: '#8b5cf6',
    knowledge: '#06b6d4',
    health: '#22c55e',
    creativity: '#f59e0b',
    finance: '#10b981',
    communication: '#ec4899',
  };

  return (
    <div className="h-full overflow-y-auto px-5 py-5 md:px-8 md:py-6">
      <div className="max-w-[1400px] mx-auto h-full flex flex-col gap-5">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between shrink-0"
        >
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">
              Welcome back, {character.name}!
            </h1>
            <p className="text-cyber-muted text-base mt-1">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="flex items-center gap-2 bg-cyber-card border border-cyber-border rounded-xl px-4 py-2">
            <Flame size={20} className="text-orange-500" />
            <span className="font-bold text-orange-500 text-lg">{character.streak}</span>
            <span className="text-cyber-muted text-sm hidden sm:inline">day streak</span>
          </div>
        </motion.div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
          {[
            { label: 'Level', value: character.level, icon: Star, color: 'text-cyber-accent', bg: 'from-cyber-accent/15 to-cyber-accent/5' },
            { label: 'Total XP', value: character.xp.toLocaleString(), icon: TrendingUp, color: 'text-cyber-accent2', bg: 'from-cyber-accent2/15 to-cyber-accent2/5' },
            { label: 'Coins', value: character.coins.toLocaleString(), icon: Zap, color: 'text-cyber-gold', bg: 'from-yellow-500/15 to-yellow-500/5' },
            { label: 'Energy', value: `${character.energy}/${character.maxEnergy}`, icon: Zap, color: 'text-cyber-success', bg: 'from-green-500/15 to-green-500/5' },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`stat-card rounded-xl p-5 bg-gradient-to-br ${item.bg}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-cyber-muted text-sm">{item.label}</span>
                <item.icon size={18} className={item.color} />
              </div>
              <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Character Card + Today's Quests — fills remaining space */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 flex-1 min-h-0">
          <div className="lg:col-span-2 glass rounded-xl p-6 flex flex-col">
            <h2 className="font-semibold mb-4 flex items-center gap-2 text-base shrink-0">
              <Star size={18} className="text-cyber-accent" />
              Character Card
            </h2>
            <div className="flex items-center gap-5 shrink-0">
              <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-cyber-accent/30 to-cyber-accent2/20 flex items-center justify-center text-4xl border border-cyber-accent/20 shrink-0">
                {character.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-bold">{character.name}</h3>
                <p className="text-cyber-muted text-sm capitalize">
                  {character.characterClass} · Level {character.level}
                </p>
                <div className="mt-2 w-full bg-cyber-border rounded-full h-3">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${xpPercent}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="bg-gradient-to-r from-cyber-accent to-cyber-accent2 h-3 rounded-full"
                  />
                </div>
                <p className="text-xs text-cyber-muted mt-1">
                  {character.xp} / {character.xpToNext} XP to next level
                </p>
              </div>
            </div>
            <div className="grid grid-cols-6 gap-3 mt-5 flex-1 items-center">
              {Object.entries(character.stats).map(([key, val]) => (
                <div key={key} className="text-center">
                  <div className="relative w-14 h-14 mx-auto mb-1.5">
                    <svg className="w-14 h-14 -rotate-90" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="15" fill="none" stroke="#1e293b" strokeWidth="3" />
                      <circle
                        cx="18" cy="18" r="15" fill="none"
                        stroke={statColors[key]}
                        strokeWidth="3"
                        strokeDasharray={`${val} 100`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-xs font-bold">
                      {val}
                    </span>
                  </div>
                  <p className="text-xs text-cyber-muted capitalize">{key}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass rounded-xl p-5 flex flex-col">
            <h2 className="font-semibold mb-4 flex items-center gap-2 text-base shrink-0">
              <Clock size={18} className="text-cyber-success" />
              Today's Quests
            </h2>
            <div className="space-y-2.5 flex-1 overflow-y-auto">
              {todayQuests.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center py-10 text-center h-full">
                  <Scroll size={36} className="text-cyber-muted/40 mb-3" />
                  <p className="text-sm text-cyber-muted">No active daily quests</p>
                  <button
                    onClick={() => navigate('/quests')}
                    className="mt-3 text-sm text-cyber-accent hover:bg-cyber-accent/10 px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5 transition-colors"
                  >
                    <Plus size={14} /> Create a quest
                  </button>
                </div>
              ) : (
                todayQuests.map((q) => (
                  <div
                    key={q.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-cyber-bg border border-cyber-border"
                  >
                    <CheckCircle2 size={16} className="text-cyber-muted shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{q.title}</p>
                      <p className="text-xs text-cyber-muted">+{q.xpReward} XP</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${
                      q.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' :
                      q.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {q.difficulty}
                    </span>
                  </div>
                ))
              )}
            </div>
            {totalCompleted > 0 && (
              <div className="mt-3 pt-3 border-t border-cyber-border text-center shrink-0">
                <p className="text-xs text-cyber-muted">
                  {totalCompleted} quest{totalCompleted !== 1 ? 's' : ''} completed total
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Campaigns + Quick Actions — fills remaining space */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 flex-1 min-h-0">
          <div className="lg:col-span-2 glass rounded-xl p-5 flex flex-col">
            <div className="flex items-center justify-between mb-4 shrink-0">
              <h2 className="font-semibold flex items-center gap-2 text-base">
                <MapIcon size={18} className="text-cyber-accent" />
                Active Campaigns
              </h2>
              <button
                onClick={() => navigate('/campaigns')}
                className="text-sm text-cyber-accent hover:bg-cyber-accent/10 px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5 transition-colors"
              >
                <Plus size={14} /> New
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {activeCampaigns.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center h-full">
                  <MapIcon size={40} className="text-cyber-muted/30 mb-3" />
                  <p className="text-base text-cyber-muted mb-1">No active campaigns</p>
                  <p className="text-sm text-cyber-muted/60">Create a campaign to start your journey</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {activeCampaigns.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => navigate('/campaigns')}
                      className="p-4 rounded-lg bg-cyber-bg border border-cyber-border cursor-pointer hover:border-cyber-accent/30 transition-all"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{c.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-base truncate">{c.title}</p>
                          <p className="text-xs text-cyber-muted">{c.progress}% complete</p>
                        </div>
                        <ArrowUpRight size={16} className="text-cyber-muted shrink-0" />
                      </div>
                      <div className="w-full bg-cyber-border rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-cyber-accent to-cyber-accent2 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${c.progress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="glass rounded-xl p-5 flex flex-col">
            <h2 className="font-semibold mb-4 text-base shrink-0">Quick Actions</h2>
            <div className="space-y-2.5 flex-1">
              {[
                { icon: Scroll, label: 'New Quest', path: '/quests', color: 'text-cyber-success' },
                { icon: MapIcon, label: 'New Campaign', path: '/campaigns', color: 'text-cyber-accent' },
                { icon: GitBranch, label: 'Add Skill', path: '/skills', color: 'text-cyber-accent2' },
                { icon: BookOpen, label: 'Write Journal', path: '/journal', color: 'text-cyber-warning' },
                { icon: Trophy, label: 'View Achievements', path: '/achievements', color: 'text-cyber-gold' },
              ].map((action) => (
                <button
                  key={action.path}
                  onClick={() => navigate(action.path)}
                  className="w-full flex items-center gap-3 p-3.5 rounded-lg bg-cyber-bg border border-cyber-border hover:border-cyber-accent/30 transition-all text-left"
                >
                  <action.icon size={20} className={action.color} />
                  <span className="text-sm font-medium">{action.label}</span>
                  <ArrowUpRight size={14} className="ml-auto text-cyber-muted" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Boss Battle */}
        {activeBoss && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass rounded-xl p-5 border border-red-500/20 shrink-0"
          >
            <h2 className="font-semibold mb-4 flex items-center gap-2 text-base">
              <Swords size={18} className="text-red-500" />
              Active Boss Battle
            </h2>
            <div className="flex items-center gap-5">
              <span className="text-5xl animate-float">{activeBoss.emoji}</span>
              <div className="flex-1">
                <h3 className="text-lg font-bold">{activeBoss.name}</h3>
                <p className="text-cyber-muted text-sm">{activeBoss.description}</p>
                <div className="mt-3 w-full bg-cyber-border rounded-full h-4">
                  <div
                    className="bg-gradient-to-r from-red-600 to-red-400 h-4 rounded-full transition-all duration-500"
                    style={{ width: `${(activeBoss.currentHp / activeBoss.maxHp) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-cyber-muted">
                    HP: {activeBoss.currentHp} / {activeBoss.maxHp}
                  </span>
                  <span className="text-xs text-cyber-gold">
                    +{activeBoss.xpReward} XP
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
