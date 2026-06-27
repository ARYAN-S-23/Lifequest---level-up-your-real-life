import { useStore } from '../store';
import { motion } from 'framer-motion';
import { Skull, Swords, Zap, Trophy } from 'lucide-react';

export default function BattlesPage() {
  const { bosses, quests, character } = useStore();

  return (
    <div className="page-container space-y-5">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold">Boss Battles</h1>
        <p className="text-cyber-muted text-sm">Defeat bosses by completing quests</p>
      </motion.div>

      {bosses.length === 0 && (
        <div className="glass rounded-xl p-12 text-center">
          <Skull size={48} className="mx-auto text-cyber-muted mb-4" />
          <p className="text-cyber-muted">No active bosses. Create a campaign with a boss to begin!</p>
        </div>
      )}

      <div className="space-y-6">
        {bosses.map((boss, i) => {
          const hpPercent = (boss.currentHp / boss.maxHp) * 100;
          const campaignQuests = quests.filter((q) => q.campaignId === boss.campaignId);
          const damageDealt = boss.maxHp - boss.currentHp;

          return (
            <motion.div
              key={boss.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className={`glass rounded-xl p-6 ${boss.defeated ? 'border border-green-500/30' : 'border border-red-500/20'}`}
            >
              <div className="flex items-start gap-6">
                <div className={`text-7xl ${boss.defeated ? 'grayscale opacity-50' : 'animate-float'}`}>
                  {boss.emoji}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-xl font-bold">{boss.name}</h2>
                    {boss.defeated ? (
                      <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-medium flex items-center gap-1">
                        <Trophy size={12} /> Defeated!
                      </span>
                    ) : (
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        boss.difficulty === 'epic' ? 'bg-purple-500/20 text-purple-400' :
                        boss.difficulty === 'legendary' ? 'bg-orange-500/20 text-orange-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {boss.difficulty}
                      </span>
                    )}
                  </div>
                  <p className="text-cyber-muted text-sm mb-4">{boss.description}</p>

                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-cyber-muted flex items-center gap-1"><Skull size={14} /> HP</span>
                      <span className={`font-bold ${boss.defeated ? 'text-green-400' : 'text-red-400'}`}>
                        {boss.currentHp} / {boss.maxHp}
                      </span>
                    </div>
                    <div className="w-full bg-cyber-border rounded-full h-5 overflow-hidden">
                      <motion.div
                        initial={{ width: '100%' }}
                        animate={{ width: `${hpPercent}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className={`h-5 rounded-full ${boss.defeated ? 'bg-green-500' : 'bg-gradient-to-r from-red-600 to-red-400'}`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="p-3 rounded-lg bg-cyber-bg border border-cyber-border text-center">
                      <p className="text-xs text-cyber-muted">Damage Dealt</p>
                      <p className="text-lg font-bold text-red-400">{damageDealt}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-cyber-bg border border-cyber-border text-center">
                      <p className="text-xs text-cyber-muted">Quests Completed</p>
                      <p className="text-lg font-bold text-cyber-accent">
                        {campaignQuests.filter((q) => q.completed).length}
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-cyber-bg border border-cyber-border text-center">
                      <p className="text-xs text-cyber-muted">XP Reward</p>
                      <p className="text-lg font-bold text-cyber-gold flex items-center justify-center gap-1">
                        <Zap size={14} /> {boss.xpReward}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs text-cyber-muted font-semibold">Quest Damage Log:</p>
                    {campaignQuests.filter((q) => q.completed).map((q) => (
                      <div key={q.id} className="flex items-center gap-2 text-xs text-cyber-muted">
                        <Swords size={12} className="text-red-400" />
                        <span>{q.title}</span>
                        <span className="ml-auto text-red-400 font-bold">-{q.xpReward} HP</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
