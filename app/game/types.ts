export type GirlId = "kiyo" | "mimi" | "runa";

export type RewardKind = "accessory" | "makeup" | "outfit";

export type DialogueChoice = {
  id: string;
  text: string;
  liked: boolean;
  creditReward: number;
  reply: string;
};

export type ChatScene = {
  id: string;
  threadTitle?: string;
  prompt: string;
  choices: [DialogueChoice, DialogueChoice, DialogueChoice, DialogueChoice];
};

export type RewardItem = {
  id: string;
  kind: RewardKind;
  name: string;
  price: number;
  tokenName: string;
  description: string;
};

export type GirlCharacter = {
  id: GirlId;
  name: string;
  handle: string;
  personality: string;
  bio: string;
  unlockPrice: number;
  unlockRequirement: string;
  palette: {
    main: string;
    soft: string;
    ink: string;
  };
  chatScenes: ChatScene[];
  rewards: RewardItem[];
};

export type InventoryToken = {
  id: string;
  girlId: GirlId;
  rewardId: string;
  name: string;
  kind: RewardKind;
  acquiredAt: string;
};

export type LeaderboardEntry = {
  playerName: string;
  totalSpent: number;
};

export type GirlProgress = {
  chatSceneIndex: number;
  mood: number;
  totalSpent: number;
  talkStreak: number;
  breakUntil: number;
  breakDurationMs: number;
  unlockedRewardIds: string[];
  leaderboard: LeaderboardEntry[];
};

export type PlayerState = {
  playerName: string;
  ageConfirmed: boolean;
  credits: number;
  money: number;
  unlockedGirlIds: GirlId[];
  inventory: InventoryToken[];
  girls: Record<GirlId, GirlProgress>;
};
