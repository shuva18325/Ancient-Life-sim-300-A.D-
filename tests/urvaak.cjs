/* ◇ THE URVAAK, THE SIVRAK'S SWITCH, THE SWALLOW, AND A NUMBER THAT USED
   TO BE WRONG
   ---------------------------------------------------------------------
   Four things, and the first one is a bug that survived three rounds of
   this file being green: slapCap() has been 8 for a seated Mesteri Rhaunek
   and 3 for everybody else since the office was written, and the verdict
   that fires when you go past it said "Six" — a figure that is in neither
   branch. It threw nothing, it drew fine, and the only way to catch it is
   to land more than the cap and READ what she says back. So that is a
   test now, in both houses.

   The rest: the urvaak is measured (below a Long there is nothing to let
   out), it reads the woman rather than rolling a die, the sivrak is now a
   switch with a number attached rather than a costume, and her gift plays
   as its own scene instead of one slot in somebody else's running order. */
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
    w.male=false; w.eth='rkrai'; w.flaws=[]; w.quirks=[]; w.traits=[];
    w.body={face:9,hairq:7,bust:8,waist:5,booty:10,legs:7}; w.age=24; w.skin='#e6bd94';
    G.wife=w; G.body=G.body||{}; G.body.secret=9;
    G.wifeRel=70; G.wifePhys=60; G.children=[];
    G.letoutDay=-99; G.letoutCount=0; G.rkSivrak=null; G.rkSivrakDay=-99;
    G.slapDay=G.day; G.slapCount=0;
  });

  /* ---------------------------------------------------------------- */
  console.log('\n=== ◈ THE FIGURE QUOTES ITS OWN NUMBER ===');
  await setup();
  let R=await pg.evaluate(()=>{
    const S=window.__SS, G=S.G, o={};
    /* an UNSEATED house is one whose wife does not qualify either — the
       coast reads the body whether or not the Ten have been asked, which is
       the long-standing design and is not what this test is about */
    const run=(seated)=>{
      G.wife.body.booty = seated? 10 : 4;
      G.wife.rkHeld = seated? ['seat'] : [];
      G.wife.rkTitleForced = seated? 'seat' : null;
      G.slapDay=G.day; G.slapCount=0;
      const cap=S.slapCap();
      let over=null;
      for(let i=0;i<cap+4;i++){ const v=S.doSlap('test'); if(v && v.k==='enough'){ over=v; break; } }
      return {cap, said:(over&&over.t)||''};
    };
    o.seated=run(true);
    o.plain =run(false);
    return o;
  });
  const wordFor=(n)=>['no','one','two','three','four','five','six','seven','eight','nine','ten'][n]||String(n);
  ok('a seated house takes eight',    R.seated.cap===8, 'cap '+R.seated.cap);
  ok('and every other house three',   R.plain.cap===3,  'cap '+R.plain.cap);
  ok('AND THE LINE SAYS THE REAL CAP, not "Six"',
     R.seated.said.toLowerCase().indexOf(wordFor(R.seated.cap))===0
     && R.seated.said.indexOf(String(R.seated.cap))>0,
     '“'+R.seated.said+'”');
  ok('in the ordinary house too',
     R.plain.said.indexOf(String(R.plain.cap))>0 && /that is four today/i.test(R.plain.said),
     '“'+R.plain.said+'”');
  ok('and neither of them says six any more',
     !/\bsix\b/i.test(R.seated.said) && !/\bsix\b/i.test(R.plain.said));

  /* ---------------------------------------------------------------- */
  console.log('\n=== ◇ THE URVAAK — MEASURED, AND IT READS HER ===');
  await setup();
  R=await pg.evaluate(()=>{
    const S=window.__SS, G=S.G, o={};
    G.body.secret=4; o.shortWhy=S.letoutWhy(); o.shortTier=S.letoutTier();
    G.body.secret=6; o.longOk=S.letoutReady(); o.longTier=S.letoutTier();
    G.body.secret=9;  o.immense=S.letoutTier();
    G.body.secret=11; o.imposs=S.letoutTier();
    G.body.secret=9;
    G.world='west';   o.offCoast=S.letoutWhy();
    G.world='rk';
    o.need=S.RK_LETOUT.need;
    /* and it is twice a day, because past that it is a man with a point */
    G.letoutDay=-99; G.letoutCount=0;
    o.left0=S.letoutLeft();
    S.openDomus(); S.tryLetout(); S.DM.letout=null;
    S.tryLetout(); S.DM.letout=null;
    o.left2=S.letoutLeft();
    const before=S.DM.letout; S.tryLetout();
    o.third=!S.DM.letout;
    return o;
  });
  ok('below a Long there is nothing to let out', /Long/.test(R.shortWhy) && R.shortTier==='short',
     R.shortWhy.slice(0,52)+'…');
  ok('a Long qualifies, and that is the bar',   R.longOk===true && R.longTier==='long' && R.need===6);
  ok('and the scale keeps going',               R.immense==='immense' && R.imposs==='impossible');
  ok('it is a custom, not a fact of anatomy',   /Not a custom here/.test(R.offCoast));
  ok('twice a day and no more',                 R.left0===2 && R.left2===0 && R.third===true);

  R=await pg.evaluate(()=>{
    const S=window.__SS, G=S.G, w=G.wife, o={};
    const read=(set)=>{ set(); return S.letoutRead(); };
    const R1=read(()=>{ G.wifeRel=95; G.wifePhys=95; w.flaws=[]; w.quirks=[]; });
    const R2=read(()=>{ G.wifeRel=75; G.wifePhys=50; });
    const R3=read(()=>{ G.wifeRel=50; G.wifePhys=40; w.flaws=['cold']; });
    const R4=read(()=>{ w.flaws=[]; w.quirks=['shameless']; G.wifeRel=40; G.wifePhys=40; });
    const R5=read(()=>{ w.quirks=[]; w.flaws=['nerves']; });
    const R6=read(()=>{ w.flaws=[]; G.wifeRel=20; G.wifePhys=20; });
    const R7=read(()=>{ w.quirks=['devout']; G.day=3; G.wifeRel=95; G.wifePhys=95; });
    G.day=40; w.quirks=[]; w.flaws=[];
    return {swarm:R1, used:R2, cold:R3, fast:R4, drop:R5, work:R6, saint:R7,
            swarmBend:!!R1.bend, swarmEyes:!!R1.eyes, coldScene:R3.scene, workScene:R6.scene,
            allHaveLines:[R1,R2,R3,R4,R5,R6,R7].every(r=>r.line&&r.head&&r.col)};
  });
  ok('90/90 → she is already crossing the floor', R.swarm.k==='swarm' && R.swarmBend && R.swarmEyes);
  ok('a settled house → she puts down the tally', R.used.k==='used');
  ok('COLD → correct, on time and unmoved',       R.cold.k==='cold' && R.coldScene===false);
  ok('shameless → she got there first',           R.fast.k==='fast');
  ok('frail-nerved → she drops the bowl',         R.drop.k==='drop');
  ok('a bond of 20 → the room carries on',        R.work.k==='work' && R.workScene===false);
  ok('devout on a feast day → not today',         R.saint.k==='saint' && R.saint.scene===false);
  ok('and every reading has a head, a line and a colour', R.allHaveLines===true);

  /* ---------------------------------------------------------------- */
  console.log('\n=== ◇ AND THE BEAT RUNS ===');
  await setup();
  R=await pg.evaluate(()=>{
    const S=window.__SS, G=S.G, o={};
    G.wifeRel=95; G.wifePhys=95;
    S.openDomus(); const D=S.DM;
    S.tryLetout();
    o.started=!!(D.letout && D.letout.ph==='out' && D.letout.locks);
    o.v=D.letout.v; o.tier=D.letout.tier;
    const bar1=S.sceneActions().map(a=>a.k+':'+a.t).join(' | ');
    o.bar1=bar1;
    for(let i=0;i<200 && D.letout && D.letout.ph==='out';i++) S.updateLetout(1);
    o.read=!!(D.letout && D.letout.ph==='read' && D.letout.read);
    o.kind=D.letout&&D.letout.read&&D.letout.read.k;
    o.bar2=S.sceneActions().map(a=>a.k+':'+a.t).join(' | ');
    const rel0=G.wifeRel, ph0=G.wifePhys;
    for(let i=0;i<400 && S.DM && S.DM.letout;i++) S.updateLetout(1);
    o.handedOff = !!(S.DM && S.DM.rslap);            // the custom is the custom
    o.took=(G.letoutTook|0);
    return o;
  });
  ok('it starts, locked, and knows the measure', R.started===true && R.v===9 && R.tier==='immense');
  ok('the bar names the key while the cloth goes', /LET IT OUT/.test(R.bar1), R.bar1);
  ok('it arrives at her reading on its own',     R.read===true && R.kind==='swarm');
  ok('and the bar changes with the phase',       /CUSTOM IS THE CUSTOM/.test(R.bar2), R.bar2);
  ok('AND THE CUSTOM IS THE CUSTOM',             R.handedOff===true && R.took>=1);

  /* ---------------------------------------------------------------- */
  console.log('\n=== ❦ THE SIVRAK IS A SWITCH, AND IT IS WORTH SOMETHING ===');
  await setup();
  R=await pg.evaluate(()=>{
    const S=window.__SS, G=S.G, o={};
    o.coldOn=S.rkSivrakOn('wife'); o.coldBuilt=S.rkSivrakBuilt(); o.coldBed=S.sivrakBed();
    S.rkSivrakWear('both');
    o.on=S.rkSivrakOn('wife'); o.built=S.rkSivrakBuilt(); o.bed=S.sivrakBed();
    const off=S.rkSivrakToggle();
    o.afterOff=S.rkSivrakOn('wife'); o.stillBuilt=S.rkSivrakBuilt(); o.offBed=S.sivrakBed();
    o.toggleSaid=off;
    const back=S.rkSivrakToggle();
    o.backOn=S.rkSivrakOn('wife'); o.backSaid=back;
    o.mult=S.RK_SIVRAK_BED;
    return o;
  });
  ok('nothing on, nothing owed',      R.coldOn===false && R.coldBuilt===false && R.coldBed===1);
  ok('built and on, and it pays',     R.on===true && R.built===true && Math.abs(R.bed-R.mult)<1e-9,
     '×'+R.mult);
  ok('OFF IS A DECISION, not the end of it', R.afterOff===false && R.stillBuilt===true && R.offBed===1
     && R.toggleSaid===false);
  ok('and it goes back on',           R.backOn===true && R.backSaid===true);

  /* ---------------------------------------------------------------- */
  console.log('\n=== ✧ HER GIFT PLAYS ALONE ===');
  R=await pg.evaluate(()=>{
    const S=window.__SS, G=S.G, o={};
    G.wife.traits=['kanvek'];
    S.setWH('done'); S.KANVEK_ONLY_set(true); S.startBedScene('fun','quick','bed');
    const s=S.BC;
    o.flagged=!!s.kanvekOnly; o.dur=s.dur;
    o.consumed=(function(){ S.setWH('done'); S.startBedScene('fun','quick','bed');
      const t=!!S.BC.kanvekOnly; return t===false; })();   // the flag is spent, not sticky
    S.setWH('done'); S.KANVEK_ONLY_set(true); S.startBedScene('fun','quick','bed');
    const s2=S.BC;
    /* it plays ONE position for the whole scene rather than a running order */
    const seen={};
    for(let T=560; T<s2.dur-40; T+=40){ S.setBCT(T);
      const step=((T-520)/160)|0; seen[step]=1; }
    o.dur2=s2.dur;
    const d0=G.day;
    S.setBCT(s2.dur); S.finishBed();
    o.days=G.day-d0;                                        // a gift is not a month
    return o;
  });
  ok('her gift is flagged, and it is short',  R.flagged===true && R.dur===860, R.dur+' ticks');
  ok('the flag is spent, not sticky',         R.consumed===true);
  ok('AND IT IS ONE EVENING, not a month',    R.days===1, R.days+' day(s)');

  console.log('\n--- PAGE ERRORS ---');
  ok('none', errs.length===0, errs.join(' | '));

  console.log('\n'+(fail? '✗ '+fail+' FAILED   ('+(pass+fail)+' checks)'
                        : 'ALL GREEN   ('+pass+' checks)'));
  await br.close();
  process.exit(fail?1:0);
})();
