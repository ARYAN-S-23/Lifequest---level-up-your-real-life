import { useState } from 'react';
import { useStore } from '../store';
import { motion } from 'framer-motion';
import { CharacterClass } from '../types';
import { Star, Shield, Zap, Heart, Coins, TrendingUp } from 'lucide-react';

const classInfo: Record<CharacterClass, { emoji: string; label: string; desc: string; color: string }> = {
  builder: { emoji: '🔨', label: 'Builder', desc: 'Creates and constructs', color: '#f59e0b' },
  scholar: { emoji: '📚', label: 'Scholar', desc: 'Learns and researches', color: '#3b82f6' },
  creator: { emoji: '🎨', label: 'Creator', desc: 'Designs and innovates', color: '#ec4899' },
  athlete: { emoji: '🏃', label: 'Athlete', desc: 'Trains and competes', color: '#22c55e' },
  explorer: { emoji: '🧭', label: 'Explorer', desc: 'Discovers and experiments', color: '#06b6d4' },
  entrepreneur: { emoji: '💼', label: 'Entrepreneur', desc: 'Leads and builds', color: '#8b5cf6' },
};

const avatars = ['🧑‍💻', '👨‍🚀', '🧙‍♂️', '🦸‍♂️', '🧑‍🎨', '🧑‍🔬', '👨‍🍳', '🧑‍🎤', '🧑‍✈️', '🥷', '🧑‍🏭', '🧙‍♀️'];

export default function CharacterPage() {
  const { character, updateCharacter, updateStats } = useStore();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(character.name);
  const [selectedClass, setSelectedClass] = useState<CharacterClass>(character.characterClass);
  const [selectedAvatar, setSelectedAvatar] = useState(character.avatar);

  const save = () => {
    updateCharacter({ name, characterClass: selectedClass, avatar: selectedAvatar });
    setEditing(false);
  };

  const xpPercent = (character.xp / character.xpToNext) * 100;
  const statColors: Record<string, string> = {
    productivity: '#8b5cf6', knowledge: '#06b6d4', health: '#22c55e',
    creativity: '#f59e0b', finance: '#10b981', communication: '#ec4899',
  };

  return (
    <div className="page-container space-y-5">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold mb-1">Character</h1>
        <p className="text-cyber-muted text-sm">Your RPG avatar and stats</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass rounded-xl p-6"
        >
          <div className="text-center mb-6">
            <div className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-cyber-accent/30 to-cyber-accent2/20 flex items-center justify-center text-5xl border-2 border-cyber-accent/30 mb-3">
              {character.avatar}
            </div>
            <h2 className="text-xl font-bold">{character.name}</h2>
            <p className="text-cyber-muted text-sm capitalize">
              {classInfo[character.characterClass].emoji} {classInfo[character.characterClass].label}
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-cyber-bg border border-cyber-border">
              <span className="text-sm text-cyber-muted flex items-center gap-2">
                <Star size={14} className="text-cyber-accent" /> Level
              </span>
              <span className="font-bold text-cyber-accent">{character.level}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-cyber-bg border border-cyber-border">
              <span className="text-sm text-cyber-muted flex items-center gap-2">
                <TrendingUp size={14} className="text-cyber-accent2" /> XP
              </span>
              <span className="font-bold text-cyber-accent2">
                {character.xp} / {character.xpToNext}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-cyber-bg border border-cyber-border">
              <span className="text-sm text-cyber-muted flex items-center gap-2">
                <Coins size={14} className="text-cyber-gold" /> Coins
              </span>
              <span className="font-bold text-cyber-gold">{character.coins.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-cyber-bg border border-cyber-border">
              <span className="text-sm text-cyber-muted flex items-center gap-2">
                <Zap size={14} className="text-cyber-warning" /> Energy
              </span>
              <span className="font-bold text-cyber-warning">{character.energy}/{character.maxEnergy}</span>
            </div>
          </div>

          <button
            onClick={() => setEditing(!editing)}
            className="mt-4 w-full py-2.5 rounded-lg bg-cyber-accent/20 text-cyber-accent border border-cyber-accent/30 hover:bg-cyber-accent/30 transition-colors text-sm font-medium"
          >
            {editing ? 'Cancel' : 'Edit Character'}
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass rounded-xl p-6"
        >
          {editing ? (
            <div className="space-y-4">
              <div>
                <label className="text-sm text-cyber-muted mb-1 block">Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-cyber-bg border border-cyber-border text-sm focus:border-cyber-accent focus:outline-none"
                />
              </div>
              <div>
                <label className="text-sm text-cyber-muted mb-2 block">Avatar</label>
                <div className="grid grid-cols-6 gap-2">
                  {avatars.map((a) => (
                    <button
                      key={a}
                      onClick={() => setSelectedAvatar(a)}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl border transition-all ${
                        selectedAvatar === a
                          ? 'border-cyber-accent bg-cyber-accent/20'
                          : 'border-cyber-border hover:border-cyber-accent/50'
                      }`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm text-cyber-muted mb-2 block">Class</label>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.keys(classInfo) as CharacterClass[]).map((cls) => (
                    <button
                      key={cls}
                      onClick={() => setSelectedClass(cls)}
                      className={`p-3 rounded-lg border text-left transition-all ${
                        selectedClass === cls
                          ? 'border-cyber-accent bg-cyber-accent/20'
                          : 'border-cyber-border hover:border-cyber-accent/50'
                      }`}
                    >
                      <span className="text-xl">{classInfo[cls].emoji}</span>
                      <p className="text-sm font-medium mt-1">{classInfo[cls].label}</p>
                      <p className="text-xs text-cyber-muted">{classInfo[cls].desc}</p>
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={save}
                className="w-full py-2.5 rounded-lg bg-cyber-accent text-white hover:bg-cyber-accent/80 transition-colors text-sm font-medium flex items-center justify-center"
              >
                Save Changes
              </button>
            </div>
          ) : (
            <div>
              <h3 className="font-semibold mb-4">Stats</h3>
              <div className="space-y-4">
                {Object.entries(character.stats).map(([key, val]) => (
                  <div key={key}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm capitalize text-cyber-muted">{key}</span>
                      <span className="text-sm font-bold" style={{ color: statColors[key] }}>{val}/100</span>
                    </div>
                    <div className="w-full bg-cyber-border rounded-full h-2.5">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${val}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="h-2.5 rounded-full"
                        style={{ backgroundColor: statColors[key] }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
