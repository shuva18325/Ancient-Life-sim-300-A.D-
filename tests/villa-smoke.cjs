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
