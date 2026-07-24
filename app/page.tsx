"use client";

import { useEffect, useMemo, useState } from "react";
import { EXCHANGE_RATE, TRIBUTE_AMOUNTS, createDefaultState, girls } from "./game/data";
import type {
  DialogueChoice,
  GirlCharacter,
  GirlId,
  InventoryToken,
  PlayerState,
  RewardItem,
} from "./game/types";

type Screen = "home" | "discover" | "messages" | "collection" | "studio" | "profile";
type ProfileTab = "posts" | "room" | "collection" | "supporters" | "about";
type Notice = { id: string; title: string; body: string; girlId?: GirlId };
type CommissionRequest = {
  id: string;
  character: string;
  format: string;
  mood: string;
  palette: string;
  brief: string;
  status: "Draft" | "Submitted";
};

const STORAGE_KEY = "pink-ledger-social-v3";
const LEGACY_KEYS = ["pink-ledger-v2-state", "pink-ledger-v1-state"];

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
  { id: "collection", label: "Collection", icon: "▧" },
  { id: "profile", label: "Profile", icon: "◌" },
];

const formatName: Record<string, string> = {
  portrait: "Portrait",
  avatar: "Profile avatar",
  wallpaper: "Wallpaper",
  outfit: "Outfit concept",
  scene: "Full scene",
  room: "Room item",
};

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function mergeState(saved: Partial<PlayerState> | null): PlayerState {
  const base = createDefaultState();
  if (!saved) return base;
  const mergedGirls = clone(base.girls);
  for (const girl of girls) {
    mergedGirls[girl.id] = { ...mergedGirls[girl.id], ...(saved.girls?.[girl.id] ?? {}) };
  }
  const unlocked = new Set<GirlId>(["kiyo", "mimi", ...(saved.unlockedGirlIds ?? [])]);
  return {
    ...base,
    ...saved,
    unlockedGirlIds: Array.from(unlocked),
    inventory: Array.isArray(saved.inventory) ? saved.inventory : [],
    girls: mergedGirls,
  };
}

function loadState(): PlayerState {
  if (typeof window === "undefined") return createDefaultState();
  for (const key of [STORAGE_KEY, ...LEGACY_KEYS]) {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) return mergeState(JSON.parse(raw) as Partial<PlayerState>);
    } catch {
      // Try the next compatible save.
    }
  }
  return createDefaultState();
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
  const [likedPosts, setLikedPosts] = useState<string[]>([]);
  const [lastPlayerLine, setLastPlayerLine] = useState("");
  const [lastReply, setLastReply] = useState("");
  const [feedback, setFeedback] = useState("Choose a reply. Attentive answers earn credits.");
  const [notice, setNotice] = useState<Notice | null>(null);
  const [confirm, setConfirm] = useState<{ type: "tribute" | "access"; amount: number } | null>(null);
  const [studioStep, setStudioStep] = useState(1);
  const [commission, setCommission] = useState<CommissionRequest>({
    id: "",
    character: "Kiyo",
    format: "portrait",
    mood: "Soft confidence",
    palette: "Blush & cream",
    brief: "",
    status: "Draft",
  });
  const [submittedCommissions, setSubmittedCommissions] = useState<CommissionRequest[]>([]);

  const selectedGirl = girlById(selectedGirlId);
  const selectedProgress = state.girls[selectedGirlId];
  const unlocked = state.unlockedGirlIds.includes(selectedGirlId);

  useEffect(() => {
    setState(loadState());
    try {
      setLikedPosts(JSON.parse(window.localStorage.getItem("pink-ledger-liked-posts") ?? "[]") as string[]);
      setSubmittedCommissions(
        JSON.parse(window.localStorage.getItem("pink-ledger-commissions") ?? "[]") as CommissionRequest[],
      );
    } catch {
      // Optional UI preferences may safely reset.
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, lastSavedAt: Date.now() }));
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
    () =>
      socialPosts.filter(
        (post) => post.visibility === "public" || state.unlockedGirlIds.includes(post.girlId),
      ),
    [state.unlockedGirlIds],
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
    updateState((draft) => {
      const progress = draft.girls[girl.id];
      draft.credits += choice.creditReward;
      progress.mood = Math.max(0, Math.min(100, progress.mood + (choice.liked ? 8 : -6)));
      progress.talkStreak += 1;
      progress.chatSceneIndex = (progress.chatSceneIndex + 1) % girl.chatScenes.length;
    });
    setLastPlayerLine(choice.text);
    setLastReply(choice.reply);
    setFeedback(choice.liked ? `Liked · +${choice.creditReward} credits` : "She was not impressed this time.");
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
    const next = likedPosts.includes(postId)
      ? likedPosts.filter((id) => id !== postId)
      : [...likedPosts, postId];
    setLikedPosts(next);
    window.localStorage.setItem("pink-ledger-liked-posts", JSON.stringify(next));
  }

  function submitCommission() {
    const request: CommissionRequest = {
      ...commission,
      id: `commission-${Date.now()}`,
      status: "Submitted",
    };
    const next = [request, ...submittedCommissions];
    setSubmittedCommissions(next);
    window.localStorage.setItem("pink-ledger-commissions", JSON.stringify(next));
    setCommission({ ...commission, id: "", brief: "", status: "Draft" });
    setStudioStep(4);
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
            const liked = likedPosts.includes(post.id);
            return (
              <article className="social-post" key={post.id}>
                <header>
                  <button className="post-author" onClick={() => openProfile(girl.id)}>
                    <span className="mini-avatar"><Portrait girl={girl} alt="" /></span>
                    <span><b>{girl.name}</b><small>@{girl.handle} · {post.time}</small></span>
                  </button>
                  <span className={`visibility ${post.visibility}`}>{post.visibility}</span>
                </header>
                <button className="post-media" onClick={() => openProfile(girl.id, post.type === "room" ? "room" : "posts")}>
                  <img src={post.image} alt={`${girl.name}'s ${post.type} post`} />
                  {post.visibility === "private" && <span className="private-stamp">private circle</span>}
                </button>
                <div className="post-actions">
                  <button className={liked ? "liked" : ""} onClick={() => togglePostLike(post.id)} aria-label="Like post">
                    {liked ? "♥" : "♡"} {post.likes + (liked ? 1 : 0)}
                  </button>
                  <button onClick={() => openProfile(girl.id)}>◯ {post.comments}</button>
                  <button onClick={() => openMessages(girl.id)} disabled={!state.unlockedGirlIds.includes(girl.id)}>↗ Message</button>
                </div>
                <p><b>{girl.name}</b> {post.caption}</p>
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
    const sortedBoard = [...progress.leaderboard, { playerName: state.playerName, totalSpent: progress.totalSpent }]
      .filter((row, index, rows) => rows.findIndex((item) => item.playerName === row.playerName) === index)
      .sort((a, b) => b.totalSpent - a.totalSpent);
    return (
      <div className="profile-page" style={{ "--accent": selectedGirl.palette.main } as React.CSSProperties}>
        <section className="profile-hero">
          <div className="profile-cover"></div>
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
                <span><b>{selectedGirl.name}</b><small>@{selectedGirl.handle} · {progress.breakUntil > Date.now() ? "taking space" : "private circle"}</small></span>
              </button>
              <button onClick={() => openProfile(selectedGirlId, "room")}>View room</button>
            </header>
            <div className="thread-scroll">
              <div className="shared-scene">
                <RoomScene girl={selectedGirl} state={state} pendingRewardId={event?.rewardId} compact />
              </div>
              <div className="message incoming"><p>{event ? `${selectedGirl.name}: Something changed. Tell me you actually looked.` : lastReply || scene.prompt}</p></div>
              {lastPlayerLine && <div className="message outgoing"><p>{lastPlayerLine}</p></div>}
              {event ? (
                <section className="guess-panel">
                  <span className="eyebrow">Observation check</span>
                  <h3>What appeared in the room?</h3>
                  <div className="reply-grid">{guessOptions.sort(() => Math.random() - 0.5).map((reward) => <button key={reward.id} onClick={() => guessReward(reward.id)}>{reward.name}</button>)}</div>
                </section>
              ) : lastReply ? (
                <button className="continue-button" onClick={() => { setLastReply(""); setLastPlayerLine(""); setFeedback("Choose a suggested reply."); }}>Continue conversation</button>
              ) : (
                <section className="suggested-replies">
                  <span className="eyebrow">Suggested replies</span>
                  <div className="reply-grid">{scene.choices.map((choice) => <button key={choice.id} onClick={() => chooseReply(choice)}>{choice.text}</button>)}</div>
                </section>
              )}
              <p className="feedback-line">{feedback}</p>
            </div>
            <footer className="tribute-dock">
              <div><span>Attention</span><b>{progress.mood}%</b><i><em style={{ width: `${progress.mood}%` }}></em></i></div>
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
              <div className="studio-step"><span className="eyebrow">Step one</span><h2>Who inspires the piece?</h2><div className="character-choice">{[...girls.map((girl) => girl.name), "Artist's choice"].map((name) => <button className={commission.character === name ? "active" : ""} key={name} onClick={() => setCommission({ ...commission, character: name })}>{name}</button>)}</div><button className="primary" onClick={() => setStudioStep(2)}>Choose the direction</button></div>
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
        {submittedCommissions.length > 0 && <section className="request-list"><span className="eyebrow">Your requests</span>{submittedCommissions.map((request) => <article key={request.id}><b>{request.character} · {formatName[request.format]}</b><span>{request.status}</span></article>)}</section>}
      </section>
    );
  }

  function PlayerProfile() {
    return (
      <section className="player-page">
        <div className="player-banner"><span className="player-avatar">{state.avatarIcon}</span><div><span className="eyebrow">Collector profile</span><h1>{state.playerName}</h1><p>{state.finSubStyle} style · local demo profile</p></div></div>
        <div className="player-stats"><article><b>{state.credits}</b><span>credits</span></article><article><b>{state.money}</b><span>fictional money</span></article><article><b>{state.inventory.length}</b><span>art cards</span></article><article><b>{state.unlockedGirlIds.length}</b><span>private circles</span></article></div>
        <section className="settings-card"><h2>Account and demo settings</h2><p>All progression is stored in this browser. This fictional platform does not process real payments.</p><button onClick={exchangeCredits} disabled={state.credits < EXCHANGE_RATE.credits}>Exchange earned credits</button><button className="danger" onClick={() => { if (window.confirm("Reset all local Pink Ledger progress?")) { for (const key of [STORAGE_KEY, ...LEGACY_KEYS]) window.localStorage.removeItem(key); setState(createDefaultState()); setScreen("home"); } }}>Reset local progress</button></section>
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
          <button className={screen === "studio" ? "active" : ""} onClick={() => navigate("studio")}><i>✎</i><span>Artist&apos;s Studio</span></button>
        </nav>
        <div className="desktop-wallet"><span>{state.credits} cr</span><span>{state.money} money</span><button onClick={exchangeCredits} disabled={state.credits < EXCHANGE_RATE.credits}>Exchange</button></div>
        <p>Fictional adult profiles · demo</p>
      </aside>
      <section className="app-column">
        <header className="mobile-header"><button className="brand" onClick={() => navigate("home")}><span>PL</span><b>Pink Ledger</b></button><button onClick={() => navigate("profile")}>{state.money} ◇</button></header>
        <div className="app-content">
          {screen === "home" && <Feed />}
          {screen === "discover" && <Discover />}
          {screen === "messages" && <Messages />}
          {screen === "collection" && <Collection />}
          {screen === "studio" && <Studio />}
          {screen === "profile" && <PlayerProfile />}
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
