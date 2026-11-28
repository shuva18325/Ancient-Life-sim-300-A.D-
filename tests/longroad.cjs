/* 🧭 THE LONG ROAD: Rome to the Han and back, by caravan or by ship, as a journey */
const {chromium}=require('playwright');
(async()=>{ const br=await chromium.launch(); const pg=await br.newPage({viewport:{width:1280,height:900}}); const errs=[]; pg.on('pageerror',e=>errs.push(''+e));
 await pg.goto('file://'+require('path').resolve(__dirname,'../index.html')); await pg.waitForTimeout(400);
 let fail=0; const ok=(c,m)=>{ console.log((c?'  PASS  ':'  FAIL  ')+m); if(!c) fail++; };
 const r=await pg.evaluate(async ()=>{ const S=window.__SS, o={}; S.newDemo('Marcus','Rome','Roman'); S.G.coin=5000; S.G.food=200;
   S.openLongRoad(); o.cards=document.querySelectorAll('#road-list .shopcard').length; document.querySelector('#road-list button').click();
   await new Promise(r=>setTimeout(r,900)); o.canvas=!!document.getElementById('road-cv'); o.spent=S.G.coin<5000;
   document.getElementById('road-skip').click(); o.w1=S.G.world; o.c1=S.G.current;
   S.openLongRoad(); o.back=[...document.querySelectorAll('#road-list b')].map(b=>b.textContent).join('|'); return o; });
 ok(r.cards===3, 'from Rome: the Silk Road, the monsoon road to the Han, the monsoon to India');
 ok(r.canvas && r.spent, 'setting out costs the fare and shows the journey');
 ok(r.w1==='east' && r.c1==='Luoyang', 'you arrive in Luoyang, in the other world');
 ok(/WEST/.test(r.back), 'and from the east the roads lead west');
 ok(errs.length===0, 'no page errors'+(errs[0]? ' — '+errs[0] : ''));
 console.log(fail? '✗ '+fail+' FAILED' : 'ALL GREEN'); await br.close(); process.exit(fail?1:0); })();
