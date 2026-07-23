import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
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

test("server-renders the playable chat game shell", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Pink Ledger<\/title>/i);
  assert.match(html, /fictional credits only/i);
  assert.match(html, /Create your player/);
  assert.match(html, /<form class="login-card"/);
  assert.match(html, /name="player-name"/);
  assert.match(html, /name="age-confirmed"/);
  assert.match(html, /Start chat/);
  assert.match(html, /type="submit" class="start-button"/);
  assert.doesNotMatch(html, /class="start-button"[^>]*disabled/i);
  assert.match(html, /window\.__PINK_LEDGER_DATA__/);
  assert.match(html, /root\.addEventListener\("click"/);
  assert.match(html, /data-choice/);
  assert.match(html, /data-tribute/);
  assert.match(html, /gift-reveal/);
  assert.match(html, /She chooses what to buy/);
  assert.match(html, /Inventory/);
  assert.match(html, /<style>/i);
  assert.match(html, /\.room\{/);
  assert.match(html, /\.bubble\{/);

  const choiceMatches = html.match(/data-choice/g) ?? [];
  assert.ok(choiceMatches.length >= 1);
});

test("keeps v1 local, fictional, and payment-free", async () => {
  const [page, data, storage, payments, packageJson] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/game/data.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/game/storage.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/game/payments.ts", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.match(data, /choices:\s*\[/);
  assert.match(data, /TRIBUTE_AMOUNTS/);
  const dialogueSectionCount = (data.match(/id:\s*"(kiyo|mimi|runa)-/g) ?? []).length;
  assert.ok(dialogueSectionCount >= 16);
  assert.match(storage, /window\.localStorage/);
  assert.match(payments, /enabled:\s*false/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  assert.doesNotMatch(page, /checkout|stripe|paypal|card number|USD/i);
  assert.doesNotMatch(page, /_sites-preview|SkeletonPreview|codex-preview/);
});
