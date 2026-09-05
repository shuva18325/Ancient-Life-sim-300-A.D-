/* =====================================================================
   VILLA SMOKE — the Rkrai hall, its scenes, and the body map
   ---------------------------------------------------------------------
   Run:  NODE_PATH=<playwright> node tests/villa-smoke.cjs
   Exits non-zero if anything fails, so it is usable in CI.

   This lives in the repo on purpose. The suite it replaces was written
   into a scratch directory and was lost the first time the container was
   recycled, which meant a session's worth of regression cover evaporated
   without anyone noticing until the next change needed checking.
   ===================================================================== */
const {chromium}=require('playwright');
const PAGE='file://'+require('path').resolve(__dirname,'..','index.html');

let failures=0;
const ok=(name,cond,detail)=>{
  if(!cond) failures++;
  console.log('  '+(cond?'PASS':'FAIL')+'  '+name+(detail!==undefined? '   '+detail : ''));
};

(async()=>{
  const b=await chromium.launch();
  const pg=await b.newPage({viewport:{width:1100,height:820}});
  const errs=[]; pg.on('pageerror',e=>errs.push(e.message));
  await pg.goto(PAGE);
  await pg.evaluate(()=>localStorage.setItem('SANDSTEEL_ADULT','1'));
  await pg.reload(); await pg.waitForTimeout(400);

  // a Rkrai house with every trait this suite cares about
  await pg.evaluate(()=>{
    const S=window.__SS;
    S.newDemo('Kaiq','Leokanis','RkTorvak');
    const G=S.G; G.world='rk'; G.rkRank='harra'; G.coin=99999;
    G.isFemale=false; G.married=true; G.hygiene=90; G.day=40; G.lastLoveDay=39;
    const her=S.makeBride('rkrai',false,9,{male:true});
    her.male=false; her.eth='rkrai'; her.name='Ulva Raun';
    her.quirks=[]; her.flaws=[]; her.traits=['curious','vakran'];
    her.body=her.body||{}; her.body.booty=10; her.body.bust=8; her.body.legs=6;
    G.wife=her; G.wifeRel=85; G.wifePhys=55; G.rkSnubs=0;
    G.body=G.body||{}; ['face','hairq','bust','waist','booty','legs'].forEach(k=>G.body[k]=6);
    G.body.secret=10; G.hasSecretMap=true;
    S.openDomus();
  });

  console.log('\n--- THE CURIOUS ONE DOES NOT CHAIN ---');
  const freq=await pg.evaluate(()=>{
    const S=window.__SS; let fires=0;
    S.openDomus(); const D=S.DM;
    for(let i=0;i<12000;i++){ D.t+=1;
      if(!D.curio && S.curioDue()){ S.startCurio(); fires++; D.curio=null; } }
    return {fires, capped:(D.curioFired|0)};
  });
  ok('at most three to a villa visit', freq.fires<=3, 'fired '+freq.fires+' in 12000 ticks');
  ok('the per-visit ceiling is what stops it', freq.capped>=3, 'counter '+freq.capped);
  ok('and it is not so rare it never fires', freq.fires>=1);

  console.log('\n--- THE CLAM IS THE VAKRAN\'S, NOT THE SEAT\'S ---');
  const clam=await pg.evaluate(()=>{
    const S=window.__SS, G=S.G, out={};
    G.wife.traits=[];            out.noTrait   = S.clamReady();
    G.wife.traits=['vakran'];    out.withTrait = S.clamReady();
    G.wife.body.booty=6;         out.lowSeat   = S.clamReady();
    G.wife.body.booty=10;
    const w0=G.world; G.world='west'; out.offCoast=S.clamReady(); G.world=w0;
    const T=S.WIFE_TRAITS.find(t=>t.id==='vakran');
    out.eth=T&&T.eth; out.female=!!(T&&T.female);
    return out;
  });
  ok('no vakran trait means no clam', clam.noTrait===false);
  ok('the trait alone opens it',      clam.withTrait===true);
  ok('a modest seat still qualifies', clam.lowSeat===true);
  ok('and never off the coast',       clam.offCoast===false);
  ok('the trait is coast-only, women only', clam.eth==='rkrai' && clam.female);

  console.log('\n--- LENGTH IS IN THE BODY-MAP READING ---');
  const feel=await pg.evaluate(()=>{
    const S=window.__SS, w=S.G.wife;
    w.body.booty=10;
    const lo=S.bmFeel(w,'booty',3), hi=S.bmFeel(w,'booty',10);
    w.body.booty=4; const small=S.bmFeel(w,'booty',10);
    w.body.booty=10;
    return {loBand:lo.band, loReach:lo.reach, hiBand:hi.band, hiReach:hi.reach,
            hiDeep:!!hi.deep, smallBand:small.band, her:!!hi.her};
  });
  ok('the same seat reads differently for a 3 and a 10',
     feel.loBand!==feel.hiBand, feel.loBand+' vs '+feel.hiBand);
  ok('a big one on a big seat gets the deep tier', feel.hiDeep===true);
  ok('reach rises with length', feel.hiReach>feel.loReach,
     feel.loReach+' -> '+feel.hiReach);
  ok('a big one on a small seat does not', feel.smallBand!=='deep');
  ok('and she has an answer of her own', feel.her);

  console.log('\n--- EVERY VILLA SCENE UPDATES AND DRAWS WITHOUT THROWING ---');
  const sweep=await pg.evaluate(()=>{
    const S=window.__SS, G=S.G, thrown=[];
    const run=(name, start, upd, draw, ticks)=>{
      try{
        S.openDomus(); G.wife.traits=['curious','vakran'];
        if(!start()) { thrown.push(name+': did not start'); return; }
        for(let i=0;i<ticks;i++){ upd(1); draw(); }
      }catch(e){ thrown.push(name+': '+e.message); }
    };
    run('curio', ()=>S.startCurio(), t=>S.updateCurio(t), ()=>S.drawCurio(), 900);
    /* every clam phase drawn, including the ones only reachable by input */
    try{
      S.openDomus(); S.startClam(); const D=S.DM;
      const phs=[['call',{}],['come',{}],['clench',{}],['hold',{pt:20}],
                 ['grab',{gp:0.5}],['drive',{driveLeft:200,nextThrust:4,thrust:3}],
                 ['bend',{slaps:1,slapFlash:10}]];
      for(const [ph,extra] of phs){
        Object.assign(D.clam, {ph, t:40, bend:0.5, stood:true, blush:0.8,
                               miss:1, strikeFlash:10}, extra);
        for(let t=0;t<40;t++){ D.clam.t=t; S.drawClam(); }
      }
    }catch(e){ thrown.push('clam phases: '+e.message); }
    run('clam',  ()=>S.startClam(),  t=>S.updateClam(t),  ()=>S.drawClam(),  900);
    run('tempt', ()=>S.startTempt&&(S.startTempt(),true), t=>S.updateTempt(t), ()=>S.drawTempt(), 700);
    /* and the curious one through EVERY rung, which is where the new
       per-rung drawing lives and where a thrown exception would hide */
    try{
      S.openDomus(); S.startCurio();
      const D=S.DM;
      for(const r of S.RK_CURIO.rungs){
        D.curio.ph='act'; D.curio.act=r; D.curio.bend=1;
        D.curio.bare=(r.id==='bare'||r.id==='hard'); D.curio.hard=(r.id==='hard');
        for(let t=0;t<60;t++){ D.curio.t=t; S.drawCurio(); }
      }
    }catch(e){ thrown.push('curio rungs: '+e.message); }
    return thrown;
  });
  ok('no scene threw', sweep.length===0, sweep.join(' | '));

  console.log('\n--- THE CLAM: PACE, STRIKES, AND THE WAYS OUT ---');
  const clam2=await pg.evaluate(()=>{
    const S=window.__SS, G=S.G, out={};
    G.wife.traits=['curious','vakran']; G.wife.body.booty=10; G.wifeRel=85;
    S.openDomus(); S.startClam(); const D=S.DM;
    out.cyc=D.clam.cyc;
    out.windowTicks=Math.round(D.clam.cyc*0.34);

    // three strikes, not one
    S.openDomus(); S.startClam(); let X=S.DM.clam;
    X.ph='hold'; X.t=0; X.pt=0; X.rode=0; X.need=8; X.miss=0;
    let guard=0;
    while(S.DM.clam && S.DM.clam.ph==='hold' && guard++<20000) S.updateClam(1);
    out.missEnded=S.DM.clam? S.DM.clam.ph : 'gone';
    out.misses=S.DM.clam? S.DM.clam.miss : -1;

    // ✊ take it off her: mash through the contest
    S.openDomus(); S.startClam(); X=S.DM.clam;
    X.ph='hold'; X.t=0; X.pt=0; X.need=8;
    S.setEdge('w'); S.updateClam(1);
    out.grabbed=(S.DM.clam.ph==='grab');
    guard=0;
    while(S.DM.clam && S.DM.clam.ph==='grab' && guard++<4000){
      S.setEdge('space'); S.updateClam(1); }
    out.drove=(S.DM.clam.ph==='drive');
    // thrust a few, then let the clock run out
    for(let i=0;i<8;i++){ S.setEdge('space'); S.updateClam(1);
      for(let j=0;j<12;j++) S.updateClam(1); }
    out.thrusts=S.DM.clam.thrust;
    guard=0;
    while(S.DM.clam && S.DM.clam.ph==='drive' && guard++<4000) S.updateClam(1);
    out.afterDrive=S.DM.clam? S.DM.clam.ph : 'gone';

    // 🍑 the two she bends for
    if(S.DM.clam && S.DM.clam.ph==='bend'){
      for(let i=0;i<60;i++) S.updateClam(1);
      S.setEdge('space'); S.updateClam(1);
      for(let i=0;i<30;i++) S.updateClam(1);
      S.setEdge('space'); S.updateClam(1);
      out.slaps=S.DM.clam? S.DM.clam.slaps : -1;
      guard=0;
      while(S.DM.clam && S.DM.clam.ph==='bend' && guard++<2000) S.updateClam(1);
      out.afterBend=S.DM.clam? S.DM.clam.ph : 'gone';
      out.kind=S.DM.clam&&S.DM.clam.result? S.DM.clam.result.kind : null;
      out.phys=S.DM.clam&&S.DM.clam.result? S.DM.clam.result.phys : null;
    }

    // ◆ stand it while she has hold
    S.openDomus(); S.startClam(); X=S.DM.clam;
    X.ph='hold'; X.t=0; X.pt=0; X.need=8;
    S.setEdge('k'); S.updateClam(1);
    out.stood=!!S.DM.clam.stood;
    out.blush=S.DM.clam.blush>0;
    S.setEdge('k'); S.updateClam(1);
    out.standOnce=(S.DM.clam.blush<=1);
    return out;
  });
  ok('the clench is a rhythm, not a reflex test', clam2.cyc>=46,
     'cycle '+clam2.cyc+' ticks, window ~'+clam2.windowTicks);
  ok('three strikes before she lets go', clam2.misses===3 || clam2.missEnded==='done',
     'misses '+clam2.misses);
  ok('W starts the contest',      clam2.grabbed===true);
  ok('winning it hands you the rhythm', clam2.drove===true);
  ok('and you can actually thrust', clam2.thrusts>0, 'thrusts '+clam2.thrusts);
  ok('the drive ends in the bend', clam2.afterDrive==='bend', clam2.afterDrive);
  ok('two slaps land',            clam2.slaps===2, 'slaps '+clam2.slaps);
  ok('and then it resolves',      clam2.afterBend==='done' || clam2.kind, clam2.kind||'');
  ok('taking it is paid as took', clam2.kind==='took', clam2.kind||'');
  ok('K stands it while she holds', clam2.stood===true);
  ok('and she colours for it',      clam2.blush===true);

  console.log('\n--- THE BODY MAP DRAWS THE PRESS ---');
  const bm=await pg.evaluate(async()=>{
    const S=window.__SS, G=S.G;
    S.openBodyMap(G.wife,'marry');
    await new Promise(r=>setTimeout(r,250));
    const cv=document.getElementById('bodymap-cv');
    S.setBmPart('booty');
    try{
      S.bmDoAction(G.wife,'booty','against',null,()=>S.drawBodyMap(cv,G.wife,'front',0));
      for(let i=0;i<40;i++) S.drawBodyMap(cv,G.wife,'front',0);
    }catch(e){ return {err:e.message}; }
    return {err:null, phys:G.wifePhys};
  });
  ok('PUT IT AGAINST draws clean', !bm.err, bm.err||'');

  console.log('\n--- THE TITLES TAB DOCUMENTS BOTH TRAITS ---');
  const guide=await pg.evaluate(()=>{
    const S=window.__SS;
    S.G.wife.traits=['curious','vakran'];
    S.openTheTen('titles');
    const t=document.getElementById('villa-body');
    const txt=t? t.textContent : '';
    return {clam:txt.indexOf('THE CLAM')>=0, curio:txt.indexOf('THE CURIOUS ONE')>=0,
            vakran:txt.indexOf('is a vakran')>=0};
  });
  ok('the clam has a card',   guide.clam);
  ok('the curious one too',   guide.curio);
  ok('and it names the trait', guide.vakran);

  console.log('\n--- PAGE ERRORS ---');
  ok('none', errs.length===0, errs.slice(0,4).join(' | '));

  await b.close();
  console.log('\n'+(failures? failures+' FAILURE(S)' : 'ALL GREEN'));
  process.exit(failures? 1 : 0);
})().catch(e=>{ console.error('harness threw:', e); process.exit(1); });
