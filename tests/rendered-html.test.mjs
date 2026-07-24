import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the social game application", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Pink Ledger<\/title>/i);
  assert.match(html, /Opening your feed/i);
  assert.match(html, /Pink Ledger/i);
});

test("implements the fictional social, room, chat and collection systems", async () => {
  const [page, data, payments, css] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/game/data.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/game/payments.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);

  assert.match(page, /Home Feed|For you/);
  assert.match(page, /Discover/);
  assert.match(page, /PrivateAccessCard/);
  assert.match(page, /Artist&apos;s Studio/);
  assert.match(page, /RoomScene/);
  assert.match(page, /What appeared in the room/);
  assert.match(page, /pendingSpendEvent/);
  assert.match(page, /suggested replies/i);
  assert.match(page, /collection-grid/);
  assert.match(page, /fictional money/i);
  assert.match(data, /unlockedGirlIds:\s*\["kiyo",\s*"mimi"\]/);
  assert.match(data, /pendingTributes/);
  assert.match(data, /nextSpendAt/);
  assert.match(payments, /enabled:\s*false/);
  assert.match(css, /mobile-nav/);
  assert.match(css, /prefers-reduced-motion/);
  assert.doesNotMatch(page, /stripe|paypal|card number|USD/i);
});

test("includes all generated demo artwork", async () => {
  const art = [
    "kiyo-concept.webp",
    "mimi-concept.webp",
    "runa-concept.webp",
    "room-concept.webp",
    "reward-collection.webp",
  ];

  await Promise.all(art.map((name) => access(new URL(`../public/art/${name}`, import.meta.url))));
});
