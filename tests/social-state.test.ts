import assert from "node:assert/strict";
import test from "node:test";
import { createDefaultState, girls } from "../app/game/data";
import {
  applyInteraction,
  buildCharacterPrompt,
  evaluateInteraction,
  migratePlayerState,
} from "../app/game/social";

test("migrates the previous save without losing progression", () => {
  const defaults = createDefaultState();
  const migrated = migratePlayerState({
    playerName: "LegacyPlayer",
    ageConfirmed: true,
    credits: 77,
    money: 321,
    unlockedGirlIds: ["kiyo"],
    inventory: [],
    girls: defaults.girls,
  });

  assert.equal(migrated.schemaVersion, 4);
  assert.equal(migrated.playerName, "LegacyPlayer");
  assert.equal(migrated.credits, 77);
  assert.equal(migrated.money, 321);
  assert.deepEqual(migrated.unlockedGirlIds, ["kiyo", "mimi"]);
  assert.equal(migrated.profile.complete, false);
  assert.ok(migrated.profile.ownedAvatarIds.length >= 3);
});

test("scores positive, neutral and boundary-breaking interactions deterministically", () => {
  const girl = girls[0];
  const progress = createDefaultState().girls.kiyo;

  const positive = evaluateInteraction(
    girl,
    progress,
    "I noticed the room styling around your vanity. Which detail did you choose first?",
  );
  const neutral = evaluateInteraction(girl, progress, "How was your day?");
  const negative = evaluateInteraction(girl, progress, "Give me private contact details and reply now.");

  assert.equal(positive.tone, "positive");
  assert.ok(positive.moodDelta > 0);
  assert.ok(positive.boredomDelta < 0);
  assert.equal(neutral.tone, "neutral");
  assert.equal(negative.tone, "negative");
  assert.ok(negative.familiarityDelta < 0);

  const updated = applyInteraction(progress, positive);
  assert.ok(updated.familiarity > progress.familiarity);
  assert.ok(updated.boredom < progress.boredom);
});

test("AI prompt preserves character context but denies game-state authority", () => {
  const state = createDefaultState();
  const prompt = buildCharacterPrompt(girls[2], state.girls.runa, "Player", [
    {
      id: "message-1",
      role: "player",
      content: "What game art have you liked lately?",
      createdAt: 1,
      mode: "ai",
    },
  ]);
  const system = prompt[0].content;

  assert.match(system, /fictional adult character/i);
  assert.match(system, /Never grant rewards, currency, private access/i);
  assert.match(system, /Never request real-world contact/i);
  assert.match(system, /mood is 50\/100/i);
  assert.equal(prompt.at(-1)?.role, "user");
});
