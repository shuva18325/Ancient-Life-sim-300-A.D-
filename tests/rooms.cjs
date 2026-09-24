/* 🚪 THE ROOMS, THE SLAPS, THE PRESS — AND WHICH BUILD YOU ARE PLAYING
   ---------------------------------------------------------------------
   From the round after the pair was built:
     · "did you REALLY fix it" — the screenshot was the old build, on the old
       link; every screen now says which build it is;
     · a family 'match' can wed a child from fourteen, and married children
       who live at home are behind the bedroom, bath and wardrobe doors —
       so nobody under eighteen is ever in one of those rooms, or peeked at;
     · "when you take a peek … it's a JOKE" — sprites rotated on their side;
     · "the romantic slap and normal slap BOTH", and the coast's Press;
     · her faces rolled per scene; the REAL chart with their clothes on.
   Run against the build before with FILE=…: it fails there.               */
const {chromium}=require('playwright');
const FILE=process.env.FILE || ('file://'+require('path').resolve(__dirname,'..','index.html'));
let pass=0, fail=0;
const ok=(name,cond,note)=>{ if(cond){pass++; console.log('  PASS  '+name+(note?'   '+note:''));}
                             else {fail++; console.log('  FAIL  '+name+(note?'   '+note:''));} };
(async()=>{
  const br=await chromium.launch();
  const pg=await br.newPage({viewport:{width:960,height:700}});
  const errs=[]; pg.on('pageerror',e=>errs.push(''+e));
  await pg.goto(FILE);
  await pg.evaluate(()=>localStorage.setItem('SANDSTEEL_ADULT','1'));
  await pg.reload(); await pg.waitForTimeout(400);
  const T=async(fn,arg)=>{ try{ return await pg.evaluate(fn,arg); }catch(e){ return {err:String(e).slice(0,160)}; } };
  const SETUP=(world,fem)=>{ const S=window.__SS; S.newDemo('Kaiq','Leokanis','RkTorvak'); const G=S.G;
    G.world=world; G.rkRank='harra'; G.coin=99999; G.isFemale=!!fem; G.married=true; G.hygiene=90; G.day=400; G.lastLoveDay=399;
    const sp=S.makeBride(world==='rk'?'rkrai':'roman',false,9,{male:true}); sp.male=!!fem; sp.eth=world==='rk'?'rkrai':'roman';
    sp.name=fem? 'Torvak Ruun' : 'Ulva Raun'; sp.quirks=[]; sp.flaws=[]; sp.traits=['vakran'];
    sp.body=Object.assign(sp.body||{},{booty:10,bust:9,legs:7,secret:9}); G.wife=sp; G.wifeRel=85; G.wifePhys=60;
    G.body=G.body||{}; G.body.secret=10; return G; };
  const src='('+SETUP.toString()+')';

  console.log('\n=== 🏷 WHICH BUILD IS THIS ===');
  let R=await T(()=>({stamp:window.__SS.BUILD_STAMP, title:(document.getElementById('build-stamp')||{}).textContent||''}));
  ok('the build has a name, and the title screen says it', !R.err && !!R.stamp && R.title.indexOf(R.stamp)>=0, R.err||(R.title));

  console.log('\n=== 🔞 NOBODY UNDER EIGHTEEN BEHIND A DOOR ===');
  R=await T((src)=>{ const S=window.__SS; const G=eval(src)('rome');
    const kid=(age, spAge, wedAgo)=>({name:'Lucius Leokanis', sex:'m', born:G.day-2.4*age, wed:true, livesHome:true, wedDay:G.day-2.4*(wedAgo||0),
      spouse:{name:'Aurelia Varro', male:false, age:spAge, body:{bust:7,booty:7}}});
    const inRooms=(c)=>{ let n=0; const d0=G.day; for(let d=0; d<90; d++){ G.day=d0+d; c.born=G.day-2.4*c._age; c.wedDay=G.day-2.4*(c._wed||0);
        if(Object.keys(S.roomsOccupiedToday()).length) n++; } G.day=d0; return n; };
    const minor=kid(15,15,0); minor._age=15; G.children=[minor]; const m=inRooms(minor);
    const adult=kid(24,22,3); adult._age=24; adult._wed=3; G.children=[adult]; const a=inRooms(adult);
    const youngSp=kid(24,15,1); youngSp._age=24; youngSp._wed=1; G.children=[youngSp]; const y=inRooms(youngSp);
    const grownSp=kid(24,15,4); grownSp._age=24; grownSp._wed=4; G.children=[grownSp]; const gsp=inRooms(grownSp);
    G.children=[minor]; minor.born=G.day-2.4*15; S.openDomus();
    const peek=S.startPeek('bed',{name:'Lucius',spouse:'Aurelia',ref:minor});
    return {m, a, y, gsp, peek}; }, src);
  ok('a married fifteen-year-old is in no room, on any of ninety days', !R.err && R.m===0, R.err||(R.m+' days'));
  ok('a married adult couple is behind a door some days', !R.err && R.a>0, R.err||(R.a+' days'));
  ok('an adult child with a spouse wed at fifteen, a year ago — not in any room', !R.err && R.y===0, R.err||(R.y+' days'));
  ok('…until the spouse is eighteen', !R.err && R.gsp>0, R.err||(R.gsp+' days'));
  ok('and the peek itself refuses an under-age couple, whoever calls it', R.peek===false, String(R.peek));

  console.log('\n=== 👁 THE PEEK IS A ROOM, AND THE MOMENT THEY SEE YOU ===');
  R=await T((src)=>{ const S=window.__SS; const G=eval(src)('rome');
    const c={name:'Lucius Leokanis', sex:'m', born:G.day-2.4*24, wed:true, livesHome:true, wedDay:G.day-2.4*3,
      spouse:{name:'Aurelia Varro', male:false, age:22, body:{bust:8,booty:8,waist:7,legs:7,face:7}, skin:'#e6bd94', hair:'#5a3a1e', dress:'#8a2f5a'}};
    G.children=[c]; let occ=null;
    for(let d=400; d<520 && !occ; d++){ G.day=d; c.born=d-2.4*24; c.wedDay=d-2.4*3; occ=S.roomsOccupiedToday().bed||null; }
    const g=document.getElementById('game'), shot=(act,tier)=>{ S.openDomus(); const D=S.DM; D.peek=null; G.peeked={};
      if(!S.startPeek('bed',occ)) return null; D.peek.act=S.PEEK_ACTS.find(a=>a.id===act); D.peek.stage=S.PEEK_STAGE[tier];
      D.peek.t=110; D.peek.ph='hold'; S.drawDomus(); return g.getContext('2d').getImageData(150,80,180,110).data; };
    const dif=(A,B)=>{ if(!A||!B) return -1; let n=0; for(let i=0;i<A.length;i+=4) if(Math.abs(A[i]-B[i])+Math.abs(A[i+1]-B[i+1])+Math.abs(A[i+2]-B[i+2])>40) n++; return n; };
    const kiss0=shot('kiss',0), kiss4=shot('kiss',4), sleep=shot('sleep',4);
    return {found:!!occ, tableau:typeof S.drawPeekTableau==='function', stage:dif(kiss0,kiss4), sleep:dif(kiss4,sleep)}; }, src);
  ok('the peek is drawn as a room with the couple in it', !R.err && R.found && R.tableau===true, R.err);
  ok('how far along they were shows — dressed is not the same picture as caught', !R.err && R.stage>80, R.err||(R.stage+' px'));
  ok('and asleep is its own picture — in the bed, under the sheet', !R.err && R.sleep>150, R.err||(R.sleep+' px'));

  console.log('\n=== 👋 THE SLAP — HIS ARM, ON HER ===');
  R=await T((src)=>{ const S=window.__SS; eval(src)('rome');
    S.openDomus(); const D=S.DM; D.x=D.wifeX-26; S.startSlapAnim(D.wifeX); if(!D.slap) return {none:true};
    const n0=S.PAIR_DRAWS; D.slap.t=10; S.drawDomus(); const up=S.PAIR_LAST&&S.PAIR_LAST.R;
    D.slap.t=29; S.drawDomus(); const L=S.PAIR_LAST&&S.PAIR_LAST.R;
    const d=(L&&L.hisHand&&L.seat)? Math.hypot(L.hisHand[0]-L.seat[0], L.hisHand[1]-L.seat[1]) : 999;
    return {drew:S.PAIR_DRAWS>n0, land:d, rs:(L&&L.rs)||0, cocked: up&&up.hisHand&&up.hisShoulder? up.hisHand[1] < up.hisShoulder[1]+2 : false, pairFlag:!!D.slap.pair}; }, src);
  ok('the normal slap is drawn by the pair — her and him, not a floating arm', !R.err && R.drew && R.pairFlag, R.err||JSON.stringify(R));
  ok('he draws his arm back and up first', R.cocked===true);
  ok('and his hand lands ON her seat', !R.err && R.land <= (R.rs||6)+3, R.err||(R.land.toFixed(1)+' px from its middle, r '+(R.rs||0).toFixed(1)));

  console.log('\n=== 💥 THE ROMANTIC ONE — HIS LENGTH, ON HER ===');
  R=await T((src)=>{ const S=window.__SS; eval(src)('rome');
    S.openDomus(); const D=S.DM; D.x=D.wifeX-26; S.startRomantic(D.wifeX,'spouse'); if(!D.rslap) return {none:true};
    const n0=S.PAIR_DRAWS; D.rslap.t=100; S.drawDomus(); const early=S.PAIR_LAST&&S.PAIR_LAST.R;
    D.rslap.t=237; S.drawDomus(); const L=S.PAIR_LAST&&S.PAIR_LAST.R;
    const d=(L&&L.hisTip&&L.seat)? Math.hypot(L.hisTip[0]-L.seat[0], L.hisTip[1]-L.seat[1]) : 999;
    return {drew:S.PAIR_DRAWS>n0, dressedEarly: !!(early && !early.hisTip), tip:d, rs:(L&&L.rs)||0}; }, src);
  ok('the romantic slap is drawn by the pair', !R.err && R.drew===true, R.err||JSON.stringify(R));
  ok('he starts it dressed', R.dressedEarly===true);
  ok('and on the strike the tip of him is at her seat', !R.err && R.tip <= (R.rs||6)+6, R.err||(R.tip.toFixed(1)+' px, r '+(R.rs||0).toFixed(1)));

  console.log('\n=== ◆ THE PRESS ===');
  R=await T((src)=>{ const S=window.__SS; eval(src)('rk');
    S.openDomus(); const D=S.DM; D.x=D.wifeX-40; D.press={t:120, ph:'held', stand:1, side:-1, rub:0.8, tier:{i:1}, sparks:[]};
    const n0=S.PAIR_DRAWS; S.drawDomus(); const L=S.PAIR_LAST&&S.PAIR_LAST.R;
    const d=(L&&L.hisHip&&L.join)? Math.hypot(L.hisHip[0]-L.join[0], L.hisHip[1]-L.join[1]) : 999;
    return {drew:S.PAIR_DRAWS>n0, d}; }, src);
  ok('the Press is drawn by the pair, in profile', !R.err && R.drew===true, R.err);
  ok('held: he is right up against her', !R.err && R.d < 8, R.err||(R.d.toFixed(1)+' px'));

  console.log('\n=== ❦ HER FACE IS HERS, AND IT CHANGES ===');
  R=await T((src)=>{ const S=window.__SS; const G=eval(src)('rome'); const w=G.wife; const seen={}, cold={};
    for(let i=0;i<40;i++){ S.HER_ROLL=i; seen[S.herFace(w,'act')]=1; }
    G.wifeRel=20; for(let i=0;i<60;i++){ S.HER_ROLL=i; const f=S.herFace(w,'act'); cold[f]=(cold[f]||0)+1; }
    S.HER_ROLL=5; const a=S.herFace(w,'act'), b=S.herFace(w,'act');
    const top=Object.entries(cold).sort((x,y)=>y[1]-x[1])[0][0];
    return {kinds:Object.keys(seen), coldTop:top, stable:a===b}; }, src);
  ok('scene to scene she does not pull the same face — at least three over forty scenes', !R.err && R.kinds.length>=3, R.err||R.kinds.join(','));
  ok('in a cold marriage it is mostly a cross face', !R.err && R.coldTop==='cross', R.err||R.coldTop);
  ok('and within one scene it holds', R.stable===true);

  console.log('\n=== 👗 THE REAL CHART, DRESSED ===');
  R=await T((src)=>{ const S=window.__SS; const G=eval(src)('rome'); G.tunic='#7a2f22';
    const cv=document.createElement('canvas'); cv.width=200; cv.height=290; const c=cv.getContext('2d');
    const her={male:false,name:'Ulva Raun',skin:'#e6bd94',hair:'#3a2618',dress:'#c0a02a',body:{bust:9,booty:9,waist:8,legs:7,face:8},age:24};
    const him={male:true,self:true,skin:'#c89868',hair:'#2a1a10',body:{bust:7,booty:7,waist:7,legs:7,face:7,secret:10},age:30};
    const shot=(w,o)=>{ c.clearRect(0,0,200,290); c.save(); c.translate(100,280); c.scale(3.6,3.6); S.drawRealFig(c,w,'front',undefined,o); c.restore(); return c.getImageData(0,0,200,290).data; };
    const dif=(A,B)=>{ let n=0; for(let i=0;i<A.length;i+=4) if(Math.abs(A[i]-B[i])+Math.abs(A[i+1]-B[i+1])+Math.abs(A[i+2]-B[i+2])>40) n++; return n; };
    const hB=shot(him,{}), hD=shot(him,{dressed:true, dressInfo:S.realDressInfo(him)});
    const wB=shot(her,{}), wD=shot(her,{dressed:true, dressInfo:S.realDressInfo(her)});
    const hDL=shot(him,{dressed:true, showLen:true, aro:1, dressInfo:S.realDressInfo(him)});
    G.world='rk'; const kD=shot(her,{dressed:true, dressInfo:S.realDressInfo(her)});
    return {him:dif(hB,hD), her:dif(wB,wD), lenHidden:dif(hD,hDL), coastDiffers:dif(wD,kD)}; }, src);
  ok('DRESSED puts a real garment on him', !R.err && R.him>1500, R.err||(R.him+' px'));
  ok('and on her', !R.err && R.her>2500, R.err||(R.her+' px'));
  ok('with his clothes on, his length is not drawn through them', !R.err && R.lenHidden<250, R.err||(R.lenHidden+' px'));
  ok('the coast dresses her in its own cut, not the stola', !R.err && R.coastDiffers>1500, R.err||(R.coastDiffers+' px'));

  console.log('\n=== 🙋 A WOMAN SLAPPING HER HUSBAND STILL WORKS ===');
  R=await T((src)=>{ const S=window.__SS; eval(src)('rome', true); S.openDomus(); const D=S.DM; D.x=D.wifeX-26;
    S.startSlapAnim(D.wifeX); if(D.slap){ for(const t of [10,29,60]){ D.slap.t=t; S.drawDomus(); } } return {ran:true, pair:!!(D.slap&&D.slap.pair)}; }, src);
  ok('and it keeps its own drawing (not the pair)', !R.err && R.ran && R.pair===false, R.err||JSON.stringify(R));

  console.log('\n--- PAGE ERRORS ---');
  ok('none', errs.length===0, errs.slice(0,3).join(' | '));
  console.log('\n'+(fail? '✗ '+fail+' FAILED' : 'ALL GREEN')+'   ('+(pass+fail)+' checks)');
  await br.close();
  process.exit(fail?1:0);
})();
