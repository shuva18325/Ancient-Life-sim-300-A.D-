/* 🔥 V46 — STAMINA, THEIR FACES, GREEDY EYES, HIS BEND, HIS ESCALATORS, AND A BEDCHAMBER WORTH THE NAME
   ---------------------------------------------------------------------
   From the round that asked for:
     · "add stamina — in the training you can upgrade it; if your stamina is
        high and she takes a big one, tongue out and hot; a small one too";
     · "add to the actions tablet: make her face do this — hungry, for both";
     · "make impossible comically large but not TOO large, just a bit bigger";
     · "custom escalator woohoos for the husband";
     · "a greedy trait — playing the wife, he peeks at that booty or stares
        at the bust"; "as the wife you can bend down and he slaps or gets it out";
     · "the bedchamber background is so bad, so old and outdated — fix it,
        and make woohoos better";
     · "and a roadmap".
   Run against the build before with FILE=…: it fails there.               */
const {chromium}=require('playwright');
const FILE=process.env.FILE || ('file://'+require('path').resolve(__dirname,'..','index.html'));
let pass=0, fail=0;
const ok=(name,cond,note)=>{ if(cond){pass++; console.log('  PASS  '+name+(note?'   '+note:''));}
                             else {fail++; console.log('  FAIL  '+name+(note?'   '+note:''));} };
(async()=>{
  const br=await chromium.launch();
  const pg=await br.newPage({viewport:{width:1366,height:768}});
  const errs=[]; pg.on('pageerror',e=>errs.push(''+e));
  await pg.goto(FILE);
  await pg.evaluate(()=>{ localStorage.clear(); localStorage.setItem('SANDSTEEL_ADULT','1'); });
  await pg.reload(); await pg.waitForTimeout(500);
  const T=async(fn,arg)=>{ try{ return await pg.evaluate(fn,arg); }catch(e){ return {err:String(e).slice(0,200)}; } };
  /* a household: fem=true makes you the wife and the spouse a husband */
  const SETUP=`(function(fem, o){ o=o||{}; const S=window.__SS;
    S.newDemo(fem?'Livia':'Marcus','Italia','Roman'); const G=S.G; G.married=true; G.isFemale=!!fem; G.hasVilla=true; G.day=40; G.coin=20000;
    G.body=G.body||{}; if(o.mySecret!==undefined) G.body.secret=o.mySecret; if(o.myStam!==undefined) G.stamina=o.myStam;
    const w=S.makeBride('roman',true,8,fem? {male:true} : undefined); w.male=!!fem; w.traits=o.traits||[]; w.flaws=[]; w.quirks=[];
    w.body=w.body||{}; if(o.spSecret!==undefined) w.body.secret=o.spSecret; if(o.spStam!==undefined) w.stamina=o.spStam;
    G.wife=w; G.wifeRel=80; G.wifePhys=70; if(o.domus!==false) S.openDomus(); return G; })`;

  console.log('\n=== 📏 IMPOSSIBLE, BROUGHT BACK TO EARTH ===');
  let R=await T(()=>{ const S=window.__SS; const at=(v,f)=>S.lengthInches({name:'m'+v+f, body:{secret:v, secretFrac:f}},1).hard;
    return {imp:[0,0.25,0.5,0.75,1].map(f=>at(11,f)), immTop:at(10,1), immBot:at(9,0), long:at(8,1)}; });
  ok('IMPOSSIBLE is 22–26 inches — a step past IMMENSE, not a thing that enters the room first', !R.err && R.imp.every(x=>x>=22 && x<=26) && Math.min(...R.imp)>R.immTop, R.err||JSON.stringify(R));
  ok('and the rest of the ladder is where it was (Immense 14–21, Long up to 10)', !R.err && R.immBot>=14 && R.immTop<=21 && R.long<=10, R.err||JSON.stringify(R));

  console.log('\n=== 🔥 STAMINA — TRAINED AT THE LUDUS ===');
  R=await T(([SETUP])=>{ const S=window.__SS; const G=eval(SETUP)(false,{domus:false}); const out={def:S.selfStamina()};
    S.trainScreen(); const card=document.getElementById('stamina-card'); out.card=!!card; out.text=card? card.textContent : '';
    const c0=G.coin, d0=G.day, f0=G.fatigue||0; card.querySelector('button').click();
    out.after=S.selfStamina(); out.paid=c0-G.coin; out.days=G.day-d0; out.tired=(G.fatigue||0)>f0;
    G.stamina=10; S.trainScreen(); const b2=document.querySelector('#stamina-card button'); out.maxed=b2.disabled && /ALL NIGHT/.test(b2.textContent);
    return out; }, [SETUP]);
  ok('a new career starts at 3; the ludus has a STAMINA card beside the body drills', !R.err && R.def===3 && R.card && /STAMINA/.test(R.text), R.err||JSON.stringify(R));
  ok('training it costs coin, a day and some fatigue, and raises it by one', !R.err && R.after===4 && R.paid>0 && R.days===1 && R.tired, R.err||JSON.stringify(R));
  ok('and at ten it is as far as it goes', !R.err && R.maxed, R.err||JSON.stringify(R));

  console.log('\n=== 🥵 WHAT IT DOES IN THE BEDCHAMBER ===');
  R=await T(()=>{ const S=window.__SS; const t=(i,her,his)=>S.staminaTierFor(i,her,his).tier; const tongue=(x)=>x==='hot'||x==='much';
    return {
      bigHighYou: t(17,7,10),          // an Immense one, your stamina high, hers decent → hot
      bigLowHer:  t(24,3,5),           // an Impossible one on a wife with little → too much
      bigHighBoth:t(24,10,5),          // an Impossible one, her stamina maxed → hot, not too much
      smallYouHigh:t(3.5,3,10),        // a small one, but you keep going → tongue out
      smallOrd:   t(3.5,5,3),          // a small one, ordinary man, ordinary wife → she wants more
      avgOrd:     t(6,5,3),            // an ordinary man and an ordinary wife → a good match
      tongueOnBig:[9,10,11].every(v=>{ const i=S.lengthInches({name:'b'+v, body:{secret:v, secretFrac:0.5}},1).hard; return tongue(t(i,5,5)); }),
      faces:{hot:S.STAM_TIERS.hot.face, much:S.STAM_TIERS.much.face, easy:S.STAM_TIERS.easy.face}, tongueFaces:['thirsty','overwhelmed'].every(k=>S.FACE_EX[k].tongue) }; });
  ok('your stamina high and a big one: tongue out and HOT, not too much', !R.err && R.bigHighYou==='hot' && R.bigHighBoth==='hot', R.err||JSON.stringify(R));
  ok('on a wife without the stamina for it, it is TOO MUCH', !R.err && R.bigLowHer==='much', R.err||JSON.stringify(R));
  ok('and even a small one gets her tongue out, with a man who trained for it', !R.err && R.smallYouHigh==='hot', R.err||JSON.stringify(R));
  ok('an ordinary pair is a good match; a small one on an ordinary wife, she wants more', !R.err && R.avgOrd==='good' && R.smallOrd==='easy', R.err||JSON.stringify(R));
  ok('every big one on an average wife is tongue-out territory, and those faces have the tongue', !R.err && R.tongueOnBig && R.tongueFaces && R.faces.hot==='thirsty' && R.faces.easy==='smug', R.err||JSON.stringify(R));
  R=await T(([SETUP])=>{ const S=window.__SS; const out={};
    const run=(o)=>{ const G=eval(SETUP)(false,Object.assign({domus:false},o)); S.setWH('done'); S.startBedScene('fun','long','bed'); return S.BC; };
    let B=run({mySecret:11, myStam:1, spStam:10}); out.shortDur=B.dur; out.tierHot=B.stam&&B.stam.tier;
    B=run({mySecret:11, myStam:9, spStam:10}); out.longDur=B.dur;
    B=run({mySecret:11, myStam:5, spStam:2}); out.much=B.stam&&B.stam.tier;
    let spentAt=null; for(let t=800;t<B.dur;t+=10){ B.t=t; B.stage=S.bedStage(B); B.tT=t; if(S.bedStamLeft(B)<=0.02){ spentAt=B.stage&&B.stage.p; break; } }
    out.spentAt=spentAt;
    /* her face in a position */
    B=run({mySecret:11, myStam:5, spStam:8}); out.faceTier=B.stam&&B.stam.tier; B.t=1300; B.stage=S.bedStage(B); B.tT=1300; S.drawBed(); out.face=B.nf&&B.nf.he;
    /* and after: she walks back into the hall wearing it, and practice builds hers */
    const w=S.G.wife, st0=S.spouseStamina(w); S.finishBed(); out.mood=S.wifeMood(); out.grew=S.spouseStamina(w)>st0;
    return out; }, [SETUP]);
  ok('his stamina is how long he lasts — a trained man lasts positions longer', !R.err && R.longDur>R.shortDur, R.err||JSON.stringify(R));
  ok('TOO MUCH runs her stamina out before the end, and she is spent', !R.err && R.much==='much' && R.spentAt!==null && R.spentAt<0.95, R.err||JSON.stringify(R));
  ok('in the positions her face is the tier’s — tongue out and hot for a big one she has the stamina for', !R.err && R.face==='thirsty', R.err||JSON.stringify(R));
  ok('she walks back into the hall wearing it, and practice builds her stamina', !R.err && R.mood==='thirsty' && R.grew, R.err||JSON.stringify(R));
  R=await T(([SETUP])=>{ const S=window.__SS; const G=eval(SETUP)(false,{domus:false, spStam:6});
    S.openBodyMap(S.selfSubject(),'villa'); const me=document.getElementById('bodymap-verdict').textContent;
    S.openBodyMap(G.wife,'villa'); const her=document.getElementById('bodymap-verdict').textContent;
    return {me:/STAMINA 3\/10/.test(me) && /you last/.test(me), her:/STAMINA 6\/10/.test(her) && /tongue-out hot up to/.test(her)}; }, [SETUP]);
  ok('the body map says it for you and for them, in plain words', !R.err && R.me && R.her, R.err||JSON.stringify(R));

  console.log('\n=== ☺ MAKE THEIR FACE ===');
  R=await T(([SETUP])=>{ const S=window.__SS; const out={};
    let G=eval(SETUP)(false); S.openTablet(); out.menuW=S.tabletMenu().map(m=>m.id);
    S.tabletFire('face'); out.grid=S.DM.tablet && S.DM.tablet.faces; S.drawDomus();
    S.tabletFaceApply('hungry','spouse'); out.wife=S.wifeExpr(G.wife); out.quip=!!(S.DM.walkQuip);
    const cv=document.createElement('canvas'); cv.width=100; cv.height=100;
    G=eval(SETUP)(true); S.openTablet(); out.menuH=S.tabletMenu().find(m=>m.id==='face').name;
    S.tabletFaceApply('hungry','spouse'); const F=S.hallManFace(G.wife, 80); out.husb=F && F.id; out.husbEyes=F && F.eyes;
    S.tabletFaceApply('smitten','self'); out.self=S.selfMood(); out.selfExpr=S.wifeExpr(S.playerLook());
    S.tabletFaceApply('clear','spouse'); out.cleared=S.wifeMood();
    out.faces=S.TABLET_FACES.length; out.named=S.TABLET_FACES.every(id=>S.tabletFaceName(id)[0].length>1);
    return out; }, [SETUP]);
  ok('the tablet has MAKE HER FACE and MAKE YOUR FACE, and opens a grid of faces', !R.err && R.menuW.includes('face') && R.menuW.includes('myface') && R.grid==='spouse', R.err||JSON.stringify(R));
  ok('pick HUNGRY and she wears it, and says something about it', !R.err && R.wife==='hungry' && R.quip, R.err||JSON.stringify(R));
  ok('HUNGRY works on a husband too — his eyes have a booty in them', !R.err && /HIS FACE/.test(R.menuH) && R.husb==='hungry' && R.husbEyes==='want', R.err||JSON.stringify(R));
  ok('your own face, and back to their own', !R.err && R.self==='smitten' && R.selfExpr==='smitten' && R.cleared===null && R.faces>=17 && R.named, R.err||JSON.stringify(R));

  console.log('\n=== 👀 GREEDY ===');
  R=await T(([SETUP])=>{ const S=window.__SS; const out={};
    out.traits=['gr_greedy','gr_seat','gr_front'].every(id=>!!S.traitById(id) && S.traitById(id).adult);
    let G=eval(SETUP)(true,{traits:['gr_seat']}); let D=S.DM;
    D.x=D.wifeX-40; D.face=-1; S.startGaze(); out.seat=D.gaze.kind; out.heTurns=D.wifeDir===-1;
    D.gaze.t=30; D.face=1; S.updateGaze(1); out.caught=D.gaze && D.gaze.caught; out.caughtFace=S.wifeMood();
    D.gaze=null; D.face=1; D.lastGazeT=-99999; G.wife.traits=['gr_front']; S.startGaze(); out.front=D.gaze.kind;
    const t0=S.gazeTarget('front'), t1=S.gazeTarget('seat'); out.targets=t0[1]<t1[1];                   // her front is higher up than her seat
    /* F: give him something to look at */
    D.gaze=null; G.wife.traits=['gr_seat']; D.face=-1; S.startGaze(); D.gaze.t=10; out.bendFromLook=(function(){ window.__SS.DM.gaze.t=10; return true; })();
    /* a greedy wife looks too, at him */
    G=eval(SETUP)(false,{traits:['gr_front']}); D=S.DM; D.x=D.wifeX-40; D.face=1; S.startGaze(); out.wifeLooks=D.gaze.kind==='front' && /tunic|floor/.test(D.gaze.line);
    for(let i=0;i<5;i++){ D.t++; S.drawDomus(); }
    /* when nobody is greedy, nobody looks */
    G=eval(SETUP)(false,{traits:[]}); out.nobody=!S.gazeReady();
    /* no child inherits it */
    G=eval(SETUP)(false,{traits:['gr_greedy','gr_seat']}); G.traits=['gr_front']; let kid=0; for(let i=0;i<200;i++) kid+=(S.inheritDNA(i%2===0).traits||[]).filter(t=>/^gr_/.test(t)).length; out.kid=kid;
    return out; }, [SETUP]);
  ok('three greedy traits — Greedy, Seat-Struck, Front-Struck — mature content only', !R.err && R.traits, R.err||JSON.stringify(R));
  ok('playing the wife, a Seat-Struck husband stops, turns and looks at your seat', !R.err && R.seat==='seat' && R.heTurns, R.err||JSON.stringify(R));
  ok('turn round and you have caught him', !R.err && R.caught && (R.caughtFace==='flush'||R.caughtFace==='smug'), R.err||JSON.stringify(R));
  ok('a Front-Struck one looks at your front instead — the line goes to it', !R.err && R.front==='front' && R.targets, R.err||JSON.stringify(R));
  ok('a greedy wife looks too — at the front of your tunic', !R.err && R.wifeLooks, R.err||JSON.stringify(R));
  ok('nobody greedy, nobody looks; and a child never inherits where the eyes go', !R.err && R.nobody && R.kid===0, R.err||JSON.stringify(R));

  console.log('\n=== 🍑 THE BEND, WHEN YOU ARE THE WIFE ===');
  R=await T(([SETUP])=>{ const S=window.__SS; const out={};
    let G=eval(SETUP)(true,{traits:['gr_seat']}); let D=S.DM;
    out.ok=S.playerBendOk(); D.x=D.wifeX-40; D.face=-1; out.started=S.startPlayerBend(false); out.show=D.drop&&D.drop.show; out.ph=D.drop&&D.drop.ph;
    const R3={slap:0,rise:0,stare:0}; for(let i=0;i<600;i++) R3[S.bendReaction({show:'seat'})]++; out.reacts=R3;
    /* shake it until he comes, and see each reaction resolve */
    const drive=(react)=>{ const G2=eval(SETUP)(true,{traits:['gr_seat','priapic']}); const D2=S.DM; D2.x=D2.wifeX-40; D2.face=-1; S.startPlayerBend(false);
      const orig=S.bendReaction; D2.drop.noticed=500; D2.drop.bend=true;
      let seen=null; for(let i=0;i<30 && D2.drop;i++){ D2.drop.t+=1; if(D2.drop.ph==='bait'){ D2.drop.react=null; }
        /* force the reaction the first time he is pulled */
        if(D2.drop.ph==='bait' && D2.drop.noticed>=500){ window.__forceReact=react; }
        S.updateDrop(1); seen=seen || (D2.drop? D2.drop.ph : (D2.rise? 'rise' : 'gone')); if(D2.drop && D2.drop.ph!=='bait') break; }
      return seen; };
    out.firstMove=drive('slap');
    /* a husband off the bend who is priapic can simply be up — the rise, already risen */
    let rose=false; for(let k=0;k<80 && !rose;k++){ G=eval(SETUP)(true,{traits:['priapic']}); D=S.DM; D.x=D.wifeX-40; D.face=-1; S.startPlayerBend(false);   // a fresh bend each try — the reaction is rolled once
      D.drop.noticed=500; S.updateDrop(1); if(D.rise) rose=D.rise.stage>=4; }
    out.rose=rose;
    /* and a stare */
    let stared=false; for(let k=0;k<60 && !stared;k++){ G=eval(SETUP)(true,{traits:['gr_greedy','gr_front']}); D=S.DM; D.x=D.wifeX-40; D.face=1; S.startPlayerBend(false); D.drop.noticed=500; S.updateDrop(1); stared=!!(D.drop && D.drop.ph==='gawk'); if(stared){ for(let i=0;i<4;i++){ D.t++; S.drawDomus(); } } }
    out.stared=stared;
    return out; }, [SETUP]);
  ok('playing the wife you can bend over on demand, and he sees your seat when your back is to him', !R.err && R.ok && R.started && R.show==='seat' && R.ph==='bait', R.err||JSON.stringify(R));
  ok('what he does is his: mostly a slap, sometimes he gets it out where he stands, sometimes he just stares', !R.err && R.reacts.slap>R.reacts.rise && R.reacts.rise>30 && R.reacts.stare>30, R.err||JSON.stringify(R.reacts));
  ok('a priapic husband can simply be up — the rise, already risen, off the bend', !R.err && R.rose, R.err||JSON.stringify(R));
  ok('and a greedy, front-struck one stops dead and stares', !R.err && R.stared, R.err||JSON.stringify(R));
  R=await T(([SETUP])=>{ const S=window.__SS; const G=eval(SETUP)(true,{traits:['esc_big']}); const D=S.DM; D.x=D.wifeX-20; D.face=-1;
    S.startPlayerBend(false); const X=D.drop; X.ph='bentslap'; X.t=90; X.husbX=D.x+10; X.landed=true; S.updateDrop(10);
    return {esc:!!(D.scene && D.scene.kind==='escalate' && D.scene.leaderMale===true)}; }, [SETUP]);
  ok('and a husband with an escalator takes the slap on your bend further — his own scene', !R.err && R.esc, R.err||JSON.stringify(R));

  console.log('\n=== 🔺 HIS OWN ESCALATIONS ===');
  R=await T(([SETUP])=>{ const S=window.__SS; const out={plans:{}, ended:{}, errs:[]};
    for(const e of ['big','turn','mid','slow']){ out.plans[e]=S.escPlan(e,true).filter(b=>b.k==='pose').map(b=>b.vi).join(','); }
    out.differ=['big','turn','mid','slow'].every(e=>S.escPlan(e,true).filter(b=>b.k==='pose').map(b=>b.vi).join(',')!==S.escPlan(e,false).filter(b=>b.k==='pose').map(b=>b.vi).join(','));
    out.threeEach=['big','turn','slow'].every(e=>S.escPlan(e,true).filter(b=>b.k==='pose' && b.vi!==1).length>=3);
    out.sundial=['turn','slow'].every(e=>S.escPlan(e,true).some(b=>b.vi===5));
    for(const esc of ['big','turn','mid','slow']){
      const G=eval(SETUP)(true,{traits:['esc_'+esc]}); const D=S.DM;
      if(esc==='slow'){ S.escAfterSlap({k:'ok'},'slap','spouse',260); S.escAfterSlap({k:'ok'},'slap','spouse',260); }
      S.escAfterSlap({k:'ok'}, esc==='mid'? 'romantic' : 'slap', 'spouse', 260);
      let g=0; const vis=new Set();
      while(D.scene && g<9000){ g++; D.scene.t+=1; try{ S.updateEscalate(1); }catch(e){ out.errs.push(esc+': '+e.message); break; }
        if(D.scene && g%41===0){ const st=D.scene.plan[D.scene.si]; if(st.vi!==undefined) vis.add(st.vi); try{ S.drawDomus(); }catch(e){ out.errs.push(esc+' draw: '+e.message); break; } } }
      out.ended[esc]={ended:!D.scene, vis:[...vis].join(',')}; }
    return out; }, [SETUP]);
  ok('when he leads, all four escalators run his own order — not hers', !R.err && R.differ, R.err||JSON.stringify(R.plans));
  ok('three positions each: he pins, lifts, and takes her from behind; he sets her down and gets it out', !R.err && R.threeEach && R.sundial, R.err||JSON.stringify(R.plans));
  ok('and every one of his plays through to the end in the hall', !R.err && Object.values(R.ended).every(v=>v.ended) && R.errs.length===0, R.err||JSON.stringify([R.ended,R.errs]));

  console.log('\n=== 🏛 A BEDCHAMBER WORTH THE NAME ===');
  R=await T(([SETUP])=>{ const S=window.__SS; const out={};
    const cv=document.createElement('canvas'); cv.width=480; cv.height=270; const c=cv.getContext('2d');
    const busy=(g)=>{ const d=g.getImageData(0,0,480,270).data; const cols=new Set(); for(let i=0;i<d.length;i+=16) cols.add((d[i]>>3)+'.'+(d[i+1]>>3)+'.'+(d[i+2]>>3)); return cols.size; };
    const game=document.getElementById('game').getContext('2d');
    const room=(world)=>{ if(world==='rk') S.newDemo('Kaiq','Leokanis','RkTorvak'); else S.newDemo('Marcus','Italia','Roman');
      const G=S.G; G.married=true; G.hasVilla=true; const w=S.makeBride(world==='rk'?'rk':'roman',true,8); w.male=false; G.wife=w;
      S.setWH('done'); S.startBedScene('fun','long','bed'); const B=S.BC; B.t=80; game.setTransform(1,0,0,1,0,0); game.clearRect(0,0,480,270); S.drawBed(); const a=busy(game);
      B.t=1100; B.stage=S.bedStage(B); B.tT=1100; game.clearRect(0,0,480,270); S.drawBed(); const b=busy(game);
      /* it moves: the lamp flickers, the stars twinkle, the curtain breathes */
      const snap=()=>{ const d=game.getImageData(0,0,480,270).data; let h=0; for(let i=0;i<d.length;i+=12) h=(h*31+d[i]+d[i+1]*7+d[i+2]*3)%1000000007; return h; };
      B.t=90; game.clearRect(0,0,480,270); S.drawBed(); const h1=snap(); B.t=137; game.clearRect(0,0,480,270); S.drawBed(); const h2=snap();
      return {intro:a, stage:b, moves:h1!==h2, plan:S.hallPlan().kind}; };
    out.rome=room('rome'); out.rk=room('rk');
    /* the painters on their own, both sizes */
    const P=(x,y,w,h,col)=>{ c.fillStyle=col; c.fillRect(x|0,y|0,Math.max(1,w|0),Math.max(1,h|0)); }, D=(col)=>col;
    c.clearRect(0,0,480,270); S.drawCubiculum.call(null,P,D,0,14,480,256,224,50,S.HALL_PLAN.roman); S.drawCubiculumFloor(P,D,0,224,480,46,S.HALL_PLAN.roman); out.cubBusy=busy(c);
    return out; }, [SETUP]);
  ok('the Roman bedchamber is a painted room now — frieze, panels, window, curtain, lamp, mosaic — at the door and behind the positions', !R.err && R.rome.plan==='plaster' && R.rome.intro>120 && R.rome.stage>120 && R.cubBusy>30, R.err||JSON.stringify(R));
  ok('the coast’s longhouse is finished the same way', !R.err && R.rk.plan==='plank' && R.rk.intro>90 && R.rk.stage>90, R.err||JSON.stringify(R));
  ok('and the room is alive: the lamp flickers, the stars twinkle, the curtain moves', !R.err && R.rome.moves && R.rk.moves, R.err||JSON.stringify(R));

  console.log('\n=== 🚪 AND THE GATE ===');
  await pg.evaluate(()=>{ localStorage.setItem('SANDSTEEL_ADULT','0'); });
  await pg.reload(); await pg.waitForTimeout(400);
  R=await T(([SETUP])=>{ const S=window.__SS; const G=eval(SETUP)(true,{traits:['gr_greedy'],domus:false});
    S.trainScreen(); const card=!!document.getElementById('stamina-card');
    return {card, calc:S.bedStaminaCalc(), gaze:S.gazeReady(), bend:S.playerBendOk()}; }, [SETUP]);
  ok('with mature content off: no stamina card, no stamina in the bedchamber, no wandering eyes, no bend', !R.err && !R.card && R.calc===null && !R.gaze && !R.bend, R.err||JSON.stringify(R));

  ok('no page errors anywhere', errs.length===0, errs.slice(0,3).join(' | '));
  await br.close();
  console.log(fail? `\n${fail} FAILED, ${pass} passed` : `\nALL GREEN   (${pass} checks)`);
  process.exit(fail?1:0);
})();
