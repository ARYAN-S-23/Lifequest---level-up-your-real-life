import { useStore } from '../store';
import { motion } from 'framer-motion';
import { Trophy, Lock, CheckCircle2 } from 'lucide-react';

const rarityConfig: Record<string, { color: string; bg: string; border: string }> = {
  common: { color: 'text-gray-400', bg: 'bg-gray-500/20', border: 'border-gray-500/30' },
  uncommon: { color: 'text-green-400', bg: 'bg-green-500/20', border: 'border-green-500/30' },
  rare: { color: 'text-blue-400', bg: 'bg-blue-500/20', border: 'border-blue-500/30' },
  epic: { color: 'text-purple-400', bg: 'bg-purple-500/20', border: 'border-purple-500/30' },
  legendary: { color: 'text-orange-400', bg: 'bg-orange-500/20', border: 'border-orange-500/30' },
};

export default function AchievementsPage() {
  const { achievements } = useStore();
  const unlocked = achievements.filter((a) => a.unlocked);
  const locked = achievements.filter((a) => !a.unlocked);

  return (
    <div className="page-container space-y-5">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold">Achievements</h1>
        <p className="text-cyber-muted text-sm">{unlocked.length}/{achievements.length} unlocked</p>
      </motion.div>

      <div className="w-full bg-cyber-border rounded-full h-3">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${(unlocked.length / achievements.length) * 100}%` }}
          transition={{ duration: 1 }}
          className="bg-gradient-to-r from-cyber-gold to-cyber-accent h-3 rounded-full"
        />
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-cyber-muted flex items-center gap-2">
          <CheckCircle2 size={14} className="text-green-400" /> Unlocked
        </h3>
        {unlocked.map((a, i) => {
          const rc = rarityConfig[a.rarity];
          return (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`glass rounded-xl p-4 flex items-center gap-4 border ${rc.border}`}
            >
              <div className={`w-14 h-14 rounded-xl ${rc.bg} flex items-center justify-center text-2xl`}>
                {a.emoji}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{a.name}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${rc.bg} ${rc.color} capitalize`}>
                    {a.rarity}
                  </span>
                </div>
                <p className="text-sm text-cyber-muted">{a.description}</p>
                {a.unlockedAt && (
                  <p className="text-xs text-cyber-muted mt-1">Unlocked: {a.unlockedAt}</p>
                )}
              </div>
              <span className="text-sm text-cyber-accent font-bold">+{a.xpReward} XP</span>
            </motion.div>
          );
        })}
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-cyber-muted flex items-center gap-2">
          <Lock size={14} /> Locked
        </h3>
        {locked.map((a, i) => {
          const rc = rarityConfig[a.rarity];
          return (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass rounded-xl p-4 flex items-center gap-4 opacity-50"
            >
              <div className="w-14 h-14 rounded-xl bg-cyber-border flex items-center justify-center text-2xl grayscale">
                {a.emoji}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{a.name}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${rc.bg} ${rc.color} capitalize`}>
                    {a.rarity}
                  </span>
                </div>
                <p className="text-sm text-cyber-muted">{a.description}</p>
                <p className="text-xs text-cyber-muted mt-1">Requirement: {a.requirement}</p>
              </div>
              <span className="text-sm text-cyber-muted font-bold">+{a.xpReward} XP</span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
