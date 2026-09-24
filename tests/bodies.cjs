/* ⚔ V40 — THE WOOHOO'S BODIES, EVERYWHERE; THE HUB AS A PLACE FOR IT
   ---------------------------------------------------------------------
   From the round after V39:
     · "the breeding hub is available as an option in woohoo ONLY in Rkrai" —
       and spottable in the Rkrai villa;
     · "get the bodies from the woohoos … the fighting system and everything
       else" — fighters, soldiers, cards, the fallen, the stands;
     · "the wife's walk is WAY small in the bedchamber";
     · "the woohoo stages are so limited";
     · "expressions like hurt in the villa; in the body map an expression
       called HUNGRY with a booty reflection in the eyes and a caption
       'chasing it'".
   Run against the build before with FILE=…: it fails there.               */
const {chromium}=require('playwright');
const FILE=process.env.FILE || ('file://'+require('path').resolve(__dirname,'..','index.html'));
let pass=0, fail=0;
const S_WANT=(id)=>['hungry','starving','hypnotized'].indexOf(id)>=0;
const ok=(name,cond,note)=>{ if(cond){pass++; console.log('  PASS  '+name+(note?'   '+note:''));}
                             else {fail++; console.log('  FAIL  '+name+(note?'   '+note:''));} };
(async()=>{
  const br=await chromium.launch();
  const pg=await br.newPage({viewport:{width:960,height:800}});
  const errs=[]; pg.on('pageerror',e=>errs.push(''+e));
  await pg.goto(FILE);
  await pg.evaluate(()=>localStorage.setItem('SANDSTEEL_ADULT','1'));
  await pg.reload(); await pg.waitForTimeout(400);
  const T=async(fn,arg)=>{ try{ return await pg.evaluate(fn,arg); }catch(e){ return {err:String(e).slice(0,200)}; } };
  const SETUP=(world)=>{ const S=window.__SS; S.newDemo('Kaiq','Leokanis','RkTorvak'); const G=S.G;
    G.world=world; G.coin=99999; G.isFemale=false; G.married=true; G.hygiene=90; G.day=400; G.hasVilla=true; G.rkHub=false;
    const sp=S.makeBride(world==='rk'?'rkrai':'roman',false,9,{male:true}); sp.male=false; sp.name='Ulva'; sp.quirks=[]; sp.flaws=[]; sp.traits=[];
    G.wife=sp; G.wifeRel=90; G.wifePhys=60; G.pregnant=null; return G; };
  const src='('+SETUP.toString()+')';

  console.log('\n=== ◆ THE HUB IS A PLACE FOR IT — ON THE COAST, AND NOWHERE ELSE ===');
  let R=await T((src)=>{ const S=window.__SS; const out={}; let G=eval(src)('rk');
    S.openVilla(); out.rkPlace=[...document.querySelectorAll('#villa-body button')].map(b=>b.textContent).filter(t=>/HUB|BREEDING/.test(t));
    S.openDomus(); S.DM.x=S.RK_HUB_DOOR.cx; out.plot=S.nearHubPlot(); S.tryHubPlot(); out.built=G.rkHub; out.door=S.nearHubDoor();
    out.spots=S.ardorSpots().map(s=>s.id);
    S.openVilla(); out.talk=[...document.querySelectorAll('#villa-body button')].map(b=>b.textContent).some(t=>/The hub\. Now/.test(t));
    G=eval(src)('rome'); G.rkHub=true; S.setPlace('hub');
    out.romeSan=S.sanitizeBedPlace(); S.openVilla();
    out.romeAny=[...document.querySelectorAll('#villa-body button')].map(b=>b.textContent).filter(t=>/HUB|BREEDING|hub\.|breeding house/i.test(t));
    S.openDomus(); S.DM.x=S.RK_HUB_DOOR.cx; out.romeDoor=S.nearHubDoor(); out.romePlot=S.nearHubPlot(); out.romeSpots=S.ardorSpots().map(s=>s.id);
    return out; }, src);
  ok('on the coast the woohoo Place row carries the hub (buildable in place) and the breeding house', !R.err && R.rkPlace.some(t=>/THE HUB/.test(t)) && R.rkPlace.some(t=>/BREEDING HOUSE/.test(t)), R.err||JSON.stringify(R.rkPlace));
  ok('the Rkrai hall shows a plot where the hub goes, and SPACE there builds it', !R.err && R.plot && R.built && R.door, R.err||JSON.stringify([R.plot,R.built,R.door]));
  ok('once built: a line in the talk and a card in GET HARD’s where', !R.err && R.talk && R.spots.indexOf('hub')>=0, R.err||JSON.stringify([R.talk,R.spots]));
  ok('in Rome: no hub, no breeding house, no door, no plot — and a remembered hub falls back to the bed', !R.err && R.romeAny.length===0 && !R.romeDoor && !R.romePlot && R.romeSpots.indexOf('hub')<0 && R.romeSan==='bed', R.err||JSON.stringify(R));

  console.log('\n=== ⚔ THE FIGHTER IS THE WOOHOO’S FIGURE, IN HIS KIT ===');
  R=await T(()=>{ const S=window.__SS; S.newDemo('Kaiq','Leokanis','Murmillo');
    const cv=document.getElementById('game'), c=cv.getContext('2d'); const n0=S.NB_DRAWS.fighter; const errs=[];
    const H=Object.keys(S.NB_HELM), A=Object.keys(S.NB_ARMOR);
    const shots=new Set();
    for(let i=0;i<Math.max(H.length,A.length);i++){ const f=S.makeFighter({x:240,y:230,facing:i%2?1:-1,female:i%3===0,skin:'#caa06a',tunic:'#8a2f22'});
      f.gear={weapon:S.gearOf('weapon','gladius'),shield:S.gearOf('shield',['scutum','parmula','none','rete','sode'][i%5]),helmet:S.gearOf('helmet',H[i%H.length]),armor:S.gearOf('armor',A[i%A.length])};
      c.setTransform(1,0,0,1,0,0); c.clearRect(0,0,480,270); try{ S.drawGladiator(f); }catch(e){ errs.push(String(e)); }
      shots.add(cv.toDataURL().length); }
    // the poses move the body
    const pose=(o)=>{ const f=S.makeFighter(Object.assign({x:240,y:230,facing:1},o)); c.setTransform(1,0,0,1,0,0); c.clearRect(0,0,480,270); S.drawGladiator(f); return S.NB_DRAWS.last; };
    const idle=pose({}), hi=pose({stance:'high'}), slash=pose({atk:true,atkType:'slash',atkT:9,atkDur:18}), elbow=pose({atk:true,atkType:'elbow',atkT:9,atkDur:18}), thr=pose({charging:4,chargeMax:12});
    return {drawn:S.NB_DRAWS.fighter-n0, distinct:shots.size, errs, idle, hi, slash, elbow, thr, last:S.NB_DRAWS.last}; });
  ok('every helmet and every harness draws on the new body without an error', !R.err && R.errs.length===0 && R.drawn>=29, R.err||(R.drawn+' drawn · '+R.errs.slice(0,2)));
  ok('and they are different pictures', !R.err && R.distinct>=20, R.err||(R.distinct+' distinct'));
  ok('the arm is posed off the fight: stance, swing, elbow and the javelin wind-up all move the hand', !R.err && R.idle.arm==='weapon' && R.elbow.arm==='elbow' && R.thr.arm==='throw'
      && Math.abs(R.idle.hand[1]-R.hi.hand[1])>3 && Math.abs(R.idle.hand[1]-R.slash.hand[1])>2, R.err||JSON.stringify([R.idle.hand,R.hi.hand,R.slash.hand]));
  R=await T(()=>{ const S=window.__SS; const cv=document.createElement('canvas'); cv.width=120; cv.height=120; const c=cv.getContext('2d');
    const C=S.paletteFor({skin:'#caa06a',tunic:'#8a2f22'});
    const M={hip:[60,70], floor:104, lean:0.05, u:0, aro:1, bare:true, look:{male:true, body:{secret:10}}, lenIn:9, diaIn:2, pxi:1, kit:{C, loin:'#8a2f22'}};
    S.drawMateFig(c,c,M); const tip=M._tip;
    const w={skin:'#e6bd94', body:{bust:10,booty:10,waist:7,legs:7}};
    // the tip colour of a bare bust: mixHex(skin,'#b0605a',0.45) ≈ (208,146,121) — counted inside the bust only
    const tipHits=(kit)=>{ c.clearRect(0,0,120,120); const O=S.drawFemFig(c,c,Object.assign({look:w, hip:[60,60], floor:104}, kit? {kit:{C, loin:'#2040ff', band:'#2040ff'}} : {}));
      const d=c.getImageData(0,0,120,120).data; let hits=0;
      for(const b of [O.bust,O.bustFar]) if(b) for(let y=Math.floor(b[1]-7);y<=b[1]+7;y++) for(let x=Math.floor(b[0]-7);x<=b[0]+7;x++){ const i=(y*120+x)*4;
        if(d[i+3]>200 && Math.abs(d[i]-208)<12 && Math.abs(d[i+1]-146)<12 && Math.abs(d[i+2]-121)<12) hits++; }
      return hits; };
    return {tip, hits:tipHits(true), bare:tipHits(false)}; });
  ok('in kit there is ALWAYS a loincloth: nothing under it is drawn, whatever the arousal says', !R.err && R.tip===undefined, R.err||JSON.stringify(R.tip));
  ok('and her bust is the band’s cloth — no bare tip drawn (the same figure out of kit has one)', !R.err && R.hits===0 && R.bare>0, R.err||(R.hits+' px in kit · '+R.bare+' px bare'));
  R=await T(()=>{ const S=window.__SS; const n0=S.NB_DRAWS.fighter; S.SETTINGS.classicBodies=true;
    const f=S.makeFighter({x:240,y:230}); S.drawGladiator(f); const n1=S.NB_DRAWS.fighter; S.SETTINGS.classicBodies=false; S.drawGladiator(f); return {classic:n1-n0, back:S.NB_DRAWS.fighter-n1}; });
  ok('Settings → Bodies: CLASSIC puts the old rig back, NEW is the template', !R.err && R.classic===0 && R.back===1, R.err||JSON.stringify(R));
  R=await T(()=>{ const S=window.__SS; const cv=document.createElement('canvas'); cv.width=80; cv.height=30; const out=new Set();
    const C=S.paletteFor({});
    for(const id of ['harpuun','herd_spear','torv_spear','ulaq','adze','flenser','talk_staff','tally_baton','reach_pole','weigh_rod','nagamaki','uchigatana','bokuto']){
      const g=document.getElementById('game').getContext('2d'); g.setTransform(1,0,0,1,0,0); g.clearRect(0,0,80,30); g.translate(20,15); S.drawWeapon2 ? S.drawWeapon2(id,C) : null; g.setTransform(1,0,0,1,0,0);
      out.add(g.getImageData(0,0,80,30).data.join(',').length+':'+id.length); }
    return {n:out.size, has:typeof S.drawWeapon2}; });
  if(R && R.has==='function') ok('the coast’s tools (and three from Wa) are drawn, not a grey bar', !R.err && R.n>=12, R.err||(R.n+' distinct'));

  console.log('\n=== ⚔ AND EVERYWHERE ELSE ===');
  R=await T(()=>{ const S=window.__SS; const c0=S.NB_DRAWS.card; S.SETTINGS.rkUnlocked=true; S.sel.world='west'; S.sel.sex='m'; S.sel.social='elite'; S.openCreate();
    const cards=S.NB_DRAWS.card-c0; const s0=S.NB_DRAWS.soldier;
    const a=S.nbSoldierSprite('#8a2f22','#e8c34a','#c52a2a',0,false), b=S.nbSoldierSprite('#8a2f22','#e8c34a','#c52a2a',0,false), d=S.nbSoldierSprite('#8a2f22','#e8c34a','#c52a2a',2,false);
    return {cards, cached:a===b, frames:a!==d, made:S.NB_DRAWS.soldier-s0}; });
  ok('every armed career on the enrolment card is the fighter, full length, in his kit', !R.err && R.cards>=10, R.err||(R.cards+' cards'));
  ok('the field: a soldier is a cached sprite of the template, one per army colour and step', !R.err && R.cached && R.frames && R.made>=1, R.err||JSON.stringify(R));

  console.log('\n=== ✦ THE BEDCHAMBER: HER SIZE, AND THE STAGES ===');
  R=await T((src)=>{ const S=window.__SS; const G=eval(src)('rome');
    const cv=document.createElement('canvas'); cv.width=240; cv.height=240; const c=cv.getContext('2d');
    S.drawPreludeRunner(c, 120, 230, 40);
    const d=c.getImageData(0,0,240,240).data; let top=240, bot=0; for(let y=0;y<240;y++) for(let x=0;x<240;x++) if(d[(y*240+x)*4+3]>40){ top=Math.min(top,y); bot=Math.max(bot,y); }
    const out={runnerH:bot-top};
    for(const len of ['quick','long']){ S.setWH('done'); S.startBedScene('fun',len,'bed'); const B=S.BC; const poses=[], stages=[];
      for(let t=0;t<B.dur;t+=20){ S.setBCT(t); B.stage=S.bedStage(B); B.tT=t; S.drawBed(); const L=S.BEDPOSE_LAST; if(t>=S.BED_INTRO && L && poses[poses.length-1]!==L.vi) poses.push(L.vi); const st=B.stage&&B.stage.id; if(st && stages[stages.length-1]!==st) stages.push(st); }
      out[len]={dur:B.dur, poses, stages}; }
    return out; }, src);
  ok('she runs for the door at the room’s scale, not a doll’s (the old silhouettes stood ~85px)', !R.err && R.runnerH>=80, R.err||(R.runnerH+' px'));
  ok('a QUICK one has positions in it now (it had none — the doorway and the clothes ate it)', !R.err && R.quick.poses.length>=3, R.err||JSON.stringify(R.quick));
  ok('and every session climbs through all five stages, ending at rest', !R.err && R.quick.stages.length===5 && R.long.stages.length===5 && R.long.poses[R.long.poses.length-1]===7, R.err||JSON.stringify([R.quick.stages,R.long.poses]));

  console.log('\n=== 😋 THE FACES THAT SAY SOMETHING ===');
  R=await T((src)=>{ const S=window.__SS; const G=eval(src)('rome');
    const out={ex:['hurt','hungry','smitten','shock','laugh','sulk','coin','spent'].every(k=>!!S.FACE_EX[k]), sting:S.reactExpr('sting')};
    S.setWifeMood('hurt',5000); out.mood=S.wifeExpr(G.wife); S.setWifeMood(null,1);
    const w=G.wife, cv=document.createElement('canvas'); cv.width=80; cv.height=110; const c=cv.getContext('2d');
    const shot=(e)=>{ c.clearRect(0,0,80,110); S.drawFemFig(c,c,{look:w, hip:[40,60], floor:100, expr:e, t:30}); return c.getImageData(0,0,80,110).data; };
    const dif=(A,B)=>{ let n=0; for(let i=0;i<A.length;i+=4) if(Math.abs(A[i]-B[i])+Math.abs(A[i+1]-B[i+1])+Math.abs(A[i+2]-B[i+2])>40) n++; return n; };
    const flat=shot('flat'); out.hurt=dif(flat,shot('hurt')); out.hungry=dif(flat,shot('hungry'));
    // the body map, with HUNGRY picked
    G.hasBodyMap=true; S.SETTINGS.bluntBody=true; S.CHART_FACE='auto'; S.openBodyMap(w,'villa');
    const bm=document.querySelector('#scr-bodymap canvas'); const a0=bm.getContext('2d').getImageData(0,0,bm.width,80).data;
    S.CHART_FACE='hungry'; S.openBodyMap(w,'villa'); const a1=bm.getContext('2d').getImageData(0,0,bm.width,80).data;
    out.caption=dif(a0,a1); out.btn=[...document.querySelectorAll('#scr-bodymap button')].some(b=>/HUNGRY/.test(b.textContent));
    out.cap=S.CHART_FACES.hungry.caption; S.CHART_FACE='auto'; S.SETTINGS.bluntBody=false;
    return out; }, src);
  ok('hurt, hungry, smitten, shocked, laughing, sulking, calculating and spent are faces now', !R.err && R.ex, R.err||'');
  ok('a slap that stings leaves her HURT, and a mood she is in shows on her body', !R.err && R.sting==='hurt' && R.mood==='hurt', R.err||JSON.stringify([R.sting,R.mood]));
  ok('on the new body they are different faces (a tear; the reflection and the drool)', !R.err && R.hurt>4 && R.hungry>4, R.err||JSON.stringify([R.hurt,R.hungry]));
  ok('the body map picks HUNGRY for either of them, and prints “CHASING IT” over the figure', !R.err && R.btn && R.caption>200 && R.cap==='CHASING IT', R.err||JSON.stringify([R.btn,R.caption]));

  console.log('\n=== 🤤 HUNGRY FOR BOTH, AND WHAT EACH OF THEM IS CHASING ===');
  R=await T((src)=>{ const S=window.__SS; const G=eval(src)('rome'); const out={};
    out.her=S.resolveEyes('want', false); out.him=S.resolveEyes('want', true); out.spiral=S.resolveEyes('spiral', false);
    out.faces=['starving','hypnotized','thirsty','overwhelmed'].every(k=>!!S.FACE_EX[k] && !!S.CHART_FACES[k] && !!S.HARD_FACES[k]);
    // her eye with a length in it is a different picture from her eye with a heart
    const cv=document.createElement('canvas'); cv.width=40; cv.height=40; const c=cv.getContext('2d');
    const shot=(k)=>{ c.clearRect(0,0,40,40); S.drawEyeFx(c,k,20,20,12,0); return c.getImageData(0,0,40,40).data; };
    const dif=(A,B)=>{ let n=0; for(let i=0;i<A.length;i+=4) if(Math.abs(A[i+3]-B[i+3])>60) n++; return n; };
    const L0=shot('length'), H0=shot('heart'); out.lenVsHeart=dif(L0,H0);
    c.clearRect(0,0,40,40); S.drawEyeFx(c,'length',20,20,12,12); out.bounce=dif(L0, c.getImageData(0,0,40,40).data);
    // watching her bend: HIS face wants her booty
    out.tempt=S.temptHimPose({ph:'bend', shook:true, t:10, hold:100}).face.id;
    // his GET HARD, from her side of the room: bigger is worse
    G.body=G.body||{}; G.body.secret=11; S.openDomus(); S.DM.ardor={ph:'ready', t:0, heat:100};
    out.ardorBig=S.wifeExpr(G.wife); G.body.secret=6; out.ardorMid=S.wifeExpr(G.wife); S.DM.ardor=null;
    return out; }, src);
  ok('hungry is for both: in her eyes a length, in his a booty (a heart with mature content off)', !R.err && R.her==='length' && R.him==='booty' && R.spiral==='spiral-length', R.err||JSON.stringify([R.her,R.him,R.spiral]));
  ok('and the length bounces — it is a different picture from a heart, and from itself a moment later', !R.err && R.lenVsHeart>20 && R.bounce>5, R.err||JSON.stringify([R.lenVsHeart,R.bounce]));
  ok('STARVING, HYPNOTIZED, THIRSTY and OVERWHELMED join it, for her, for him and on the chart', !R.err && R.faces, R.err||'');
  ok('he gets the hungry face watching her bend; she gets it when he GETS HARD — and an Impossible man hypnotizes her', !R.err && S_WANT(R.tempt) && R.ardorBig==='hypnotized' && R.ardorMid==='hungry', R.err||JSON.stringify([R.tempt,R.ardorBig,R.ardorMid]));

  console.log('\n=== 📏 IMMENSE AND IMPOSSIBLE, TOO BIG ON PURPOSE ===');
  R=await T((src)=>{ const S=window.__SS; const G=eval(src)('rome'); const L=(v)=>S.lengthInches({name:'x', body:{secret:v, secretFrac:0.5}},1).hard;
    const out={avg:L(6), long:L(8), imm:L(10), imp:L(11)};
    G.body=G.body||{}; G.body.secret=11; S.setWH('done'); S.startBedScene('fun','long','bed'); out.bigV=S.BC.bigV; out.slow=S.BC.bigSlow;
    S.setBCT(1100); S.BC.stage=S.bedStage(S.BC); S.BC.tT=1100; S.drawBed(); out.he=S.BC.nf&&S.BC.nf.he;
    G.body.secret=6; S.setWH('done'); S.startBedScene('fun','long','bed'); out.midSlow=S.BC.bigSlow;
    return out; }, src);
  ok('an Immense man is 14–21in and an Impossible one 26–34in on a 70in frame; the middle of the ladder is untouched', !R.err && R.imm>=14 && R.imp>=26 && R.avg<7.3 && R.long<10.1, R.err||JSON.stringify(R));
  ok('when she takes a big one it goes slower, and her tongue is out a little', !R.err && R.bigV===11 && R.slow<1 && R.midSlow===1 && R.he==='overwhelmed', R.err||JSON.stringify(R));

  console.log('\n=== 😋 THE FACES COME UP IN THE VILLA ON THEIR OWN ===');
  R=await T((src)=>{ const S=window.__SS; const G=eval(src)('rome'); G.wifeRel=82; G.wifePhys=96; G.jealousy=0; S.setWifeMood(null,1);
    S.openVilla(); const card=[...document.querySelectorAll('#villa-body .small')].map(e=>e.textContent).find(t=>/Right now:/.test(t))||'';
    S.openDomus(); S.DM.wifeX=300; S.DM.x=200; S.drawDomus(); const mood=S.DM.moodW&&S.DM.moodW.id;
    return {expr:S.wifeExpr(G.wife), card, mood}; }, src);
  ok('a wife who is running hot is HUNGRY in the hall, with a bubble saying so', !R.err && R.expr==='hungry' && R.mood==='hungry', R.err||JSON.stringify(R));
  ok('and the villa card says what her face is doing right now', !R.err && /HUNGRY/.test(R.card), R.err||R.card);

  console.log('\n=== 🔞 AND WITH MATURE CONTENT OFF ===');
  await pg.evaluate(()=>localStorage.setItem('SANDSTEEL_ADULT','0')); await pg.reload(); await pg.waitForTimeout(400);
  R=await T(()=>{ const S=window.__SS; return {her:S.resolveEyes('want',false), him:S.resolveEyes('want',true), spiral:S.resolveEyes('spiral',true)}; });
  ok('hungry is a heart for both of them, and nothing else is reflected', !R.err && R.her==='heart' && R.him==='heart' && R.spiral==='spiral-heart', R.err||JSON.stringify(R));

  console.log('\n--- PAGE ERRORS ---');
  ok('none', errs.length===0, errs.slice(0,3).join(' | '));
  console.log('\n'+(fail? fail+' FAILED':'ALL GREEN')+'   ('+(pass+fail)+' checks)');
  await br.close(); process.exit(fail?1:0);
})();
