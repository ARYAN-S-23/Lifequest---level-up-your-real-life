import { motion } from 'framer-motion';
import { Users, Swords, Trophy, Share2, Download, Lock } from 'lucide-react';

export default function CommunityPage() {
  const features = [
    { icon: Users, title: 'Guilds', desc: 'Join or create guilds with like-minded people', status: 'coming' },
    { icon: Trophy, title: 'Leaderboards', desc: 'Compete with others on XP and quest completion', status: 'coming' },
    { icon: Swords, title: 'Challenges', desc: 'Challenge friends to complete quests faster', status: 'coming' },
    { icon: Share2, title: 'Share Campaigns', desc: 'Share your campaigns and progress', status: 'coming' },
    { icon: Download, title: 'Templates', desc: 'Download community-created campaign templates', status: 'coming' },
  ];

  return (
    <div className="page-container space-y-5">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold">Community</h1>
        <p className="text-cyber-muted text-sm">Connect with other LifeQuest users</p>
      </motion.div>

      <div className="glass rounded-xl p-12 text-center">
        <Lock size={48} className="mx-auto text-cyber-accent mb-4" />
        <h2 className="text-xl font-bold mb-2">Coming in Version 2</h2>
        <p className="text-cyber-muted mb-6">Community features are under development. Stay tuned!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass rounded-xl p-5 opacity-60"
          >
            <div className="flex items-center gap-3 mb-2">
              <f.icon size={20} className="text-cyber-accent" />
              <h3 className="font-semibold">{f.title}</h3>
              <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 ml-auto">Coming Soon</span>
            </div>
            <p className="text-sm text-cyber-muted">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
