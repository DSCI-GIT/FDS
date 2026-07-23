import type { GirlCharacter, GirlId, LeaderboardEntry, PlayerState } from "./types";

export const EXCHANGE_RATE = {
  credits: 10,
  money: 50,
};

export const TRIBUTE_AMOUNTS = [50, 100, 150, 250, 500];

function scene(
  id: string,
  threadTitle: string,
  prompt: string,
  likedA: string,
  likedB: string,
  dislikedA: string,
  dislikedB: string,
) {
  return {
    id,
    threadTitle,
    prompt,
    choices: [
      {
        id: `${id}-a`,
        text: likedA,
        liked: true,
        creditReward: 12,
        reply: "Good. You followed the thread and made yourself useful.",
      },
      {
        id: `${id}-b`,
        text: dislikedA,
        liked: false,
        creditReward: 0,
        reply: "No. That answer wanders off like you forgot who has the spotlight.",
      },
      {
        id: `${id}-c`,
        text: likedB,
        liked: true,
        creditReward: 10,
        reply: "Cute. Not perfect, but I can work with devotion that learns.",
      },
      {
        id: `${id}-d`,
        text: dislikedB,
        liked: false,
        creditReward: 0,
        reply: "That was almost noise. Try listening before trying to be charming.",
      },
    ] as const,
  };
}

const kiyoOngoingScenes = [
  scene(
    "kiyo-thread-01",
    "Kiyo's vanity list",
    "Kiyo sends a blurry photo of her desk. \"Look carefully. What part of my little kingdom needs upgrading first?\"",
    "The vanity corner. It deserves something glossy.",
    "The bow drawer. It should look as spoiled as you do.",
    "The chair maybe? I cannot really tell.",
    "Nothing. It already looks good enough.",
  ),
  scene(
    "kiyo-thread-02",
    "Kiyo's vanity list",
    "\"I found three things I like. You get one chance to sound grateful I told you.\"",
    "Thank you for letting me fund the prettiest option.",
    "Pick the one that makes you smile when you see my name.",
    "Are they expensive?",
    "Do you really need another thing?",
  ),
  scene(
    "kiyo-thread-03",
    "Kiyo's vanity list",
    "\"Imagine I unbox something cute. What should your job be while I do it?\"",
    "Watching quietly and remembering who made it happen.",
    "Complimenting the choice without trying to own it.",
    "Asking if I get something too.",
    "Telling you what I would have bought instead.",
  ),
  scene(
    "kiyo-thread-04",
    "Kiyo's vanity list",
    "Kiyo taps her cheek. \"If I reward you with a photo, what do you say first?\"",
    "That it suits you because you chose it.",
    "That the receipt was worth being noticed.",
    "Finally.",
    "I would ask for another angle.",
  ),
];

const mimiOngoingScenes = [
  scene(
    "mimi-thread-01",
    "Mimi's receipt game",
    "Mimi opens her notes app. \"I am ranking useful people today. What belongs beside your name?\"",
    "Consistent, attentive, and easy to invoice.",
    "Improving. Still below you, obviously.",
    "Funny, charming, unpaid.",
    "Whatever makes me look best.",
  ),
  scene(
    "mimi-thread-02",
    "Mimi's receipt game",
    "\"A proper tribute should feel like punctuation. Which kind are you?\"",
    "A period. Clear, finished, no excuses.",
    "An exclamation mark when you want drama.",
    "A question mark because I need to think.",
    "A comma. Small but frequent.",
  ),
  scene(
    "mimi-thread-03",
    "Mimi's receipt game",
    "Mimi smiles at her reflection. \"If I buy something with your money, who gets credit?\"",
    "You do. I only get the honor of being useful.",
    "Your taste gets credit. My wallet just behaved.",
    "Me, because I paid.",
    "Both of us equally.",
  ),
  scene(
    "mimi-thread-04",
    "Mimi's receipt game",
    "\"My list has accessories, makeup, and outfits. What would a smart admirer notice?\"",
    "That you choose the reward, not me.",
    "That every item is another reason to keep earning.",
    "The cheapest one.",
    "The one I personally like best.",
  ),
];

const runaOngoingScenes = [
  scene(
    "runa-thread-01",
    "Runa's drop table",
    "Runa opens a tiny wishlist window. \"Rare drop table updated. How do you improve your odds?\"",
    "By sending tribute and letting you roll.",
    "By earning credits until my timing is useful.",
    "By asking for a discount.",
    "By guessing what you want.",
  ),
  scene(
    "runa-thread-02",
    "Runa's drop table",
    "\"If I pick a gift after you tribute, what is your reaction supposed to be?\"",
    "Delighted. The choice is the reward.",
    "Proud that my tribute became your upgrade.",
    "Confused because I wanted to pick.",
    "Annoyed if it is not my favorite.",
  ),
  scene(
    "runa-thread-03",
    "Runa's drop table",
    "Runa yawns. \"My chat log says you like being useful. Confirm or deny?\"",
    "Confirmed, especially when you notice.",
    "Confirmed, and I can do better.",
    "Deny. I am here to win.",
    "Maybe, if there is a prize.",
  ),
  scene(
    "runa-thread-04",
    "Runa's drop table",
    "\"Final check before I buy something cute. What should I remember about you?\"",
    "That I learned the loop: earn, exchange, tribute.",
    "That your upgrades matter more than my bragging.",
    "That I deserve a big reward.",
    "That I am still deciding if this is worth it.",
  ),
];

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
        threadTitle: "Kiyo's vanity list",
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
        threadTitle: "Kiyo's vanity list",
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
      ...kiyoOngoingScenes,
    ],
    rewards: [
      {
        id: "kiyo-bow",
        kind: "accessory",
        name: "Ribbon Headband",
        price: 50,
        tokenName: "Kiyo Ribbon Receipt",
        description: "A glossy bow for her sketch avatar and a token for your inventory.",
      },
      {
        id: "kiyo-gloss",
        kind: "makeup",
        name: "Sugar Gloss",
        price: 100,
        tokenName: "Kiyo Gloss Stamp",
        description: "A soft lip tint that marks your tribute history.",
      },
      {
        id: "kiyo-dress",
        kind: "outfit",
        name: "Cloud Knit Set",
        price: 150,
        tokenName: "Kiyo Outfit Card",
        description: "A cozy pink outfit layer for her portrait.",
      },
      {
        id: "kiyo-lamp",
        kind: "accessory",
        name: "Heart Desk Lamp",
        price: 250,
        tokenName: "Kiyo Lamp Token",
        description: "A soft room upgrade she picked from her vanity list.",
      },
      {
        id: "kiyo-coat",
        kind: "outfit",
        name: "Ribbon Trim Coat",
        price: 500,
        tokenName: "Kiyo Coat Card",
        description: "A bigger outfit reveal for serious tribute energy.",
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
        threadTitle: "Mimi's receipt game",
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
        threadTitle: "Mimi's receipt game",
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
      ...mimiOngoingScenes,
    ],
    rewards: [
      {
        id: "mimi-choker",
        kind: "accessory",
        name: "Pearl Choker",
        price: 50,
        tokenName: "Mimi Pearl Token",
        description: "A neat accessory layer with a prim little receipt.",
      },
      {
        id: "mimi-blush",
        kind: "makeup",
        name: "Petal Blush",
        price: 100,
        tokenName: "Mimi Blush Compact",
        description: "A warm cheek tint for her vanity set.",
      },
      {
        id: "mimi-cardigan",
        kind: "outfit",
        name: "Lace Cardigan",
        price: 150,
        tokenName: "Mimi Lace Card",
        description: "A soft outfit reward for steady tribute.",
      },
      {
        id: "mimi-mirror",
        kind: "accessory",
        name: "Pearl Hand Mirror",
        price: 250,
        tokenName: "Mimi Mirror Token",
        description: "A vanity prop she chose for checking every detail.",
      },
      {
        id: "mimi-set",
        kind: "outfit",
        name: "Velvet Ribbon Set",
        price: 500,
        tokenName: "Mimi Velvet Card",
        description: "A full look chosen from her private receipt game.",
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
        threadTitle: "Runa's drop table",
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
        threadTitle: "Runa's drop table",
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
      ...runaOngoingScenes,
    ],
    rewards: [
      {
        id: "runa-headset",
        kind: "accessory",
        name: "Kitten Headset",
        price: 50,
        tokenName: "Runa Headset Token",
        description: "A cute gamer accessory for her avatar layer.",
      },
      {
        id: "runa-liner",
        kind: "makeup",
        name: "Spark Liner",
        price: 100,
        tokenName: "Runa Liner Stamp",
        description: "A bright eye detail for her sketch face.",
      },
      {
        id: "runa-hoodie",
        kind: "outfit",
        name: "Prize Hoodie",
        price: 150,
        tokenName: "Runa Hoodie Card",
        description: "A cozy outfit unlock for top-tier tribute.",
      },
      {
        id: "runa-controller",
        kind: "accessory",
        name: "Pink Pro Controller",
        price: 250,
        tokenName: "Runa Controller Token",
        description: "A desk prop she picked for her next queue.",
      },
      {
        id: "runa-jacket",
        kind: "outfit",
        name: "Arcade Bomber Jacket",
        price: 500,
        tokenName: "Runa Jacket Card",
        description: "A bigger outfit reveal from her rare drop table.",
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
