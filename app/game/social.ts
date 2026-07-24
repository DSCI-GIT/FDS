import { createDefaultState, girls } from "./data";
import type {
  ChatMessage,
  GirlCharacter,
  GirlProgress,
  MoodLabel,
  PlayerState,
} from "./types";

export const SAVE_KEY = "pink-ledger-social-v4";
export const LEGACY_SAVE_KEYS = [
  "pink-ledger-social-v3",
  "pink-ledger-v2-state",
  "pink-ledger-v1-state",
];

export const AVATARS = [
  { id: "plum-moon", label: "Plum Moon", symbol: "☾", unlocked: true, requirement: "Starter" },
  { id: "rose-ribbon", label: "Rose Ribbon", symbol: "୨୧", unlocked: true, requirement: "Starter" },
  { id: "blue-star", label: "Blue Star", symbol: "✦", unlocked: true, requirement: "Starter" },
  { id: "pearl-heart", label: "Pearl Heart", symbol: "♡", unlocked: false, requirement: "Collect 3 art cards" },
  { id: "arcade-crown", label: "Arcade Crown", symbol: "♕", unlocked: false, requirement: "Meet Runa" },
  { id: "artist-avatar", label: "Custom portrait", symbol: "✎", unlocked: false, requirement: "Artist commission" },
] as const;

export const BANNERS = [
  { id: "blush-clouds", label: "Blush Clouds", unlocked: true },
  { id: "lavender-dusk", label: "Lavender Dusk", unlocked: true },
  { id: "soft-sky", label: "Soft Sky", unlocked: true },
  { id: "midnight-arcade", label: "Midnight Arcade", unlocked: false },
  { id: "artist-banner", label: "Custom banner", unlocked: false },
] as const;

export type InteractionSignal = {
  tone: "positive" | "neutral" | "negative";
  moodDelta: number;
  boredomDelta: number;
  familiarityDelta: number;
  topic: string;
  reason: string;
};

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export function migratePlayerState(saved: Partial<PlayerState> | null): PlayerState {
  const base = createDefaultState();
  if (!saved) return base;

  const merged = {
    ...base,
    ...saved,
    schemaVersion: 4,
    profile: {
      ...base.profile,
      ...(saved.profile ?? {}),
      ownedAvatarIds: Array.isArray(saved.profile?.ownedAvatarIds)
        ? saved.profile.ownedAvatarIds
        : base.profile.ownedAvatarIds,
      ownedBannerIds: Array.isArray(saved.profile?.ownedBannerIds)
        ? saved.profile.ownedBannerIds
        : base.profile.ownedBannerIds,
    },
    unlockedGirlIds: Array.from(new Set(["kiyo", "mimi", ...(saved.unlockedGirlIds ?? [])])),
    inventory: Array.isArray(saved.inventory) ? saved.inventory : [],
    likedPostIds: Array.isArray(saved.likedPostIds) ? saved.likedPostIds : [],
    bookmarkedPostIds: Array.isArray(saved.bookmarkedPostIds) ? saved.bookmarkedPostIds : [],
    notifications: Array.isArray(saved.notifications) ? saved.notifications : base.notifications,
    activity: Array.isArray(saved.activity) ? saved.activity : [],
    artistRequests: Array.isArray(saved.artistRequests) ? saved.artistRequests : [],
    placeReminders: Array.isArray(saved.placeReminders) ? saved.placeReminders : [],
    girls: clone(base.girls),
  } as PlayerState;

  for (const girl of girls) {
    merged.girls[girl.id] = {
      ...base.girls[girl.id],
      ...(saved.girls?.[girl.id] ?? {}),
      recentTopics: Array.isArray(saved.girls?.[girl.id]?.recentTopics)
        ? saved.girls[girl.id].recentTopics
        : [],
      aiMessages: Array.isArray(saved.girls?.[girl.id]?.aiMessages)
        ? saved.girls[girl.id].aiMessages
        : [],
    };
  }

  return merged;
}

export function loadPlayerState(): PlayerState {
  if (typeof window === "undefined") return createDefaultState();
  for (const key of [SAVE_KEY, ...LEGACY_SAVE_KEYS]) {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) return migratePlayerState(JSON.parse(raw) as Partial<PlayerState>);
    } catch {
      // Continue through compatible save keys.
    }
  }
  return createDefaultState();
}

function containsAny(message: string, phrases: string[]) {
  return phrases.some((phrase) =>
    phrase
      .toLowerCase()
      .split(/\W+/)
      .filter((word) => word.length > 3)
      .some((word) => message.includes(word)),
  );
}

export function evaluateInteraction(
  girl: GirlCharacter,
  progress: Pick<GirlProgress, "recentTopics" | "boredom" | "mood">,
  rawMessage: string,
): InteractionSignal {
  const message = rawMessage.trim().toLowerCase();
  const words = message.split(/\s+/).filter(Boolean);
  const boundaryViolation =
    /\b(reply now|answer me|real name|phone number|address|contact me|you owe me|send me|give me private)\b/.test(message);
  const interestMatch = containsAny(message, [
    ...girl.conversation.interests,
    ...girl.conversation.preferredTopics,
  ]);
  const genericPraise = /\b(pretty|hot|beautiful|cute)\b/.test(message) && words.length < 8;
  const repeated = progress.recentTopics.some((topic) => topic && message.includes(topic));
  const thoughtful = words.length >= 9 && (interestMatch || message.includes("?"));

  const topic =
    [...girl.conversation.interests, ...girl.conversation.preferredTopics]
      .flatMap((item) => item.toLowerCase().split(/\W+/))
      .find((word) => word.length > 3 && message.includes(word)) ??
    words.find((word) => word.length > 5) ??
    "conversation";

  if (boundaryViolation) {
    return {
      tone: "negative",
      moodDelta: -14,
      boredomDelta: 16,
      familiarityDelta: -9,
      topic,
      reason: "A stated boundary was ignored.",
    };
  }
  if (repeated || genericPraise) {
    return {
      tone: "negative",
      moodDelta: -5,
      boredomDelta: 12,
      familiarityDelta: -2,
      topic,
      reason: repeated ? "The conversation repeated an exhausted topic." : "The message was too generic.",
    };
  }
  if (thoughtful) {
    return {
      tone: "positive",
      moodDelta: 8,
      boredomDelta: -10,
      familiarityDelta: 6,
      topic,
      reason: "The reply was relevant, specific and attentive.",
    };
  }
  return {
    tone: "neutral",
    moodDelta: 1,
    boredomDelta: 2,
    familiarityDelta: 1,
    topic,
    reason: "The exchange was acceptable but did not reveal much.",
  };
}

export function applyInteraction(progress: GirlProgress, signal: InteractionSignal): GirlProgress {
  return {
    ...progress,
    mood: Math.max(0, Math.min(100, progress.mood + signal.moodDelta)),
    boredom: Math.max(0, Math.min(100, progress.boredom + signal.boredomDelta)),
    familiarity: Math.max(0, Math.min(100, progress.familiarity + signal.familiarityDelta)),
    recentTopics: [signal.topic, ...progress.recentTopics.filter((topic) => topic !== signal.topic)].slice(0, 6),
    breakUntil:
      signal.tone === "negative" && progress.mood + signal.moodDelta < 18
        ? Date.now() + progress.breakDurationMs
        : progress.breakUntil,
  };
}

export function getMoodLabel(progress: GirlProgress): MoodLabel {
  if (progress.breakUntil > Date.now()) return "taking-space";
  if (progress.boredom >= 72) return "bored";
  if (progress.mood >= 82 && progress.familiarity >= 45) return "excited";
  if (progress.mood >= 62) return "interested";
  return "curious";
}

export function buildCharacterPrompt(
  girl: GirlCharacter,
  progress: GirlProgress,
  playerName: string,
  messages: ChatMessage[],
) {
  const recent = messages.slice(-12);
  const system = [
    `You are ${girl.name}, a fictional adult character inside the fictional Pink Ledger game.`,
    `Public persona: ${girl.conversation.publicPersona}`,
    `Private persona: ${girl.conversation.privatePersona}`,
    `Voice: ${girl.conversation.voice}`,
    `Interests: ${girl.conversation.interests.join(", ")}.`,
    `Dislikes: ${girl.conversation.dislikes.join(", ")}.`,
    `Boundaries: ${girl.conversation.boundaries.join("; ")}.`,
    `Current mood is ${progress.mood}/100, boredom is ${progress.boredom}/100, and familiarity is ${progress.familiarity}/100.`,
    progress.conversationSummary ? `Conversation memory: ${progress.conversationSummary}` : "",
    `The player is called ${playerName}. Reply naturally in 1-3 short paragraphs and stay in character.`,
    "Never claim to be a real person. Never request real-world contact, personal data, financial details, payments, or off-platform contact.",
    "Never grant rewards, currency, private access, room objects, commissions, or other game-state changes. The deterministic game system owns all progression.",
    "Respect consent and boundaries. If boredom is high, be brief or ask for a fresh topic. If taking space, state that clearly.",
  ]
    .filter(Boolean)
    .join("\n");

  return [
    { role: "system" as const, content: system },
    ...recent.map((message) => ({
      role: message.role === "player" ? ("user" as const) : ("assistant" as const),
      content: message.content,
    })),
  ];
}

