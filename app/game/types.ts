export type GirlId = "kiyo" | "mimi" | "runa";
export type ChatMode = "scripted" | "ai";
export type ChatRole = "player" | "girl";
export type MoodLabel = "taking-space" | "bored" | "curious" | "interested" | "excited";

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
  conversation: GirlConversationProfile;
};

export type GirlConversationProfile = {
  publicPersona: string;
  privatePersona: string;
  voice: string;
  interests: string[];
  dislikes: string[];
  preferredTopics: string[];
  boredomTriggers: string[];
  boundaries: string[];
};

export type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: number;
  mode: ChatMode;
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
  boredom: number;
  familiarity: number;
  recentTopics: string[];
  conversationSummary: string;
  chatMode: ChatMode;
  aiMessages: ChatMessage[];
};

export type PlayerProfile = {
  complete: boolean;
  handle: string;
  bio: string;
  tagline: string;
  avatarId: string;
  bannerId: string;
  accent: string;
  ownedAvatarIds: string[];
  ownedBannerIds: string[];
};

export type SocialNotification = {
  id: string;
  title: string;
  body: string;
  createdAt: number;
  read: boolean;
  girlId?: GirlId;
  destination?: "messages" | "profile" | "collection" | "studio" | "places";
};

export type PlayerActivity = {
  id: string;
  label: string;
  detail: string;
  createdAt: number;
};

export type ArtistRequestStatus =
  | "Draft"
  | "Submitted"
  | "Awaiting artist review"
  | "Approved"
  | "Completed";

export type ArtistRequest = {
  id: string;
  character: string;
  format: string;
  mood: string;
  palette: string;
  brief: string;
  status: ArtistRequestStatus;
  createdAt: number;
};

export type PlayerState = {
  schemaVersion: number;
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
  profile: PlayerProfile;
  likedPostIds: string[];
  bookmarkedPostIds: string[];
  notifications: SocialNotification[];
  activity: PlayerActivity[];
  artistRequests: ArtistRequest[];
  placeReminders: string[];
  aiChatAcknowledged: boolean;
};
