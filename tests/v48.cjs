/* 🤖 V48 — THE LAST OLD BODIES, A USABLE TABLET, THE RIGHT SPOUSES, COURTSHIP
   UPGRADED, KANVEK YOU CAN SEE, A LESS HUNGRY GREEDY WIFE, AND THE THREE BOTS
   ---------------------------------------------------------------------
   From the rounds that asked for:
     · "the cheat tablet is too full … the command table in the villa is
        packed and I can't do anything";
     · "playing as a son I can pick husbands, or as a girl I can pick wives";
     · "upgrade courtship";
     · "in kanvek I can't see the length — I can't see ANY of it";
     · "why does the hungry expression happen so much because she has greedy?";
     · "make 3 bots in the settings, record their playthrough, make it
        watchable, add personalities … subtitles of what they are thinking".
   Run against the build before with FILE=…: it fails there.               */
const {chromium}=require('playwright');
const FILE=process.env.FILE || ('file://'+require('path').resolve(__dirname,'..','index.html'));
let pass=0, fail=0;
const ok=(name,cond,note)=>{ if(cond){pass++; console.log('  PASS  '+name+(note?'   '+note:''));}
                             else {fail++; console.log('  FAIL  '+name+(note?'   '+note:''));} };
(async()=>{
  const br=await chromium.launch();
  const pg=await br.newPage({viewport:{width:1280,height:720}});
  const errs=[]; pg.on('pageerror',e=>errs.push(''+e));
  await pg.goto(FILE);
  await pg.evaluate(()=>{ localStorage.clear(); localStorage.setItem('SANDSTEEL_ADULT','1'); });
  await pg.reload(); await pg.waitForTimeout(500);
  const T=async(fn,arg)=>{ try{ return await pg.evaluate(fn,arg); }catch(e){ return {err:String(e).slice(0,300)}; } };
  await pg.evaluate(()=>{
    window.__cv=(w,h)=>{ const c=document.createElement('canvas'); c.width=w; c.height=h; return c; };
    window.__busy=(c)=>{ const d=c.getContext('2d').getImageData(0,0,c.width,c.height).data; let n=0; for(let i=3;i<d.length;i+=4) if(d[i]>0) n++; return n; };
    window.__diff=(a,b)=>{ const A=a.getContext('2d').getImageData(0,0,a.width,a.height).data, B=b.getContext('2d').getImageData(0,0,b.width,b.height).data;
      let n=0; for(let i=0;i<A.length;i+=4){ if(Math.abs(A[i]-B[i])+Math.abs(A[i+1]-B[i+1])+Math.abs(A[i+2]-B[i+2])>30) n++; } return n; };
  });
  const HOUSE=`(function(fem, o){ o=o||{}; const S=window.__SS;
    S.newDemo(fem?'Livia':(o.rk?'Kaiq':'Marcus'), o.rk?'Leokanis':'Italia', o.rk?'RkTorvak':'Roman'); const G=S.G; G.married=true; G.isFemale=!!fem; G.hasVilla=true; G.coin=20000;
    const w=S.makeBride(o.rk?'rkrai':'roman',true,8,fem? {male:true} : undefined); w.male=!!fem; w.traits=o.traits||[]; w.flaws=[]; w.quirks=[];
    G.wife=w; G.wifeRel=o.rel===undefined? 80 : o.rel; G.wifePhys=o.phys===undefined? 70 : o.phys; if(o.domus!==false) S.openDomus(); return G; })`;

  console.log('\n=== ⌘ THE TABLET, AS A PANEL ===');
  let R=await T((H)=>{ const S=window.__SS; eval(H)(false,{}); S.openTablet(); S.syncTabletPanel();
    const p=document.getElementById('tabpanel'); const tabs=p? p.querySelectorAll('.tab').length : 0, items=p? p.querySelectorAll('.it').length : 0;
    const vis=p && !p.classList.contains('hide'); S.DM.tablet=null; S.syncTabletPanel(); return {vis, tabs, items, closed:p.classList.contains('hide')}; }, HOUSE);
  ok('the villa tablet opens as a clickable panel with tabs, not a packed wall', !R.err && R.vis && R.tabs>=3 && R.items>0 && R.items<=12 && R.closed, R.err||JSON.stringify(R));

  console.log('\n=== ⚭ THE RIGHT SPOUSES ===');
  R=await T(()=>{ const S=window.__SS; S.newDemo('Marcus','Italia','Roman'); const G=S.G; G.isFemale=false; G.married=false; G.coin=5000;
    const h=S.makeBride('roman',true,7,{male:true}); h.male=true; S.marryList=[h];                // the last one's shortlist, of husbands
    try{ S.openMarry(false); }catch(e){}
    const L=S.marryList; const sonOk=!L || L.every(w=>!w.male);
    G.isFemale=true; const w=S.makeBride('roman',true,7); w.male=false; S.marryList=[w]; try{ S.openMarry(false); }catch(e){}
    const L2=S.marryList; const girlOk=!L2 || L2.every(x=>!!x.male);
    return {sonOk, girlOk}; });
  ok('a son is not offered husbands, and a daughter is not offered wives', !R.err && R.sonOk && R.girlOk, R.err||JSON.stringify(R));

  console.log('\n=== 🤤 HUNGRY, IN FLASHES — NOT ALL DAY ===');
  R=await T((H)=>{ const S=window.__SS; let FK=100000; const pn=performance.now.bind(performance); performance.now=()=>FK; const out={};
    for(const [lab,tr,phys] of [['greedy',['gr_greedy'],70],['fit',[],95],['greedyFit',['gr_greedy'],95]]){
      eval(H)(false,{traits:tr, phys, rel:85}); let hung=0, gazes=0; const N=7200;
      for(let i=0;i<N;i++){ const D=S.DM; if(!D) break; D.wifeX=D.x+30; const had=!!D.gaze; FK+=16.67; S.updateDomus(1); if(!had && S.DM && S.DM.gaze) gazes++;
        const e=S.wifeExpr(S.G.wife); if(e==='hungry'||e==='starving') hung++; }
      out[lab]={frac:+(hung/N).toFixed(3), gazes}; }
    performance.now=pn; return out; }, HOUSE);
  ok('a Greedy wife wears the Hungry face a small part of the time, not most of it', !R.err && R.greedy && R.greedy.frac<0.2, R.err||JSON.stringify(R.greedy));
  ok('a wife in top form is no longer Hungry 100% of the time (it comes in flashes)', !R.err && R.fit && R.fit.frac<0.2 && R.greedyFit.frac<0.25, R.err||JSON.stringify(R));
  ok('and a Greedy one still looks — a handful of times in two minutes, not every five seconds', !R.err && R.greedy.gazes>=1 && R.greedy.gazes<=10, R.err||('gazes '+R.greedy.gazes));

  console.log('\n=== ✧ KANVEK: YOU CAN SEE HIM ===');
  R=await T(()=>{ const S=window.__SS;
    S.newDemo('Kaiq','Leokanis','RkTorvak'); const G=S.G; G.body=G.body||{}; G.body.secret=9;
    const look={male:true, skin:'#b88458', hair:'#2a1a10', body:{legs:6, secret:9}};
    const draw=(showLen)=>{ const c=__cv(120,120), g=c.getContext('2d'); S.drawMateFig(g, g, {hip:[50,60], floor:110, look, bare:true, showLen, aro:1, u:0, lenIn:9, diaIn:1.8, pxi:1, face:null}); return c; };
    const a=draw(false), b=draw(true); return {diff:__diff(a,b)}; });
  ok('a bare figure whose scene shows his length draws it (the tunic hem no longer "covers" a man with nothing on)', !R.err && R.diff>12, R.err||JSON.stringify(R));
  R=await T(()=>{ const S=window.__SS;
    S.newDemo('Kaiq','Leokanis','RkTorvak'); const G=S.G; G.world='rk'; G.married=true; G.isFemale=false; G.hasVilla=true;
    const w=S.makeBride('rkrai',false,9,{male:true}); w.male=false; w.eth='rkrai'; w.flaws=[]; w.quirks=[]; w.traits=['kanvek']; w.body={face:10,hairq:7,bust:7,waist:5,booty:10,legs:7}; w.age=24; G.wife=w; G.body=G.body||{}; G.body.secret=9;
    const i=S.rkPoseOrder().indexOf(22); S.setWH('done'); S.startBedScene('long','love','bed'); S.BC.kanDeep={all:false, snd:[], lastPk:false};
    const d=[]; for(let k=0;k<34;k+=2){ const Tt=520+(S.BED_UNDRESS||0)+i*160+60+k; S.setBCT(Tt); S.drawShadowPlay(S.BC, Tt); d.push(S.BC.kanDeep.depth); }
    return {min:Math.min(...d), max:Math.max(...d)}; });
  ok('every stroke runs from the tip to her depth and back (most of him is out at the top of it)', !R.err && R.min<2 && R.max-R.min>2.5, R.err||JSON.stringify(R));

  console.log('\n=== 🌹 COURTSHIP, UPGRADED ===');
  R=await T(()=>{ const S=window.__SS; S.newDemo('Marcus','Italia','Roman'); const G=S.G; G.coin=5000; G.courtLog={}; G.glory=0;
    S.startCourtship('poor'); const CT=S.CT; const out={temper:CT.temper, hasT:!!S.COURT_TEMPERS[CT.temper], anim:!!CT.anim, readT0:CT.readT};
    S.courtAsk(); out.readT1=S.CT.readT; out.asked=S.CT.asked;
    const c0=G.coin; S.courtGift('flower'); out.gifted=S.CT.gifted; out.paid=c0-G.coin;
    S.CT.prog=20; const m0=S.CT.mistakes; S.courtHand(); out.handBlocked=(!S.CT.handTried && S.CT.mistakes===m0);
    S.CT.rival=true; S.CT.rivalDone=false; S.CT.turns=5; S.courtNextBeat(); out.rivalBeat=!!S.CT.beat.rival;
    const t0=S.CT.anim.t; for(let i=0;i<30;i++) S.courtTick(1, __cv(440,164)); out.ticked=S.CT.anim.t-t0;
    return out; });
  ok('each person has a temperament of their own', !R.err && R.hasT, R.err||R.temper);
  ok('👂 asking about them reads their temperament', !R.err && !R.readT0 && R.readT1 && R.asked, R.err||JSON.stringify(R));
  ok('🎁 a gift costs coin and can only be given once', !R.err && R.gifted && R.paid===2, R.err||JSON.stringify(R));
  ok('🤝 their hand cannot be taken while it is going badly', !R.err && R.handBlocked, R.err||'');
  ok('🗡 the rival cuts in with a line of their own', !R.err && R.rivalBeat, R.err||'');
  ok('the scene runs on its own clock between your lines', !R.err && R.ticked===30, R.err||JSON.stringify(R));
  R=await T(()=>{ const S=window.__SS; const cs={}; for(const w of ['west','wa','east','rk']){ const c=__cv(440,164); S.drawCourtVenue(c.getContext('2d'),440,164,150,'poor',w,10,0.5); cs[w]=c; }
    return {wa:__diff(cs.west,cs.wa), east:__diff(cs.west,cs.east), rk:__diff(cs.west,cs.rk), waEast:__diff(cs.wa,cs.east)}; });
  ok('the places are the places of whichever world you are in (Rome, Wa, the East, the coast)', !R.err && R.wa>8000 && R.east>8000 && R.rk>8000 && R.waEast>8000, R.err||JSON.stringify(R));
  R=await T(()=>{ const S=window.__SS; const poorOnly=S.COURT_PROMPTS.filter(p=>p.ranks && p.ranks.length===1 && p.ranks[0]==='poor');
    S.newDemo('Marcus','Italia','Roman'); const G=S.G; G.office=6; G.senate=true; G.socialClass='elite'; G.courtLog={}; S.startCourtship('elite'); if(!S.CT||S.CT.rankId!=='elite') return {noCT:true};
    let bad=0; for(let i=0;i<60;i++){ S.CT.rival=false; S.courtNextBeat(); if(poorOnly.some(p=>p.q===S.CT.beat.q)) bad++; } return {n:poorOnly.length, bad}; });
  ok('some lines only happen on some streets (a street-stall line never comes up in a patrician hall)', !R.err && (R.noCT || (R.n>=2 && R.bad===0)), R.err||JSON.stringify(R));

  console.log('\n=== 🤖 THE THREE BOTS ===');
  R=await T(()=>{ const S=window.__SS; S.newDemo('Verus','Italia','Roman'); const G0=S.G; G0.coin=4321;
    const snap=()=>{ const o={}; for(let i=0;i<localStorage.length;i++){ const k=localStorage.key(i); if(k!=='SANDSTEEL_BOTS') o[k]=localStorage.getItem(k); } return JSON.stringify(o); };
    const before=snap(); const out={};
    for(const id of ['minerva','lucius','brutus']){ const r=S.botRecord(id); out[id]= r.err? {err:r.err.slice(0,200)} : {n:r.beats.length, world:r.world, stats:r.stats,
      thoughts:r.beats.filter(b=>b.th).length, kinds:[...new Set(r.beats.map(b=>b.k))], female:!r.look.male, spouseCurves:r.spouse? ((r.spouse.body.bust||0)+(r.spouse.body.booty||0)) : 0}; }
    out.gBack=(S.G===G0 && S.G.coin===4321); out.saveSame=(snap()===before); out.sandboxOff=!S.BOT_SANDBOX; out.stored=Object.keys(S.botLoad()).length;
    return out; });
  ok('all three play a whole career without error', !R.err && ['minerva','lucius','brutus'].every(id=>R[id] && !R[id].err && R[id].n>=30), R.err||JSON.stringify(R).slice(0,300));
  ok('…in a sandbox: your career comes back untouched, and nothing is written to your save', !R.err && R.gBack && R.saveSame && R.sandboxOff, R.err||JSON.stringify({g:R.gBack, s:R.saveSame}));
  ok('and every scene is written down with what they were thinking', !R.err && ['minerva','lucius','brutus'].every(id=>R[id].thoughts>=R[id].n-1), R.err||'');
  ok('Minerva is a woman who takes the forum road; Lucius and Brutus are men', !R.err && R.minerva.female && !R.lucius.female && !R.brutus.female && R.minerva.kinds.includes('forum'), R.err||JSON.stringify(R.minerva.kinds));
  ok('Lucius plays on the Rkrai coast and marries the curviest (a title-holder or better)', !R.err && R.lucius.world==='rk' && R.lucius.stats.spouse && R.lucius.spouseCurves>=16, R.err||JSON.stringify({w:R.lucius.world, c:R.lucius.spouseCurves}));
  ok('Brutus fights, buys bigger weapons and races', !R.err && ['fight','shop','race'].every(k=>R.brutus.kinds.includes(k)), R.err||JSON.stringify(R.brutus.kinds));
  ok('the recordings are kept for watching later', !R.err && R.stored===3, R.err||R.stored);
  R=await T(()=>{ const S=window.__SS; S.openSettings('scr-title'); const card=[...document.querySelectorAll('#settings-body > div')].some(d=>/THE THREE BOTS/.test(d.textContent));
    S.openBotWatch('lucius','scr-settings'); const B=S.BW; const out={card, state:S.state, overlay:!document.getElementById('botwatch').classList.contains('hide')};
    B.playing=true; for(let i=0;i<40;i++) S.botWatchTick(1); out.sub=document.querySelector('#botwatch .bw-sub').textContent; out.cap=document.querySelector('#botwatch .bw-cap').textContent;
    const g=document.getElementById('game').getContext('2d').getImageData(0,0,480,270).data; let lit=0; for(let i=0;i<g.length;i+=4) if(g[i]+g[i+1]+g[i+2]>60) lit++; out.lit=lit;
    const fi=B.rec.beats.findIndex(b=>b.k==='fight'); S.botEnterBeat(fi); for(let i=0;i<200;i++) S.botWatchTick(1); out.fightDrawn=!!(B.F && B.F.p && B.F.e);
    S.botCmd('next'); out.next=B.i===fi+1; S.botCmd('speed'); out.speed=B.speed;
    S.closeBotWatch(); out.back=document.getElementById('scr-settings').classList.contains('on') && !S.BW; return out; });
  ok('the Settings card lists the three bots', !R.err && R.card, R.err||'');
  ok('▶ WATCH plays it on the game canvas with a caption and the bot’s thought as a subtitle', !R.err && R.state==='botwatch' && R.overlay && /LUCIUS/.test(R.sub) && /💭/.test(R.sub) && /DAY/.test(R.cap) && R.lit>20000, R.err||JSON.stringify(R));
  ok('the bouts are fought on the arena’s own gladiators, and the video bar skips and speeds up', !R.err && R.fightDrawn && R.next && R.speed===2, R.err||JSON.stringify(R));
  ok('✕ closes it and puts you back in Settings', !R.err && R.back, R.err||'');
  // mature content off: a tame Lucius
  await pg.evaluate(()=>{ localStorage.setItem('SANDSTEEL_ADULT','0'); }); await pg.reload(); await pg.waitForTimeout(400);
  R=await T(()=>{ const S=window.__SS; S.newDemo('Verus','Italia','Roman'); const r=S.botRecord('lucius'); S.openBotWatch('lucius','scr-settings'); const B=S.BW; const subs=[];
    for(let i=0;i<B.rec.beats.length;i++){ S.botEnterBeat(i); B.playing=true; for(let k=0;k<30;k++) S.botWatchTick(1); subs.push(document.querySelector('#botwatch .bw-sub').textContent); }
    S.closeBotWatch(); return {lenCheat:r.beats.some(b=>b.k==='cheat' && b.what==='length'), rude:subs.filter(s=>/length|curv|booty|bust/i.test(s)).length}; });
  ok('with mature content off Lucius stays tame (no length cheat, no talk of curves)', !R.err && !R.lenCheat && R.rude===0, R.err||JSON.stringify(R));

  console.log('\n=== 🚪 AND THE REST ===');
  R=await T(()=>window.__SS.BUILD_STAMP);
  ok('the build says V48', typeof R==='string' && /V48/.test(R), String(R));
  ok('no page errors anywhere', errs.length===0, errs.slice(0,3).join(' | '));
  console.log('\n'+(fail? fail+' FAILED, ' : 'ALL GREEN   ')+'('+pass+' checks)');
  await br.close(); process.exit(fail?1:0);
})();
