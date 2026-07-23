import { EXCHANGE_RATE, createDefaultState, girls } from "./game/data";

const gameData = JSON.stringify({
  girls,
  exchangeRate: EXCHANGE_RATE,
  defaultState: createDefaultState(),
}).replace(/</g, "\\u003c");

export default function Home() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <main id="game-root" className="game-shell">
        <noscript>This prototype needs JavaScript enabled to play.</noscript>
      </main>
      <script
        dangerouslySetInnerHTML={{
          __html: `window.__PINK_LEDGER_DATA__=${gameData};${script}`,
        }}
      />
    </>
  );
}

const styles = `
:root{--background:#fff6fb;--foreground:#35202c;--main:#f47aae;--soft:#ffe0ef;--ink:#6e3155;--line:rgba(128,61,99,.22);--shadow:0 20px 55px rgba(145,74,109,.22);font-family:"Trebuchet MS","Segoe UI",Arial,sans-serif}
*{box-sizing:border-box}html,body{min-height:100%;margin:0;background:var(--background);color:var(--foreground)}button,input{font:inherit}button{cursor:pointer}button:disabled{cursor:not-allowed;opacity:.5}
.game-shell{min-height:100vh;padding:16px;background:radial-gradient(circle at 12% 10%,rgba(255,255,255,.95) 0 5%,transparent 8%),linear-gradient(135deg,#fff6fb 0%,var(--soft) 44%,#ffd7e9 100%)}
.login-screen{position:fixed;inset:0;z-index:10;display:grid;place-items:center;padding:18px;background:linear-gradient(135deg,rgba(255,246,251,.97),rgba(255,215,233,.97))}
.login-room{position:relative;width:min(760px,100%);min-height:520px;overflow:hidden;border:10px solid #ffeef7;border-radius:8px;background:radial-gradient(circle at 18% 30%,rgba(255,255,255,.76),transparent 20%),linear-gradient(90deg,#f7d3e3 0 24%,#ffe8f2 24% 56%,#f4d5de 56%);box-shadow:0 24px 70px rgba(99,47,75,.26)}
.login-room:before{position:absolute;left:28px;bottom:48px;width:280px;height:140px;border-radius:8px;background:linear-gradient(#fff7fb,#ffd5e5);box-shadow:inset 0 -16px 0 rgba(238,142,181,.36);content:""}
.login-card{position:absolute;z-index:2;right:34px;top:50%;display:grid;gap:14px;width:min(390px,calc(100% - 68px));padding:22px;border:3px solid rgba(255,255,255,.88);border-radius:8px;background:rgba(255,250,253,.96);box-shadow:0 18px 40px rgba(107,49,79,.2);transform:translateY(-50%)}
.sticker-mark{display:inline-block;justify-self:start;padding:6px 12px;border:2px solid #fff;border-radius:999px;background:var(--main);color:#fff;font-size:1.2rem;font-weight:900;text-shadow:0 2px 0 rgba(91,40,68,.26);box-shadow:0 5px 0 rgba(156,80,119,.24)}
.login-card h1{margin:0;color:var(--ink);font-size:2rem;font-weight:950}.login-card p{margin:0;color:rgba(58,32,47,.75);line-height:1.35}
.login-field{display:grid;gap:6px}.login-field span{color:var(--ink);font-size:.82rem;font-weight:900;text-transform:uppercase}.login-field input{width:100%;padding:13px 14px;border:2px solid rgba(244,122,174,.34);border-radius:8px;background:#fff;color:var(--foreground);outline:none;font-size:1.1rem;font-weight:900}
.confirm-row{display:grid;grid-template-columns:22px 1fr;gap:10px;align-items:start;color:rgba(58,32,47,.78);font-size:.92rem;font-weight:800;line-height:1.3}.confirm-row input{width:18px;height:18px;accent-color:var(--main)}
.login-error{margin:0;padding:9px 10px;border:2px solid rgba(176,38,85,.24);border-radius:8px;background:#fff1f6;color:#8d244c;font-weight:900}.start-button,.primary-button{min-height:54px;border:0;border-radius:8px;background:var(--main);color:#fff;font-size:1.04rem;font-weight:950;box-shadow:0 7px 0 rgba(94,39,68,.18)}
.topbar,.play-guide,.panel,.chat-panel{border:2px solid rgba(255,255,255,.74);border-radius:8px;background:rgba(255,250,253,.92);box-shadow:0 12px 32px rgba(145,74,109,.16)}
.topbar{display:grid;grid-template-columns:1fr auto;gap:12px;align-items:center;max-width:1380px;margin:0 auto 12px;padding:10px 12px;border-radius:999px}.wallet{display:flex;flex-wrap:wrap;gap:8px;justify-content:flex-end}.wallet span,.pill{padding:8px 10px;border:1px solid var(--line);border-radius:999px;background:#fff;color:var(--ink);font-weight:900}
.play-guide{display:flex;flex-wrap:wrap;gap:8px;max-width:1380px;margin:0 auto 12px;padding:8px}.play-guide span,.play-guide strong{padding:7px 10px;border-radius:999px;background:#fff;color:var(--ink);font-size:.86rem;font-weight:900}.play-guide .hot{background:var(--main);color:#fff}
.game-grid{display:grid;grid-template-columns:180px minmax(0,1fr) 320px;gap:12px;max-width:1380px;margin:0 auto}.roster,.side-stack{display:grid;align-content:start;gap:12px}.girl-tab{display:grid;gap:4px;width:100%;padding:12px;border:2px solid rgba(255,255,255,.72);border-radius:8px;background:rgba(255,250,253,.92);color:var(--foreground);text-align:left;box-shadow:0 12px 32px rgba(145,74,109,.16)}.girl-tab.active{box-shadow:inset 0 0 0 2px var(--main),0 12px 28px rgba(145,74,109,.18)}.girl-tab b{font-size:1.25rem}
.stage{display:grid;grid-template-rows:minmax(500px,68vh) auto;gap:10px}.room{position:relative;min-height:500px;height:100%;overflow:hidden;border:8px solid #ffeef7;border-radius:8px;background:radial-gradient(circle at 20% 24%,rgba(255,255,255,.62),transparent 20%),linear-gradient(rgba(255,255,255,.05),rgba(255,221,238,.58)),linear-gradient(90deg,#f7d3e3 0 18%,#ffe8f2 18% 45%,#f4d5de 45%);box-shadow:0 22px 60px rgba(99,47,75,.24)}
.room:before{position:absolute;inset:0;content:"";opacity:.8;background:linear-gradient(90deg,transparent 0 18%,rgba(255,255,255,.58) 18% 19%,transparent 19% 45%,rgba(255,255,255,.4) 45% 46%,transparent 46%),repeating-linear-gradient(90deg,rgba(255,255,255,.2) 0 2px,transparent 2px 70px)}
.bed{position:absolute;left:26px;bottom:116px;width:370px;height:160px;border-radius:8px;background:linear-gradient(#fff7fb,#ffd5e5);box-shadow:inset 0 -16px 0 rgba(238,142,181,.36)}.desk{position:absolute;right:42px;bottom:130px;width:230px;height:120px;border-radius:8px;background:#f5c7d8}.screen{position:absolute;left:50px;top:-54px;width:126px;height:70px;border:8px solid #fdf2f8;border-radius:8px;background:#2a222a}
.avatar{position:absolute;right:11%;bottom:138px;width:280px;height:390px;filter:drop-shadow(0 8px 0 rgba(74,42,58,.18))}.avatar div,.avatar span{position:absolute}.hair,.head,.neck,.body,.arm{background:#fff;border:4px solid #2d2930}.hair{left:54px;top:0;width:142px;height:156px;border-radius:48% 52% 46% 45%;transform:rotate(-4deg)}.head{left:74px;top:54px;width:104px;height:116px;border-top:0;border-radius:48%}.neck{left:104px;top:156px;width:46px;height:40px;border-top:0;border-bottom:0}.body{left:62px;top:184px;width:138px;height:146px;border-radius:44px 44px 18px 18px}.arm{left:0;top:176px;width:90px;height:34px;border-radius:24px;transform:rotate(-24deg)}.eye{top:42px;width:28px;height:18px;border:3px solid #2d2930;border-top:0;border-radius:0 0 12px 12px}.eye.left{left:20px;transform:rotate(8deg)}.eye.right{right:18px;transform:rotate(-8deg)}.mouth{left:48px;top:76px;width:12px;height:12px;border-right:3px solid #2d2930;border-bottom:3px solid #2d2930;transform:rotate(45deg)}.reward-layer{inset:38px 10px 8px;border:3px solid var(--main);border-radius:34px;background:linear-gradient(160deg,rgba(255,255,255,.24),var(--soft))}.bow{left:138px;top:18px;width:48px;height:34px;border-radius:999px;background:var(--main);border:3px solid #2d2930}
.bubble{position:absolute;left:5%;right:5%;bottom:22px;display:grid;grid-template-columns:132px 1fr;min-height:118px;border:12px solid #ffe8f4;border-radius:999px 24px 24px 999px;background:rgba(255,211,231,.95);box-shadow:0 12px 0 rgba(130,64,99,.11),0 18px 38px rgba(88,45,68,.16)}.speaker{display:grid;place-items:center;border-radius:999px;background:var(--main);color:#fff;font-size:1.45rem;font-weight:950}.bubble-copy{align-self:center;padding:14px 24px}.you-said{display:block;margin-bottom:6px;color:rgba(73,34,56,.68);font-size:.84rem;font-weight:900}.bubble p{margin:0;color:var(--ink);font-size:clamp(1rem,1.6vw,1.32rem);font-style:italic;font-weight:900;line-height:1.25}
.chat-panel,.panel{padding:12px}.meta{display:flex;justify-content:space-between;gap:12px}.meta h1,.panel h2,.reward h3{margin:0;color:var(--ink)}.meta p,.reward p,.empty{margin:4px 0 0;color:rgba(58,32,47,.74);line-height:1.35}.mood{min-width:150px}.mood span{display:block;margin-bottom:5px;color:var(--ink);font-size:.8rem;font-weight:900}.mood div{height:12px;overflow:hidden;border-radius:999px;background:#ffe4f0}.mood i{display:block;height:100%;border-radius:inherit;background:linear-gradient(90deg,var(--main),#ffd166)}
.choices{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin-top:12px}.choice,.continue{min-height:58px;padding:12px 14px;border:2px solid rgba(244,122,174,.32);border-radius:8px;background:linear-gradient(180deg,#fff,#fff0f7);color:var(--ink);box-shadow:0 5px 0 rgba(174,93,132,.12);font-weight:900;text-align:left;line-height:1.25}.continue{width:100%;margin-top:12px;text-align:center;background:var(--main);color:#fff}
.feedback{margin:12px 0 0;color:var(--ink);font-weight:900}.reward-list,.token-list,.leaderboard{display:grid;gap:10px;margin-top:12px}.reward{display:grid;gap:10px;padding:12px;border:1px solid rgba(128,61,99,.14);border-radius:8px;background:#fffafd}.reward button{padding:10px;border:0;border-radius:8px;background:var(--main);color:#fff;font-weight:900}.token{padding:8px 10px;border-radius:999px;background:#fff;color:var(--ink);font-size:.82rem;font-weight:900}.leaderboard{padding:0;list-style:none}.leaderboard li{display:flex;justify-content:space-between;padding:9px 10px;border-radius:8px;background:#fff}.reset{position:fixed;right:18px;bottom:18px;padding:10px 12px;border:0;border-radius:8px;background:#5b3a4a;color:#fff;font-weight:900}
@media(max-width:1000px){.game-grid{grid-template-columns:1fr}.roster{grid-template-columns:repeat(3,1fr)}.side-stack{grid-template-columns:repeat(3,1fr)}}@media(max-width:700px){.topbar,.game-grid,.side-stack,.roster{grid-template-columns:1fr}.room{min-height:520px}.avatar{right:-10px;bottom:150px;transform:scale(.82);transform-origin:bottom right}.bubble{left:10px;right:10px;grid-template-columns:1fr;border-radius:8px}.speaker{min-height:54px;border-radius:8px 8px 0 0}.choices{grid-template-columns:1fr}.login-card{left:16px;right:16px;width:auto}}
`;

const script = `
(function(){
  var data = window.__PINK_LEDGER_DATA__;
  var root = document.getElementById("game-root");
  var key = "pink-ledger-v2-state";
  var selectedGirlId = "kiyo";
  var lastReply = "";
  var lastPlayerLine = "";
  var feedback = "Pick a reply. Liked answers pay credits.";

  function clone(value){ return JSON.parse(JSON.stringify(value)); }
  function loadState(){
    try {
      var saved = JSON.parse(localStorage.getItem(key) || "null");
      if (saved) return Object.assign(clone(data.defaultState), saved, { girls: Object.assign(clone(data.defaultState.girls), saved.girls || {}) });
    } catch {}
    return clone(data.defaultState);
  }
  var state = loadState();
  function save(){ localStorage.setItem(key, JSON.stringify(state)); }
  function girl(){ return data.girls.find(function(item){ return item.id === selectedGirlId; }) || data.girls[0]; }
  function progress(){ return state.girls[girl().id]; }
  function moneyLabel(){ return "Money: " + state.money; }
  function escapeHtml(value){ return String(value).replace(/[&<>"']/g,function(char){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[char];}); }

  function renderLogin(){
    root.innerHTML = '<section class="login-screen" aria-label="Create player"><div class="login-room"><form class="login-card" id="login-form"><span class="sticker-mark">Pink Ledger</span><h1>Create your player</h1><p>Local prototype profile. Your name, wallet, inventory, and leaderboard progress save on this browser only.</p><label class="login-field"><span>Player name</span><input name="player-name" maxlength="16" value="'+escapeHtml(state.playerName || "")+'" placeholder="enter a name"></label><label class="confirm-row"><input name="age-confirmed" type="checkbox" '+(state.ageConfirmed?"checked":"")+'><span>I understand this is an adult-themed fictional game with no real-money purchases.</span></label><p class="login-error" id="login-error" hidden></p><button type="submit" class="start-button">Start chat</button></form></div></section>';
    document.getElementById("login-form").addEventListener("submit", function(event){
      event.preventDefault();
      var form = new FormData(event.currentTarget);
      var name = String(form.get("player-name") || "").trim().slice(0, 16);
      var confirmed = form.get("age-confirmed") === "on";
      var error = document.getElementById("login-error");
      if (!name) { error.hidden = false; error.textContent = "Enter a player name first."; return; }
      if (!confirmed) { error.hidden = false; error.textContent = "Check the confirmation box to start."; return; }
      state.playerName = name;
      state.ageConfirmed = true;
      save();
      feedback = "Welcome, " + name + ". Choose a reply to start earning credits.";
      renderGame();
    });
  }

  function avatarHtml(unlocked){
    var hasReward = unlocked.length > 0;
    return '<div class="avatar"><div class="hair"></div><div class="head"><span class="eye left"></span><span class="eye right"></span><span class="mouth"></span></div><div class="neck"></div><div class="body">'+(hasReward?'<span class="reward-layer"></span>':'')+'</div><div class="arm"></div>'+(hasReward?'<span class="bow"></span>':'')+'</div>';
  }

  function renderGame(){
    var g = girl();
    var p = progress();
    var unlocked = p.unlockedRewardIds || [];
    var scene = g.chatScenes[p.chatSceneIndex % g.chatScenes.length];
    var canExchange = state.credits >= data.exchangeRate.credits;
    var canAfford = g.rewards.some(function(reward){ return unlocked.indexOf(reward.id) < 0 && state.money >= reward.price; });
    root.style.setProperty("--main", g.palette.main);
    root.style.setProperty("--soft", g.palette.soft);
    root.style.setProperty("--ink", g.palette.ink);
    root.innerHTML =
      '<section class="topbar"><div><span class="sticker-mark">Pink Ledger</span> <span class="pill">fictional credits only</span></div><div class="wallet"><span>Player: '+escapeHtml(state.playerName)+'</span><span>Credits: '+state.credits+'</span><span>'+moneyLabel()+'</span><button class="primary-button" data-action="exchange" '+(!canExchange?'disabled':'')+'>Exchange</button></div></section>' +
      '<section class="play-guide"><strong>Playable loop</strong><span class="'+(!lastReply?'hot':'')+'">1. Choose a reply</span><span class="'+(canExchange?'hot':'')+'">2. Exchange credits</span><span class="'+(canAfford?'hot':'')+'">3. Send tribute</span><span>4. Unlock look + token</span></section>' +
      '<section class="game-grid"><aside class="roster">'+data.girls.map(function(item){ var gp = state.girls[item.id]; return '<button class="girl-tab '+(item.id===selectedGirlId?'active':'')+'" data-girl="'+item.id+'"><b>'+escapeHtml(item.name)+'</b><span>@'+escapeHtml(item.handle)+'</span><span>Spent '+gp.totalSpent+'</span></button>'; }).join("")+'</aside>' +
      '<section class="stage"><div class="room"><div class="bed"></div><div class="desk"><div class="screen"></div></div>'+avatarHtml(unlocked)+'<div class="bubble"><div class="speaker">'+escapeHtml(g.name)+'</div><div class="bubble-copy">'+(lastPlayerLine?'<span class="you-said">You: '+escapeHtml(lastPlayerLine)+'</span>':'')+'<p>'+escapeHtml(lastReply || scene.prompt)+'</p></div></div></div>' +
      '<div class="chat-panel"><div class="meta"><div><h1>'+escapeHtml(g.name)+'</h1><p>'+escapeHtml(g.personality)+'</p></div><div class="mood"><span>Mood</span><div><i style="width:'+p.mood+'%"></i></div></div></div>' +
      (lastReply ? '<button class="continue" data-action="continue">Continue chat</button>' : '<div class="choices">'+scene.choices.map(function(choice, index){ return '<button class="choice" data-choice="'+index+'">'+escapeHtml(choice.text)+'</button>'; }).join("")+'</div>') +
      '<p class="feedback">'+escapeHtml(feedback)+'</p></div></section>' +
      '<aside class="side-stack"><section class="panel"><h2>Tribute Shop</h2><p>'+escapeHtml(g.bio)+'</p><div class="reward-list">'+g.rewards.map(function(reward){ var owned = unlocked.indexOf(reward.id) >= 0; var disabled = owned || state.money < reward.price; return '<article class="reward"><div><h3>'+escapeHtml(reward.name)+'</h3><p>'+escapeHtml(reward.description)+'</p></div><button data-reward="'+reward.id+'" '+(disabled?'disabled':'')+'>'+(owned?'Owned':state.money<reward.price?'Need '+(reward.price-state.money):'Tribute '+reward.price)+'</button></article>'; }).join("")+'</div></section>' +
      '<section class="panel"><h2>Inventory</h2><div class="token-list">'+(state.inventory.length ? state.inventory.slice(0,6).map(function(token){ return '<span class="token">'+escapeHtml(token.name)+'</span>'; }).join("") : '<p class="empty">Tokens appear here after a tribute unlock.</p>')+'</div></section>' +
      '<section class="panel"><h2>'+escapeHtml(g.name)+' Board</h2><ol class="leaderboard">'+leaderboardRows(g.id)+'</ol></section></aside></section><button class="reset" data-action="reset">Reset local save</button>';
  }

  function leaderboardRows(girlId){
    var p = state.girls[girlId];
    var rows = (p.leaderboard || []).filter(function(row){ return row.playerName !== state.playerName; });
    rows.push({ playerName: state.playerName || "guest", totalSpent: p.totalSpent });
    rows.sort(function(a,b){ return b.totalSpent - a.totalSpent; });
    return rows.slice(0,5).map(function(row, index){ return '<li><span>'+(index+1)+'. '+escapeHtml(row.playerName)+'</span><strong>'+row.totalSpent+'</strong></li>'; }).join("");
  }

  root.addEventListener("click", function(event){
    var target = event.target.closest("button");
    if (!target) return;
    if (target.dataset.girl) { selectedGirlId = target.dataset.girl; lastReply = ""; lastPlayerLine = ""; feedback = "New chat open. Pick one of four replies."; renderGame(); return; }
    if (target.dataset.choice) {
      var g = girl(), p = progress(), scene = g.chatScenes[p.chatSceneIndex % g.chatScenes.length], choice = scene.choices[Number(target.dataset.choice)];
      state.credits += choice.creditReward;
      p.mood = Math.max(0, Math.min(100, p.mood + (choice.liked ? 8 : -6)));
      p.chatSceneIndex = (p.chatSceneIndex + 1) % g.chatScenes.length;
      lastPlayerLine = choice.text;
      lastReply = choice.reply;
      feedback = choice.liked ? "Liked. +" + choice.creditReward + " credits." : "Disliked. No credits this time.";
      save(); renderGame(); return;
    }
    if (target.dataset.reward) {
      var g = girl(), p = progress(), reward = g.rewards.find(function(item){ return item.id === target.dataset.reward; });
      if (!reward || p.unlockedRewardIds.indexOf(reward.id) >= 0 || state.money < reward.price) return;
      state.money -= reward.price;
      p.totalSpent += reward.price;
      p.mood = Math.min(100, p.mood + 12);
      p.unlockedRewardIds.push(reward.id);
      state.inventory.unshift({ id: g.id + "-" + reward.id + "-" + Date.now(), girlId: g.id, rewardId: reward.id, name: reward.tokenName, kind: reward.kind, acquiredAt: new Date().toISOString() });
      p.leaderboard = (p.leaderboard || []).filter(function(row){ return row.playerName !== state.playerName; });
      p.leaderboard.push({ playerName: state.playerName, totalSpent: p.totalSpent });
      feedback = g.name + " bought herself " + reward.name + ". Token added.";
      save(); renderGame(); return;
    }
    if (target.dataset.action === "exchange") {
      var bundles = Math.floor(state.credits / data.exchangeRate.credits);
      if (bundles > 0) { state.credits -= bundles * data.exchangeRate.credits; state.money += bundles * data.exchangeRate.money; feedback = "Converted credits into in-game money."; save(); renderGame(); }
      return;
    }
    if (target.dataset.action === "continue") { lastReply = ""; lastPlayerLine = ""; feedback = "Your turn. Choose one reply."; renderGame(); return; }
    if (target.dataset.action === "reset") { localStorage.removeItem(key); state = clone(data.defaultState); selectedGirlId = "kiyo"; lastReply = ""; lastPlayerLine = ""; feedback = "Local save reset."; renderLogin(); }
  });

  if (state.playerName && state.ageConfirmed) renderGame(); else renderLogin();
})();
`;
