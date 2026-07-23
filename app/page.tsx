import { EXCHANGE_RATE, TRIBUTE_AMOUNTS, createDefaultState, girls } from "./game/data";

const gameData = JSON.stringify({
  girls,
  exchangeRate: EXCHANGE_RATE,
  tributeAmounts: TRIBUTE_AMOUNTS,
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
.feedback{margin:12px 0 0;color:var(--ink);font-weight:900}.tribute-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin-top:12px}.tribute-button{min-height:50px;padding:10px;border:0;border-radius:8px;background:var(--main);color:#fff;font-weight:950;box-shadow:0 5px 0 rgba(94,39,68,.18)}.reward-list,.token-list,.leaderboard{display:grid;gap:10px;margin-top:12px}.reward{display:grid;gap:4px;padding:10px;border:1px solid rgba(128,61,99,.14);border-radius:8px;background:#fffafd}.reward.owned{background:linear-gradient(135deg,#fff,var(--soft))}.reward small{color:rgba(58,32,47,.66);font-weight:900;text-transform:uppercase}.token{padding:8px 10px;border-radius:999px;background:#fff;color:var(--ink);font-size:.82rem;font-weight:900}.leaderboard{padding:0;list-style:none}.leaderboard li{display:flex;justify-content:space-between;padding:9px 10px;border-radius:8px;background:#fff}.gift-reveal{position:fixed;inset:0;z-index:30;display:grid;place-items:center;padding:18px;background:rgba(70,31,52,.38);backdrop-filter:blur(6px)}.gift-card{display:grid;gap:12px;width:min(460px,100%);padding:22px;border:4px solid #ffe8f4;border-radius:8px;background:#fffafd;box-shadow:0 24px 70px rgba(99,47,75,.32);text-align:center}.gift-card h2{margin:0;color:var(--ink);font-size:1.8rem}.gift-card p{margin:0;color:rgba(58,32,47,.76);line-height:1.35}.gift-icon{display:grid;place-items:center;justify-self:center;width:120px;height:120px;border:6px solid #ffe8f4;border-radius:999px;background:linear-gradient(135deg,var(--main),var(--soft));color:#fff;font-size:3rem;font-weight:950}.gift-card button{min-height:50px;border:0;border-radius:8px;background:var(--main);color:#fff;font-weight:950}.reset{position:fixed;right:18px;bottom:18px;padding:10px 12px;border:0;border-radius:8px;background:#5b3a4a;color:#fff;font-weight:900}
@media(max-width:1000px){.game-grid{grid-template-columns:1fr}.roster{grid-template-columns:repeat(3,1fr)}.side-stack{grid-template-columns:repeat(3,1fr)}}@media(max-width:700px){.topbar,.game-grid,.side-stack,.roster{grid-template-columns:1fr}.room{min-height:520px}.avatar{right:-10px;bottom:150px;transform:scale(.82);transform-origin:bottom right}.bubble{left:10px;right:10px;grid-template-columns:1fr;border-radius:8px}.speaker{min-height:54px;border-radius:8px 8px 0 0}.choices{grid-template-columns:1fr}.login-card{left:16px;right:16px;width:auto}}
.girl-tab.locked{filter:saturate(.55);opacity:.78}.girl-tab.locked b:after{content:" locked";font-size:.72rem;text-transform:uppercase;color:#8b5570}.attention-meter{position:relative;display:grid;gap:6px;margin:12px 0 0}.attention-meter span{color:var(--ink);font-size:.82rem;font-weight:950;text-transform:uppercase}.attention-meter:after{height:12px;border-radius:999px;background:#ffe4f0;content:""}.attention-meter i{position:absolute;left:0;bottom:0;height:12px;border-radius:999px;background:linear-gradient(90deg,#5dd6a5,#ffd166,var(--main))}.break-card{display:grid;gap:8px;margin-top:12px;padding:12px;border:2px solid rgba(244,122,174,.28);border-radius:8px;background:#fff5fa}.break-card b{color:var(--ink)}.break-card p{margin:0;color:rgba(58,32,47,.74);line-height:1.35}.unlock-list{display:grid;gap:8px;margin-top:12px}.unlock-row{display:grid;grid-template-columns:1fr auto;gap:10px;align-items:center;padding:10px;border:1px solid rgba(128,61,99,.14);border-radius:8px;background:#fff}.unlock-row.owned{background:linear-gradient(135deg,#fff,#fff0f7)}.unlock-row p{margin:3px 0 0;color:rgba(58,32,47,.65);font-size:.82rem}.unlock-row span,.unlock-row button{align-self:center;padding:9px 10px;border:0;border-radius:8px;background:var(--main);color:#fff;font-weight:950}.unlock-row span{background:#5dd6a5;color:#263b34}
@media(max-width:760px){html,body{overflow-x:hidden}.game-shell{min-height:100svh;padding:0 0 18px;background:linear-gradient(180deg,#fff5fb 0,#ffe1ef 42%,#fff8fc 100%)}.topbar{position:sticky;top:0;z-index:8;grid-template-columns:1fr;margin:0;padding:10px 12px;border-width:0 0 2px;border-radius:0;background:rgba(255,250,253,.96);box-shadow:0 10px 26px rgba(145,74,109,.16);backdrop-filter:blur(10px)}.topbar .sticker-mark{font-size:1rem}.wallet{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));justify-content:stretch}.wallet span,.wallet button{min-height:40px;text-align:center}.wallet .primary-button{grid-column:1/-1;min-height:46px}.play-guide{display:flex;overflow-x:auto;flex-wrap:nowrap;margin:0;padding:9px 12px;border:0;border-radius:0;background:#fff8fc;box-shadow:none;scrollbar-width:none}.play-guide span,.play-guide strong{white-space:nowrap}.game-grid{gap:0;margin:0}.roster{display:flex;position:sticky;top:114px;z-index:7;overflow-x:auto;gap:8px;padding:10px 12px;background:rgba(255,248,252,.96);box-shadow:0 8px 22px rgba(145,74,109,.1);scrollbar-width:none}.girl-tab{min-width:132px;padding:10px;border-width:1px;box-shadow:none}.girl-tab b{font-size:1.05rem}.stage{grid-template-rows:auto auto;gap:0}.room{min-height:58svh;height:auto;margin:0;border-width:0 0 7px;border-radius:0;box-shadow:none}.bed{left:10px;bottom:104px;width:56%;height:118px}.desk{right:10px;bottom:116px;width:34%;height:98px}.screen{left:20px;top:-44px;width:78px;height:52px}.avatar{right:-34px;bottom:134px;width:236px;height:330px;transform:scale(.92);transform-origin:bottom right}.bubble{left:12px;right:12px;bottom:12px;grid-template-columns:72px 1fr;min-height:92px;border-width:7px;border-radius:999px 14px 14px 999px}.speaker{font-size:1rem}.bubble-copy{padding:10px 12px}.bubble p{font-size:1rem}.chat-panel{margin:0;padding:12px;border-width:0 0 2px;border-radius:0;box-shadow:none}.meta{display:grid;grid-template-columns:1fr}.meta h1{font-size:1.35rem}.mood{min-width:0}.choices{grid-template-columns:1fr;gap:10px}.choice,.continue{min-height:64px;font-size:.98rem}.side-stack{display:grid;grid-template-columns:1fr;gap:10px;padding:10px 12px}.panel{padding:12px;border-radius:8px;box-shadow:0 8px 22px rgba(145,74,109,.1)}.unlock-panel{order:-1}.tribute-grid{grid-template-columns:repeat(3,minmax(0,1fr))}.tribute-button{min-height:52px;padding:8px;font-size:.92rem}.reward-list{grid-template-columns:1fr}.reward{padding:9px}.gift-card{padding:18px}.gift-icon{width:92px;height:92px;font-size:2.2rem}.reset{right:10px;bottom:10px;z-index:9;min-height:42px}.login-room{min-height:100svh;width:100%;border:0;border-radius:0}.login-room:before{left:12px;bottom:42px;width:58%;height:120px}.login-card{top:auto;bottom:18px;left:12px;right:12px;width:auto;padding:18px;transform:none}.login-card h1{font-size:1.65rem}.unlock-row{grid-template-columns:1fr}.unlock-row button,.unlock-row span{width:100%;text-align:center}}
`;

const script = `
(function(){
  var data = window.__PINK_LEDGER_DATA__;
  var root = document.getElementById("game-root");
  var key = "pink-ledger-v3-state";
  var oldKey = "pink-ledger-v2-state";
  var maxTalkStreak = 4;
  var interruptPenalty = 8;
  var selectedGirlId = "kiyo";
  var lastReply = "";
  var lastPlayerLine = "";
  var feedback = "Pick a reply. Liked answers pay credits.";
  var giftReveal = null;

  function clone(value){ return JSON.parse(JSON.stringify(value)); }
  function loadState(){
    try {
      var saved = JSON.parse(localStorage.getItem(key) || localStorage.getItem(oldKey) || "null");
      if (saved) {
        var base = clone(data.defaultState);
        var mergedGirls = clone(base.girls);
        Object.keys(saved.girls || {}).forEach(function(id){
          mergedGirls[id] = Object.assign({}, mergedGirls[id], saved.girls[id]);
        });
        return Object.assign(base, saved, {
          unlockedGirlIds: saved.unlockedGirlIds || ["kiyo"],
          girls: mergedGirls,
        });
      }
    } catch {}
    return clone(data.defaultState);
  }
  var state = loadState();
  function save(){ localStorage.setItem(key, JSON.stringify(state)); }
  function girl(){ return data.girls.find(function(item){ return item.id === selectedGirlId; }) || data.girls[0]; }
  function progress(){ return state.girls[girl().id]; }
  function isGirlUnlocked(girlId){ return (state.unlockedGirlIds || ["kiyo"]).indexOf(girlId) >= 0; }
  function isReady(p){ return !p.breakUntil || Date.now() >= p.breakUntil; }
  function breakHint(p){
    if (isReady(p)) return "She might be ready. Try your luck.";
    return "She is bored and taking space. No timer. Guess when she is ready.";
  }
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

  function chooseGiftForTribute(g, p, amount) {
    var lockedAffordable = g.rewards
      .filter(function(reward){ return p.unlockedRewardIds.indexOf(reward.id) < 0 && reward.price <= amount; })
      .sort(function(a, b){ return b.price - a.price; });
    if (lockedAffordable.length) return lockedAffordable[0];
    return g.rewards.find(function(reward){ return p.unlockedRewardIds.indexOf(reward.id) < 0; }) || null;
  }

  function renderGame(){
    if (!isGirlUnlocked(selectedGirlId)) selectedGirlId = (state.unlockedGirlIds && state.unlockedGirlIds[0]) || "kiyo";
    var g = girl();
    var p = progress();
    var unlocked = p.unlockedRewardIds || [];
    var scene = g.chatScenes[p.chatSceneIndex % g.chatScenes.length];
    var ready = isReady(p);
    var canExchange = state.credits >= data.exchangeRate.credits;
    var canTribute = data.tributeAmounts.some(function(amount){ return state.money >= amount; });
    root.style.setProperty("--main", g.palette.main);
    root.style.setProperty("--soft", g.palette.soft);
    root.style.setProperty("--ink", g.palette.ink);
    root.innerHTML =
      '<section class="topbar"><div><span class="sticker-mark">Pink Ledger</span> <span class="pill">fictional credits only</span></div><div class="wallet"><span>Player: '+escapeHtml(state.playerName)+'</span><span>Credits: '+state.credits+'</span><span>'+moneyLabel()+'</span><button class="primary-button" data-action="exchange" '+(!canExchange?'disabled':'')+'>Exchange</button></div></section>' +
      '<section class="play-guide"><strong>'+escapeHtml(scene.threadTitle || "Ongoing chat")+'</strong><span class="'+(!lastReply && ready?'hot':'')+'">1. Choose a reply</span><span class="'+(!ready?'hot':'')+'">2. Respect breaks</span><span class="'+(canExchange?'hot':'')+'">3. Exchange credits</span><span class="'+(canTribute?'hot':'')+'">4. Send tribute</span></section>' +
      '<section class="game-grid"><aside class="roster">'+data.girls.map(function(item){ var gp = state.girls[item.id]; var unlockedGirl = isGirlUnlocked(item.id); return '<button class="girl-tab '+(item.id===selectedGirlId?'active':'')+' '+(!unlockedGirl?'locked':'')+'" data-girl="'+item.id+'"><b>'+escapeHtml(item.name)+'</b><span>@'+escapeHtml(item.handle)+'</span><span>'+(unlockedGirl?'Spent '+gp.totalSpent:'Locked - '+item.unlockPrice+' money')+'</span></button>'; }).join("")+'</aside>' +
      '<section class="stage"><div class="room"><div class="bed"></div><div class="desk"><div class="screen"></div></div>'+avatarHtml(unlocked)+'<div class="bubble"><div class="speaker">'+escapeHtml(g.name)+'</div><div class="bubble-copy">'+(lastPlayerLine?'<span class="you-said">You: '+escapeHtml(lastPlayerLine)+'</span>':'')+'<p>'+escapeHtml(lastReply || scene.prompt)+'</p></div></div></div>' +
      '<div class="chat-panel"><div class="meta"><div><h1>'+escapeHtml(g.name)+'</h1><p>'+escapeHtml(g.personality)+'</p></div><div class="mood"><span>Mood</span><div><i style="width:'+p.mood+'%"></i></div></div></div>' +
      '<div class="attention-meter"><span>Attention '+Math.min(maxTalkStreak, p.talkStreak || 0)+'/'+maxTalkStreak+'</span><i style="width:'+(100 - Math.min(100, ((p.talkStreak || 0) / maxTalkStreak) * 100))+'%"></i></div>' +
      (!ready ? '<div class="break-card"><b>Break mode</b><p>'+escapeHtml(breakHint(p))+'</p><button class="continue" data-action="check-ready">Check if she is ready</button></div>' : (lastReply ? '<button class="continue" data-action="continue">Continue chat</button>' : '<div class="choices">'+scene.choices.map(function(choice, index){ return '<button class="choice" data-choice="'+index+'">'+escapeHtml(choice.text)+'</button>'; }).join("")+'</div>')) +
      '<p class="feedback">'+escapeHtml(feedback)+'</p></div></section>' +
      '<aside class="side-stack"><section class="panel unlock-panel"><h2>Unlocks</h2><div class="unlock-list">'+data.girls.map(function(item){ var unlockedGirl = isGirlUnlocked(item.id); return '<article class="unlock-row '+(unlockedGirl?'owned':'')+'"><div><b>'+escapeHtml(item.name)+'</b><p>'+escapeHtml(item.unlockRequirement)+'</p></div>'+(unlockedGirl?'<span>Open</span>':'<button data-unlock="'+item.id+'" '+(state.money < item.unlockPrice ? 'disabled' : '')+'>Unlock '+item.unlockPrice+'</button>')+'</article>'; }).join("")+'</div></section><section class="panel"><h2>Tribute</h2><p>'+escapeHtml(g.bio)+' She chooses what to buy after you send money.</p><div class="tribute-grid">'+data.tributeAmounts.map(function(amount){ return '<button class="tribute-button" data-tribute="'+amount+'" '+(state.money < amount ? 'disabled' : '')+'>Send '+amount+'</button>'; }).join("")+'</div><div class="reward-list">'+g.rewards.map(function(reward){ var owned = unlocked.indexOf(reward.id) >= 0; return '<article class="reward '+(owned?'owned':'')+'"><h3>'+escapeHtml(reward.name)+'</h3><small>'+(owned?'Unlocked':'She may choose this at '+reward.price+'+')+'</small><p>'+escapeHtml(reward.description)+'</p></article>'; }).join("")+'</div></section>' +
      '<section class="panel"><h2>Inventory</h2><div class="token-list">'+(state.inventory.length ? state.inventory.slice(0,6).map(function(token){ return '<span class="token">'+escapeHtml(token.name)+'</span>'; }).join("") : '<p class="empty">Tokens appear here after a tribute unlock.</p>')+'</div></section>' +
      '<section class="panel"><h2>'+escapeHtml(g.name)+' Board</h2><ol class="leaderboard">'+leaderboardRows(g.id)+'</ol></section></aside></section><button class="reset" data-action="reset">Reset local save</button>' +
      (giftReveal ? '<section class="gift-reveal"><div class="gift-card"><div class="gift-icon">★</div><h2>'+escapeHtml(giftReveal.girlName)+' bought '+escapeHtml(giftReveal.rewardName)+'</h2><p>'+escapeHtml(giftReveal.description)+'</p><p><strong>Inventory token:</strong> '+escapeHtml(giftReveal.tokenName)+'</p><button data-action="close-reveal">Keep chatting</button></div></section>' : '');
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
    if (target.dataset.girl) {
      var tabGirl = data.girls.find(function(item){ return item.id === target.dataset.girl; });
      if (!tabGirl) return;
      if (!isGirlUnlocked(tabGirl.id)) {
        feedback = tabGirl.name + " is locked. Save enough in-game money and unlock her first.";
        renderGame();
        return;
      }
      selectedGirlId = tabGirl.id;
      lastReply = "";
      lastPlayerLine = "";
      feedback = isReady(progress()) ? "New chat open. Pick one of four replies." : breakHint(progress());
      renderGame();
      return;
    }
    if (target.dataset.choice) {
      var g = girl(), p = progress(), scene = g.chatScenes[p.chatSceneIndex % g.chatScenes.length], choice = scene.choices[Number(target.dataset.choice)];
      if (!isReady(p)) { feedback = breakHint(p); renderGame(); return; }
      state.credits += choice.creditReward;
      p.mood = Math.max(0, Math.min(100, p.mood + (choice.liked ? 8 : -6)));
      p.chatSceneIndex = (p.chatSceneIndex + 1) % g.chatScenes.length;
      p.talkStreak = (p.talkStreak || 0) + 1;
      lastPlayerLine = choice.text;
      lastReply = choice.reply;
      feedback = choice.liked ? "Liked. +" + choice.creditReward + " credits." : "Disliked. No credits this time.";
      if (p.talkStreak >= maxTalkStreak) {
        p.breakUntil = Date.now() + (p.breakDurationMs || 45000);
        p.breakDurationMs = Math.min(120000, Math.round((p.breakDurationMs || 45000) * 1.15));
        feedback = g.name + " is bored now and needs a break. Guess when she is ready or lose credits.";
      }
      save(); renderGame(); return;
    }
    if (target.dataset.unlock) {
      var unlockGirl = data.girls.find(function(item){ return item.id === target.dataset.unlock; });
      if (!unlockGirl || isGirlUnlocked(unlockGirl.id)) return;
      if (state.money < unlockGirl.unlockPrice) {
        feedback = "Not enough in-game money to unlock " + unlockGirl.name + ".";
        renderGame();
        return;
      }
      state.money -= unlockGirl.unlockPrice;
      state.unlockedGirlIds = (state.unlockedGirlIds || ["kiyo"]).concat(unlockGirl.id);
      selectedGirlId = unlockGirl.id;
      lastReply = "";
      lastPlayerLine = "";
      feedback = unlockGirl.name + " unlocked. She is watching your next reply.";
      save(); renderGame(); return;
    }
    if (target.dataset.tribute) {
      var amount = Number(target.dataset.tribute);
      var g = girl(), p = progress();
      if (!amount || state.money < amount) return;
      var reward = chooseGiftForTribute(g, p, amount);
      state.money -= amount;
      p.totalSpent += amount;
      p.mood = Math.min(100, p.mood + 12);
      p.leaderboard = (p.leaderboard || []).filter(function(row){ return row.playerName !== state.playerName; });
      p.leaderboard.push({ playerName: state.playerName, totalSpent: p.totalSpent });
      if (reward) {
        p.unlockedRewardIds.push(reward.id);
        state.inventory.unshift({ id: g.id + "-" + reward.id + "-" + Date.now(), girlId: g.id, rewardId: reward.id, name: reward.tokenName, kind: reward.kind, acquiredAt: new Date().toISOString() });
        giftReveal = { girlName: g.name, rewardName: reward.name, tokenName: reward.tokenName, description: reward.description };
        feedback = g.name + " chose her own gift after your tribute.";
      } else {
        giftReveal = { girlName: g.name, rewardName: "a private wishlist upgrade", tokenName: "Devotion Receipt", description: "She already unlocked the visible gifts, so this tribute went into her private stash." };
        feedback = g.name + " accepted the tribute and kept the choice private.";
      }
      save(); renderGame(); return;
    }
    if (target.dataset.action === "exchange") {
      var bundles = Math.floor(state.credits / data.exchangeRate.credits);
      if (bundles > 0) { state.credits -= bundles * data.exchangeRate.credits; state.money += bundles * data.exchangeRate.money; feedback = "Converted credits into in-game money."; save(); renderGame(); }
      return;
    }
    if (target.dataset.action === "continue") { lastReply = ""; lastPlayerLine = ""; feedback = "Your turn. Choose one reply."; renderGame(); return; }
    if (target.dataset.action === "check-ready") {
      var g = girl(), p = progress();
      if (isReady(p)) {
        p.breakUntil = 0;
        p.talkStreak = 0;
        lastReply = "";
        lastPlayerLine = "";
        feedback = g.name + " is ready again. Do not waste it.";
      } else {
        state.credits = Math.max(0, state.credits - interruptPenalty);
        p.mood = Math.max(0, p.mood - 5);
        feedback = "Too early. " + g.name + " ignored you and took " + interruptPenalty + " credits.";
      }
      save(); renderGame(); return;
    }
    if (target.dataset.action === "close-reveal") { giftReveal = null; renderGame(); return; }
    if (target.dataset.action === "reset") { localStorage.removeItem(key); state = clone(data.defaultState); selectedGirlId = "kiyo"; lastReply = ""; lastPlayerLine = ""; feedback = "Local save reset."; renderLogin(); }
  });

  if (state.playerName && state.ageConfirmed) renderGame(); else renderLogin();
})();
`;
