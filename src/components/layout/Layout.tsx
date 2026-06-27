import { NavLink, Outlet } from 'react-router-dom';
import { useStore } from '../../store';
import {
  LayoutDashboard, Swords, Map, Scroll, GitBranch, Skull, Trophy,
  Backpack, Calendar, BarChart3, BookOpen, Coins, Palette, Users,
  Bot, ChevronLeft, ChevronRight, Zap
} from 'lucide-react';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/character', icon: Swords, label: 'Character' },
  { to: '/campaigns', icon: Map, label: 'Campaigns' },
  { to: '/quests', icon: Scroll, label: 'Quests' },
  { to: '/skills', icon: GitBranch, label: 'Skill Tree' },
  { to: '/battles', icon: Skull, label: 'Boss Battles' },
  { to: '/achievements', icon: Trophy, label: 'Achievements' },
  { to: '/inventory', icon: Backpack, label: 'Inventory' },
  { to: '/calendar', icon: Calendar, label: 'Calendar' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/journal', icon: BookOpen, label: 'Journal' },
  { to: '/economy', icon: Coins, label: 'Economy' },
  { to: '/customization', icon: Palette, label: 'Customization' },
  { to: '/community', icon: Users, label: 'Community' },
  { to: '/coach', icon: Bot, label: 'AI Coach' },
];

export default function Layout() {
  const { character, sidebarOpen, toggleSidebar } = useStore();
  const xpPercent = (character.xp / character.xpToNext) * 100;

  return (
    <div className="flex h-full w-full">
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-16'
        } h-full bg-cyber-card border-r border-cyber-border flex flex-col transition-all duration-300 overflow-hidden shrink-0`}
      >
        <div className="p-3 border-b border-cyber-border flex items-center gap-3 min-h-[56px]">
          {sidebarOpen && (
            <div className="flex items-center gap-2.5 flex-1 min-w-0">
              <span className="text-2xl shrink-0">⚔️</span>
              <span className="font-bold text-lg text-cyber-accent truncate">LifeQuest</span>
            </div>
          )}
          {!sidebarOpen && <span className="text-2xl mx-auto">⚔️</span>}
          <button
            onClick={toggleSidebar}
            className="p-1.5 rounded-md hover:bg-cyber-border transition-colors shrink-0"
          >
            {sidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </button>
        </div>

        {sidebarOpen && (
          <div className="p-3 border-b border-cyber-border">
            <div className="flex items-center gap-3 mb-2.5">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyber-accent/30 to-cyber-accent2/20 flex items-center justify-center text-xl border border-cyber-accent/20 shrink-0">
                {character.avatar}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-base font-semibold truncate">{character.name}</p>
                <p className="text-sm text-cyber-muted">Lv. {character.level}</p>
              </div>
            </div>
            <div className="w-full bg-cyber-border rounded-full h-2">
              <div
                className="bg-gradient-to-r from-cyber-accent to-cyber-accent2 h-2 rounded-full transition-all duration-500"
                style={{ width: `${xpPercent}%` }}
              />
            </div>
            <p className="text-xs text-cyber-muted mt-1">
              {character.xp} / {character.xpToNext} XP
            </p>
          </div>
        )}

        <nav className="flex-1 overflow-y-auto py-2">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 mx-2 rounded-lg text-sm transition-all ${
                  isActive
                    ? 'bg-cyber-accent/15 text-cyber-accent font-medium'
                    : 'text-cyber-muted hover:text-cyber-text hover:bg-cyber-border/50'
                }`
              }
            >
              <Icon size={18} className="shrink-0" />
              {sidebarOpen && <span className="truncate">{label}</span>}
            </NavLink>
          ))}
        </nav>

        {sidebarOpen && (
          <div className="p-3 border-t border-cyber-border">
            <div className="flex items-center justify-between text-sm text-cyber-muted">
              <span className="flex items-center gap-1.5">
                <Zap size={14} className="text-cyber-warning" />
                {character.energy}/{character.maxEnergy}
              </span>
              <span className="flex items-center gap-1.5">
                🪙 {character.coins.toLocaleString()}
              </span>
            </div>
          </div>
        )}
      </aside>

      <main className="flex-1 h-full overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
}
