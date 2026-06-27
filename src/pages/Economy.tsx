import { useStore } from '../store';
import { motion } from 'framer-motion';
import { Coins, ShoppingBag, Star, Zap, Crown } from 'lucide-react';

const typeConfig: Record<string, { color: string; bg: string }> = {
  theme: { color: 'text-purple-400', bg: 'bg-purple-500/20' },
  'avatar-frame': { color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
  icon: { color: 'text-cyan-400', bg: 'bg-cyan-500/20' },
  consumable: { color: 'text-pink-400', bg: 'bg-pink-500/20' },
};

export default function EconomyPage() {
  const { character, shopItems, buyShopItem } = useStore();
  const ranks = [
    { name: 'Novice', minLevel: 1, color: 'text-gray-400' },
    { name: 'Apprentice', minLevel: 5, color: 'text-green-400' },
    { name: 'Warrior', minLevel: 10, color: 'text-blue-400' },
    { name: 'Champion', minLevel: 15, color: 'text-purple-400' },
    { name: 'Hero', minLevel: 20, color: 'text-yellow-400' },
    { name: 'Legend', minLevel: 30, color: 'text-red-400' },
    { name: 'Mythic', minLevel: 50, color: 'text-orange-400' },
  ];
  const currentRank = [...ranks].reverse().find((r) => character.level >= r.minLevel) || ranks[0];

  return (
    <div className="page-container space-y-5">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold">Economy</h1>
        <p className="text-cyber-muted text-sm">Spend your hard-earned coins</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="stat-card rounded-xl p-5 text-center">
          <Coins size={24} className="mx-auto text-cyber-gold mb-2" />
          <p className="text-3xl font-bold text-cyber-gold">{character.coins.toLocaleString()}</p>
          <p className="text-xs text-cyber-muted mt-1">Total Coins</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="stat-card rounded-xl p-5 text-center">
          <Crown size={24} className="mx-auto text-cyber-accent mb-2" />
          <p className={`text-xl font-bold ${currentRank.color}`}>{currentRank.name}</p>
          <p className="text-xs text-cyber-muted mt-1">Current Rank</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="stat-card rounded-xl p-5 text-center">
          <Star size={24} className="mx-auto text-cyber-accent2 mb-2" />
          <p className="text-3xl font-bold text-cyber-accent2">Level {character.level}</p>
          <p className="text-xs text-cyber-muted mt-1">Character Level</p>
        </motion.div>
      </div>

      <div className="glass rounded-xl p-5">
        <h3 className="font-semibold mb-4">Rank Progress</h3>
        <div className="space-y-2">
          {ranks.map((rank) => (
            <div key={rank.name} className={`flex items-center gap-3 p-2 rounded-lg ${character.level >= rank.minLevel ? 'bg-cyber-accent/10' : 'opacity-40'}`}>
              <Crown size={16} className={character.level >= rank.minLevel ? rank.color : 'text-cyber-muted'} />
              <span className="text-sm flex-1">{rank.name}</span>
              <span className="text-xs text-cyber-muted">Lv. {rank.minLevel}</span>
              {character.level >= rank.minLevel && <Star size={12} className="text-cyber-gold" />}
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <ShoppingBag size={18} /> Shop
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {shopItems.map((item, i) => {
            const tc = typeConfig[item.type] || typeConfig.consumable;
            const canBuy = !item.owned && character.coins >= item.price;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`glass rounded-xl p-4 ${item.owned ? 'opacity-50' : ''}`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-12 h-12 rounded-xl ${tc.bg} flex items-center justify-center text-2xl`}>
                    {item.emoji}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.name}</p>
                    <p className="text-xs text-cyber-muted">{item.description}</p>
                  </div>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <span className="text-xs text-cyber-muted capitalize">{item.type.replace('-', ' ')}</span>
                  {item.owned ? (
                    <span className="text-xs text-green-400 font-medium">Owned</span>
                  ) : (
                    <button
                      onClick={() => buyShopItem(item.id)}
                      disabled={!canBuy}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        canBuy
                          ? 'bg-cyber-gold/20 text-cyber-gold border border-cyber-gold/30 hover:bg-cyber-gold/30'
                          : 'bg-cyber-border text-cyber-muted cursor-not-allowed'
                      }`}
                    >
                      🪙 {item.price}
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
