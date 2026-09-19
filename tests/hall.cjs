/* ONE THING AT A TIME IN THE HALL
   ---------------------------------------------------------------------
   The reported bug: her gift opened on top of a child's grievance, two
   speech boxes deep, both reading the same keys. The cause was not one
   missing check — it was that ELEVEN different gates each carried their
   own hand-written list of what counts as the-hall-is-busy, and no two of
   the eleven agreed. Nothing looked at D.gripe at all.

   So this suite does not test a pair. It tests the MATRIX: for every beat
   that can hold the hall, every gate that can start one must refuse. That
   is 22 × 10 questions and it is the only shape of test that catches the
   next one somebody forgets, because forgetting is the failure mode.     */
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

  console.log('\n=== THE HALL HAS ONE ANSWER ===');
  let R=await pg.evaluate(()=>{
    const S=window.__SS, o={};
    S.newDemo('Kaiq','Leokanis','RkTorvak');
    const G=S.G; G.world='rk'; G.married=true; G.isFemale=false; G.hasVilla=true; G.day=40;
    const w=S.makeBride('rkrai',false,9,{male:true});
    w.male=false; w.eth='rkrai'; w.flaws=[]; w.quirks=[]; w.traits=['kanvek','tempting'];
    w.body={face:10,hairq:7,bust:9,waist:5,booty:10,legs:9}; w.skin='#e6bd94';
    G.wife=w; G.body=G.body||{}; G.body.secret=9;
    G.wifeRel=90; G.wifePhys=90; G.hygiene=90;
    S.openDomus();
    const D=S.DM;
    o.beats=S.HALL_BEATS.slice();
    o.free=S.hallBusy();                     // an empty hall answers nothing
    D.gripe={t:0};
    o.gripeSeen=S.hallBusy();                // and the one nobody used to look at
    o.gripeNamed=S.hallBusyWhy();
    D.gripe=null;
    D.reward={t:0};
    o.mineSkipped=S.hallBusy('reward');      // asking about my own slot skips it
    o.mineSeen=S.hallBusy();
    D.reward=null;
    /* and every key in the list is actually named in plain words */
    o.unnamed=o.beats.filter(k=>!S.HALL_BEAT_NAMES[k]);
    return o;
  });
  ok('an empty hall is free',            R.free==='');
  ok('and every beat is a real slot',    R.beats.length>=20, R.beats.length+' of them');
  ok('THE COMPLAINT IS SEEN',            R.gripeSeen==='gripe');
  ok('and it has a name in plain words', /grievance/.test(R.gripeNamed||''), '“'+R.gripeNamed+'”');
  ok('a caller can skip its own slot',   R.mineSkipped==='' && R.mineSeen==='reward');
  ok('and nothing in the list is unnamed', R.unnamed.length===0, R.unnamed.join(',')||'all named');

  /* ---------------- THE MATRIX ---------------- */
  /* AND IT RUNS IN BOTH HOUSES. Three of these gates belong to the wife's
     side of the game and refuse outright unless you ARE her — so probed in
     a husband's hall they answer false for the wrong reason and the matrix
     quietly stops testing them. The first cut of this suite was only really
     exercising four of the eleven, which the control caught. */
  console.log('\n=== AND NOTHING STARTS OVER ANYTHING ELSE ===');
  const matrix=(female)=>pg.evaluate((female)=>{
    const S=window.__SS;
    S.newDemo('Kaiq','Leokanis','RkTorvak');
    const G=S.G; G.world='rk'; G.married=true; G.isFemale=!!female;
    G.hasVilla=true; G.day=40;
    const sp=S.makeBride('rkrai', !!female, 9, {male:!!female});
    sp.male=!!female; sp.eth='rkrai'; sp.flaws=[]; sp.quirks=[];
    sp.traits=['kanvek','tempting','curious','vakran','priapic'];
    sp.body={face:10,hairq:7,bust:9,waist:5,booty:10,legs:9}; sp.skin='#e6bd94';
    G.wife=sp; G.body=G.body||{}; G.body.secret=9;
    G.wifeRel=90; G.wifePhys=90; G.hygiene=90; G.husbandOwes=1;
    /* a hall with somebody small in it, or two of these gates are dead */
    G.children=[{name:'Kaiqa', sex:'f', born:G.day-3000, rel:90},
                {name:'Torvi', sex:'m', born:G.day-2600, rel:90}];
    S.openDomus();
    const D=S.DM, beats=S.HALL_BEATS;
    const GATES={
      temptDue:S.temptDue, riseDue:S.riseDue, kidWalkDue:S.kidWalkDue,
      curioDue:S.curioDue, clamDue:S.clamDue, praiseDue:S.praiseDue,
      seatAskDue:S.seatAskDue, rkRewardDue:S.rkRewardDue,
      dropDue:S.dropDue, husbandMoveDue:S.husbandMoveDue,
      maybeRoomComplaint:()=>S.maybeRoomComplaint(true),
    };
    /* EVERY ONE OF THESE ENDS IN A DIE ROLL and most in a cooldown and a
       per-visit quota besides. Probed raw they answer false for reasons
       that have nothing to do with the hall being busy — so every other
       reason to refuse is taken off the table and the only thing left that
       can say no is the thing under test. */
    const real=Math.random;
    const clear=()=>{
      beats.forEach(x=>{ D[x]=null; });
      D.t=99999;
      ['lastTemptT','lastRiseT','lastDropT','lastHusbT','lastKidWalkT'].forEach(k=>D[k]=-99999);
      ['curioFired','clamFired','praiseFired','seatAskFired','rewardFired'].forEach(k=>D[k]=0);
      ['curioNext','clamNext','praiseNext','seatAskNext','rewardNext'].forEach(k=>D[k]=0);
      D.kidWalkSeen={}; D.clearUntil=999999;   // villaClear() is a >, not a >=
      G.rkRewardDay=-99; G.rkRewardFor={}; G.rkRewardForce=false;
      G.slapDay=G.day; G.slapCount=0; G.letoutDay=-99; G.letoutCount=0;
    };
    Math.random=()=>0;
    const live=[], dead=[], bad=[];
    for(const g in GATES){
      clear();
      let yes=false;
      try{ yes=!!GATES[g](); }catch(e){ yes='threw: '+e; }
      if(yes!==true){ dead.push(g); continue; }
      live.push(g);
      for(const k of beats){
        clear();
        D[k]={t:0, ph:'x', locks:true};
        let out=false;
        try{ out=!!GATES[g](); }catch(e){ out='threw: '+e; }
        if(out!==false) bad.push(g+' started over '+k+(out===true?'':' ('+out+')'));
      }
    }
    Math.random=real; clear();
    return {bad, live, dead, beats:beats.length};
  }, female);

  const MH=await matrix(false), WH=await matrix(true);
  const liveAll=new Set([...MH.live, ...WH.live]);
  const deadBoth=MH.dead.filter(g=>WH.dead.includes(g));
  const bad=[...MH.bad.map(x=>'his hall: '+x), ...WH.bad.map(x=>'her hall: '+x)];
  ok('the husband’s hall exercises most of them',  MH.live.length>=7,
     MH.live.length+' live · not reachable here: '+(MH.dead.join(',')||'none'));
  ok('and the wife’s hall picks up her side',      WH.live.length>=4,
     WH.live.length+' live · not reachable here: '+(WH.dead.join(',')||'none'));
  /* HONEST COVERAGE. kidWalkDue needs a wed child occupying a room today,
     which is a lot of state to fabricate for a gate whose busy-check is one
     line; it is verified by inspection and named here rather than silently
     counted as tested. Anything ELSE going dark is a real gap. */
  ok('and every other gate is live in one hall or the other',
     deadBoth.filter(g=>g!=='kidWalkDue').length===0,
     liveAll.size+' of 11 exercised · by inspection only: '+(deadBoth.join(',')||'none'));
  ok('AND NOT ONE OF THEM OPENS OVER A BEAT THAT IS ALREADY RUNNING',
     bad.length===0,
     bad.length? bad.slice(0,6).join(' · ')+(bad.length>6?' …+'+(bad.length-6):'')
               : (MH.live.length+WH.live.length)+' live gates × '+MH.beats+' beats, every one refused');

  /* the one the report actually described, end to end */
  console.log('\n=== THE ONE THAT WAS REPORTED ===');
  R=await pg.evaluate(()=>{
    const S=window.__SS, o={};
    /* back into a HUSBAND's hall — the matrix left the wife's one standing,
       and her gift is his half of the game */
    S.newDemo('Kaiq','Leokanis','RkTorvak');
    const G=S.G; G.world='rk'; G.married=true; G.isFemale=false; G.hasVilla=true; G.day=40;
    const w=S.makeBride('rkrai',false,9,{male:true});
    w.male=false; w.eth='rkrai'; w.flaws=[]; w.quirks=[]; w.traits=['kanvek'];
    w.body={face:10,hairq:7,bust:9,waist:5,booty:10,legs:9}; w.skin='#e6bd94';
    G.wife=w; G.body=G.body||{}; G.body.secret=9;
    G.wifeRel=90; G.wifePhys=90; G.hygiene=90;
    G.children=[{name:'Kaiqa', sex:'f', born:G.day-3000, rel:90}];
    S.openDomus();
    const D=S.DM;
    D.t=99999; D.rewardNext=0; D.rewardFired=0;
    S.HALL_BEATS.forEach(b=>{ D[b]=null; });
    G.rkRewardDay=-99; G.rkRewardForce=true;
    /* a child is mid-grievance. She does not call him over across the top
       of it — and the console's own override does not get to either. */
    D.gripe={t:0};
    o.overGripe=S.rkRewardDue();
    D.gripe=null;
    o.freeAfter=S.rkRewardDue();
    /* and the other way round: she is offering, so nobody talks over her */
    D.gripe=null; D.reward={t:0, locks:true};
    o.gripeOver=S.maybeRoomComplaint(true);
    o.seatOver=S.seatAskDue();
    o.praiseOver=S.praiseDue();
    o.curioOver=S.curioDue();
    o.temptOver=S.temptDue();
    S.HALL_BEATS.forEach(b=>{ D[b]=null; });
    return o;
  });
  ok('her gift does NOT flip over a complaint', R.overGripe===false);
  ok('and it still fires in a free hall',       R.freeAfter===true);
  ok('nor a complaint over her gift',           R.gripeOver===false);
  ok('nor the office, the praise, the curious one or the low shelf',
     R.seatOver===false && R.praiseOver===false && R.curioOver===false && R.temptOver===false,
     'seat '+R.seatOver+' · praise '+R.praiseOver+' · curio '+R.curioOver+' · tempt '+R.temptOver);

  console.log('\n--- PAGE ERRORS ---');
  ok('none', errs.length===0, errs.join(' | '));

  console.log('\n'+(fail? '✗ '+fail+' FAILED   ('+(pass+fail)+' checks)'
                        : 'ALL GREEN   ('+pass+' checks)'));
  await br.close();
  process.exit(fail?1:0);
})();
