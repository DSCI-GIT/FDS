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
.avatar.outfit-on .reward-layer{background:linear-gradient(160deg,#fff,var(--soft) 45%,var(--main));opacity:.88}.avatar.makeup-on .mouth{border-color:var(--main)}.makeup-dot{left:23px;top:70px;width:58px;height:16px;border:0;border-radius:999px;background:radial-gradient(circle,var(--main) 0 26%,transparent 28% 100%);opacity:.55}.room-prop{right:-22px;bottom:50px;width:54px;height:54px;border:4px solid #2d2930;border-radius:14px;background:linear-gradient(135deg,#fff,var(--soft));box-shadow:0 0 0 7px rgba(255,255,255,.42)}.guess-card{display:grid;gap:9px;margin-top:12px;padding:12px;border:2px solid rgba(244,122,174,.32);border-radius:8px;background:linear-gradient(180deg,#fff,#fff5fb)}.guess-card b{color:var(--ink)}.guess-card p{margin:0;color:rgba(58,32,47,.74);line-height:1.35}.pending-purse{margin-top:10px;padding:9px 10px;border-radius:8px;background:#fff;color:var(--ink);font-weight:950}.spend-notice{position:fixed;left:12px;right:12px;top:14px;z-index:40;display:grid;place-items:center;pointer-events:none}.spend-notice div{display:grid;gap:6px;width:min(420px,100%);padding:14px;border:3px solid #ffe8f4;border-radius:8px;background:#fffafd;box-shadow:0 18px 48px rgba(99,47,75,.25);pointer-events:auto}.spend-notice b{color:var(--ink);font-size:1.08rem}.spend-notice p{margin:0;color:rgba(58,32,47,.74);line-height:1.32}.spend-notice button{justify-self:end;min-height:38px;padding:7px 14px;border:0;border-radius:8px;background:var(--main);color:#fff;font-weight:950}
.persona-screen{min-height:100vh;display:grid;place-items:center;padding:18px;background:linear-gradient(180deg,#fff5fb,#ffddec)}.persona-card,.player-card{display:grid;gap:14px;width:min(460px,100%);padding:20px;border:3px solid #ffe8f4;border-radius:8px;background:#fffafd;box-shadow:0 18px 48px rgba(99,47,75,.22)}.persona-card h1,.player-card h2{margin:0;color:var(--ink)}.persona-card p,.player-card p{margin:0;color:rgba(58,32,47,.74);line-height:1.35}.persona-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.persona-grid button,.avatar-picker button,.menu-actions button{border:2px solid rgba(244,122,174,.28);border-radius:8px;background:#fff;color:var(--ink);font-weight:950}.persona-grid button{display:grid;gap:4px;min-height:92px;padding:12px;text-align:left}.persona-grid span{font-size:.84rem;color:rgba(58,32,47,.68);line-height:1.25}.player-menu{position:fixed;inset:0;z-index:45;display:grid;place-items:end center;padding:14px;background:rgba(70,31,52,.32);backdrop-filter:blur(8px)}.player-head{display:grid;grid-template-columns:58px 1fr;gap:12px;align-items:center}.avatar-badge{display:grid;place-items:center;width:58px;height:58px;border:4px solid #ffe8f4;border-radius:999px;background:var(--main);color:#fff;font-weight:950}.login-field select{width:100%;padding:13px 14px;border:2px solid rgba(244,122,174,.34);border-radius:8px;background:#fff;color:var(--foreground);outline:none;font-weight:900}.avatar-picker{display:grid;gap:8px}.avatar-picker>span{color:var(--ink);font-size:.82rem;font-weight:900;text-transform:uppercase}.avatar-picker div{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}.avatar-picker button{min-height:46px}.avatar-picker button.active{background:var(--main);color:#fff}.menu-actions{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px}.menu-actions button{min-height:46px}.phone-toast{position:fixed;left:12px;right:12px;top:12px;z-index:50;display:grid;justify-items:center;pointer-events:none}.phone-toast div{display:grid;grid-template-columns:1fr auto;gap:3px 10px;width:min(430px,100%);padding:12px 12px 12px 14px;border:1px solid rgba(255,255,255,.8);border-radius:18px;background:rgba(255,250,253,.92);box-shadow:0 14px 40px rgba(73,34,56,.26);backdrop-filter:blur(12px);pointer-events:auto}.phone-toast b{color:var(--ink)}.phone-toast p{grid-column:1;margin:0;color:rgba(58,32,47,.72);font-size:.9rem;line-height:1.25}.phone-toast button{grid-row:1/3;grid-column:2;align-self:center;min-height:34px;border:0;border-radius:999px;background:var(--main);color:#fff;font-weight:950}.piggybank-bar{position:fixed;left:0;right:0;bottom:0;z-index:30;display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px;align-items:center;min-height:40px;padding:4px 10px calc(4px + env(safe-area-inset-bottom));border-top:2px solid #ffe8f4;background:rgba(255,250,253,.96);box-shadow:0 -8px 22px rgba(99,47,75,.14);backdrop-filter:blur(10px)}.piggybank{display:grid;grid-template-columns:32px 1fr;gap:8px;align-items:center;min-width:0;padding:0;border:0;background:transparent;color:var(--ink);font-weight:950;touch-action:manipulation}.piggybank:before{display:grid;place-items:center;width:28px;height:28px;border-radius:999px;background:radial-gradient(circle at 35% 25%,#fff 0 10%,var(--main) 12% 100%);color:#fff;font-size:.72rem;content:attr(data-avatar)}.piggybank b{overflow:hidden;font-size:.88rem;text-align:left;text-overflow:ellipsis;white-space:nowrap}.piggybank span{overflow:hidden;font-size:.78rem;text-align:left;text-overflow:ellipsis;white-space:nowrap}.piggybank>*{pointer-events:none}.piggy-exchange{min-height:31px;padding:5px 10px;border:0;border-radius:999px;background:var(--main);color:#fff;font-size:.82rem;font-weight:950}.piggy-exchange:disabled{opacity:.45}
.demand-card{display:grid;gap:9px;margin-top:12px;padding:12px;border:2px solid rgba(244,122,174,.34);border-radius:8px;background:linear-gradient(180deg,#fff,#fff0f7)}.demand-card b{color:var(--ink)}.demand-card p{margin:0;color:rgba(58,32,47,.74);line-height:1.35}
.confirming{outline:3px solid #ffd166!important;background:#5b3a4a!important;color:#fff!important;animation:confirmPulse .8s ease-in-out infinite alternate}@keyframes confirmPulse{from{transform:translateY(0)}to{transform:translateY(-2px)}}.piggybank b:after{content:" Menu";font-size:.68rem;color:rgba(110,49,85,.72)}
@media(max-width:760px){html,body{overflow-x:hidden}.game-shell{min-height:100svh;padding:0 0 48px;background:linear-gradient(180deg,#fff5fb 0,#ffe1ef 42%,#fff8fc 100%)}.topbar{position:sticky;top:0;z-index:8;display:flex;margin:0;padding:10px 12px;border-width:0 0 2px;border-radius:0;background:rgba(255,250,253,.96);box-shadow:0 10px 26px rgba(145,74,109,.16);backdrop-filter:blur(10px)}.topbar .sticker-mark{font-size:1rem}.play-guide{display:flex;overflow-x:auto;flex-wrap:nowrap;margin:0;padding:9px 12px;border:0;border-radius:0;background:#fff8fc;box-shadow:none;scrollbar-width:none}.play-guide span,.play-guide strong{white-space:nowrap}.game-grid{gap:0;margin:0}.roster{display:flex;position:sticky;top:54px;z-index:7;overflow-x:auto;gap:8px;padding:10px 12px;background:rgba(255,248,252,.96);box-shadow:0 8px 22px rgba(145,74,109,.1);scrollbar-width:none}.girl-tab{min-width:132px;padding:10px;border-width:1px;box-shadow:none}.girl-tab b{font-size:1.05rem}.stage{grid-template-rows:auto auto;gap:0}.room{min-height:70svh;height:auto;margin:0;border-width:0 0 7px;border-radius:0;box-shadow:none}.bed{left:10px;bottom:96px;width:54%;height:112px}.desk{right:8px;bottom:106px;width:32%;height:90px}.screen{left:18px;top:-40px;width:72px;height:48px}.avatar{right:-12px;bottom:112px;width:236px;height:330px;transform:scale(.72);transform-origin:bottom right}.bubble{left:10px;right:10px;bottom:8px;grid-template-columns:66px 1fr;min-height:86px;border-width:7px;border-radius:999px 14px 14px 999px}.speaker{font-size:.95rem}.bubble-copy{padding:9px 11px}.bubble p{font-size:.94rem}.chat-panel{margin:0;padding:12px;border-width:0 0 2px;border-radius:0;box-shadow:none}.meta{display:grid;grid-template-columns:1fr}.meta h1{font-size:1.35rem}.mood{min-width:0}.choices{grid-template-columns:1fr;gap:10px}.choice,.continue{min-height:64px;font-size:.98rem}.side-stack{display:grid;grid-template-columns:1fr;gap:10px;padding:10px 12px}.panel{padding:12px;border-radius:8px;box-shadow:0 8px 22px rgba(145,74,109,.1)}.unlock-panel{order:-1}.tribute-grid{grid-template-columns:repeat(3,minmax(0,1fr))}.tribute-button{min-height:52px;padding:8px;font-size:.92rem}.reward-list{grid-template-columns:1fr}.reward{padding:9px}.gift-card{padding:18px}.gift-icon{width:92px;height:92px;font-size:2.2rem}.reset{right:10px;bottom:10px;z-index:9;min-height:42px;display:none}.login-room{min-height:100svh;width:100%;border:0;border-radius:0}.login-room:before{left:12px;bottom:42px;width:58%;height:120px}.login-card{top:auto;bottom:18px;left:12px;right:12px;width:auto;padding:18px;transform:none}.login-card h1{font-size:1.65rem}.unlock-row{grid-template-columns:1fr}.unlock-row button,.unlock-row span{width:100%;text-align:center}.persona-grid{grid-template-columns:1fr}.menu-actions{grid-template-columns:1fr}.player-menu{place-items:end center;padding:10px}.player-card{max-height:92svh;overflow:auto}}
.contacts-toggle{position:relative;justify-self:end;min-height:40px;padding:8px 14px;border:0;border-radius:999px;background:var(--main);color:#fff;font-weight:950;touch-action:manipulation}.contacts-toggle span{position:absolute;right:-6px;top:-7px;display:grid;place-items:center;min-width:22px;height:22px;padding:0 6px;border:2px solid #fff;border-radius:999px;background:#5b3a4a;color:#fff;font-size:.76rem}.contacts-toggle>*{pointer-events:none}.contacts-menu{position:fixed;inset:0;z-index:42;display:grid;place-items:end center;padding:14px;background:rgba(70,31,52,.28);backdrop-filter:blur(7px)}.contacts-card{display:grid;gap:12px;width:min(440px,100%);max-height:82svh;padding:14px;border:3px solid #ffe8f4;border-radius:12px;background:#fffafd;box-shadow:0 18px 48px rgba(99,47,75,.24)}.contacts-head{display:flex;justify-content:space-between;gap:12px;align-items:center}.contacts-head h2{margin:0;color:var(--ink)}.contacts-head p{margin:2px 0 0;color:rgba(58,32,47,.65)}.contacts-head>span{display:grid;place-items:center;min-width:30px;height:30px;border-radius:999px;background:var(--main);color:#fff;font-weight:950}.contact-list{display:grid;gap:8px;overflow:auto}.contact-row{position:relative;display:grid;grid-template-columns:44px 1fr auto;gap:10px;align-items:center;min-height:62px;padding:9px 12px;border:1px solid rgba(128,61,99,.14);border-radius:10px;background:#fff;color:var(--foreground);text-align:left}.contact-row.active{box-shadow:inset 0 0 0 2px var(--main)}.contact-row.locked{opacity:.65}.contact-icon{display:grid;place-items:center;width:44px;height:44px;border-radius:999px;background:linear-gradient(135deg,var(--main),var(--soft));color:#fff;font-weight:950}.contact-row b{display:block;color:var(--ink)}.contact-row small{display:block;margin-top:2px;color:rgba(58,32,47,.66);font-weight:800}.contact-row i{display:grid;place-items:center;min-width:24px;height:24px;padding:0 7px;border-radius:999px;background:#5b3a4a;color:#fff;font-style:normal;font-weight:950}.close-contacts{min-height:44px;border:0;border-radius:8px;background:var(--main);color:#fff;font-weight:950}.topbar{grid-template-columns:1fr auto}@media(max-width:760px){.topbar{display:flex!important;justify-content:space-between;align-items:center}.roster{display:none!important}.contacts-menu,.player-menu{place-items:end center;padding:10px}.contacts-card,.player-card{max-height:92svh;overflow:auto}.game-shell{padding-bottom:48px!important}}
.confirm-popup{position:fixed;inset:0;z-index:55;display:grid;place-items:center;padding:18px;background:rgba(70,31,52,.32);backdrop-filter:blur(7px)}.confirm-popup>div{display:grid;gap:10px;width:min(360px,100%);padding:18px;border:3px solid #ffe8f4;border-radius:12px;background:#fffafd;box-shadow:0 18px 48px rgba(99,47,75,.26);text-align:center}.confirm-popup h2{margin:0;color:var(--ink)}.confirm-popup p{margin:0;color:rgba(58,32,47,.72)}.confirm-popup div div{display:grid;grid-template-columns:1fr 1fr;gap:8px}.confirm-popup button{min-height:46px;border:0;border-radius:8px;background:var(--main);color:#fff;font-weight:950}.confirm-popup button+button{background:#5b3a4a}
`;

const script = `
(function(){
  var data = window.__PINK_LEDGER_DATA__;
  var root = document.getElementById("game-root");
  var key = "pink-ledger-v5-state";
  var lastKey = "pink-ledger-v4-state";
  var oldKey = "pink-ledger-v2-state";
  var priorKey = "pink-ledger-v3-state";
  var maxTalkStreak = 4;
  var interruptPenalty = 8;
  var guessReward = 16;
  var guessPenalty = 12;
  var rivalNames = ["lacefund", "pinktax", "ledgerpet", "queueking", "glossnote"];
  var demandCooldown = 600000;
  var demandTones = {
    attention: "I want your attention translated into tribute. Now.",
    humiliation: "Prove you can take a little wallet shame and still be useful.",
    obedience: "Do not negotiate. Send the amount I asked for.",
    praise: "Be sweet, be generous, and tell me I chose correctly."
  };
  var selectedGirlId = "kiyo";
  var lastReply = "";
  var lastPlayerLine = "";
  var feedback = "Pick a reply. Liked answers pay credits.";
  var phoneNotice = null;
  var playerMenuOpen = false;
  var contactsOpen = false;
  var avatarOptions = ["PL", "BB", "RC", "GL", "VIP", "PET"];
  var pendingConfirm = null;

  function clone(value){ return JSON.parse(JSON.stringify(value)); }
  function loadState(){
    try {
      var saved = JSON.parse(localStorage.getItem(key) || localStorage.getItem(lastKey) || localStorage.getItem(priorKey) || localStorage.getItem(oldKey) || "null");
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
  function autosave(label){ state.lastSavedAt = Date.now(); save(); }
  function playSound(kind){
    try {
      var AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      var ctx = playSound.ctx || (playSound.ctx = new AudioContext());
      var now = ctx.currentTime;
      var gain = ctx.createGain();
      var osc = ctx.createOscillator();
      var tones = { tap: 360, positive: 740, negative: 160, notice: 520, confirm: 620 };
      osc.type = kind === "negative" ? "sawtooth" : "sine";
      osc.frequency.setValueAtTime(tones[kind] || tones.tap, now);
      if (kind === "positive") osc.frequency.exponentialRampToValueAtTime(980, now + 0.12);
      if (kind === "notice") osc.frequency.exponentialRampToValueAtTime(700, now + 0.18);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(kind === "negative" ? 0.055 : 0.07, now + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + (kind === "notice" ? 0.24 : 0.14));
      osc.connect(gain).connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.28);
    } catch {}
  }
  function pushNotice(title, body){
    phoneNotice = { title: title, body: body };
    playSound("notice");
    window.clearTimeout(pushNotice.timer);
    pushNotice.timer = window.setTimeout(function(){ phoneNotice = null; renderGame(); }, 4200);
  }
  function setConfirm(type, amount){
    pendingConfirm = { type: type, amount: amount, girlId: selectedGirlId };
    playSound("confirm");
  }
  function isConfirm(type, amount){
    return pendingConfirm && pendingConfirm.type === type && pendingConfirm.amount === amount && pendingConfirm.girlId === selectedGirlId;
  }
  function clearConfirm(){ pendingConfirm = null; }
  function confirmPopupHtml(){
    if (!pendingConfirm) return "";
    var label = pendingConfirm.type === "exchange" ? "Convert credits into money?" : pendingConfirm.type === "demand" ? "Send demanded tribute?" : "Send tribute?";
    var detail = pendingConfirm.type === "exchange" ? "This will convert all full credit bundles." : "Amount: " + pendingConfirm.amount;
    return '<section class="confirm-popup"><div><h2>'+escapeHtml(label)+'</h2><p>'+escapeHtml(detail)+'</p><div><button data-action="confirm-action">Confirm</button><button data-action="cancel-confirm">Cancel</button></div></div></section>';
  }
  function girl(){ return data.girls.find(function(item){ return item.id === selectedGirlId; }) || data.girls[0]; }
  function progress(){ return state.girls[girl().id]; }
  function isGirlUnlocked(girlId){ return (state.unlockedGirlIds || ["kiyo"]).indexOf(girlId) >= 0; }
  function isReady(p){ return !p.breakUntil || Date.now() >= p.breakUntil; }
  function pendingCountFor(girlId){
    var p = state.girls[girlId];
    if (!p || !isGirlUnlocked(girlId)) return 0;
    var count = 0;
    if (p.pendingSpendEvent) count += 1;
    if (p.pendingDemand) count += 1;
    if (!isReady(p)) count += 1;
    return count;
  }
  function totalPendingCount(){
    return data.girls.reduce(function(total, g){ return total + pendingCountFor(g.id); }, 0);
  }
  function breakHint(p){
    if (isReady(p)) return "She might be ready. Try your luck.";
    return "She is bored and taking space. No timer. Guess when she is ready.";
  }
  function moneyLabel(){ return "Money: " + state.money; }
  function escapeHtml(value){ return String(value).replace(/[&<>"']/g,function(char){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[char];}); }
  function sample(list){ return list[Math.floor(Math.random() * list.length)]; }
  function rewardById(g, id){ return g.rewards.find(function(reward){ return reward.id === id; }) || null; }
  function changeById(g, id){ return (g.visualChanges || []).find(function(change){ return change.id === id; }) || null; }
  function spendEventLabel(g, event){ var reward = rewardById(g, event.rewardId); return reward ? reward.name : "private upgrade"; }
  function addActiveChanges(p, ids){
    p.activeChangeIds = p.activeChangeIds || [];
    ids.forEach(function(id){ if (p.activeChangeIds.indexOf(id) < 0) p.activeChangeIds.push(id); });
  }
  function scheduleSpend(p){
    if (p.pendingTributes > 0 && !p.pendingSpendEvent && !p.nextSpendAt) {
      p.nextSpendAt = Date.now() + 9000 + Math.floor(Math.random() * 15000);
      window.setTimeout(function(){ processSpendEvents(); autosave("scheduled-spend"); renderGame(); }, 9500);
    }
  }

  function maybeDemandText(){
    if (!state.questionnaireComplete || Date.now() - (state.lastDemandAt || 0) < demandCooldown) return;
    if (state.money < 300) return;
    if (Math.random() > 0.025) return;
    var available = data.girls.filter(function(g){ return isGirlUnlocked(g.id) && !state.girls[g.id].pendingDemand; });
    if (!available.length) return;
    var g = sample(available);
    var p = state.girls[g.id];
    var tone = state.finSubStyle || "attention";
    var amount = sample(data.tributeAmounts.slice(0, 4));
    p.pendingDemand = {
      id: g.id + "-demand-" + Date.now(),
      amount: amount,
      tone: tone,
      message: demandTones[tone] || demandTones.attention,
      createdAt: Date.now(),
    };
    state.lastDemandAt = Date.now();
    pushNotice(g.name + " texted you", p.pendingDemand.message + " Tribute: " + amount);
    autosave("demand-text");
  }

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
      autosave("login");
      feedback = "Welcome, " + name + ". Pick the kind of attention you want them to compete over.";
      renderPersona();
    });
  }

  function renderPersona(){
    root.innerHTML = '<section class="persona-screen" aria-label="Player style questionnaire"><div class="persona-card"><span class="sticker-mark">Piggy profile</span><h1>What gets your attention?</h1><p>The girls will compete around this style in their texts and tribute demands.</p><div class="persona-grid"><button data-persona="humiliation"><b>Humiliation</b><span>Teasing, wallet shame, being called out.</span></button><button data-persona="attention"><b>Attention</b><span>Being noticed, messaged, and singled out.</span></button><button data-persona="obedience"><b>Obedience</b><span>Clear orders, strict amounts, no negotiation.</span></button><button data-persona="praise"><b>Praise</b><span>Sweet approval when you get it right.</span></button></div></div></section>';
  }

  function playerMenuHtml(){
    if (!playerMenuOpen) return "";
    return '<section class="player-menu"><form class="player-card" id="profile-form"><div class="player-head"><span class="avatar-badge">'+escapeHtml(state.avatarIcon || "PL")+'</span><div><h2>Player menu</h2><p>Autosaved local profile</p></div></div><label class="login-field"><span>Player name</span><input name="profile-name" maxlength="16" value="'+escapeHtml(state.playerName || "")+'"></label><label class="login-field"><span>Fin-sub style</span><select name="profile-style"><option value="humiliation" '+(state.finSubStyle==="humiliation"?"selected":"")+'>Humiliation</option><option value="attention" '+(state.finSubStyle==="attention"?"selected":"")+'>Attention</option><option value="obedience" '+(state.finSubStyle==="obedience"?"selected":"")+'>Obedience</option><option value="praise" '+(state.finSubStyle==="praise"?"selected":"")+'>Praise</option></select></label><div class="avatar-picker"><span>Avatar icon</span><div>'+avatarOptions.map(function(icon){ return '<button type="button" class="'+((state.avatarIcon || "PL")===icon?'active':'')+'" data-avatar="'+icon+'">'+icon+'</button>'; }).join("")+'</div></div><div class="menu-actions"><button type="submit" class="primary-button">Update profile</button><button type="button" data-action="logout">Logout</button><button type="button" data-action="close-menu">Close</button></div></form></section>';
  }

  function avatarHtml(g, p, unlocked){
    var active = (unlocked || []).concat(p.activeChangeIds || []);
    var hasReward = active.length > 0;
    var hasBow = active.some(function(id){ return /bow|choker|headset|hairclip|side|pearl|ribbon/.test(id); });
    var hasMakeup = active.some(function(id){ return /gloss|blush|liner|tint/.test(id); });
    var hasRoom = active.some(function(id){ return /lamp|mirror|controller|lights|note|sticker/.test(id); });
    var hasOutfit = active.some(function(id){ return /dress|coat|cardigan|set|hoodie|jacket/.test(id); });
    return '<div class="avatar '+(hasMakeup?'makeup-on':'')+' '+(hasOutfit?'outfit-on':'')+'"><div class="hair"></div><div class="head"><span class="eye left"></span><span class="eye right"></span><span class="mouth"></span>'+(hasMakeup?'<span class="makeup-dot"></span>':'')+'</div><div class="neck"></div><div class="body">'+(hasReward?'<span class="reward-layer"></span>':'')+'</div><div class="arm"></div>'+(hasBow?'<span class="bow"></span>':'')+(hasRoom?'<span class="room-prop"></span>':'')+'</div>';
  }

  function chooseGiftForTribute(g, p, amount) {
    var lockedAffordable = g.rewards
      .filter(function(reward){ return p.unlockedRewardIds.indexOf(reward.id) < 0 && reward.price <= amount; })
      .sort(function(a, b){ return b.price - a.price; });
    if (lockedAffordable.length) return lockedAffordable[0];
    return g.rewards.find(function(reward){ return p.unlockedRewardIds.indexOf(reward.id) < 0; }) || null;
  }

  function createSpendEvent(g, p, amount, sourcePlayerName, sourceIsRival) {
    var reward = chooseGiftForTribute(g, p, amount) || sample(g.rewards);
    var extras = (g.visualChanges || []).slice().sort(function(){ return Math.random() - 0.5; }).slice(0, Math.random() > 0.45 ? 2 : 1);
    var changeIds = [reward.id].concat(extras.map(function(change){ return change.id; }));
    p.pendingSpendEvent = {
      id: g.id + "-spend-" + Date.now() + "-" + Math.floor(Math.random() * 9999),
      rewardId: reward.id,
      sourcePlayerName: sourcePlayerName,
      sourceIsRival: sourceIsRival,
      amount: amount,
      changeIds: changeIds,
      createdAt: Date.now(),
    };
    addActiveChanges(p, changeIds);
    return p.pendingSpendEvent;
  }

  function processSpendEvents(){
    var didSpend = false;
    data.girls.forEach(function(g){
      var p = state.girls[g.id];
      if (!p || p.pendingSpendEvent || !p.pendingTributes || !p.nextSpendAt || Date.now() < p.nextSpendAt) return;
      var amount = Math.min(p.pendingTributes, Math.max(50, p.pendingTributes));
      p.pendingTributes = Math.max(0, p.pendingTributes - amount);
      p.nextSpendAt = p.pendingTributes > 0 ? Date.now() + 15000 + Math.floor(Math.random() * 20000) : 0;
      var event = createSpendEvent(g, p, amount, state.playerName || "you", false);
      pushNotice(g.name + " spent " + amount, event.sourcePlayerName + " funded a new change. Guess what she bought.");
      didSpend = true;
    });
    if (didSpend) autosave("spend-event");
  }

  function maybeRivalGift(g, p){
    if (p.pendingSpendEvent || !isGirlUnlocked(g.id) || Math.random() > 0.16) return;
    var amount = sample(data.tributeAmounts);
    var rival = sample(rivalNames);
    var event = createSpendEvent(g, p, amount, rival, true);
    p.leaderboard = p.leaderboard || [];
    var row = p.leaderboard.find(function(entry){ return entry.playerName === rival; });
    if (row) row.totalSpent += amount; else p.leaderboard.push({ playerName: rival, totalSpent: amount, creditsEarned: 0 });
    pushNotice(g.name + " got a rival gift", rival + " funded a change. Guess it and they earn credits too.");
  }

  function guessOptions(g, event){
    var correct = rewardById(g, event.rewardId);
    var options = g.rewards
      .filter(function(reward){ return reward.id !== event.rewardId; })
      .slice()
      .sort(function(){ return Math.random() - 0.5; })
      .slice(0, 2)
      .map(function(reward){ return { id: reward.id, label: reward.name }; });
    var change = event.changeIds.map(function(id){ return changeById(g, id); }).filter(Boolean)[0];
    if (change) options.push({ id: change.id, label: change.name });
    while (options.length < 3) {
      var filler = sample((g.visualChanges || []).concat(g.rewards));
      if (!options.some(function(option){ return option.id === filler.id; }) && filler.id !== event.rewardId) options.push({ id: filler.id, label: filler.name });
    }
    options.push({ id: event.rewardId, label: correct ? correct.name : "private upgrade" });
    return options.sort(function(){ return Math.random() - 0.5; });
  }

  function renderGame(){
    processSpendEvents();
    if (!isGirlUnlocked(selectedGirlId)) selectedGirlId = (state.unlockedGirlIds && state.unlockedGirlIds[0]) || "kiyo";
    var g = girl();
    var p = progress();
    var unlocked = p.unlockedRewardIds || [];
    var scene = g.chatScenes[p.chatSceneIndex % g.chatScenes.length];
    var ready = isReady(p);
    var pendingEvent = p.pendingSpendEvent;
    var pendingDemand = p.pendingDemand;
    var guessList = pendingEvent ? guessOptions(g, pendingEvent) : [];
    var canExchange = state.credits >= data.exchangeRate.credits;
    var canTribute = data.tributeAmounts.some(function(amount){ return state.money >= amount; });
    var totalPending = totalPendingCount();
    root.style.setProperty("--main", g.palette.main);
    root.style.setProperty("--soft", g.palette.soft);
    root.style.setProperty("--ink", g.palette.ink);
    root.innerHTML =
      '<section class="topbar"><div><span class="sticker-mark">Pink Ledger</span> <span class="pill">fictional credits only</span></div><button class="contacts-toggle" data-action="contacts" aria-label="Open girls contacts">Girls'+(totalPending?'<span>'+totalPending+'</span>':'')+'</button></section>' +
      '<section class="play-guide"><strong>'+escapeHtml(scene.threadTitle || "Ongoing chat")+'</strong><span class="'+(pendingEvent?'hot':'')+'">1. Spot changes</span><span class="'+(!lastReply && ready && !pendingEvent?'hot':'')+'">2. Choose a reply</span><span class="'+(!ready?'hot':'')+'">3. Respect breaks</span><span class="'+(canTribute?'hot':'')+'">4. Tribute refills</span></section>' +
      '<section class="game-grid">' +
      '<section class="stage"><div class="room"><div class="bed"></div><div class="desk"><div class="screen"></div></div>'+avatarHtml(g, p, unlocked)+'<div class="bubble"><div class="speaker">'+escapeHtml(g.name)+'</div><div class="bubble-copy">'+(lastPlayerLine?'<span class="you-said">You: '+escapeHtml(lastPlayerLine)+'</span>':'')+'<p>'+escapeHtml(lastReply || (pendingEvent ? "I spent tribute and changed something. Look before you talk." : scene.prompt))+'</p></div></div></div>' +
      '<div class="chat-panel"><div class="meta"><div><h1>'+escapeHtml(g.name)+'</h1><p>'+escapeHtml(g.personality)+'</p></div><div class="mood"><span>Mood</span><div><i style="width:'+p.mood+'%"></i></div></div></div>' +
      '<div class="attention-meter"><span>Attention '+Math.min(maxTalkStreak, p.talkStreak || 0)+'/'+maxTalkStreak+'</span><i style="width:'+(100 - Math.min(100, ((p.talkStreak || 0) / maxTalkStreak) * 100))+'%"></i></div>' +
      (pendingEvent ? '<div class="guess-card"><b>What did '+escapeHtml(g.name)+' buy or change?</b><p>'+escapeHtml(pendingEvent.sourceIsRival ? pendingEvent.sourcePlayerName + " funded this one. If you guess their gift, they get credits too." : "She spent from your pending tribute purse.")+'</p><div class="choices">'+guessList.map(function(option){ return '<button class="choice" data-guess="'+option.id+'">'+escapeHtml(option.label)+'</button>'; }).join("")+'</div></div>' : (pendingDemand ? '<div class="demand-card"><b>'+escapeHtml(g.name)+' demands tribute</b><p>'+escapeHtml(pendingDemand.message)+'</p><div class="tribute-grid"><button class="tribute-button" data-demand-pay="'+pendingDemand.amount+'" '+(state.money < pendingDemand.amount ? 'disabled' : '')+'>Send '+pendingDemand.amount+'</button><button class="choice" data-action="refuse-demand">Not now</button></div></div>' : (!ready ? '<div class="break-card"><b>Break mode</b><p>'+escapeHtml(breakHint(p))+'</p><button class="continue" data-action="check-ready">Check if she is ready</button></div>' : (lastReply ? '<button class="continue" data-action="continue">Continue chat</button>' : '<div class="choices">'+scene.choices.map(function(choice, index){ return '<button class="choice" data-choice="'+index+'">'+escapeHtml(choice.text)+'</button>'; }).join("")+'</div>')))) +
      '<p class="feedback">'+escapeHtml(feedback)+'</p></div></section>' +
      '<aside class="side-stack"><section class="panel unlock-panel"><h2>Unlocks</h2><div class="unlock-list">'+data.girls.map(function(item){ var unlockedGirl = isGirlUnlocked(item.id); return '<article class="unlock-row '+(unlockedGirl?'owned':'')+'"><div><b>'+escapeHtml(item.name)+'</b><p>'+escapeHtml(item.unlockRequirement)+'</p></div>'+(unlockedGirl?'<span>Open</span>':'<button data-unlock="'+item.id+'" '+(state.money < item.unlockPrice ? 'disabled' : '')+'>Unlock '+item.unlockPrice+'</button>')+'</article>'; }).join("")+'</div></section><section class="panel"><h2>Tribute</h2><p>'+escapeHtml(g.bio)+' Tribute refills her attention now. She spends it later and makes you guess the change.</p><div class="pending-purse">Pending purse: '+(p.pendingTributes || 0)+'</div><div class="tribute-grid">'+data.tributeAmounts.map(function(amount){ return '<button class="tribute-button" data-tribute="'+amount+'" '+(state.money < amount ? 'disabled' : '')+'>Send '+amount+'</button>'; }).join("")+'</div><div class="reward-list">'+g.rewards.map(function(reward){ var owned = unlocked.indexOf(reward.id) >= 0; return '<article class="reward '+(owned?'owned':'')+'"><h3>'+escapeHtml(reward.name)+'</h3><small>'+(owned?'Unlocked':'Possible spend at '+reward.price+'+')+'</small><p>'+escapeHtml(reward.description)+'</p></article>'; }).join("")+'</div></section>' +
      '<section class="panel"><h2>Inventory</h2><div class="token-list">'+(state.inventory.length ? state.inventory.slice(0,6).map(function(token){ return '<span class="token">'+escapeHtml(token.name)+'</span>'; }).join("") : '<p class="empty">Tokens appear here after you correctly identify a spend.</p>')+'</div></section>' +
      '<section class="panel"><h2>'+escapeHtml(g.name)+' Board</h2><ol class="leaderboard">'+leaderboardRows(g.id)+'</ol></section></aside></section><section class="piggybank-bar"><button class="piggybank" data-avatar="'+escapeHtml(state.avatarIcon || "PL")+'" data-action="wallet" aria-label="Open player menu"><b>'+escapeHtml(state.playerName || "Player")+'</b><span>'+state.credits+' cr / '+state.money+' money</span></button><button class="piggy-exchange" data-action="exchange" '+(!canExchange?'disabled':'')+'>Exchange</button></section><button class="reset" data-action="reset">Reset local save</button>' +
      (phoneNotice ? '<section class="phone-toast"><div><b>'+escapeHtml(phoneNotice.title)+'</b><p>'+escapeHtml(phoneNotice.body)+'</p><button data-action="close-notice">OK</button></div></section>' : '') +
      contactsHtml(totalPending) +
      confirmPopupHtml() +
      playerMenuHtml();
  }

  function contactsHtml(totalPending){
    if (!contactsOpen) return "";
    return '<section class="contacts-menu"><div class="contacts-card"><div class="contacts-head"><div><h2>Girls</h2><p>Choose a chat</p></div>'+(totalPending?'<span>'+totalPending+'</span>':'')+'</div><div class="contact-list">'+data.girls.map(function(item){ var gp = state.girls[item.id]; var unlockedGirl = isGirlUnlocked(item.id); var count = pendingCountFor(item.id); var status = !unlockedGirl ? 'Locked - '+item.unlockPrice+' money' : gp.pendingSpendEvent ? 'Changed something' : gp.pendingDemand ? 'Demand text' : !isReady(gp) ? 'Taking a break' : 'Ready to chat'; return '<button class="contact-row '+(item.id===selectedGirlId?'active':'')+' '+(!unlockedGirl?'locked':'')+'" data-girl="'+item.id+'"><span class="contact-icon">'+escapeHtml(item.name.slice(0,1))+'</span><span><b>'+escapeHtml(item.name)+'</b><small>@'+escapeHtml(item.handle)+' - '+escapeHtml(status)+'</small></span>'+(count?'<i>'+count+'</i>':'')+'</button>'; }).join("")+'</div><button class="close-contacts" data-action="close-contacts">Close</button></div></section>';
  }

  function runConfirmedAction(){
    if (!pendingConfirm) return;
    var action = pendingConfirm;
    clearConfirm();
    if (action.type === "exchange") {
      var bundles = Math.floor(state.credits / data.exchangeRate.credits);
      if (bundles > 0) {
        state.credits -= bundles * data.exchangeRate.credits;
        state.money += bundles * data.exchangeRate.money;
        feedback = "Converted credits into in-game money.";
        playSound("positive");
        maybeDemandText();
        autosave("exchange");
      }
      renderGame();
      return;
    }
    var g = girl(), p = progress(), amount = action.amount;
    if (action.type === "tribute") {
      if (!amount || state.money < amount) return;
      state.money -= amount;
      p.totalSpent += amount;
      p.pendingTributes = (p.pendingTributes || 0) + amount;
      p.talkStreak = 0;
      p.breakUntil = 0;
      p.mood = Math.min(100, p.mood + 12);
      p.leaderboard = (p.leaderboard || []).filter(function(row){ return row.playerName !== state.playerName; });
      p.leaderboard.push({ playerName: state.playerName, totalSpent: p.totalSpent });
      scheduleSpend(p);
      feedback = g.name + " accepted the tribute. Her attention is refilled, but she will spend it later.";
      playSound("positive");
      autosave("tribute");
      renderGame();
      return;
    }
    if (action.type === "demand") {
      if (!p.pendingDemand || state.money < amount) return;
      state.money -= amount;
      p.totalSpent += amount;
      p.pendingTributes = (p.pendingTributes || 0) + amount;
      p.pendingDemand = null;
      p.talkStreak = 0;
      p.breakUntil = 0;
      p.mood = Math.min(100, p.mood + 16);
      scheduleSpend(p);
      pushNotice(g.name + " accepted", "Attention refilled. She will spend it when she feels like it.");
      feedback = g.name + " got exactly what she demanded. Her meter is full again.";
      playSound("positive");
      autosave("demand-paid");
      renderGame();
    }
  }

  function leaderboardRows(girlId){
    var p = state.girls[girlId];
    var rows = (p.leaderboard || []).filter(function(row){ return row.playerName !== state.playerName; });
    rows.push({ playerName: state.playerName || "guest", totalSpent: p.totalSpent });
    rows.sort(function(a,b){ return b.totalSpent - a.totalSpent; });
    return rows.slice(0,5).map(function(row, index){ return '<li><span>'+(index+1)+'. '+escapeHtml(row.playerName)+(row.creditsEarned ? ' - +'+row.creditsEarned+' cr' : '')+'</span><strong>'+row.totalSpent+'</strong></li>'; }).join("");
  }

  Object.keys(state.girls || {}).forEach(function(id){ scheduleSpend(state.girls[id]); });

  document.addEventListener("pointerup", function(event){
    var target = event.target;
    var walletButton = target && target.closest ? target.closest(".piggybank") : null;
    if (!walletButton || !root.contains(walletButton)) return;
    event.preventDefault();
    event.stopPropagation();
    playSound("tap");
    playerMenuOpen = true;
    clearConfirm();
    renderGame();
  }, true);

  root.addEventListener("click", function(event){
    var target = event.target.closest("button");
    if (!target) return;
    playSound("tap");
    if (target.dataset.persona) {
      state.finSubStyle = target.dataset.persona;
      state.questionnaireComplete = true;
      state.lastDemandAt = Date.now();
      autosave("persona");
      playSound("positive");
      pushNotice("Profile saved", "The girls will compete for your " + state.finSubStyle + " side.");
      renderGame();
      return;
    }
    if (target.dataset.avatar) {
      state.avatarIcon = target.dataset.avatar;
      autosave("avatar");
      playSound("positive");
      renderGame();
      return;
    }
    if (target.dataset.girl) {
      var tabGirl = data.girls.find(function(item){ return item.id === target.dataset.girl; });
      if (!tabGirl) return;
      if (!isGirlUnlocked(tabGirl.id)) {
        feedback = tabGirl.name + " is locked. Save enough in-game money and unlock her first.";
        renderGame();
        return;
      }
      selectedGirlId = tabGirl.id;
      contactsOpen = false;
      lastReply = "";
      lastPlayerLine = "";
      maybeRivalGift(tabGirl, state.girls[tabGirl.id]);
      maybeDemandText();
      feedback = isReady(progress()) ? "New chat open. Pick one of four replies." : breakHint(progress());
      if (progress().pendingSpendEvent) feedback = tabGirl.name + " changed something. Guess it before chatting.";
      autosave("select-girl");
      renderGame();
      return;
    }
    if (target.dataset.choice) {
      var g = girl(), p = progress(), scene = g.chatScenes[p.chatSceneIndex % g.chatScenes.length], choice = scene.choices[Number(target.dataset.choice)];
      if (p.pendingSpendEvent) { feedback = "Guess what changed before she lets you chat normally."; renderGame(); return; }
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
      playSound(choice.liked ? "positive" : "negative");
      autosave("chat-choice"); renderGame(); return;
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
      playSound("positive");
      autosave("unlock-girl"); renderGame(); return;
    }
    if (target.dataset.tribute) {
      var amount = Number(target.dataset.tribute);
      var g = girl(), p = progress();
      if (!amount || state.money < amount) return;
      setConfirm("tribute", amount);
      renderGame();
      return;
    }
    if (target.dataset.demandPay) {
      var amount = Number(target.dataset.demandPay);
      var g = girl(), p = progress();
      if (!p.pendingDemand || state.money < amount) return;
      setConfirm("demand", amount);
      renderGame();
      return;
    }
    if (target.dataset.guess) {
      var g = girl(), p = progress(), event = p.pendingSpendEvent, reward = event && rewardById(g, event.rewardId);
      if (!event || !reward) return;
      var correct = target.dataset.guess === event.rewardId;
      if (correct) {
        state.credits += guessReward;
        p.talkStreak = 0;
        p.breakUntil = 0;
        p.mood = Math.min(100, p.mood + 10);
        if (p.unlockedRewardIds.indexOf(reward.id) < 0) p.unlockedRewardIds.push(reward.id);
        state.inventory.unshift({ id: g.id + "-" + reward.id + "-" + Date.now(), girlId: g.id, rewardId: reward.id, name: reward.tokenName, kind: reward.kind, acquiredAt: new Date().toISOString() });
        if (event.sourceIsRival) {
          var row = (p.leaderboard || []).find(function(entry){ return entry.playerName === event.sourcePlayerName; });
          if (row) row.creditsEarned = (row.creditsEarned || 0) + guessReward;
        }
        p.pendingSpendEvent = null;
        lastReply = g.name + " notices you caught it: " + reward.clue;
        lastPlayerLine = "I noticed the " + reward.name + ".";
        feedback = "Correct. +" + guessReward + " credits. Normal chat is open.";
        playSound("positive");
      } else {
        state.credits = Math.max(0, state.credits - guessPenalty);
        p.talkStreak = maxTalkStreak;
        p.breakUntil = Date.now() + (p.breakDurationMs || 45000);
        p.breakDurationMs = Math.min(140000, Math.round((p.breakDurationMs || 45000) * 1.2));
        p.mood = Math.max(0, p.mood - 12);
        p.pendingSpendEvent = null;
        lastReply = g.name + " shuts the chat window. You missed what changed.";
        lastPlayerLine = "I guessed wrong.";
        feedback = "Wrong. -" + guessPenalty + " credits, and she is instantly bored.";
        playSound("negative");
      }
      autosave("guess"); renderGame(); return;
    }
    if (target.dataset.action === "exchange") {
      var bundles = Math.floor(state.credits / data.exchangeRate.credits);
      if (bundles > 0) {
        setConfirm("exchange", 0);
        renderGame();
      }
      return;
    }
    if (target.dataset.action === "confirm-action") { runConfirmedAction(); return; }
    if (target.dataset.action === "cancel-confirm") { clearConfirm(); renderGame(); return; }
    if (target.dataset.action === "continue") { var cg = girl(), cp = progress(); clearConfirm(); maybeRivalGift(cg, cp); maybeDemandText(); lastReply = ""; lastPlayerLine = ""; feedback = cp.pendingSpendEvent ? cg.name + " changed something. Guess it before chatting." : "Your turn. Choose one reply."; autosave("continue"); renderGame(); return; }
    if (target.dataset.action === "wallet") { playerMenuOpen = true; renderGame(); return; }
    if (target.dataset.action === "contacts") { contactsOpen = true; clearConfirm(); renderGame(); return; }
    if (target.dataset.action === "close-contacts") { contactsOpen = false; renderGame(); return; }
    if (target.dataset.action === "close-menu") { playerMenuOpen = false; renderGame(); return; }
    if (target.dataset.action === "logout") { playerMenuOpen = false; state.playerName = ""; state.ageConfirmed = false; autosave("logout"); renderLogin(); return; }
    if (target.dataset.action === "refuse-demand") {
      var g = girl(), p = progress();
      if (p.pendingDemand) {
        p.pendingDemand = null;
        p.mood = Math.max(0, p.mood - 10);
        p.talkStreak = maxTalkStreak;
        p.breakUntil = Date.now() + (p.breakDurationMs || 45000);
        state.credits = Math.max(0, state.credits - 6);
        feedback = g.name + " hated being refused. -6 credits and she is bored.";
        playSound("negative");
        autosave("demand-refused");
        renderGame();
      }
      return;
    }
    if (target.dataset.action === "check-ready") {
      var g = girl(), p = progress();
      if (isReady(p)) {
        p.breakUntil = 0;
        p.talkStreak = 0;
        lastReply = "";
        lastPlayerLine = "";
        feedback = g.name + " is ready again. Do not waste it.";
        playSound("positive");
      } else {
        state.credits = Math.max(0, state.credits - interruptPenalty);
        p.mood = Math.max(0, p.mood - 5);
        feedback = "Too early. " + g.name + " ignored you and took " + interruptPenalty + " credits.";
        playSound("negative");
      }
      autosave("check-ready"); renderGame(); return;
    }
    if (target.dataset.action === "close-notice") { phoneNotice = null; renderGame(); return; }
    if (target.dataset.action === "reset") { localStorage.removeItem(key); state = clone(data.defaultState); selectedGirlId = "kiyo"; lastReply = ""; lastPlayerLine = ""; phoneNotice = null; playerMenuOpen = false; feedback = "Local save reset."; renderLogin(); }
  });

  root.addEventListener("submit", function(event){
    if (!event.target || event.target.id !== "profile-form") return;
    event.preventDefault();
    var form = new FormData(event.target);
    var name = String(form.get("profile-name") || "").trim().slice(0, 16);
    var style = String(form.get("profile-style") || "attention");
    if (name) state.playerName = name;
    state.finSubStyle = style;
    state.questionnaireComplete = true;
    playerMenuOpen = false;
    pushNotice("Profile updated", "Avatar, name, and style are saved.");
    autosave("profile-update");
    renderGame();
  });

  if (state.playerName && state.ageConfirmed && state.questionnaireComplete) renderGame();
  else if (state.playerName && state.ageConfirmed) renderPersona();
  else renderLogin();
})();
`;
