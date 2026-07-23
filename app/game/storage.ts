import { createDefaultState } from "./data";
import type { PlayerState } from "./types";

const STORAGE_KEY = "pink-ledger-v1-state";

export type PersistenceAdapter = {
  load: () => PlayerState;
  save: (state: PlayerState) => void;
  reset: () => PlayerState;
};

function mergeWithDefaults(saved: PlayerState): PlayerState {
  const defaults = createDefaultState();
  const mergedGirls = {
    ...defaults.girls,
    ...saved.girls,
  };
  const isStarterSave =
    Object.values(mergedGirls).every((girl) => girl.totalSpent === 0) &&
    (!Array.isArray(saved.inventory) || saved.inventory.length === 0);

  return {
    ...defaults,
    ...saved,
    playerName: saved.playerName === "guest" ? "" : saved.playerName,
    ageConfirmed: Boolean(saved.ageConfirmed),
    money: isStarterSave ? Math.max(defaults.money, saved.money ?? 0) : saved.money,
    girls: mergedGirls,
    inventory: Array.isArray(saved.inventory) ? saved.inventory : [],
  };
}

export const localPersistence: PersistenceAdapter = {
  load() {
    if (typeof window === "undefined") {
      return createDefaultState();
    }

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return createDefaultState();
      }

      return mergeWithDefaults(JSON.parse(raw) as PlayerState);
    } catch {
      return createDefaultState();
    }
  },
  save(state) {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  },
  reset() {
    const state = createDefaultState();

    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }

    return state;
  },
};
