import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Character, Campaign, Quest, Skill, Boss, Achievement, InventoryItem, ShopItem, XPLog, JournalEntry, ThemeName } from '../types';
import { v4 as uuid } from 'uuid';
import {
  defaultCharacter, defaultCampaigns, defaultQuests, defaultSkills,
  defaultBosses, defaultAchievements, defaultInventory, defaultShopItems, defaultXPLog,
} from '../data/seed';

interface AppState {
  character: Character;
  campaigns: Campaign[];
  quests: Quest[];
  skills: Skill[];
  bosses: Boss[];
  achievements: Achievement[];
  inventory: InventoryItem[];
  shopItems: ShopItem[];
  xpLog: XPLog[];
  journalEntries: JournalEntry[];
  activeTheme: ThemeName;
  sidebarOpen: boolean;

  setCharacter: (c: Character) => void;
  updateCharacter: (updates: Partial<Character>) => void;
  updateStats: (updates: Partial<Character['stats']>) => void;

  addCampaign: (c: Campaign) => void;
  updateCampaign: (id: string, updates: Partial<Campaign>) => void;
  deleteCampaign: (id: string) => void;

  addQuest: (q: Quest) => void;
  updateQuest: (id: string, updates: Partial<Quest>) => void;
  deleteQuest: (id: string) => void;
  completeQuest: (id: string) => void;

  addSkill: (s: Skill) => void;
  updateSkill: (id: string, updates: Partial<Skill>) => void;
  addXpToSkill: (id: string, amount: number) => void;

  damageBoss: (bossId: string, damage: number) => void;

  unlockAchievement: (id: string) => void;

  addToInventory: (item: InventoryItem) => void;
  buyShopItem: (id: string) => void;

  addXPLog: (amount: number, source: string) => void;

  addJournalEntry: (entry: JournalEntry) => void;
  updateJournalEntry: (id: string, updates: Partial<JournalEntry>) => void;

  setTheme: (t: ThemeName) => void;
  toggleSidebar: () => void;
}

function calcXpForLevel(level: number): number {
  return 500 + (level - 1) * 300;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      character: defaultCharacter,
      campaigns: defaultCampaigns,
      quests: defaultQuests,
      skills: defaultSkills,
      bosses: defaultBosses,
      achievements: defaultAchievements,
      inventory: defaultInventory,
      shopItems: defaultShopItems,
      xpLog: defaultXPLog,
      journalEntries: [],
      activeTheme: 'cyberpunk',
      sidebarOpen: true,

      setCharacter: (c) => set({ character: c }),

      updateCharacter: (updates) =>
        set((s) => ({ character: { ...s.character, ...updates } })),

      updateStats: (updates) =>
        set((s) => ({
          character: {
            ...s.character,
            stats: { ...s.character.stats, ...updates },
          },
        })),

      addCampaign: (c) => set((s) => ({ campaigns: [...s.campaigns, c] })),

      updateCampaign: (id, updates) =>
        set((s) => ({
          campaigns: s.campaigns.map((c) => (c.id === id ? { ...c, ...updates } : c)),
        })),

      deleteCampaign: (id) =>
        set((s) => ({ campaigns: s.campaigns.filter((c) => c.id !== id) })),

      addQuest: (q) => set((s) => ({ quests: [...s.quests, q] })),

      updateQuest: (id, updates) =>
        set((s) => ({
          quests: s.quests.map((q) => (q.id === id ? { ...q, ...updates } : q)),
        })),

      deleteQuest: (id) =>
        set((s) => ({ quests: s.quests.filter((q) => q.id !== id) })),

      completeQuest: (id) => {
        const state = get();
        const quest = state.quests.find((q) => q.id === id);
        if (!quest || quest.completed) return;

        const now = new Date().toISOString();
        const newChar = { ...state.character };
        newChar.xp += quest.xpReward;
        newChar.coins += quest.coinReward;

        while (newChar.xp >= newChar.xpToNext) {
          newChar.xp -= newChar.xpToNext;
          newChar.level += 1;
          newChar.xpToNext = calcXpForLevel(newChar.level);
        }

        const newQuests = state.quests.map((q) =>
          q.id === id ? { ...q, completed: true, completedAt: now } : q
        );

        const newBosses = state.bosses.map((b) => {
          if (quest.campaignId && b.campaignId === quest.campaignId && !b.defeated) {
            const newHp = Math.max(0, b.currentHp - quest.xpReward);
            return { ...b, currentHp: newHp, defeated: newHp <= 0 };
          }
          return b;
        });

        set({
          character: newChar,
          quests: newQuests,
          bosses: newBosses,
        });

        get().addXPLog(quest.xpReward, `Quest: ${quest.title}`);

        quest.skillIds.forEach((skId) => {
          get().addXpToSkill(skId, Math.floor(quest.xpReward * 0.3));
        });

        const totalCompleted = newQuests.filter((q) => q.completed).length;

        state.achievements.forEach((a) => {
          if (a.unlocked) return;
          const req = a.requirement.toLowerCase();
          if (req.includes('first quest') && totalCompleted >= 1) {
            get().unlockAchievement(a.id);
          } else if (req.includes('100 quest') && totalCompleted >= 100) {
            get().unlockAchievement(a.id);
          } else if (req.includes('level 25') && newChar.level >= 25) {
            get().unlockAchievement(a.id);
          }
        });

        newBosses.forEach((b) => {
          if (b.defeated && state.bosses.find((ob) => ob.id === b.id && !ob.defeated)) {
            get().addXPLog(b.xpReward, `Boss defeated: ${b.name}`);
            state.achievements.forEach((a) => {
              if (a.unlocked) return;
              const req = a.requirement.toLowerCase();
              if (req.includes('boss')) {
                get().unlockAchievement(a.id);
              }
            });
          }
        });
      },

      addSkill: (s) => set((st) => ({ skills: [...st.skills, s] })),

      updateSkill: (id, updates) =>
        set((s) => ({
          skills: s.skills.map((sk) => (sk.id === id ? { ...sk, ...updates } : sk)),
        })),

      addXpToSkill: (id, amount) =>
        set((s) => ({
          skills: s.skills.map((sk) => {
            if (sk.id !== id) return sk;
            const newXP = sk.xp + amount;
            if (newXP >= sk.xpToNext && sk.level < sk.maxLevel) {
              return { ...sk, level: sk.level + 1, xp: newXP - sk.xpToNext };
            }
            return { ...sk, xp: newXP };
          }),
        })),

      damageBoss: (bossId, damage) =>
        set((s) => ({
          bosses: s.bosses.map((b) => {
            if (b.id !== bossId) return b;
            const newHp = Math.max(0, b.currentHp - damage);
            return { ...b, currentHp: newHp, defeated: newHp <= 0 };
          }),
        })),

      unlockAchievement: (id) =>
        set((s) => ({
          achievements: s.achievements.map((a) =>
            a.id === id && !a.unlocked
              ? { ...a, unlocked: true, unlockedAt: new Date().toISOString().split('T')[0] }
              : a
          ),
        })),

      addToInventory: (item) =>
        set((s) => ({ inventory: [...s.inventory, item] })),

      buyShopItem: (id) => {
        const state = get();
        const item = state.shopItems.find((i) => i.id === id);
        if (!item || item.owned || state.character.coins < item.price) return;

        set({
          character: { ...state.character, coins: state.character.coins - item.price },
          shopItems: state.shopItems.map((i) =>
            i.id === id ? { ...i, owned: true } : i
          ),
        });

        get().addToInventory({
          id: uuid(),
          name: item.name,
          description: item.description,
          emoji: item.emoji,
          type: item.type as 'tool',
          acquiredAt: new Date().toISOString().split('T')[0],
        });
      },

      addXPLog: (amount, source) =>
        set((s) => ({
          xpLog: [
            { id: uuid(), date: new Date().toISOString().split('T')[0], amount, source },
            ...s.xpLog,
          ],
        })),

      addJournalEntry: (entry) =>
        set((s) => ({ journalEntries: [...s.journalEntries, entry] })),

      updateJournalEntry: (id, updates) =>
        set((s) => ({
          journalEntries: s.journalEntries.map((e) =>
            e.id === id ? { ...e, ...updates } : e
          ),
        })),

      setTheme: (t) => set({ activeTheme: t }),
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
    }),
    { name: 'lifequest-v2' }
  )
);
