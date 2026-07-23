import type { GirlCharacter, GirlId, LeaderboardEntry, PlayerState } from "./types";

export const EXCHANGE_RATE = {
  credits: 10,
  money: 50,
};

export const girls: GirlCharacter[] = [
  {
    id: "kiyo",
    name: "Kiyo",
    handle: "softboss",
    personality: "Sweet-faced, bossy, and impossible to impress by accident.",
    bio: "A pink-room princess who treats praise like rent and keeps receipts on every tribute.",
    palette: {
      main: "#f47aae",
      soft: "#ffe0ef",
      ink: "#6e3155",
    },
    chatScenes: [
      {
        id: "kiyo-hello",
        prompt: "Kiyo tilts her head from her glittery desk chair. \"You came back. Cute. Tell me why I should answer.\"",
        choices: [
          {
            id: "kiyo-hello-a",
            text: "Because making you smile is the best use of my credits.",
            liked: true,
            creditReward: 12,
            reply: "That was almost graceful. I will allow you to keep trying.",
          },
          {
            id: "kiyo-hello-b",
            text: "I just wanted to see what you were doing.",
            liked: false,
            creditReward: 0,
            reply: "Boring answer. Curiosity is not a tribute.",
          },
          {
            id: "kiyo-hello-c",
            text: "I was hoping you would notice me.",
            liked: true,
            creditReward: 8,
            reply: "Honest and a little pathetic. Adorable enough.",
          },
          {
            id: "kiyo-hello-d",
            text: "You should answer because I asked nicely.",
            liked: false,
            creditReward: 0,
            reply: "Nicely is the bare minimum. I collect more than minimums.",
          },
        ],
      },
      {
        id: "kiyo-wishlist",
        prompt: "\"My vanity looks empty today. Tragic, right?\" Kiyo taps a nail on the screen.",
        choices: [
          {
            id: "kiyo-wishlist-a",
            text: "A tragedy I can help fund.",
            liked: true,
            creditReward: 14,
            reply: "There it is. Useful instincts.",
          },
          {
            id: "kiyo-wishlist-b",
            text: "It looks fine to me.",
            liked: false,
            creditReward: 0,
            reply: "Fine is not a word I asked you to bring into my room.",
          },
          {
            id: "kiyo-wishlist-c",
            text: "Tell me what shade belongs there.",
            liked: true,
            creditReward: 10,
            reply: "Soft pink gloss. You do listen sometimes.",
          },
          {
            id: "kiyo-wishlist-d",
            text: "Maybe later.",
            liked: false,
            creditReward: 0,
            reply: "Later is where forgettable people live.",
          },
        ],
      },
    ],
    rewards: [
      {
        id: "kiyo-bow",
        kind: "accessory",
        name: "Ribbon Headband",
        price: 120,
        tokenName: "Kiyo Ribbon Receipt",
        description: "A glossy bow for her sketch avatar and a token for your inventory.",
      },
      {
        id: "kiyo-gloss",
        kind: "makeup",
        name: "Sugar Gloss",
        price: 180,
        tokenName: "Kiyo Gloss Stamp",
        description: "A soft lip tint that marks your tribute history.",
      },
      {
        id: "kiyo-dress",
        kind: "outfit",
        name: "Cloud Knit Set",
        price: 260,
        tokenName: "Kiyo Outfit Card",
        description: "A cozy pink outfit layer for her portrait.",
      },
    ],
  },
  {
    id: "mimi",
    name: "Mimi",
    handle: "laceledger",
    personality: "Playful, elegant, and laser-focused on who pays attention.",
    bio: "A lace-and-lipgloss strategist who rewards devotion with tiny, deliberate upgrades.",
    palette: {
      main: "#d978c5",
      soft: "#f7ddff",
      ink: "#553064",
    },
    chatScenes: [
      {
        id: "mimi-attention",
        prompt: "Mimi folds her arms. \"Quick. What detail changed since last time?\"",
        choices: [
          {
            id: "mimi-attention-a",
            text: "Your nails. Softer shade, sharper attitude.",
            liked: true,
            creditReward: 14,
            reply: "Good. You may survive the conversation.",
          },
          {
            id: "mimi-attention-b",
            text: "The room is pinker?",
            liked: false,
            creditReward: 0,
            reply: "A guess dressed up as an answer. No.",
          },
          {
            id: "mimi-attention-c",
            text: "Your ribbon moved to the other side.",
            liked: true,
            creditReward: 10,
            reply: "Observant enough to be useful.",
          },
          {
            id: "mimi-attention-d",
            text: "I was looking at your smile.",
            liked: false,
            creditReward: 0,
            reply: "Flattery without detail is just fog.",
          },
        ],
      },
      {
        id: "mimi-ledger",
        prompt: "\"My leaderboard is looking competitive. Would you rather be remembered or ignored?\"",
        choices: [
          {
            id: "mimi-ledger-a",
            text: "Remembered, ranked, and useful.",
            liked: true,
            creditReward: 12,
            reply: "That sentence can stay.",
          },
          {
            id: "mimi-ledger-b",
            text: "Ignored sounds cheaper.",
            liked: false,
            creditReward: 0,
            reply: "Cheap is not a personality I reward.",
          },
          {
            id: "mimi-ledger-c",
            text: "Tell me where I belong on the list.",
            liked: true,
            creditReward: 8,
            reply: "Below me. Above excuses.",
          },
          {
            id: "mimi-ledger-d",
            text: "Leaderboards are not my thing.",
            liked: false,
            creditReward: 0,
            reply: "Then learn to enjoy being decorative.",
          },
        ],
      },
    ],
    rewards: [
      {
        id: "mimi-choker",
        kind: "accessory",
        name: "Pearl Choker",
        price: 140,
        tokenName: "Mimi Pearl Token",
        description: "A neat accessory layer with a prim little receipt.",
      },
      {
        id: "mimi-blush",
        kind: "makeup",
        name: "Petal Blush",
        price: 190,
        tokenName: "Mimi Blush Compact",
        description: "A warm cheek tint for her vanity set.",
      },
      {
        id: "mimi-cardigan",
        kind: "outfit",
        name: "Lace Cardigan",
        price: 280,
        tokenName: "Mimi Lace Card",
        description: "A soft outfit reward for steady tribute.",
      },
    ],
  },
  {
    id: "runa",
    name: "Runa",
    handle: "glitchglam",
    personality: "Sleepy, smug, and secretly delighted when you keep up.",
    bio: "A cute gamer princess with a plush chair, a sharp tongue, and a wishlist that updates fast.",
    palette: {
      main: "#ff86a8",
      soft: "#ffe5f1",
      ink: "#623348",
    },
    chatScenes: [
      {
        id: "runa-login",
        prompt: "Runa looks up from her handheld. \"You interrupted my queue. Make it worth the pause.\"",
        choices: [
          {
            id: "runa-login-a",
            text: "Pause accepted. Your attention is worth the fee.",
            liked: true,
            creditReward: 12,
            reply: "Correct. A little dramatic, but correct.",
          },
          {
            id: "runa-login-b",
            text: "What game are you playing?",
            liked: false,
            creditReward: 0,
            reply: "Conversation is not loot by itself.",
          },
          {
            id: "runa-login-c",
            text: "I brought tribute energy and no excuses.",
            liked: true,
            creditReward: 10,
            reply: "Finally, someone reads the room.",
          },
          {
            id: "runa-login-d",
            text: "You can go back to your game.",
            liked: false,
            creditReward: 0,
            reply: "I was going to. You made that easy.",
          },
        ],
      },
      {
        id: "runa-drop",
        prompt: "\"Rare drop check. What should I buy myself when you stop hesitating?\"",
        choices: [
          {
            id: "runa-drop-a",
            text: "The headset. It belongs in your victory pose.",
            liked: true,
            creditReward: 14,
            reply: "Excellent taste. Suspiciously useful.",
          },
          {
            id: "runa-drop-b",
            text: "Whatever is cheapest.",
            liked: false,
            creditReward: 0,
            reply: "That word should be banned from my chat.",
          },
          {
            id: "runa-drop-c",
            text: "The hoodie, then the gloss. Priority matters.",
            liked: true,
            creditReward: 10,
            reply: "A strategy player. Cute.",
          },
          {
            id: "runa-drop-d",
            text: "I cannot decide.",
            liked: false,
            creditReward: 0,
            reply: "Then I decide you need more credits.",
          },
        ],
      },
    ],
    rewards: [
      {
        id: "runa-headset",
        kind: "accessory",
        name: "Kitten Headset",
        price: 130,
        tokenName: "Runa Headset Token",
        description: "A cute gamer accessory for her avatar layer.",
      },
      {
        id: "runa-liner",
        kind: "makeup",
        name: "Spark Liner",
        price: 200,
        tokenName: "Runa Liner Stamp",
        description: "A bright eye detail for her sketch face.",
      },
      {
        id: "runa-hoodie",
        kind: "outfit",
        name: "Prize Hoodie",
        price: 300,
        tokenName: "Runa Hoodie Card",
        description: "A cozy outfit unlock for top-tier tribute.",
      },
    ],
  },
];

export const rivalLeaderboards: Record<GirlId, LeaderboardEntry[]> = {
  kiyo: [
    { playerName: "lacefund", totalSpent: 420 },
    { playerName: "pinktax", totalSpent: 260 },
    { playerName: "softserve", totalSpent: 90 },
  ],
  mimi: [
    { playerName: "ledgerpet", totalSpent: 390 },
    { playerName: "ribbonrun", totalSpent: 240 },
    { playerName: "glossnote", totalSpent: 110 },
  ],
  runa: [
    { playerName: "queueking", totalSpent: 460 },
    { playerName: "dropwatch", totalSpent: 230 },
    { playerName: "plushcoin", totalSpent: 80 },
  ],
};

export function createDefaultState(): PlayerState {
  return {
    playerName: "",
    ageConfirmed: false,
    credits: 20,
    money: 150,
    inventory: [],
    girls: girls.reduce((accumulator, girl) => {
      accumulator[girl.id] = {
        chatSceneIndex: 0,
        mood: 50,
        totalSpent: 0,
        unlockedRewardIds: [],
        leaderboard: rivalLeaderboards[girl.id],
      };
      return accumulator;
    }, {} as PlayerState["girls"]),
  };
}
