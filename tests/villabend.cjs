/* 🍑 THE VILLA BEND: IT GOES IN
   A player: "on the bend your length doesn't even enter the seat, it looks like sliding through". Aimed at the bottom of
   her seat's curve, the length lay along the underside of it — a tangent — and never went into anything. The entry is now
   on her outline at the back curve of the seat (where the near cheek hides the cleft), the stroke keeps moving, and at the
   bottom of it he is flush: nothing of him showing between them. */
const {chromium}=require('playwright');
const SETUP=(world,booty,secret)=>{ const S=window.__SS; S.newDemo('Marcus','Italia','Roman'); const G=S.G;
    G.world=world; G.coin=99999; G.isFemale=false; G.married=true; G.hygiene=90; G.day=40; G.lastLoveDay=39;
    const sp=S.makeBride(world==='rk'?'rkrai':'roman',false,9,{male:true}); sp.male=false; sp.eth=world==='rk'?'rkrai':'roman';
    sp.name='Julia'; sp.quirks=[]; sp.flaws=[]; sp.traits=['curious'];
    sp.body=Object.assign(sp.body||{},{booty, bust:8,legs:7,secret:9}); G.wife=sp; G.wifeRel=85; G.wifePhys=60;
    G.body=G.body||{}; G.body.secret=secret; return G; };
(async()=>{ const br=await chromium.launch(); const pg=await br.newPage({viewport:{width:960,height:700}}); const errs=[]; pg.on('pageerror',e=>errs.push(''+e));
 await pg.goto('file://'+require('path').resolve(__dirname,'../index.html')); await pg.evaluate(()=>localStorage.setItem('SANDSTEEL_ADULT','1')); await pg.reload(); await pg.waitForTimeout(400);
 let fail=0; const ok=(c,m)=>{ console.log((c?'  PASS  ':'  FAIL  ')+m); if(!c) fail++; };
 for(const [world,booty,secret] of [['rome',10,9],['rome',4,6],['rk',9,11],['rome',7,12]]){
   const r=await pg.evaluate(([src,world,booty,secret])=>{ const S=window.__SS; eval(src)(world,booty,secret);
     S.openDomus(); const D=S.DM; D.x=D.wifeX-30; D.face=1; S.startVillaLove(D.wifeX,false,true); const vis=[]; let bad=null, onLine=0, n=0;
     for(let i=0;i<40;i++){ D.scene.t=300+i; S.drawDomus(); const R=S.PAIR_LAST&&S.PAIR_LAST.R; if(!R||!R.entry){ bad='no entry'; continue; }
       const E=R.entry, rt=R.hisRoot; n++;
       if(E[0] < R.seat[0]-R.rs*0.45 && E[1] > R.seat[1] && E[1] < R.seat[1]+R.rs*0.75) onLine++;
       vis.push(Math.max(0, E[0]-rt[0])); }
     return {vis, onLine, n, bad}; }, ['('+SETUP.toString()+')',world,booty,secret]);
   const tag=world+' seat '+booty+' · length '+secret;
   ok(!r.bad && r.onLine===r.n, tag+': the entry is on her outline, at the back of the seat, not under it ('+r.onLine+'/'+r.n+')');
   const mx=Math.max(...r.vis), mn=Math.min(...r.vis);
   ok(mn < 0.6, tag+': at the bottom of the stroke he is flush — nothing showing ('+mn.toFixed(1)+' px)');
   ok(mx > 2.5, tag+': and on the way out you see it come out of her ('+mx.toFixed(1)+' px)');
   const still=r.vis.filter((v,i)=>i>0 && Math.abs(v-r.vis[i-1])<0.05).length;
   ok(still < r.vis.length*0.35, tag+': the stroke keeps moving — it does not sit out for half of every beat ('+still+' still frames of '+r.vis.length+')');
 }
 ok(errs.length===0, 'no page errors'+(errs[0]? ' — '+errs[0] : ''));
 console.log(fail? '✗ '+fail+' FAILED' : 'ALL GREEN'); await br.close(); process.exit(fail?1:0); })();
