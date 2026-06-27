import { Character, Campaign, Quest, Skill, Boss, Achievement, InventoryItem, ShopItem, XPLog } from '../types';

export const defaultCharacter: Character = {
  id: 'char-1',
  name: 'Hero',
  avatar: '🧑‍💻',
  characterClass: 'builder',
  level: 1,
  xp: 0,
  xpToNext: 500,
  coins: 0,
  energy: 100,
  maxEnergy: 100,
  stats: {
    productivity: 0,
    knowledge: 0,
    health: 0,
    creativity: 0,
    finance: 0,
    communication: 0,
  },
  streak: 0,
  createdAt: new Date().toISOString().split('T')[0],
};

export const defaultCampaigns: Campaign[] = [];

export const defaultQuests: Quest[] = [];

export const defaultSkills: Skill[] = [];

export const defaultBosses: Boss[] = [];

export const defaultAchievements: Achievement[] = [];

export const defaultInventory: InventoryItem[] = [];

export const defaultShopItems: ShopItem[] = [];

export const defaultXPLog: XPLog[] = [];
