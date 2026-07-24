"use client";

import { useEffect, useMemo, useState } from "react";
import { EXCHANGE_RATE, TRIBUTE_AMOUNTS, createDefaultState, girls } from "./game/data";
import {
  AVATARS,
  BANNERS,
  LEGACY_SAVE_KEYS,
  SAVE_KEY,
  applyInteraction,
  evaluateInteraction,
  getMoodLabel,
  loadPlayerState,
} from "./game/social";
import {
  WEBLLM_MODEL_ID,
  initializeWebLLM,
  interruptWebLLM,
  streamCharacterReply,
  supportsWebLLM,
  type WebLLMStatus,
} from "./game/webllm";
import type {
  ArtistRequest,
  ChatMessage,
  DialogueChoice,
  GirlCharacter,
  GirlId,
  InventoryToken,
  PlayerState,
  RewardItem,
} from "./game/types";

type Screen = "home" | "discover" | "messages" | "collection" | "places" | "studio" | "profile";
type ProfileTab = "posts" | "room" | "collection" | "supporters" | "about";
type Notice = { id: string; title: string; body: string; girlId?: GirlId };

const characterArt: Record<GirlId, string> = {
  kiyo: "/art/kiyo-concept.webp",
  mimi: "/art/mimi-concept.webp",
  runa: "/art/runa-concept.webp",
};

const socialPosts = [
  {
    id: "kiyo-room-morning",
    girlId: "kiyo" as GirlId,
    visibility: "public",
    type: "room",
    image: "/art/room-concept.webp",
    time: "18 min",
    caption: "The shelves are waiting for better decisions. Yours, preferably.",
    likes: 284,
    comments: 31,
  },
  {
    id: "mimi-soft-launch",
    girlId: "mimi" as GirlId,
    visibility: "public",
    type: "portrait",
    image: "/art/mimi-concept.webp",
    time: "1 hr",
    caption: "A soft look still requires sharp attention.",
    likes: 417,
    comments: 46,
  },
  {
    id: "runa-queue",
    girlId: "runa" as GirlId,
    visibility: "public",
    type: "portrait",
    image: "/art/runa-concept.webp",
    time: "3 hr",
    caption: "Public queue. Private drops are better.",
    likes: 526,
    comments: 63,
  },
  {
    id: "kiyo-artist-drop",
    girlId: "kiyo" as GirlId,
    visibility: "private",
    type: "collection",
    image: "/art/reward-collection.webp",
    time: "Yesterday",
    caption: "Three little upgrades. Only one belongs on my desk first.",
    likes: 192,
    comments: 22,
  },
];

const navItems: { id: Screen; label: string; icon: string }[] = [
  { id: "home", label: "Feed", icon: "⌂" },
  { id: "discover", label: "Discover", icon: "✦" },
  { id: "messages", label: "Messages", icon: "♡" },
  { id: "places", label: "Places", icon: "◇" },
  { id: "profile", label: "Profile", icon: "◌" },
];

const formatName: Record<string, string> = {
  portrait: "Portrait",
  avatar: "Profile avatar",
  wallpaper: "Wallpaper",
  outfit: "Outfit concept",
  scene: "Full scene",
  room: "Room item",
  banner: "Profile banner",
  frame: "Avatar frame",
};

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function girlById(id: GirlId): GirlCharacter {
  return girls.find((girl) => girl.id === id) ?? girls[0];
}

function rewardById(girl: GirlCharacter, rewardId: string): RewardItem | undefined {
  return girl.rewards.find((reward) => reward.id === rewardId);
}

function profileStatus(girl: GirlCharacter, state: PlayerState) {
  if (girl.id === "kiyo" || girl.id === "mimi") return "Open contact";
  return state.unlockedGirlIds.includes(girl.id) ? "Private access" : "Public profile";
}

function Portrait({
  girl,
  className = "",
  alt,
}: {
  girl: GirlCharacter;
  className?: string;
  alt?: string;
}) {
  return (
    <img
      className={`character-art ${className}`}
      src={characterArt[girl.id]}
      alt={alt ?? `Illustrated portrait of ${girl.name}, an adult fictional character`}
    />
  );
}

function RoomScene({
  girl,
  state,
  pendingRewardId,
  compact = false,
}: {
  girl: GirlCharacter;
  state: PlayerState;
  pendingRewardId?: string;
  compact?: boolean;
}) {
  const progress = state.girls[girl.id];
  const visible = Array.from(
    new Set([...(progress.activeChangeIds ?? []), ...(progress.unlockedRewardIds ?? []), pendingRewardId ?? ""]),
  ).filter(Boolean);
  const placements = [
    { left: 70, top: 30, symbol: "♨", label: "vanity lamp" },
    { left: 84, top: 41, symbol: "◈", label: "shelf collectible" },
    { left: 64, top: 60, symbol: "♕", label: "perfume bottle" },
    { left: 76, top: 63, symbol: "♡", label: "ribbon box" },
    { left: 55, top: 45, symbol: "✦", label: "framed art" },
  ];

  return (
    <figure className={`room-scene ${compact ? "compact" : ""}`}>
      <img src="/art/room-concept.webp" alt={`${girl.name}'s approved room concept with open display areas`} />
      {visible.slice(0, placements.length).map((rewardId, index) => {
        const placement = placements[index];
        const reward = rewardById(girl, rewardId);
        const isNew = rewardId === pendingRewardId;
        return (
          <button
            className={`room-object ${isNew ? "unobserved" : ""}`}
            key={`${rewardId}-${index}`}
            style={{ left: `${placement.left}%`, top: `${placement.top}%` }}
            aria-label={isNew ? "An unobserved room change" : reward?.name ?? placement.label}
            title={isNew ? "Something changed…" : reward?.name ?? placement.label}
          >
            {isNew ? "?" : placement.symbol}
          </button>
        );
      })}
      <figcaption>
        <span>{girl.name}&apos;s room</span>
        <small>{visible.length ? `${visible.length} collected detail${visible.length === 1 ? "" : "s"}` : "A clean beginning"}</small>
      </figcaption>
    </figure>
  );
}

export default function Home() {
  const [state, setState] = useState<PlayerState>(() => createDefaultState());
  const [ready, setReady] = useState(false);
  const [screen, setScreen] = useState<Screen>("home");
  const [selectedGirlId, setSelectedGirlId] = useState<GirlId>("kiyo");
  const [profileTab, setProfileTab] = useState<ProfileTab>("posts");
  const [lastPlayerLine, setLastPlayerLine] = useState("");
  const [lastReply, setLastReply] = useState("");
  const [feedback, setFeedback] = useState("Choose a reply. Attentive answers earn credits.");
  const [notice, setNotice] = useState<Notice | null>(null);
  const [confirm, setConfirm] = useState<{ type: "tribute" | "access"; amount: number } | null>(null);
  const [studioStep, setStudioStep] = useState(1);
  const [commission, setCommission] = useState<ArtistRequest>({
    id: "",
    character: "Kiyo",
    format: "portrait",
    mood: "Soft confidence",
    palette: "Blush & cream",
    brief: "",
    status: "Draft",
    createdAt: 0,
  });
  const [profileStep, setProfileStep] = useState(1);
  const [profileDraft, setProfileDraft] = useState({
    displayName: "",
    handle: "",
    bio: "",
    tagline: "",
    avatarId: "plum-moon",
    bannerId: "blush-clouds",
    accent: "#c35f85",
  });
  const [editingProfile, setEditingProfile] = useState(false);
  const [discoverQuery, setDiscoverQuery] = useState("");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [aiStatus, setAiStatus] = useState<WebLLMStatus>("idle");
  const [aiProgress, setAiProgress] = useState(0);
  const [aiProgressText, setAiProgressText] = useState("");
  const [aiDraft, setAiDraft] = useState("");
  const [streamingReply, setStreamingReply] = useState("");

  const selectedGirl = girlById(selectedGirlId);
  const selectedProgress = state.girls[selectedGirlId];
  const unlocked = state.unlockedGirlIds.includes(selectedGirlId);
  const unreadCount = state.notifications.filter((item) => !item.read).length;

  useEffect(() => {
    const loaded = loadPlayerState();
    setState(loaded);
    setProfileDraft({
      displayName: loaded.playerName,
      handle: loaded.profile.handle,
      bio: loaded.profile.bio,
      tagline: loaded.profile.tagline,
      avatarId: loaded.profile.avatarId,
      bannerId: loaded.profile.bannerId,
      accent: loaded.profile.accent,
    });
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(SAVE_KEY, JSON.stringify({ ...state, lastSavedAt: Date.now() }));
  }, [state, ready]);

  useEffect(() => {
    if (!ready) return;
    const timer = window.setInterval(() => {
      setState((current) => {
        let changed = false;
        const next = clone(current);
        for (const girl of girls) {
          const progress = next.girls[girl.id];
          if (
            progress.pendingTributes > 0 &&
            progress.nextSpendAt > 0 &&
            Date.now() >= progress.nextSpendAt &&
            !progress.pendingSpendEvent
          ) {
            const reward =
              girl.rewards.find((item) => !progress.unlockedRewardIds.includes(item.id)) ?? girl.rewards[0];
            progress.pendingSpendEvent = {
              id: `${girl.id}-room-${Date.now()}`,
              rewardId: reward.id,
              sourcePlayerName: next.playerName,
              sourceIsRival: false,
              amount: progress.pendingTributes,
              changeIds: [reward.id],
              createdAt: Date.now(),
            };
            progress.pendingTributes = 0;
            progress.nextSpendAt = 0;
            if (!progress.activeChangeIds.includes(reward.id)) progress.activeChangeIds.push(reward.id);
            next.notifications.unshift({
              id: `room-${girl.id}-${Date.now()}`,
              title: `${girl.name} changed her room`,
              body: "A tribute purchase appeared. Look closely before you guess.",
              createdAt: Date.now(),
              read: false,
              girlId: girl.id,
              destination: "messages",
            });
            changed = true;
            setNotice({
              id: `notice-${Date.now()}`,
              title: `${girl.name} changed her room`,
              body: "A tribute purchase appeared. Look closely before you guess.",
              girlId: girl.id,
            });
          }
        }
        return changed ? next : current;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [ready]);

  const feedPosts = useMemo(
    () => socialPosts,
    [],
  );

  function updateState(mutate: (draft: PlayerState) => void) {
    setState((current) => {
      const next = clone(current);
      mutate(next);
      next.lastSavedAt = Date.now();
      return next;
    });
  }

  function navigate(next: Screen) {
    setScreen(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function openProfile(girlId: GirlId, tab: ProfileTab = "posts") {
    setSelectedGirlId(girlId);
    setProfileTab(tab);
    navigate("discover");
  }

  function openMessages(girlId: GirlId) {
    setSelectedGirlId(girlId);
    setLastReply("");
    setLastPlayerLine("");
    setFeedback("Choose a suggested reply.");
    navigate("messages");
  }

  function exchangeCredits() {
    const bundles = Math.floor(state.credits / EXCHANGE_RATE.credits);
    if (!bundles) return;
    updateState((draft) => {
      draft.credits -= bundles * EXCHANGE_RATE.credits;
      draft.money += bundles * EXCHANGE_RATE.money;
    });
    setNotice({
      id: `exchange-${Date.now()}`,
      title: "Wallet updated",
      body: `${bundles * EXCHANGE_RATE.credits} credits became ${bundles * EXCHANGE_RATE.money} fictional money.`,
    });
  }

  function chooseReply(choice: DialogueChoice) {
    const girl = selectedGirl;
    const signal = evaluateInteraction(girl, selectedProgress, choice.text);
    updateState((draft) => {
      const progress = draft.girls[girl.id];
      draft.credits += choice.creditReward;
      const updated = applyInteraction(progress, {
        ...signal,
        moodDelta: choice.liked ? Math.max(6, signal.moodDelta) : Math.min(-5, signal.moodDelta),
      });
      draft.girls[girl.id] = {
        ...updated,
        talkStreak: progress.talkStreak + 1,
        chatSceneIndex: (progress.chatSceneIndex + 1) % girl.chatScenes.length,
      };
    });
    setLastPlayerLine(choice.text);
    setLastReply(choice.reply);
    setFeedback(
      choice.liked
        ? `Liked · +${choice.creditReward} credits · ${signal.reason}`
        : `She was not impressed · ${signal.reason}`,
    );
  }

  function completeTribute(amount: number) {
    if (state.money < amount) return;
    updateState((draft) => {
      const progress = draft.girls[selectedGirlId];
      draft.money -= amount;
      progress.totalSpent += amount;
      progress.pendingTributes += amount;
      progress.nextSpendAt = Date.now() + 4500;
      progress.mood = Math.min(100, progress.mood + 12);
      const playerRow = progress.leaderboard.find((row) => row.playerName === draft.playerName);
      if (playerRow) playerRow.totalSpent += amount;
      else progress.leaderboard.push({ playerName: draft.playerName, totalSpent: amount });
      draft.activity.unshift({
        id: `tribute-activity-${Date.now()}`,
        label: `Supported ${selectedGirl.name}`,
        detail: `${amount} fictional money entered her pending purse.`,
        createdAt: Date.now(),
      });
      draft.notifications.unshift({
        id: `tribute-notification-${Date.now()}`,
        title: `${selectedGirl.name} received ${amount}`,
        body: "Her room may change after she chooses a purchase.",
        createdAt: Date.now(),
        read: false,
        girlId: selectedGirlId,
        destination: "messages",
      });
    });
    setConfirm(null);
    setNotice({
      id: `tribute-${Date.now()}`,
      title: `${selectedGirl.name} received ${amount}`,
      body: "It is in her pending purse. She decides when it becomes a room purchase.",
      girlId: selectedGirlId,
    });
  }

  function unlockPrivateAccess() {
    if (state.money < selectedGirl.unlockPrice) return;
    updateState((draft) => {
      draft.money -= selectedGirl.unlockPrice;
      if (!draft.unlockedGirlIds.includes(selectedGirlId)) draft.unlockedGirlIds.push(selectedGirlId);
      draft.activity.unshift({
        id: `access-activity-${Date.now()}`,
        label: `Opened ${selectedGirl.name}'s private circle`,
        detail: "Private posts, room, collection and DMs became available.",
        createdAt: Date.now(),
      });
      draft.notifications.unshift({
        id: `access-notification-${Date.now()}`,
        title: `${selectedGirl.name}'s private circle is open`,
        body: "Private posts, room, collection and messages are now available.",
        createdAt: Date.now(),
        read: false,
        girlId: selectedGirlId,
        destination: "profile",
      });
    });
    setConfirm(null);
    setNotice({
      id: `access-${Date.now()}`,
      title: `${selectedGirl.name}'s private circle is open`,
      body: "Private posts, room, collection and messages are now available.",
      girlId: selectedGirlId,
    });
  }

  function guessReward(rewardId: string) {
    const event = selectedProgress.pendingSpendEvent;
    if (!event) return;
    const correct = rewardId === event.rewardId;
    const reward = rewardById(selectedGirl, event.rewardId);
    updateState((draft) => {
      const progress = draft.girls[selectedGirlId];
      if (correct && reward) {
        if (!progress.unlockedRewardIds.includes(reward.id)) progress.unlockedRewardIds.push(reward.id);
        const token: InventoryToken = {
          id: `${selectedGirlId}-${reward.id}-${Date.now()}`,
          girlId: selectedGirlId,
          rewardId: reward.id,
          name: reward.tokenName,
          kind: reward.kind,
          acquiredAt: new Date().toISOString(),
        };
        draft.inventory.unshift(token);
        draft.credits += 20;
        progress.mood = Math.min(100, progress.mood + 15);
        draft.activity.unshift({
          id: `collection-activity-${Date.now()}`,
          label: `Collected ${reward.name}`,
          detail: `${selectedGirl.name}'s room detail was identified correctly.`,
          createdAt: Date.now(),
        });
        draft.notifications.unshift({
          id: `collection-notification-${Date.now()}`,
          title: `${reward.name} added to your collection`,
          body: "Correct observation earned an art card and 20 credits.",
          createdAt: Date.now(),
          read: false,
          girlId: selectedGirlId,
          destination: "collection",
        });
      } else {
        progress.mood = Math.max(0, progress.mood - 5);
      }
      progress.pendingSpendEvent = null;
    });
    setLastPlayerLine(correct ? `I noticed the ${reward?.name}.` : "I missed the new detail.");
    setLastReply(
      correct
        ? `${selectedGirl.name}: Good. You actually looked. I added the art card to your collection.`
        : `${selectedGirl.name}: The room changed and you still guessed wrong. Look closer next time.`,
    );
    setFeedback(correct ? "Correct · collectible added · +20 credits" : "Incorrect · the purchase stays in her room.");
  }

  function togglePostLike(postId: string) {
    updateState((draft) => {
      draft.likedPostIds = draft.likedPostIds.includes(postId)
        ? draft.likedPostIds.filter((id) => id !== postId)
        : [...draft.likedPostIds, postId];
    });
  }

  function toggleBookmark(postId: string) {
    updateState((draft) => {
      draft.bookmarkedPostIds = draft.bookmarkedPostIds.includes(postId)
        ? draft.bookmarkedPostIds.filter((id) => id !== postId)
        : [...draft.bookmarkedPostIds, postId];
    });
  }

  function submitCommission() {
    const request: ArtistRequest = {
      ...commission,
      id: `commission-${Date.now()}`,
      status: "Submitted",
      createdAt: Date.now(),
    };
    updateState((draft) => {
      draft.artistRequests.unshift(request);
      draft.activity.unshift({
        id: `artist-activity-${Date.now()}`,
        label: "Submitted an artist request",
        detail: `${formatName[request.format] ?? request.format} request awaiting review.`,
        createdAt: Date.now(),
      });
      draft.notifications.unshift({
        id: `artist-notification-${Date.now()}`,
        title: "Artist request submitted",
        body: "No fee was charged. The request is awaiting artist review.",
        createdAt: Date.now(),
        read: false,
        destination: "studio",
      });
    });
    setCommission({ ...commission, id: "", brief: "", status: "Draft" });
    setStudioStep(4);
  }

  function savePlayerProfile() {
    const displayName = profileDraft.displayName.trim().slice(0, 24);
    const handle = profileDraft.handle
      .trim()
      .toLowerCase()
      .replace(/^@/, "")
      .replace(/[^a-z0-9_]/g, "")
      .slice(0, 18);
    if (!displayName || handle.length < 3 || !profileDraft.bio.trim()) {
      setNotice({
        id: `profile-error-${Date.now()}`,
        title: "Profile needs a little more",
        body: "Add a display name, a handle of at least 3 characters, and a short bio.",
      });
      return;
    }
    updateState((draft) => {
      draft.playerName = displayName;
      draft.profile = {
        ...draft.profile,
        complete: true,
        handle,
        bio: profileDraft.bio.trim().slice(0, 160),
        tagline: profileDraft.tagline.trim().slice(0, 60),
        avatarId: profileDraft.avatarId,
        bannerId: profileDraft.bannerId,
        accent: profileDraft.accent,
      };
      draft.activity.unshift({
        id: `profile-activity-${Date.now()}`,
        label: editingProfile ? "Updated social profile" : "Joined Pink Ledger",
        detail: `@${handle} chose a new profile identity.`,
        createdAt: Date.now(),
      });
    });
    setEditingProfile(false);
    setProfileStep(1);
    setNotice({
      id: `profile-saved-${Date.now()}`,
      title: editingProfile ? "Profile updated" : "Your profile is live",
      body: `@${handle} is ready for the network.`,
    });
  }

  function beginProfileEdit() {
    setProfileDraft({
      displayName: state.playerName,
      handle: state.profile.handle,
      bio: state.profile.bio,
      tagline: state.profile.tagline,
      avatarId: state.profile.avatarId,
      bannerId: state.profile.bannerId,
      accent: state.profile.accent,
    });
    setProfileStep(1);
    setEditingProfile(true);
  }

  async function enableAIChat() {
    if (!supportsWebLLM()) {
      setAiStatus("unsupported");
      updateState((draft) => {
        draft.girls[selectedGirlId].chatMode = "scripted";
        draft.aiChatAcknowledged = true;
      });
      return;
    }
    updateState((draft) => {
      draft.aiChatAcknowledged = true;
    });
    setAiStatus("loading");
    setAiProgress(0);
    setAiProgressText("Preparing the private local model…");
    try {
      await initializeWebLLM((progress, text) => {
        setAiProgress(progress);
        setAiProgressText(text);
      });
      updateState((draft) => {
        draft.girls[selectedGirlId].chatMode = "ai";
      });
      setAiStatus("ready");
    } catch {
      setAiStatus("error");
      updateState((draft) => {
        draft.girls[selectedGirlId].chatMode = "scripted";
      });
    }
  }

  function switchToScriptedChat() {
    interruptWebLLM();
    updateState((draft) => {
      draft.girls[selectedGirlId].chatMode = "scripted";
    });
    setAiStatus("idle");
    setStreamingReply("");
  }

  async function sendAIMessage() {
    const content = aiDraft.trim().slice(0, 500);
    if (!content || aiStatus !== "ready" || selectedProgress.breakUntil > Date.now()) return;
    const signal = evaluateInteraction(selectedGirl, selectedProgress, content);
    const playerMessage: ChatMessage = {
      id: `player-${Date.now()}`,
      role: "player",
      content,
      createdAt: Date.now(),
      mode: "ai",
    };
    const updatedProgress = applyInteraction(selectedProgress, signal);
    const promptMessages = [...selectedProgress.aiMessages, playerMessage].slice(-20);

    updateState((draft) => {
      draft.girls[selectedGirlId] = {
        ...draft.girls[selectedGirlId],
        ...updatedProgress,
        aiMessages: promptMessages,
      };
    });
    setAiDraft("");
    setStreamingReply("");
    setFeedback(signal.reason);
    setAiStatus("generating");

    try {
      const response = await streamCharacterReply({
        girl: selectedGirl,
        progress: updatedProgress,
        playerName: state.playerName,
        messages: promptMessages,
        onToken: setStreamingReply,
      });
      const girlMessage: ChatMessage = {
        id: `girl-${Date.now()}`,
        role: "girl",
        content: response || "I lost that thought. Try me again.",
        createdAt: Date.now(),
        mode: "ai",
      };
      updateState((draft) => {
        const progress = draft.girls[selectedGirlId];
        progress.aiMessages = [...progress.aiMessages, girlMessage].slice(-20);
        progress.conversationSummary = `${state.playerName} recently discussed ${signal.topic}. ${signal.reason}`.slice(0, 240);
      });
      setStreamingReply("");
      setAiStatus("ready");
    } catch {
      setStreamingReply("");
      setAiStatus("error");
      setFeedback("The local model stopped. Scripted chat remains available.");
    }
  }

  function resetAIConversation() {
    if (!window.confirm(`Reset the local AI conversation with ${selectedGirl.name}?`)) return;
    updateState((draft) => {
      draft.girls[selectedGirlId].aiMessages = [];
      draft.girls[selectedGirlId].conversationSummary = "";
      draft.girls[selectedGirlId].recentTopics = [];
      draft.girls[selectedGirlId].boredom = 18;
    });
    setStreamingReply("");
    setFeedback("Local AI conversation reset.");
  }

  function openNotification(item: PlayerState["notifications"][number]) {
    updateState((draft) => {
      const notification = draft.notifications.find((candidate) => candidate.id === item.id);
      if (notification) notification.read = true;
    });
    setNotificationsOpen(false);
    if (item.girlId && item.destination === "messages") openMessages(item.girlId);
    else if (item.girlId && item.destination === "profile") openProfile(item.girlId);
    else if (item.destination) navigate(item.destination);
  }

  if (!ready) {
    return (
      <main className="loading-screen">
        <span className="brand-mark">PL</span>
        <p>Opening your feed…</p>
      </main>
    );
  }

  if (!state.playerName || !state.ageConfirmed) {
    return (
      <main className="onboarding">
        <section className="onboarding-art">
          <div className="onboarding-copy">
            <span className="eyebrow">A fictional social world</span>
            <h1>Pink Ledger</h1>
            <p>Notice the details. Earn attention. Watch every room become a collection.</p>
          </div>
          <Portrait girl={girls[0]} alt="" />
        </section>
        <form
          className="onboarding-card"
          onSubmit={(event) => {
            event.preventDefault();
            const form = new FormData(event.currentTarget);
            const playerName = String(form.get("player-name") ?? "").trim().slice(0, 18);
            const confirmed = form.get("age-confirmed") === "on";
            if (!playerName || !confirmed) return;
            updateState((draft) => {
              draft.playerName = playerName;
              draft.ageConfirmed = true;
            });
            setProfileDraft((current) => ({
              ...current,
              displayName: playerName,
              handle: playerName.toLowerCase().replace(/[^a-z0-9_]/g, "").slice(0, 18),
            }));
          }}
        >
          <span className="eyebrow">Private profile setup</span>
          <h2>Enter the network</h2>
          <p>Your demo profile and progress stay on this device. The people and accounts shown here are fictional.</p>
          <label>
            <span>Player name</span>
            <input name="player-name" maxLength={18} placeholder="Choose a display name" required />
          </label>
          <label className="check-row">
            <input name="age-confirmed" type="checkbox" required />
            <span>I confirm that I am an adult and understand this is an adult-themed fictional game using fictional money.</span>
          </label>
          <button className="primary" type="submit">Create profile</button>
        </form>
      </main>
    );
  }

  if (!state.profile.complete || editingProfile) {
    const chosenAvatar = AVATARS.find((avatar) => avatar.id === profileDraft.avatarId) ?? AVATARS[0];
    return (
      <main className="profile-setup-shell">
        <section className="profile-setup-aside">
          <span className="eyebrow">{editingProfile ? "Edit your identity" : "Welcome to the network"}</span>
          <h1>Make it yours.</h1>
          <p>Your profile is your place in Pink Ledger—visible in the feed, messages, collections and future locations.</p>
          <div className={`profile-preview banner-${profileDraft.bannerId}`} style={{ "--profile-accent": profileDraft.accent } as React.CSSProperties}>
            <div className="preview-banner" />
            <span className="preview-avatar">{chosenAvatar.symbol}</span>
            <div>
              <b>{profileDraft.displayName || state.playerName || "Display name"}</b>
              <small>@{profileDraft.handle || "your_handle"}</small>
              <p>{profileDraft.bio || "Your short profile bio will appear here."}</p>
            </div>
          </div>
        </section>
        <section className="profile-setup-card">
          <div className="setup-progress" aria-label="Profile setup progress">
            {["Identity", "Avatar", "Style", "Review"].map((label, index) => (
              <span className={profileStep >= index + 1 ? "active" : ""} key={label}>{index + 1}<i>{label}</i></span>
            ))}
          </div>
          {profileStep === 1 && (
            <div className="setup-step">
              <span className="eyebrow">Step one</span>
              <h2>Introduce yourself</h2>
              <label><span>Display name</span><input type="text" value={profileDraft.displayName} maxLength={24} onChange={(event) => setProfileDraft({ ...profileDraft, displayName: event.target.value })} /></label>
              <label><span>Handle</span><div className="handle-input"><i>@</i><input type="text" value={profileDraft.handle} maxLength={18} onChange={(event) => setProfileDraft({ ...profileDraft, handle: event.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "") })} /></div></label>
              <label><span>Bio</span><textarea value={profileDraft.bio} maxLength={160} placeholder="A short introduction for your circle…" onChange={(event) => setProfileDraft({ ...profileDraft, bio: event.target.value })} /></label>
              <label><span>Tagline <small>optional</small></span><input type="text" value={profileDraft.tagline} maxLength={60} placeholder="Collector, observer, night owl…" onChange={(event) => setProfileDraft({ ...profileDraft, tagline: event.target.value })} /></label>
              <div className="form-actions">
                {editingProfile && <button onClick={() => setEditingProfile(false)}>Cancel</button>}
                <button className="primary" disabled={!profileDraft.displayName.trim() || profileDraft.handle.length < 3 || !profileDraft.bio.trim()} onClick={() => setProfileStep(2)}>Choose an avatar</button>
              </div>
            </div>
          )}
          {profileStep === 2 && (
            <div className="setup-step">
              <span className="eyebrow">Step two</span>
              <h2>Choose your face in the network</h2>
              <div className="avatar-choice-grid">
                {AVATARS.map((avatar) => {
                  const owned = state.profile.ownedAvatarIds.includes(avatar.id);
                  const available = avatar.unlocked || owned;
                  return (
                    <button
                      className={`${profileDraft.avatarId === avatar.id ? "active" : ""} ${available ? "" : "locked"}`}
                      key={avatar.id}
                      disabled={!available && (avatar.id !== "artist-avatar" || !editingProfile)}
                      onClick={() => {
                        if (avatar.id === "artist-avatar" && editingProfile) {
                          setCommission({ ...commission, character: state.playerName, format: "avatar" });
                          setEditingProfile(false);
                          setScreen("studio");
                        } else if (available) {
                          setProfileDraft({ ...profileDraft, avatarId: avatar.id });
                        }
                      }}
                    >
                      <i>{avatar.symbol}</i><b>{avatar.label}</b><small>{avatar.id === "artist-avatar" && !editingProfile ? "Finish setup, then request in Studio" : avatar.requirement}</small>
                    </button>
                  );
                })}
              </div>
              <div className="form-actions"><button onClick={() => setProfileStep(1)}>Back</button><button className="primary" onClick={() => setProfileStep(3)}>Choose your style</button></div>
            </div>
          )}
          {profileStep === 3 && (
            <div className="setup-step">
              <span className="eyebrow">Step three</span>
              <h2>Set the atmosphere</h2>
              <div className="banner-choice-grid">
                {BANNERS.map((banner) => {
                  const owned = state.profile.ownedBannerIds.includes(banner.id);
                  const available = banner.unlocked || owned;
                  return <button className={`banner-${banner.id} ${profileDraft.bannerId === banner.id ? "active" : ""}`} disabled={!available} key={banner.id} onClick={() => setProfileDraft({ ...profileDraft, bannerId: banner.id })}><i></i><b>{banner.label}</b><small>{available ? "Available" : banner.id === "artist-banner" ? "Artist commission" : "Future unlock"}</small></button>;
                })}
              </div>
              <label><span>Profile accent</span><input type="color" value={profileDraft.accent} onChange={(event) => setProfileDraft({ ...profileDraft, accent: event.target.value })} /></label>
              <div className="form-actions"><button onClick={() => setProfileStep(2)}>Back</button><button className="primary" onClick={() => setProfileStep(4)}>Review profile</button></div>
            </div>
          )}
          {profileStep === 4 && (
            <div className="setup-step final-profile-step">
              <span className="eyebrow">Step four</span>
              <h2>Your profile is ready</h2>
              <p>Likes, messages, collections and future outings will all connect to this identity. You can edit it later.</p>
              <dl><div><dt>Name</dt><dd>{profileDraft.displayName}</dd></div><div><dt>Handle</dt><dd>@{profileDraft.handle}</dd></div><div><dt>Avatar</dt><dd>{chosenAvatar.label}</dd></div><div><dt>Banner</dt><dd>{BANNERS.find((banner) => banner.id === profileDraft.bannerId)?.label}</dd></div></dl>
              <div className="form-actions"><button onClick={() => setProfileStep(3)}>Back</button><button className="primary" onClick={savePlayerProfile}>{editingProfile ? "Save changes" : "Enter the feed"}</button></div>
            </div>
          )}
        </section>
      </main>
    );
  }

  if (!state.questionnaireComplete) {
    const personas = [
      ["attention", "Attention", "Being noticed, messaged and remembered."],
      ["obedience", "Obedience", "Clear instructions and strict amounts."],
      ["praise", "Praise", "Soft approval when you get it right."],
      ["humiliation", "Teasing", "Sharp wallet jokes and playful pressure."],
    ];
    return (
      <main className="persona-screen">
        <section className="persona-card">
          <span className="eyebrow">Tune your private feed</span>
          <h1>What gets your attention?</h1>
          <p>The girls use this to shape their messages and demands.</p>
          <div className="persona-options">
            {personas.map(([value, label, copy]) => (
              <button
                key={value}
                onClick={() =>
                  updateState((draft) => {
                    draft.finSubStyle = value;
                    draft.questionnaireComplete = true;
                  })
                }
              >
                <b>{label}</b>
                <span>{copy}</span>
              </button>
            ))}
          </div>
        </section>
      </main>
    );
  }

  function Feed() {
    return (
      <div className="feed-layout">
        <section className="feed-column">
          <div className="page-intro">
            <span className="eyebrow">Your circle</span>
            <h1>For you</h1>
            <p>Public posts, private drops and the room details you have not noticed yet.</p>
          </div>
          <div className="story-row" aria-label="Character stories">
            {girls.map((girl) => {
              const isOpen = state.unlockedGirlIds.includes(girl.id);
              return (
                <button key={girl.id} onClick={() => openProfile(girl.id)}>
                  <span className={`story-ring ${isOpen ? "" : "locked"}`}>
                    <Portrait girl={girl} alt="" />
                  </span>
                  <b>{girl.name}</b>
                  <small>{isOpen ? "new story" : "public"}</small>
                </button>
              );
            })}
          </div>
          {feedPosts.map((post) => {
            const girl = girlById(post.girlId);
            const liked = state.likedPostIds.includes(post.id);
            const bookmarked = state.bookmarkedPostIds.includes(post.id);
            const lockedPost = post.visibility === "private" && !state.unlockedGirlIds.includes(post.girlId);
            return (
              <article className={`social-post ${lockedPost ? "locked-post" : ""}`} key={post.id}>
                <header>
                  <button className="post-author" onClick={() => openProfile(girl.id)}>
                    <span className="mini-avatar"><Portrait girl={girl} alt="" /></span>
                    <span><b>{girl.name}</b><small>@{girl.handle} · {post.time}</small></span>
                  </button>
                  <span className={`visibility ${post.visibility}`}>{post.visibility}</span>
                </header>
                <button className="post-media" onClick={() => openProfile(girl.id, lockedPost ? "posts" : post.type === "room" ? "room" : "posts")}>
                  <img src={post.image} alt={`${girl.name}'s ${post.type} post`} />
                  {post.visibility === "private" && <span className="private-stamp">private circle</span>}
                  {lockedPost && <span className="locked-post-copy"><b>Private post</b><small>Open {girl.name}&apos;s profile to see what her circle includes.</small></span>}
                </button>
                <div className="post-actions">
                  <button className={liked ? "liked" : ""} disabled={lockedPost} onClick={() => togglePostLike(post.id)} aria-label="Like post">
                    {liked ? "♥" : "♡"} {post.likes + (liked ? 1 : 0)}
                  </button>
                  <button onClick={() => openProfile(girl.id)}>◯ {post.comments}</button>
                  <button onClick={() => openMessages(girl.id)} disabled={!state.unlockedGirlIds.includes(girl.id)}>↗ Message</button>
                  <button className={bookmarked ? "bookmarked" : ""} disabled={lockedPost} onClick={() => toggleBookmark(post.id)} aria-label="Bookmark post">{bookmarked ? "◆ Saved" : "◇ Save"}</button>
                </div>
                <p><b>{girl.name}</b> {lockedPost ? "A private-circle update is waiting behind this profile." : post.caption}</p>
              </article>
            );
          })}
        </section>
        <aside className="feed-rail">
          <section className="wallet-card">
            <span className="eyebrow">Your wallet</span>
            <div><b>{state.credits}</b><span>credits</span></div>
            <div><b>{state.money}</b><span>fictional money</span></div>
            <button onClick={exchangeCredits} disabled={state.credits < EXCHANGE_RATE.credits}>Exchange full bundles</button>
          </section>
          <section className="rail-card">
            <span className="eyebrow">Artist drop</span>
            <img src="/art/reward-collection.webp" alt="Illustrated collection of placeholder room rewards" />
            <h3>Objects become memories</h3>
            <p>Correctly identify a purchase to keep its art card.</p>
            <button onClick={() => navigate("studio")}>Visit Artist&apos;s Studio</button>
          </section>
        </aside>
      </div>
    );
  }

  function Discover() {
    const isPrivateOpen = state.unlockedGirlIds.includes(selectedGirlId);
    const girlPosts = socialPosts.filter((post) => post.girlId === selectedGirlId);
    const progress = state.girls[selectedGirlId];
    const query = discoverQuery.trim().toLowerCase();
    const matches = girls.filter((girl) =>
      [girl.name, girl.handle, girl.personality, ...girl.conversation.interests]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
    const sortedBoard = [...progress.leaderboard, { playerName: state.playerName, totalSpent: progress.totalSpent }]
      .filter((row, index, rows) => rows.findIndex((item) => item.playerName === row.playerName) === index)
      .sort((a, b) => b.totalSpent - a.totalSpent);
    return (
      <div className="discover-page">
        <section className="profile-directory">
          <div><span className="eyebrow">Discover the network</span><h1>Profiles</h1></div>
          <label><span className="sr-only">Search profiles</span><input type="search" value={discoverQuery} placeholder="Search names, handles or interests…" onChange={(event) => setDiscoverQuery(event.target.value)} /></label>
          <div className="directory-row">
            <button onClick={() => navigate("profile")}><span className="directory-avatar player-directory-avatar">{AVATARS.find((avatar) => avatar.id === state.profile.avatarId)?.symbol}</span><b>{state.playerName}</b><small>@{state.profile.handle} · you</small></button>
            {matches.map((girl) => <button className={girl.id === selectedGirlId ? "active" : ""} key={girl.id} onClick={() => { setSelectedGirlId(girl.id); setProfileTab("posts"); }}><span className="directory-avatar"><Portrait girl={girl} alt="" /></span><b>{girl.name}</b><small>@{girl.handle} · {profileStatus(girl, state)}</small></button>)}
          </div>
          {!matches.length && <p className="empty-state">No fictional profiles match that search.</p>}
        </section>
        <div className="profile-page" style={{ "--accent": selectedGirl.palette.main } as React.CSSProperties}>
        <section className="profile-hero">
          <div className="profile-cover" aria-hidden="true"></div>
          <div className="profile-identity">
            <span className="profile-avatar"><Portrait girl={selectedGirl} alt="" /></span>
            <div className="profile-title">
              <span className="eyebrow">{profileStatus(selectedGirl, state)}</span>
              <h1>{selectedGirl.name}</h1>
              <p>@{selectedGirl.handle} · adult fictional character</p>
            </div>
            <div className="profile-actions">
              {isPrivateOpen ? (
                <button className="primary" onClick={() => openMessages(selectedGirlId)}>Message</button>
              ) : (
                <button className="primary" onClick={() => setConfirm({ type: "access", amount: selectedGirl.unlockPrice })}>
                  Open private circle · {selectedGirl.unlockPrice}
                </button>
              )}
            </div>
          </div>
          <p className="profile-bio">{selectedGirl.bio}</p>
          <div className="profile-stats">
            <span><b>{girlPosts.length + 12}</b> posts</span>
            <span><b>{selectedGirl.rewards.length}</b> collectible drops</span>
            <span><b>{progress.totalSpent}</b> your support</span>
          </div>
        </section>
        <nav className="profile-tabs" aria-label={`${selectedGirl.name} profile sections`}>
          {(["posts", "room", "collection", "supporters", "about"] as ProfileTab[]).map((tab) => (
            <button
              className={profileTab === tab ? "active" : ""}
              key={tab}
              onClick={() => setProfileTab(tab)}
            >
              {tab}
              {!isPrivateOpen && tab !== "posts" && tab !== "about" ? " · locked" : ""}
            </button>
          ))}
        </nav>
        {!isPrivateOpen && profileTab !== "posts" && profileTab !== "about" ? (
          <PrivateAccessCard girl={selectedGirl} onOpen={() => setConfirm({ type: "access", amount: selectedGirl.unlockPrice })} />
        ) : profileTab === "posts" ? (
          <section className="profile-post-grid">
            {girlPosts.map((post) => (
              <button key={post.id} className="profile-post-tile">
                <img src={post.image} alt={`${selectedGirl.name} ${post.type} post`} />
                <span>{post.visibility}</span>
              </button>
            ))}
            {!isPrivateOpen && (
              <>
                <button className="profile-post-tile locked-tile" onClick={() => setConfirm({ type: "access", amount: selectedGirl.unlockPrice })}><span>Private room update</span></button>
                <button className="profile-post-tile locked-tile" onClick={() => setConfirm({ type: "access", amount: selectedGirl.unlockPrice })}><span>Private art drop</span></button>
              </>
            )}
          </section>
        ) : profileTab === "room" ? (
          <section className="room-tab">
            <div className="section-heading"><span className="eyebrow">Persistent scene</span><h2>Her room changes with every purchase</h2></div>
            <RoomScene girl={selectedGirl} state={state} pendingRewardId={progress.pendingSpendEvent?.rewardId} />
          </section>
        ) : profileTab === "collection" ? (
          <Collection girlFilter={selectedGirlId} />
        ) : profileTab === "supporters" ? (
          <section className="supporter-board">
            <div className="section-heading"><span className="eyebrow">Private circle</span><h2>Supporters</h2></div>
            <ol>{sortedBoard.slice(0, 6).map((row, index) => <li key={row.playerName}><span>{index + 1}<b>{row.playerName}</b></span><strong>{row.totalSpent}</strong></li>)}</ol>
          </section>
        ) : (
          <section className="about-card">
            <Portrait girl={selectedGirl} />
            <div><span className="eyebrow">About @{selectedGirl.handle}</span><h2>{selectedGirl.personality}</h2><p>{selectedGirl.bio}</p><p>Profile media in this demo is placeholder concept art. Production photos and likenesses require adult model approval.</p></div>
          </section>
        )}
        </div>
      </div>
    );
  }

  function PrivateAccessCard({ girl, onOpen }: { girl: GirlCharacter; onOpen: () => void }) {
    return (
      <section className="access-card">
        <div className="access-art"><Portrait girl={girl} /></div>
        <div>
          <span className="eyebrow">Public preview</span>
          <h2>Enter {girl.name}&apos;s private circle</h2>
          <p>Unlock private posts, authored DMs, her evolving room, supporter board and {girl.rewards.length} collectible drops.</p>
          <div className="access-teasers"><span>private DMs</span><span>room access</span><span>art collection</span></div>
          <button className="primary" onClick={onOpen}>Open access · {girl.unlockPrice} fictional money</button>
        </div>
      </section>
    );
  }

  function Messages() {
    const progress = state.girls[selectedGirlId];
    const moodLabel = getMoodLabel(progress).replace("-", " ");
    const scene = selectedGirl.chatScenes[progress.chatSceneIndex % selectedGirl.chatScenes.length];
    const event = progress.pendingSpendEvent;
    const guessOptions = event
      ? [
          rewardById(selectedGirl, event.rewardId),
          ...selectedGirl.rewards.filter((reward) => reward.id !== event.rewardId).slice(0, 2),
        ].filter(Boolean) as RewardItem[]
      : [];
    return (
      <div className="messages-page">
        <aside className="message-contacts">
          <div className="section-heading"><span className="eyebrow">Private messages</span><h1>Inbox</h1></div>
          {girls.map((girl) => {
            const open = state.unlockedGirlIds.includes(girl.id);
            const gp = state.girls[girl.id];
            return (
              <button className={girl.id === selectedGirlId ? "active" : ""} key={girl.id} onClick={() => setSelectedGirlId(girl.id)}>
                <span className="mini-avatar"><Portrait girl={girl} alt="" /></span>
                <span><b>{girl.name}</b><small>{open ? gp.pendingSpendEvent ? "Something changed" : "Tap to open" : "Public only"}</small></span>
                {!open && <i>locked</i>}
              </button>
            );
          })}
        </aside>
        {!unlocked ? (
          <PrivateAccessCard girl={selectedGirl} onOpen={() => setConfirm({ type: "access", amount: selectedGirl.unlockPrice })} />
        ) : (
          <section className="thread">
            <header className="thread-header">
              <button className="post-author" onClick={() => openProfile(selectedGirlId)}>
                <span className="mini-avatar"><Portrait girl={selectedGirl} alt="" /></span>
                <span><b>{selectedGirl.name}</b><small>@{selectedGirl.handle} · {moodLabel}</small></span>
              </button>
              <div className="thread-header-actions">
                <button className={progress.chatMode === "ai" ? "active" : ""} onClick={() => progress.chatMode === "ai" ? switchToScriptedChat() : enableAIChat()}>{progress.chatMode === "ai" ? "AI Chat Beta on" : "Try AI Chat Beta"}</button>
                <button onClick={() => openProfile(selectedGirlId, "room")}>View room</button>
              </div>
            </header>
            <div className="thread-scroll">
              <div className="shared-scene">
                <RoomScene girl={selectedGirl} state={state} pendingRewardId={event?.rewardId} compact />
              </div>
              {event ? (
                <section className="guess-panel">
                  <div className="message incoming"><p>{selectedGirl.name}: Something changed. Tell me you actually looked.</p></div>
                  <span className="eyebrow">Observation check</span>
                  <h3>What appeared in the room?</h3>
                  <div className="reply-grid">{guessOptions.sort(() => Math.random() - 0.5).map((reward) => <button key={reward.id} onClick={() => guessReward(reward.id)}>{reward.name}</button>)}</div>
                </section>
              ) : progress.chatMode === "ai" ? (
                <section className="ai-conversation">
                  {!progress.aiMessages.length && aiStatus === "ready" && <div className="ai-empty"><span>✦</span><h3>Local AI chat is ready</h3><p>Write naturally. Her mood, boredom and familiarity respond to the way you speak.</p></div>}
                  {progress.aiMessages.map((message) => <div className={`message ${message.role === "player" ? "outgoing" : "incoming"}`} key={message.id}><small>{message.role === "player" ? state.playerName : selectedGirl.name}</small><p>{message.content}</p></div>)}
                  {streamingReply && <div className="message incoming generating"><small>{selectedGirl.name} · responding locally</small><p>{streamingReply}<i></i></p></div>}
                  {aiStatus === "loading" && (
                    <section className="model-loader">
                      <span className="eyebrow">One-time local setup</span>
                      <h3>Preparing {WEBLLM_MODEL_ID.split("-").slice(0, 2).join(" ")}</h3>
                      <p>The free model is downloading to this browser. It remains local and will be cached for later visits.</p>
                      <div><i style={{ width: `${aiProgress}%` }}></i></div><b>{aiProgress}%</b><small>{aiProgressText}</small>
                      <button onClick={switchToScriptedChat}>Return to scripted chat</button>
                    </section>
                  )}
                  {aiStatus === "unsupported" && <section className="ai-fallback"><h3>AI Chat Beta is not available on this device</h3><p>This browser does not provide the WebGPU support needed to run the model locally. Scripted chat is still fully available.</p><button onClick={switchToScriptedChat}>Use scripted chat</button></section>}
                  {aiStatus === "error" && <section className="ai-fallback"><h3>The local model stopped</h3><p>No game progress was lost. Retry the local model or continue with scripted replies.</p><div><button onClick={enableAIChat}>Retry AI setup</button><button onClick={switchToScriptedChat}>Use scripted chat</button></div></section>}
                  {aiStatus === "idle" && <section className="ai-consent-card"><span className="eyebrow">Free local AI beta</span><h3>Run the conversation on this device</h3><p>Pink Ledger will download a small open model once and run it inside this browser. There is no paid API, no per-message fee and no server-side AI account.</p><ul><li>Requires a WebGPU-capable browser.</li><li>First setup can take several minutes.</li><li>Scripted chat always remains available.</li></ul><button className="primary" onClick={enableAIChat}>Download and enable AI Chat Beta</button></section>}
                </section>
              ) : (
                <>
                  <div className="message incoming"><p>{lastReply || scene.prompt}</p></div>
                  {lastPlayerLine && <div className="message outgoing"><p>{lastPlayerLine}</p></div>}
                  {lastReply ? (
                    <button className="continue-button" onClick={() => { setLastReply(""); setLastPlayerLine(""); setFeedback("Choose a suggested reply."); }}>Continue conversation</button>
                  ) : (
                    <section className="suggested-replies">
                      <span className="eyebrow">Suggested replies</span>
                      <div className="reply-grid">{scene.choices.map((choice) => <button key={choice.id} onClick={() => chooseReply(choice)}>{choice.text}</button>)}</div>
                    </section>
                  )}
                </>
              )}
              <p className="feedback-line">{feedback}</p>
            </div>
            <footer className="tribute-dock">
              <div className="relationship-meters">
                <span><i>Mood</i><b>{progress.mood}%</b><em><u style={{ width: `${progress.mood}%` }}></u></em></span>
                <span><i>Interest</i><b>{100 - progress.boredom}%</b><em><u style={{ width: `${100 - progress.boredom}%` }}></u></em></span>
                <span><i>Familiarity</i><b>{progress.familiarity}%</b><em><u style={{ width: `${progress.familiarity}%` }}></u></em></span>
              </div>
              {progress.chatMode === "ai" && aiStatus === "ready" && (
                <div className="ai-composer">
                  <label><span className="sr-only">Message {selectedGirl.name}</span><textarea value={aiDraft} maxLength={500} rows={2} placeholder={`Message ${selectedGirl.name}…`} onChange={(event) => setAiDraft(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); void sendAIMessage(); } }} /></label>
                  <button className="primary" disabled={!aiDraft.trim() || progress.breakUntil > Date.now()} onClick={() => void sendAIMessage()}>Send</button>
                  <button onClick={resetAIConversation}>Reset</button>
                  <button onClick={switchToScriptedChat}>Scripted</button>
                </div>
              )}
              {progress.chatMode === "ai" && aiStatus === "generating" && <div className="generation-controls"><span>{selectedGirl.name} is composing locally…</span><button onClick={() => { interruptWebLLM(); setAiStatus("ready"); setStreamingReply(""); }}>Stop</button></div>}
              <div className="tribute-buttons">
                {TRIBUTE_AMOUNTS.slice(0, 4).map((amount) => (
                  <button key={amount} disabled={state.money < amount || Boolean(progress.pendingSpendEvent)} onClick={() => setConfirm({ type: "tribute", amount })}>
                    Send {amount}
                  </button>
                ))}
              </div>
            </footer>
          </section>
        )}
      </div>
    );
  }

  function Collection({ girlFilter }: { girlFilter?: GirlId }) {
    const entries = state.inventory.filter((token) => !girlFilter || token.girlId === girlFilter);
    const relevantGirls = girlFilter ? [girlById(girlFilter)] : girls;
    return (
      <section className="collection-page">
        {!girlFilter && <div className="page-intro"><span className="eyebrow">Private artbook</span><h1>Your collection</h1><p>Every card remembers who funded a change and who paid enough attention to catch it.</p></div>}
        <div className="collection-grid">
          {entries.map((token) => {
            const girl = girlById(token.girlId);
            const reward = rewardById(girl, token.rewardId);
            return (
              <article className="collection-card owned" key={token.id}>
                <img src="/art/reward-collection.webp" alt="" />
                <span className="eyebrow">{reward?.kind ?? token.kind} · collected</span>
                <h3>{reward?.name ?? token.name}</h3>
                <p>{girl.name} · {new Date(token.acquiredAt).toLocaleDateString()}</p>
              </article>
            );
          })}
          {relevantGirls.flatMap((girl) =>
            girl.rewards
              .filter((reward) => !entries.some((token) => token.rewardId === reward.id))
              .map((reward) => (
                <article className="collection-card locked" key={reward.id}>
                  <div className="locked-art">?</div>
                  <span className="eyebrow">{reward.kind} · undiscovered</span>
                  <h3>Hidden art card</h3>
                  <p>{girl.name} will reveal this through play.</p>
                </article>
              )),
          )}
        </div>
        {!entries.length && <p className="empty-state">Your first correctly identified purchase will appear here.</p>}
      </section>
    );
  }

  function Studio() {
    return (
      <section className="studio-page">
        <div className="studio-hero">
          <div><span className="eyebrow">Highest-level collection</span><h1>Artist&apos;s Studio</h1><p>Shape a personal piece for the artist to review. This demo records a request—it does not process payment or promise acceptance.</p></div>
          <img src="/art/reward-collection.webp" alt="Illustrated placeholder rewards from the artist's studio" />
        </div>
        {studioStep === 4 ? (
          <section className="submission-success">
            <span>✓</span><h2>Request submitted for review</h2><p>The artist can accept it, ask for changes, or decline it. No fee has been charged.</p>
            <button className="primary" onClick={() => setStudioStep(1)}>Start another request</button>
          </section>
        ) : (
          <section className="studio-form">
            <div className="studio-progress"><span className={studioStep >= 1 ? "active" : ""}>1 Character</span><span className={studioStep >= 2 ? "active" : ""}>2 Direction</span><span className={studioStep >= 3 ? "active" : ""}>3 Review</span></div>
            {studioStep === 1 && (
              <div className="studio-step"><span className="eyebrow">Step one</span><h2>Who is this piece for?</h2><div className="character-choice">{[state.playerName, ...girls.map((girl) => girl.name), "Artist's choice"].map((name) => <button className={commission.character === name ? "active" : ""} key={name} onClick={() => setCommission({ ...commission, character: name })}>{name === state.playerName ? `${name} · your profile` : name}</button>)}</div><button className="primary" onClick={() => setStudioStep(2)}>Choose the direction</button></div>
            )}
            {studioStep === 2 && (
              <div className="studio-step"><span className="eyebrow">Step two</span><h2>Describe the artwork</h2>
                <label><span>Format</span><select value={commission.format} onChange={(event) => setCommission({ ...commission, format: event.target.value })}>{Object.entries(formatName).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
                <label><span>Mood</span><input value={commission.mood} onChange={(event) => setCommission({ ...commission, mood: event.target.value })} /></label>
                <label><span>Palette</span><input value={commission.palette} onChange={(event) => setCommission({ ...commission, palette: event.target.value })} /></label>
                <label><span>Creative brief</span><textarea value={commission.brief} onChange={(event) => setCommission({ ...commission, brief: event.target.value })} placeholder="Pose, expression, outfit, setting and the feeling you want…" /></label>
                <div className="form-actions"><button onClick={() => setStudioStep(1)}>Back</button><button className="primary" disabled={!commission.brief.trim()} onClick={() => setStudioStep(3)}>Review request</button></div>
              </div>
            )}
            {studioStep === 3 && (
              <div className="studio-step review-step"><span className="eyebrow">Step three</span><h2>Request summary</h2><dl><div><dt>Character</dt><dd>{commission.character}</dd></div><div><dt>Format</dt><dd>{formatName[commission.format]}</dd></div><div><dt>Mood</dt><dd>{commission.mood}</dd></div><div><dt>Palette</dt><dd>{commission.palette}</dd></div><div><dt>Brief</dt><dd>{commission.brief}</dd></div></dl><p className="policy-note">Submission sends a creative request for review. Pricing, timing and revisions are confirmed separately by the artist.</p><div className="form-actions"><button onClick={() => setStudioStep(2)}>Edit</button><button className="primary" onClick={submitCommission}>Submit for review</button></div></div>
            )}
          </section>
        )}
        {state.artistRequests.length > 0 && <section className="request-list"><span className="eyebrow">Your requests</span>{state.artistRequests.map((request) => <article key={request.id}><b>{request.character} · {formatName[request.format] ?? request.format}</b><span>{request.status}</span></article>)}</section>}
      </section>
    );
  }

  function Places() {
    const destinations = [
      { id: "cafe", name: "Moonmilk Café", copy: "A quiet table for longer conversations.", tag: "date location" },
      { id: "arcade", name: "Ribbon Arcade", copy: "Co-op games, neon prizes and Runa's favourite queue.", tag: "date location" },
      { id: "night-market", name: "Blush Night Market", copy: "Street lights, art stalls and small collectible discoveries.", tag: "date location" },
      { id: "rooftop", name: "Lavender Rooftop", copy: "City lights and private milestone scenes.", tag: "date location" },
      { id: "gallery", name: "Paper Moon Gallery", copy: "Character art, exhibitions and artist events.", tag: "date location" },
      { id: "waterfront", name: "Soft Sky Waterfront", copy: "A slower place for relationship chapters.", tag: "date location" },
    ];
    return (
      <section className="places-page">
        <div className="places-hero"><span className="eyebrow">The world beyond the feed</span><h1>Places</h1><p>Pink Ledger begins as a social network. These doors are the structure for the larger game growing around it.</p></div>
        <div className="available-places">
          <button onClick={() => navigate("home")}><i>⌂</i><span><b>Social Feed</b><small>Open now</small></span></button>
          <button onClick={() => navigate("discover")}><i>▣</i><span><b>Private Rooms</b><small>Available through profiles</small></span></button>
          <button onClick={() => navigate("studio")}><i>✎</i><span><b>Artist&apos;s Studio</b><small>Requests open</small></span></button>
        </div>
        <section className="casino-placeholder">
          <div><span className="eyebrow">Future destination</span><h2>The Velvet Casino</h2><p>A fictional late-night destination planned for social encounters, events, collectible opportunities and game rewards. No gambling or real-money systems are active.</p>
            <button className={state.placeReminders.includes("casino") ? "active" : ""} onClick={() => updateState((draft) => { draft.placeReminders = draft.placeReminders.includes("casino") ? draft.placeReminders.filter((id) => id !== "casino") : [...draft.placeReminders, "casino"]; })}>{state.placeReminders.includes("casino") ? "Reminder saved" : "Notify me in the demo"}</button>
          </div><span className="casino-mark">♢</span>
        </section>
        <div className="section-heading"><span className="eyebrow">Future outings</span><h2>Date locations</h2></div>
        <div className="destination-grid">
          {destinations.map((place, index) => <article key={place.id} style={{ "--place-index": index } as React.CSSProperties}><span>{place.tag} · coming soon</span><h3>{place.name}</h3><p>{place.copy}</p><div><small>Compatibility</small><i>{index % 3 === 0 ? "art · calm" : index % 3 === 1 ? "games · energy" : "style · discovery"}</i></div><button className={state.placeReminders.includes(place.id) ? "active" : ""} onClick={() => updateState((draft) => { draft.placeReminders = draft.placeReminders.includes(place.id) ? draft.placeReminders.filter((id) => id !== place.id) : [...draft.placeReminders, place.id]; })}>{state.placeReminders.includes(place.id) ? "Saved" : "Save for later"}</button></article>)}
        </div>
      </section>
    );
  }

  function PlayerProfile() {
    const avatar = AVATARS.find((item) => item.id === state.profile.avatarId) ?? AVATARS[0];
    return (
      <section className="player-page">
        <section className={`player-profile-hero banner-${state.profile.bannerId}`} style={{ "--profile-accent": state.profile.accent } as React.CSSProperties}>
          <div className="player-cover" aria-hidden="true"></div>
          <div className="player-profile-identity"><span className="player-avatar">{avatar.symbol}</span><div><span className="eyebrow">Player social profile</span><h1>{state.playerName}</h1><p>@{state.profile.handle}</p></div><button className="primary" onClick={beginProfileEdit}>Edit profile</button></div>
          <p className="player-bio">{state.profile.bio}</p>
          {state.profile.tagline && <span className="profile-tagline">{state.profile.tagline}</span>}
        </section>
        <div className="player-stats"><article><b>{state.unlockedGirlIds.length}</b><span>private circles</span></article><article><b>{state.inventory.length}</b><span>art cards</span></article><article><b>{Object.values(state.girls).reduce((total, progress) => total + progress.activeChangeIds.length, 0)}</b><span>room discoveries</span></article><article><b>{Object.values(state.girls).filter((progress) => progress.familiarity >= 35).length}</b><span>milestones</span></article></div>
        <div className="player-profile-grid">
          <section className="activity-card"><div className="section-heading"><span className="eyebrow">Your network history</span><h2>Recent activity</h2></div>{state.activity.length ? state.activity.slice(0, 6).map((item) => <article key={item.id}><i>✦</i><div><b>{item.label}</b><p>{item.detail}</p><small>{new Date(item.createdAt).toLocaleDateString()}</small></div></article>) : <p className="empty-state">Your profile is ready. Collections, private circles and artist requests will build this history.</p>}</section>
          <section className="profile-collection-preview"><div className="section-heading"><span className="eyebrow">Scrapbook</span><h2>Collection preview</h2></div>{state.inventory.slice(0, 3).map((token) => <article key={token.id}><img src="/art/reward-collection.webp" alt="" /><span><b>{token.name}</b><small>{girlById(token.girlId).name}</small></span></article>)}{!state.inventory.length && <p className="empty-state">Correctly identify a room purchase to add your first art card.</p>}<button onClick={() => navigate("collection")}>Open full collection</button></section>
        </div>
        <section className="settings-card"><h2>Account and demo settings</h2><p>All progression and AI chat history stay in this browser. WebLLM runs locally and no paid AI API is configured.</p><button onClick={exchangeCredits} disabled={state.credits < EXCHANGE_RATE.credits}>Exchange earned credits</button><button onClick={() => navigate("studio")}>Commission profile artwork</button><button className="danger" onClick={() => { if (window.confirm("Reset all local Pink Ledger progress?")) { for (const key of [SAVE_KEY, ...LEGACY_SAVE_KEYS]) window.localStorage.removeItem(key); setState(createDefaultState()); setScreen("home"); } }}>Reset local progress</button></section>
        <section className="fiction-card"><h2>Fiction and media notice</h2><p>Pink Ledger is a fictional social game. Demo art is original placeholder material. Any future real photos, rooms or likenesses must belong to consenting adult models and be approved for the exact public or private use shown.</p></section>
      </section>
    );
  }

  return (
    <main className="social-app">
      <aside className="desktop-nav">
        <button className="brand" onClick={() => navigate("home")}><span>PL</span><b>Pink Ledger</b></button>
        <nav>
          {navItems.map((item) => <button className={screen === item.id ? "active" : ""} key={item.id} onClick={() => navigate(item.id)}><i>{item.icon}</i><span>{item.label}</span></button>)}
          <button className={screen === "collection" ? "active" : ""} onClick={() => navigate("collection")}><i>▧</i><span>Collection</span></button>
          <button className={screen === "studio" ? "active" : ""} onClick={() => navigate("studio")}><i>✎</i><span>Artist&apos;s Studio</span></button>
          <button className="notification-nav-button" onClick={() => setNotificationsOpen(true)}><i>♧</i><span>Notifications</span>{unreadCount > 0 && <b>{unreadCount}</b>}</button>
        </nav>
        <div className="desktop-wallet"><span>{state.credits} cr</span><span>{state.money} money</span><button onClick={exchangeCredits} disabled={state.credits < EXCHANGE_RATE.credits}>Exchange</button></div>
        <p>Fictional adult profiles · demo</p>
      </aside>
      <section className="app-column">
        <header className="mobile-header"><button className="brand" onClick={() => navigate("home")}><span>PL</span><b>Pink Ledger</b></button><div><button className="mobile-notifications" onClick={() => setNotificationsOpen(true)}>♧{unreadCount > 0 && <b>{unreadCount}</b>}</button><button onClick={() => navigate("profile")}>{state.money} ◇</button></div></header>
        <div className="app-content">
          {screen === "home" && Feed()}
          {screen === "discover" && Discover()}
          {screen === "messages" && Messages()}
          {screen === "collection" && Collection({})}
          {screen === "places" && Places()}
          {screen === "studio" && Studio()}
          {screen === "profile" && PlayerProfile()}
        </div>
      </section>
      <nav className="mobile-nav">
        {navItems.map((item) => <button className={screen === item.id ? "active" : ""} key={item.id} onClick={() => navigate(item.id)}><i>{item.icon}</i><span>{item.label}</span></button>)}
      </nav>
      {notice && (
        <button
          className="notice-toast"
          onClick={() => {
            if (notice.girlId) openMessages(notice.girlId);
            setNotice(null);
          }}
        >
          <span>♡</span><div><b>{notice.title}</b><p>{notice.body}</p></div><i>open</i>
        </button>
      )}
      {notificationsOpen && (
        <div className="notification-drawer-backdrop" onClick={() => setNotificationsOpen(false)}>
          <aside className="notification-drawer" role="dialog" aria-modal="true" aria-label="Notifications" onClick={(event) => event.stopPropagation()}>
            <header><div><span className="eyebrow">Your network</span><h2>Notifications</h2></div><button onClick={() => setNotificationsOpen(false)}>Close</button></header>
            <div>{state.notifications.length ? state.notifications.map((item) => <button className={item.read ? "read" : ""} key={item.id} onClick={() => openNotification(item)}><i>{item.read ? "○" : "●"}</i><span><b>{item.title}</b><p>{item.body}</p><small>{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "New"}</small></span></button>) : <p className="empty-state">No notifications yet.</p>}</div>
            {unreadCount > 0 && <button className="mark-read" onClick={() => updateState((draft) => { draft.notifications.forEach((item) => { item.read = true; }); })}>Mark all as read</button>}
          </aside>
        </div>
      )}
      {confirm && (
        <div className="modal-backdrop" role="presentation" onClick={() => setConfirm(null)}>
          <section className="confirm-modal" role="dialog" aria-modal="true" aria-labelledby="confirm-title" onClick={(event) => event.stopPropagation()}>
            <span className="modal-icon">{confirm.type === "tribute" ? "♡" : "✦"}</span>
            <h2 id="confirm-title">{confirm.type === "tribute" ? `Send ${confirm.amount} to ${selectedGirl.name}?` : `Open ${selectedGirl.name}'s private circle?`}</h2>
            <p>{confirm.type === "tribute" ? "The amount enters her pending purse. She decides what appears in her room later." : "This uses fictional in-game money and permanently unlocks private posts, room, collection and DMs on this device."}</p>
            <div><button onClick={() => setConfirm(null)}>Cancel</button><button className="primary" disabled={state.money < confirm.amount} onClick={() => confirm.type === "tribute" ? completeTribute(confirm.amount) : unlockPrivateAccess()}>Confirm · {confirm.amount}</button></div>
          </section>
        </div>
      )}
    </main>
  );
}
