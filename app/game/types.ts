export type GirlId = "kiyo" | "mimi" | "runa";

export type RewardKind = "accessory" | "makeup" | "outfit";
export type VisualChangeKind = RewardKind | "room" | "hair";

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
  clue: string;
};

export type VisualChange = {
  id: string;
  kind: VisualChangeKind;
  name: string;
  description: string;
  clue: string;
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
  visualChanges: VisualChange[];
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
  creditsEarned?: number;
};

export type PendingSpendEvent = {
  id: string;
  rewardId: string;
  sourcePlayerName: string;
  sourceIsRival: boolean;
  amount: number;
  changeIds: string[];
  createdAt: number;
};

export type PendingDemandEvent = {
  id: string;
  amount: number;
  tone: "attention" | "humiliation" | "obedience" | "praise";
  message: string;
  createdAt: number;
};

export type GirlProgress = {
  chatSceneIndex: number;
  mood: number;
  totalSpent: number;
  talkStreak: number;
  breakUntil: number;
  breakDurationMs: number;
  pendingTributes: number;
  nextSpendAt: number;
  pendingSpendEvent: PendingSpendEvent | null;
  pendingDemand: PendingDemandEvent | null;
  activeChangeIds: string[];
  unlockedRewardIds: string[];
  leaderboard: LeaderboardEntry[];
};

export type PlayerState = {
  playerName: string;
  ageConfirmed: boolean;
  avatarIcon: string;
  credits: number;
  money: number;
  finSubStyle: string;
  questionnaireComplete: boolean;
  lastSavedAt: number;
  lastDemandAt: number;
  unlockedGirlIds: GirlId[];
  inventory: InventoryToken[];
  girls: Record<GirlId, GirlProgress>;
};
