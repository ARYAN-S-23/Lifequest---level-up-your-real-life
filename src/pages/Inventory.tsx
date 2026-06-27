import { useStore } from '../store';
import { motion } from 'framer-motion';
import { Backpack, Package, BookOpen, GraduationCap, Wrench, Dumbbell, Gift } from 'lucide-react';

const typeConfig: Record<string, { icon: any; color: string; bg: string }> = {
  certificate: { icon: GraduationCap, color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
  book: { icon: BookOpen, color: 'text-blue-400', bg: 'bg-blue-500/20' },
  course: { icon: GraduationCap, color: 'text-purple-400', bg: 'bg-purple-500/20' },
  tool: { icon: Wrench, color: 'text-cyan-400', bg: 'bg-cyan-500/20' },
  equipment: { icon: Dumbbell, color: 'text-green-400', bg: 'bg-green-500/20' },
  consumable: { icon: Gift, color: 'text-pink-400', bg: 'bg-pink-500/20' },
};

export default function InventoryPage() {
  const { inventory } = useStore();

  const grouped = inventory.reduce((acc, item) => {
    if (!acc[item.type]) acc[item.type] = [];
    acc[item.type].push(item);
    return acc;
  }, {} as Record<string, typeof inventory>);

  return (
    <div className="page-container space-y-5">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold">Inventory</h1>
        <p className="text-cyber-muted text-sm">{inventory.length} items collected</p>
      </motion.div>

      {inventory.length === 0 && (
        <div className="glass rounded-xl p-12 text-center">
          <Backpack size={40} className="mx-auto text-cyber-muted/30 mb-3" />
          <p className="text-sm text-cyber-muted mb-1">Inventory is empty</p>
          <p className="text-xs text-cyber-muted/60">Items will appear here as you earn them</p>
        </div>
      )}

      {Object.entries(grouped).map(([type, items]) => {
        const config = typeConfig[type] || typeConfig.tool;
        const Icon = config.icon;
        return (
          <div key={type} className="space-y-3">
            <h3 className="text-sm font-semibold text-cyber-muted flex items-center gap-2 capitalize">
              <Icon size={14} className={config.color} /> {type}s
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {items.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass rounded-xl p-4 flex items-center gap-4"
                >
                  <div className={`w-12 h-12 rounded-xl ${config.bg} flex items-center justify-center text-2xl`}>
                    {item.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{item.name}</p>
                    <p className="text-xs text-cyber-muted">{item.description}</p>
                    {item.bonus && (
                      <p className="text-xs text-cyber-accent mt-1">{item.bonus}</p>
                    )}
                  </div>
                  <p className="text-xs text-cyber-muted shrink-0">{item.acquiredAt}</p>
                </motion.div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
