export type CharacterClass = 'builder' | 'scholar' | 'creator' | 'athlete' | 'explorer' | 'entrepreneur';
export type QuestType = 'daily' | 'weekly' | 'main';
export type QuestDifficulty = 'easy' | 'medium' | 'hard' | 'epic' | 'legendary';
export type Rarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
export type Mood = 'amazing' | 'good' | 'okay' | 'bad' | 'terrible';
export type ThemeName = 'cyberpunk' | 'fantasy' | 'minimal' | 'space' | 'nature' | 'dark' | 'light';

export interface Character {
  id: string;
  name: string;
  avatar: string;
  characterClass: CharacterClass;
  level: number;
  xp: number;
  xpToNext: number;
  coins: number;
  energy: number;
  maxEnergy: number;
  stats: CharacterStats;
  streak: number;
  createdAt: string;
}

export interface CharacterStats {
  productivity: number;
  knowledge: number;
  health: number;
  creativity: number;
  finance: number;
  communication: number;
}

export interface Campaign {
  id: string;
  title: string;
  description: string;
  emoji: string;
  progress: number;
  difficulty: QuestDifficulty;
  milestones: Milestone[];
  questIds: string[];
  bossId?: string;
  startDate: string;
  targetDate: string;
  completed: boolean;
}

export interface Milestone {
  id: string;
  title: string;
  completed: boolean;
  xpReward: number;
}

export interface Quest {
  id: string;
  campaignId?: string;
  type: QuestType;
  title: string;
  description: string;
  difficulty: QuestDifficulty;
  xpReward: number;
  coinReward: number;
  estimatedTime: number;
  tags: string[];
  dueDate?: string;
  completed: boolean;
  completedAt?: string;
  notes?: string;
  skillIds: string[];
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  icon: string;
  level: number;
  xp: number;
  xpToNext: number;
  maxLevel: number;
  connections: string[];
  prerequisites: string[];
  color: string;
}

export interface Boss {
  id: string;
  campaignId: string;
  name: string;
  description: string;
  emoji: string;
  maxHp: number;
  currentHp: number;
  difficulty: QuestDifficulty;
  defeated: boolean;
  xpReward: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  emoji: string;
  xpReward: number;
  rarity: Rarity;
  unlocked: boolean;
  unlockedAt?: string;
  requirement: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  emoji: string;
  type: 'certificate' | 'book' | 'course' | 'tool' | 'equipment' | 'consumable';
  acquiredAt: string;
  bonus?: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  content: string;
  mood: Mood;
  completedQuests: string[];
  notes: string;
  images: string[];
}

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  emoji: string;
  price: number;
  type: 'theme' | 'avatar-frame' | 'icon' | 'consumable';
  owned: boolean;
}

export interface XPLog {
  id: string;
  date: string;
  amount: number;
  source: string;
  skillId?: string;
}
