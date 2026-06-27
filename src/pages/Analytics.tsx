import { useStore } from '../store';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';
import { BarChart3 } from 'lucide-react';

export default function AnalyticsPage() {
  const { xpLog, quests, skills, campaigns } = useStore();

  const completedQuests = quests.filter((q) => q.completed);
  const hasData = completedQuests.length > 0 || xpLog.length > 0 || skills.length > 0;

  const typeDistribution = [
    { name: 'Daily', value: completedQuests.filter((q) => q.type === 'daily').length || 0, color: '#22c55e' },
    { name: 'Weekly', value: completedQuests.filter((q) => q.type === 'weekly').length || 0, color: '#f59e0b' },
    { name: 'Main', value: completedQuests.filter((q) => q.type === 'main').length || 0, color: '#8b5cf6' },
  ];

  const skillData = skills.map((s) => ({
    name: s.name,
    level: s.level,
    xp: s.xp,
    color: s.color,
  }));

  const campaignData = campaigns.map((c) => ({
    name: c.title.slice(0, 12),
    progress: c.progress,
  }));

  const totalXP = xpLog.reduce((sum, l) => sum + l.amount, 0);

  return (
    <div className="page-container space-y-5">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl md:text-2xl font-bold">Analytics</h1>
        <p className="text-cyber-muted text-sm">Track your progress over time</p>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Total Quests', value: completedQuests.length, color: 'text-cyber-success' },
          { label: 'Total XP Earned', value: totalXP.toLocaleString(), color: 'text-cyber-accent' },
          { label: 'Active Skills', value: skills.length, color: 'text-cyber-accent2' },
          { label: 'Campaigns', value: campaigns.length, color: 'text-cyber-gold' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="stat-card rounded-xl p-3.5"
          >
            <p className="text-xs text-cyber-muted">{stat.label}</p>
            <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {!hasData ? (
        <div className="glass rounded-xl p-12 text-center">
          <BarChart3 size={40} className="mx-auto text-cyber-muted/30 mb-3" />
          <p className="text-sm text-cyber-muted mb-1">No data yet</p>
          <p className="text-xs text-cyber-muted/60">Complete quests and earn XP to see your analytics</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="glass rounded-xl p-4">
            <h3 className="font-semibold mb-3 text-sm">XP Over Time</h3>
            {xpLog.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={[...xpLog].reverse()}>
                  <defs>
                    <linearGradient id="xpGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} width={35} />
                  <Tooltip contentStyle={{ background: '#111827', border: '1px solid #1e293b', borderRadius: 8, fontSize: 12 }} />
                  <Area type="monotone" dataKey="amount" stroke="#8b5cf6" fill="url(#xpGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-xs text-cyber-muted">No XP data yet</div>
            )}
          </div>

          <div className="glass rounded-xl p-4">
            <h3 className="font-semibold mb-3 text-sm">Quest Completion by Type</h3>
            {completedQuests.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={typeDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value">
                    {typeDistribution.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#111827', border: '1px solid #1e293b', borderRadius: 8, fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-xs text-cyber-muted">No completed quests yet</div>
            )}
            <div className="flex justify-center gap-4 mt-2">
              {typeDistribution.map((t) => (
                <div key={t.name} className="flex items-center gap-1.5 text-[10px] text-cyber-muted">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: t.color }} />
                  {t.name}
                </div>
              ))}
            </div>
          </div>

          <div className="glass rounded-xl p-4">
            <h3 className="font-semibold mb-3 text-sm">Skill Levels</h3>
            {skillData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={skillData} layout="vertical">
                  <XAxis type="number" domain={[0, 10]} tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fill: '#e2e8f0', fontSize: 11 }} axisLine={false} tickLine={false} width={70} />
                  <Tooltip contentStyle={{ background: '#111827', border: '1px solid #1e293b', borderRadius: 8, fontSize: 12 }} />
                  <Bar dataKey="level" radius={[0, 4, 4, 0]}>
                    {skillData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-xs text-cyber-muted">No skills added yet</div>
            )}
          </div>

          <div className="glass rounded-xl p-4">
            <h3 className="font-semibold mb-3 text-sm">Campaign Progress</h3>
            {campaignData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={campaignData}>
                  <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} width={35} />
                  <Tooltip contentStyle={{ background: '#111827', border: '1px solid #1e293b', borderRadius: 8, fontSize: 12 }} />
                  <Bar dataKey="progress" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-xs text-cyber-muted">No campaigns created yet</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
