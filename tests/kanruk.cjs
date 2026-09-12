/* ✧ KAN'S TURN, AND THE GIFT SHE OFFERS FIRST
   ---------------------------------------------------------------------
   Two things are under test and they pull in opposite directions.

   The FIRST is the beat: she calls him over, it is for something specific,
   each real thing she is pleased about pays out once, and declining the
   gift — not the gift itself — is the move that costs.

   The SECOND is the augury, and the point of testing it is that the game
   must not believe it. The district says CHILDREN ARE CLOSE. The ledger
   says keeping it forfeits tonight entirely and adds a tenth to the next
   attempt inside three months, which is a WORSE trade than simply trying
   again. Both of those have to be true in the code at the same time, the
   way the criers on the crossing are four true, three false and one half.

   And then the pixels, because the finish has two animations and neither
   of them throws if it draws nothing at all.                            */
const {chromium}=require('playwright');
const FILE='file:///home/user/Ancient-Life-sim-300-A.D-/index.html';
let pass=0, fail=0;
const ok=(name,cond,note)=>{ if(cond){pass++; console.log('  PASS  '+name+(note?'   '+note:''));}
                             else {fail++; console.log('  FAIL  '+name+(note?'   '+note:''));} };

(async()=>{
  const br=await chromium.launch();
  const pg=await br.newPage({viewport:{width:960,height:600}});
  const errs=[]; pg.on('pageerror',e=>errs.push(''+e));
  await pg.goto(FILE);
  await pg.evaluate(()=>localStorage.setItem('SANDSTEEL_ADULT','1'));
  await pg.reload(); await pg.waitForTimeout(400);

  const setup=()=>pg.evaluate(()=>{
    const S=window.__SS;
    S.newDemo('Kaiq','Leokanis','RkTorvak');
    const G=S.G; G.world='rk'; G.married=true; G.isFemale=false; G.hasVilla=true; G.day=40;
    const w=S.makeBride('rkrai',false,9,{male:true});
    w.male=false; w.eth='rkrai'; w.flaws=[]; w.quirks=[]; w.traits=['kanvek'];
    w.body={face:10,hairq:7,bust:8,waist:5,booty:10,legs:7}; w.age=24; w.skin='#e6bd94';
    G.wife=w; G.body=G.body||{}; G.body.secret=6;
    G.wifeRel=70; G.wifePhys=60; G.children=[]; G.wins=0; G.rkHolds={}; G.rkCrossRuns=0;
    G.rkSeatsTaken=0; G.rkRewardFor={}; G.rkRewardDay=-99; G.rkKanruk=null;
  });

  // ---------------------------------------------------------------- gating
  console.log('\n=== ✧ WHEN THE CHOICE IS EVEN ON THE TABLE ===');
  await setup();
  let R=await pg.evaluate(()=>{
    const S=window.__SS, G=S.G, o={};
    o.on = S.kanrukOffered();
    G.wife.traits=[];            o.noTrait = S.kanrukOffered();
    G.wife.traits=['kanvek'];
    G.world='west';              o.offCoast = S.kanrukOffered();
    G.world='rk';
    G.isFemale=true;             o.herHouse = S.kanrukOffered();
    G.isFemale=false;
    return o;
  });
  ok('offered on the coast, with her gift', R.on===true);
  ok('and not without the gift',            R.noTrait===false);
  ok('and not off the coast',               R.offCoast===false);
  ok('and not in a house run the other way',R.herHouse===false);

  // ------------------------------------------------------------- the augury
  console.log('\n=== ✧ THE SIGN, AND WHAT IT IS ACTUALLY WORTH ===');
  R=await pg.evaluate(()=>{
    const S=window.__SS, G=S.G, o={};
    G.rkKanruk=null;
    o.cold=S.kanrukActive();
    S.kanrukArm();
    o.armed=S.kanrukActive(); o.left=S.kanrukLeft(); o.window=S.RK_KANRUK_WINDOW;
    /* the plain number against the number with the sign on it */
    o.plain = S.conceiveChance(0.42, G.wife, 0);
    o.signed= S.conceiveChance(0.42+S.RK_KANRUK_ADD, G.wife, 0);
    const sp=S.kanrukSpend();
    o.spend=sp; o.afterSpend=S.kanrukActive();
    /* and it lapses rather than sitting on the save for ever */
    S.kanrukArm(); G.day+=S.RK_KANRUK_WINDOW+1;
    o.lapsed=S.kanrukActive(); G.day-=S.RK_KANRUK_WINDOW+1;
    return o;
  });
  ok('shut until it is turned over',   R.cold===false);
  ok('armed, and it runs three months',R.armed===true && R.left===R.window && R.window===9,
     R.left+' days');
  ok('worth exactly a tenth',          Math.abs((R.signed-R.plain)-0.10)<1e-9,
     R.plain.toFixed(3)+' → '+R.signed.toFixed(3));
  ok('spent once and then gone',       R.spend.on===true && R.spend.add===0.10 && R.afterSpend===false);
  ok('and it lapses if unused',        R.lapsed===false);
  ok('† A WORSE TRADE THAN TRYING — forfeit tonight to gain a tenth later',
     R.plain > 3*0.10,
     'forfeits '+R.plain.toFixed(2)+' tonight to add 0.10 to one later attempt');

  // ------------------------------------------------------- the scene's beat
  console.log('\n=== ✧ THE BEAT IN THE SCENE ===');
  R=await pg.evaluate(()=>{
    const S=window.__SS, o={};
    S.setWH('done'); S.startBedScene('heir','long','bed');
    const s=S.BC;
    o.onNow=S.rkFinOn(s);
    o.at=S.rkFinAt(s); o.dur=s.dur;
    o.inside = (o.at>520 && o.at<o.dur);
    /* the clock STOPS on it. It used to be that running out of scene made
       the decision for him, which is the one thing this beat is for. */
    S.setBCT(o.at+4);
    S.updateBed(1); o.started=!!(s.fin && s.fin.ph==='ask'); o.pinned=s.rkFinPose;
    const t0=s.t; S.updateBed(1); S.updateBed(1); S.updateBed(1);
    o.frozen=(s.t===t0) && s.fin.ph==='ask';
    o.tickedOn=s.fin.t>0;
    return o;
  });
  ok('the beat is on for a kanvek night',  R.onNow===true);
  ok('and it lands inside the scene',      R.inside, 'at '+R.at+' of '+R.dur);
  ok('it starts, and pins her gift on screen', R.started===true && R.pinned===22);
  ok('AND THE CLOCK STOPS while it asks',  R.frozen===true);
  ok('while the beat itself keeps running',R.tickedOn===true);

  // ------------------------------------------------------------- keeping it
  R=await pg.evaluate(()=>{
    const S=window.__SS, G=S.G, o={};
    const s=S.BC;
    const rel0=G.wifeRel, ph0=G.wifePhys;
    S.rkFinTake(s, true);
    o.ph=s.fin.ph; o.kept=s.finKept; o.armed=S.kanrukActive();
    o.rel=G.wifeRel-rel0; o.phys=G.wifePhys-ph0;
    o.room=(s.dur - s.t) >= 200;                    // the animation gets its beats
    o.noDrops=!s.fin.drops;
    return o;
  });
  ok('[K] keeps it and turns Kan’s book over', R.ph==='in' && R.kept===true && R.armed===true);
  ok('and she has an opinion about it',        R.rel>0 && R.phys>0, '+'+R.rel+'♥ +'+R.phys+'🔥');
  ok('the scene is given room to finish',      R.room===true);
  ok('and no drips on this branch',            R.noDrops===true);

  // ------------------------------------------------------- and not keeping it
  R=await pg.evaluate(()=>{
    const S=window.__SS, G=S.G, o={};
    G.rkKanruk=null;                       // the block above armed it; start cold
    S.setWH('done'); S.startBedScene('heir','long','bed');
    const s=S.BC; S.setBCT(S.rkFinAt(s)+4); S.updateBed(1);
    S.rkFinTake(s, false);
    o.ph=s.fin.ph; o.kept=s.finKept; o.drops=(s.fin.drops||[]).length;
    o.armed=S.kanrukActive();
    return o;
  });
  ok('[X] is his, and it is not read as wrong', R.ph==='out' && R.kept===false);
  ok('it runs real drops',                      R.drops>=5, R.drops+' of them');
  ok('and no sign either way',                  R.armed===false);

  // -------------------------------------------------------------- no soft lock
  R=await pg.evaluate(()=>{
    const S=window.__SS, o={};
    S.setWH('done'); S.startBedScene('heir','long','bed');
    const s=S.BC; S.setBCT(S.rkFinAt(s)+4); S.updateBed(1);
    for(let i=0;i<600 && s.fin.ph==='ask';i++) S.updateBed(1);
    o.ph=s.fin.ph; o.drift=!!s.fin.drift;
    /* and once resolved the clock is free again */
    const t0=s.t; S.updateBed(1); o.moving=s.t>t0;
    return o;
  });
  ok('NO SOFT LOCK — left alone it decides the careful way',
     R.ph==='out' && R.drift===true);
  ok('and the clock is free again once it has',  R.moving===true);

  // ------------------------------------------- and tonight makes nobody
  console.log('\n=== ✧ AND THE COAST’S OWN ARITHMETIC ===');
  R=await pg.evaluate(()=>{
    const S=window.__SS, G=S.G, o={};
    /* a hundred heir-nights at the top of the range, kept every time. If
       any of them produced a child the coast cannot count. */
    let kids=0;
    for(let i=0;i<60;i++){
      G.pregnant=null; G.day=40;
      S.setWH('done'); S.startBedScene('heir','night','bed');
      S.BC.finKept=true; S.finishBed();
      if(G.pregnant) kids++;
    }
    o.keptKids=kids;
    /* and the same nights NOT kept, which had better produce some */
    kids=0;
    for(let i=0;i<60;i++){
      G.pregnant=null; G.day=40;
      S.setWH('done'); S.startBedScene('heir','night','bed');
      S.finishBed();
      if(G.pregnant) kids++;
    }
    o.plainKids=kids;
    return o;
  });
  ok('keeping it makes nobody tonight, every time', R.keptKids===0, R.keptKids+' of 60');
  ok('and not keeping it plainly does',             R.plainKids>20, R.plainKids+' of 60');

  // ------------------------------------------------------- "come here"
  console.log('\n=== ✧ "COME HERE" — SHE STARTS IT ===');
  await setup();
  R=await pg.evaluate(()=>{
    const S=window.__SS, G=S.G, o={};
    o.plain=S.rkRewardCause().id;
    G.rkHolds={naukan:{day:1}};   o.hold=S.rkRewardCause().id;
    S.rkRewardClaim(S.rkRewardCause());
    o.holdPaid=S.rkRewardCause().id;                // it pays out ONCE
    G.rkSeatsTaken=1;             o.seat=S.rkRewardCause().id;
    S.rkRewardClaim(S.rkRewardCause());
    G.wins=2;                     o.win=S.rkRewardCause().id;
    S.rkRewardClaim(S.rkRewardCause());
    G.children=[{name:'x'}];      o.child=S.rkRewardCause().id;
    o.forWhat=!!S.rkRewardCause().forWhat;          // and it says what it is for
    return o;
  });
  ok('with nothing to be pleased about, she is still allowed',
     R.plain==='none'||R.plain==='none2'||R.plain==='figure', R.plain);
  ok('a hold on the far shore is a reason',   R.hold==='hold');
  ok('and each reason pays out once',         R.holdPaid!=='hold', 'then: '+R.holdPaid);
  ok('her seating is a reason',               R.seat==='seat');
  ok('walking off the ground is a reason',    R.win==='win');
  ok('and so is the child',                   R.child==='child');
  ok('and it always says what it is for',     R.forWhat===true);

  R=await pg.evaluate(()=>{
    const S=window.__SS, G=S.G, o={};
    S.openDomus();
    const D=S.DM;
    o.hasDM=!!D;
    G.rkRewardForce=true;
    o.due=S.rkRewardDue();
    o.started=S.startRkReward();
    o.locks=!!(D.reward && D.reward.locks);
    o.forced=G.rkRewardForce;                      // the console's flag is spent
    o.line=(D.reward&&D.reward.line||'').slice(0,14);
    /* declining a GIFT is the expensive move on this coast — not the gift */
    const rel0=G.wifeRel;
    S.setEdge('x'); S.updateRkReward(1);
    o.ph=D.reward.ph; o.cost=G.wifeRel-rel0; o.refused=G.rkGiftsRefused|0;
    return o;
  });
  ok('the console can make her ask now',      R.hasDM===true && R.due===true && R.started===true);
  ok('and the beat locks the hall',           R.locks===true);
  ok('the forcing flag is spent, not sticky', R.forced===false);
  ok('she says it in her own words',          (R.line||'').length>4, '“'+R.line+'…”');
  ok('DECLINING THE GIFT is what costs — −5', R.ph==='no' && R.cost===-5 && R.refused===1,
     R.cost+' bond');

  R=await pg.evaluate(()=>{
    const S=window.__SS, G=S.G, o={};
    S.openDomus(); const D=S.DM;
    G.rkRewardForce=true; S.startRkReward();
    const rel0=G.wifeRel;
    for(let i=0;i<1600 && D.reward && !D.reward.ph;i++) S.updateRkReward(1);
    o.ph=D.reward? D.reward.ph : 'gone'; o.cost=G.wifeRel-rel0;
    return o;
  });
  ok('and standing there says nothing and costs nothing',
     R.ph==='away' && R.cost===0, R.ph+' / '+R.cost);

  /* ---- AND THE WHOLE THING END TO END, because every piece above passes
     in isolation and the run that matters is: she asks → he goes → the
     scene plays → the scene asks → he answers → the house is changed. ---- */
  R=await pg.evaluate(()=>{
    const S=window.__SS, G=S.G, o={};
    G.rkKanruk=null; G.pregnant=null; G.rkRewardDay=-99;
    S.openDomus(); const D=S.DM;
    G.rkRewardForce=true; S.startRkReward();
    /* the bar has to say which key does what, or the beat is a guess */
    const acts=S.sceneActions().map(a=>a.k+':'+a.t);
    o.bar=acts.join(' | ');
    o.barOk = acts.length===2 && /^k:GO TO HER/.test(acts[0]) && /^x:/.test(acts[1]);
    S.setEdge('k'); S.updateRkReward(1);
    for(let i=0;i<200 && S.DM;i++) S.updateRkReward(1);
    /* EVERY scene on this game goes through her lighting up first — that is
       the front porch startBedScene raises before it hands over, and the
       kanvek is not an exception to it */
    o.litUp = (S.state==='wifehappy');
    o.spent = (G.loveDay===G.day);            // counted against the day, not free
    for(let i=0;i<400 && S.state==='wifehappy';i++) S.updateWifeHappy(1);
    o.inBed = (S.state==='bed') && !!S.BC;
    if(!o.inBed) return o;
    /* run the scene down to the beat the way the loop would */
    const s=S.BC;
    for(let i=0;i<4000 && !(s.fin && s.fin.ph==='ask');i++) S.updateBed(1);
    o.reachedAsk = !!(s.fin && s.fin.ph==='ask');
    S.setEdge('k'); S.updateRkFin(s,1);
    o.answered = s.fin.ph==='in'; o.armed=S.kanrukActive();
    /* and the scene ends by itself from there */
    for(let i=0;i<900 && S.BC;i++) S.updateBed(1);
    o.ended = !S.BC;
    o.still = S.kanrukActive();               // the sign survives into the next day
    return o;
  });
  ok('the bar names both keys',              R.barOk===true, R.bar);
  ok('[K] → she lights up first, as she does for every scene', R.litUp===true);
  ok('and then the scene opens',             R.inBed===true);
  ok('and it is counted against the day',    R.spent===true);
  ok('the scene reaches the choice on its own', R.reachedAsk===true);
  ok('he answers, and Kan’s book turns',     R.answered===true && R.armed===true);
  ok('the scene then ends by itself',        R.ended===true);
  ok('and the sign is still standing after', R.still===true);

  // ----------------------------------------------------------- the pixels
  console.log('\n=== ✧ AND BOTH ANIMATIONS ACTUALLY DRAW ===');
  R=await pg.evaluate(()=>{
    const S=window.__SS, o={};
    const cv=document.getElementById('game'), tv=document.getElementById('gtext');
    const tc=tv.getContext('2d');
    const inked=()=>{ const D=tc.getImageData(0,0,tv.width,tv.height).data;
      let n=0; for(let i=3;i<D.length;i+=4) if(D[i]>24) n++; return n; };
    const run=(keep,t)=>{
      S.setWH('done'); S.startBedScene('fun','long','bed');
      const s=S.BC; S.setBCT(S.rkFinAt(s)); S.startRkFin(s);
      if(keep!==null){ S.rkFinTake(s, keep); }
      s.fin.t=t;
      tc.clearRect(0,0,tv.width,tv.height);
      S.drawBed();
      return {ink:inked(), anchor:s.finAt||null};
    };
    o.ask = run(null, 50);
    o.kept= run(true, 40);
    o.out = run(false, 60);
    /* and the run, later, has to have MORE fluid on it than the moment it
       landed — a run that does not run is the bug this catches */
    S.setWH('done'); S.startBedScene('fun','long','bed');
    const s=S.BC; S.setBCT(S.rkFinAt(s)); S.startRkFin(s); S.rkFinTake(s,false);
    s.fin.t=30; tc.clearRect(0,0,tv.width,tv.height); S.drawBed(); const early=inked();
    s.fin.t=110; tc.clearRect(0,0,tv.width,tv.height); S.drawBed(); const late=inked();
    o.early=early; o.late=late;
    return o;
  });
  ok('the ask puts its panel on the screen', R.ask.ink>400, R.ask.ink+' px of ink');
  ok('and it knows where the camera put her',
     !!R.ask.anchor && R.ask.anchor.x>40 && R.ask.anchor.x<480,
     R.ask.anchor? Math.round(R.ask.anchor.x)+','+Math.round(R.ask.anchor.y) : 'none');
  ok('keeping it draws the mark and the words', R.kept.ink>400, R.kept.ink+' px');
  ok('and the other one draws real fluid',      R.out.ink>400, R.out.ink+' px');
  ok('AND THE RUN ACTUALLY RUNS',               R.late>R.early, R.early+' → '+R.late+' px');

  console.log('\n--- PAGE ERRORS ---');
  ok('none', errs.length===0, errs.join(' | '));

  console.log('\n'+(fail? '✗ '+fail+' FAILED   ('+(pass+fail)+' checks)'
                        : 'ALL GREEN   ('+pass+' checks)'));
  await br.close();
  process.exit(fail?1:0);
})();