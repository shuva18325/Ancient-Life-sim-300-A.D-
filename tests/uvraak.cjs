/* =====================================================================
   ⛵ THE UVRAAK — the crossing, the look-over, and the criers
   ---------------------------------------------------------------------
   Run:  NODE_PATH=/opt/node22/lib/node_modules /opt/node22/bin/node tests/uvraak.cjs
   ===================================================================== */
const {chromium}=require('playwright');
const FILE='file://'+require('path').resolve(__dirname,'..','index.html');
let pass=0, fail=0;
const ok =(n,d)=>{ pass++; console.log('  PASS  '+n+(d?'   '+d:'')); };
const bad=(n,d)=>{ fail++; console.log('  FAIL  '+n+(d?'   '+d:'')); };
const is =(n,a,b)=> (a===b? ok(n, String(a)) : bad(n, 'got '+JSON.stringify(a)+' want '+JSON.stringify(b)));
const yes=(n,v,d)=> (v? ok(n,d) : bad(n,d));
const head=t=>console.log('\n--- '+t+' ---');

(async()=>{
  const br=await chromium.launch();
  const pg=await br.newPage({viewport:{width:1100,height:800}});
  const errs=[]; pg.on('pageerror',e=>errs.push(''+e));
  await pg.goto(FILE);
  await pg.evaluate(()=>localStorage.setItem('SANDSTEEL_ADULT','1'));
  await pg.reload(); await pg.waitForTimeout(500);

  /* a Rkrai man with a house, a wife and a loadout */
  await pg.evaluate(()=>{
    const S=window.__SS;
    S.newDemo('Kaiq','Leokanis','RkTorvak');
    const G=S.G;
    G.world='rk'; G.isFemale=false; G.married=true; G.coin=9000; G.day=14;
    G.holds=G.holds||{}; G.rkHolds={}; G.rkWar=0;
    const her=S.makeBride('rkrai',false,9,{male:true});
    her.male=false; her.eth='rkrai'; her.flaws=[]; her.quirks=[];
    her.body=her.body||{}; her.body.booty=6; G.wife=her;
    G.body=G.body||{}; G.body.secret=5;
    G.loadout={weapon:'gladius', shield:'none', helmet:'none', armor:'galerus'};
  });

  head('THE STRAIT HAS ITS OWN CALENDAR');
  { const r=await pg.evaluate(()=>{
      const S=window.__SS, G=S.G, out=[];
      for(let d=0; d<48; d+=12){ G.day=d; const s=S.rkCrossSeason(); out.push([d,s.id,s.boat,s.ice]); }
      G.day=14;
      return out;
    });
    is('four windows, twelve days each', r.map(x=>x[1]).join(','), 'break,open,close,ice');
    yes('open water floats and does not walk', r[1][2]===true && r[1][3]===false);
    yes('the ice road walks and does not float', r[3][2]===false && r[3][3]===true);
    const nx=await pg.evaluate(()=>window.__SS.rkCrossNextSeason().id);
    is('and it knows what comes next', nx, 'close');
  }

  head('⚖ THE LOOK-OVER — BOTH SIDES ON ONE SCALE');
  { const r=await pg.evaluate(()=>{
      const S=window.__SS, G=S.G;
      G.day=14;                                     // open water
      const poor=S.rkLookOver(S.rkHoldById('naukan'));
      G.loadout={weapon:'falx', shield:'scutum', helmet:'galea_secutor', armor:'hamata'};
      G.skills={footwork:4,guard:4,blade:4,wind:3,throwing:3};
      const rich=S.rkLookOver(S.rkHoldById('naukan'));
      return {poorMine:poor.mine, richMine:rich.mine, theirs:poor.theirs,
              poorRows:poor.rows.length, richRows:rich.rows.length,
              poorGap:poor.gap, richGap:rich.gap,
              poorSaid:poor.verdict.line, richSaid:rich.verdict.line};
    });
    yes('a badly found man is a low number', r.poorMine<=4, 'you were a '+r.poorMine);
    yes('and gear moves it, visibly', r.richMine>r.poorMine, r.poorMine+' → '+r.richMine);
    yes('the gap flips sign with the kit', r.poorGap>0 && r.richGap<0, r.poorGap+' → '+r.richGap);
    yes('and the verdict says so in words', /better-found|delivery/.test(r.richSaid), r.richSaid);
    yes('every point is itemised', r.richRows>=5, r.richRows+' lines');
  }

  head('AND THEIRS ADDS UP OUT OF WHAT THEY CARRY');
  { const r=await pg.evaluate(()=>{
      const S=window.__SS;
      return S.RK_HOLDS.map(h=>{
        const rows=S.rkHoldRows(h);
        const sum=Math.round(rows.reduce((a,x)=>a+x.pts,0)*10)/10;
        return {id:h.id, sum, power:S.rkHoldPower(h), lines:rows.length,
                labelled:rows.every(x=>!!x.lab && !!x.name)};
      });
    });
    yes('every hold itemises its garrison', r.every(x=>x.lines>=5 && x.labelled));
    yes('and the number is the sum of the lines',
        r.every(x=>Math.abs(x.sum-x.power)<0.51),
        r.map(x=>x.id+' '+x.sum+'≈'+x.power).join(' · '));
    yes('the far shore gets harder westward',
        r[0].power<r[r.length-1].power, r[0].power+' → '+r[r.length-1].power);
  }

  head('THE CHAIN, AND THE WINDOW');
  { const r=await pg.evaluate(()=>{
      const S=window.__SS, G=S.G;
      G.rkHolds={}; G.day=14;                                    // open water, nothing held
      const first=S.rkHoldWhy(S.rkHoldById('naukan'));
      const deep =S.rkHoldWhy(S.rkHoldById('anadyr'));
      G.rkHolds={naukan:{day:2}};                                // the door is open, the rock is not
      const icy  =S.rkHoldWhy(S.rkHoldById('imaqliq'));
      G.day=38;                                                  // the ice road
      const icyNow=S.rkHoldWhy(S.rkHoldById('imaqliq'));
      const wet   =S.rkHoldWhy(S.rkHoldById('uelen'));      // a water hold you do not yet hold
      G.day=14;
      return {first:first.ok, deepKind:deep.kind, icyKind:icy.kind,
              icyNow:icyNow.ok, wetKind:wet.kind, icyLine:icy.line, wetLine:wet.line};
    });
    yes('the door is open from the first day', r.first, 'Naukan');
    is('the river is behind holds you do not have', r.deepKind, 'chain');
    is('the rock needs the road, not a hull', r.icyKind, 'season');
    yes('and the road opens when the strait shuts', r.icyNow, r.icyLine);
    is('while the water holds shut with it', r.wetKind, 'season');
  }

  head('TAKING ONE OPENS A REAL FIELD');
  { const r=await pg.evaluate(()=>{
      const S=window.__SS, G=S.G;
      G.rkHolds={}; G.day=14; G.coin=9000;
      G.loadout={weapon:'gladius', shield:'none', helmet:'none', armor:'galerus'}; G.skills={};
      S.rkHoldTake('naukan');
      const FT=S.FT;
      return {started:!!FT, waves:FT&&FT.gauntlet&&FT.gauntlet.total,
              cross:!!(FT&&FT.rkCross), pending:!!G.__rkCross,
              foeHp:FT&&Math.round(FT.foe.maxHp)};
    });
    yes('the landing opens a bout', r.started);
    yes('with the garrison in it, one man at a time', (r.waves|0)===2, r.waves+' waves');
    yes('and the bout knows it is a hold', r.cross && r.pending);
  }

  head('AND THE GAP IS ACTUALLY IN THE FIGHT');
  { const r=await pg.evaluate(()=>{
      const S=window.__SS, G=S.G;
      const hpFor=(loadout)=>{
        G.rkHolds={}; G.day=14; G.coin=9000; G.__rkCross=null;
        G.loadout=loadout;
        S.rkHoldTake('anadyr'.length? 'lorino' : 'lorino');
        const hp=S.FT.foe.maxHp; G.__rkCross=null; return hp;
      };
      G.rkHolds={naukan:{day:1},uelen:{day:2}};                 // unlock lorino
      G.day=14;
      const weak=(()=>{ G.loadout={weapon:'pugio',shield:'none',helmet:'none',armor:'galerus'};
        G.skills={}; G.__rkCross=null; S.rkHoldTake('lorino');
        const h=S.FT.foe.maxHp; G.__rkCross=null; return h; })();
      const strong=(()=>{ G.loadout={weapon:'falx',shield:'scutum',helmet:'galea_secutor',armor:'hamata'};
        G.skills={footwork:5,guard:5,blade:5,wind:5,throwing:5}; G.__rkCross=null; S.rkHoldTake('lorino');
        const h=S.FT.foe.maxHp; G.__rkCross=null; return h; })();
      return {weak:Math.round(weak), strong:Math.round(strong)};
    });
    yes('a worse-found man meets a harder man', r.weak>r.strong,
        'badly found '+r.weak+'hp vs well found '+r.strong+'hp');
  }

  head('📣 THE CRIERS, AND WHICH OF THEM IS LYING');
  { const r=await pg.evaluate(()=>{
      const S=window.__SS;
      const truths=S.RK_CRIER.filter(c=>c.truth===true).length;
      const lies  =S.RK_CRIER.filter(c=>c.truth===false).length;
      const halves=S.RK_CRIER.filter(c=>c.truth==='half').length;
      const bodyClaims=S.RK_CRIER.filter(c=>/LONGER|SEATED/.test(c.pitch)).length;
      return {truths, lies, halves, bodyClaims,
              every:S.RK_CRIER.every(c=>c.pitch && c.voice && c.real)};
    });
    yes('some of it is true', r.truths>=3, r.truths+' true');
    yes('and some of it is not', r.lies>=3, r.lies+' lies');
    yes('with at least one half-claim', r.halves>=1);
    yes('and the body claims are in there', r.bodyClaims>=2, r.bodyClaims);
    yes('every claim has the pitch AND what is actually going on', r.every);
  }
  { const r=await pg.evaluate(()=>{
      const S=window.__SS, G=S.G;
      const seen={};
      for(let d=0; d<96; d+=12){ G.day=d; seen[d]=S.rkCrierNow().map(c=>c.id).join('+'); }
      G.day=14;
      const stable = S.rkCrierNow().map(c=>c.id).join('+')===S.rkCrierNow().map(c=>c.id).join('+');
      const two = S.rkCrierNow().length===2;
      const distinct = S.rkCrierNow()[0].id!==S.rkCrierNow()[1].id;
      return {seen, stable, two, distinct};
    });
    yes('two of them at a time', r.two && r.distinct);
    yes('stable for as long as the window lasts', r.stable);
    yes('and they change with the window',
        new Set(Object.values(r.seen)).size>=3, Object.values(r.seen).join(' / '));
  }

  head('A CLAIM SETTLES ON A LANDING AND PAYS IN THE NUMBERS');
  { const r=await pg.evaluate(()=>{
      const S=window.__SS, G=S.G;
      /* park the window on the pair that includes the length claim */
      let win=-1;
      for(let d=0; d<12*40; d+=12){ G.day=d;
        if(S.rkCrierNow().some(c=>c.id==='len')){ win=d; break; } }
      const lenBefore=G.body.secret;
      G.rkHolds={}; G.coin=9000;
      /* force the window to one where naukan is reachable AND len is shouted */
      const okDay=(()=>{ for(let d=win; d<win+12*40; d+=12){ G.day=d;
        if(S.rkCrierNow().some(c=>c.id==='len') && S.rkCrossSeason().boat) return d; } return -1; })();
      G.day=okDay;
      G.__rkCross={hold:'naukan', waves:2, gap:0, mine:5, theirs:5, season:S.rkCrossSeason().id};
      const R=S.rkCrossSettle(true, 2);
      return {okDay, lenBefore, lenAfter:G.body.secret,
              held:S.rkHeldCount(), coin:R&&R.coin, war:R&&R.war,
              vows:R&&R.vows&&R.vows.map(v=>({id:v.id,truth:v.truth,paid:!!v.paid})),
              wasLen:!!(R&&R.vows&&R.vows.some(v=>v.id==='len'))};
    });
    yes('a landing is recorded as a hold', r.held===1, r.held+' held');
    yes('and it pays in coin and notches', (r.coin|0)>0 && (r.war|0)>0, '🪙'+r.coin+' · +'+r.war);
    yes('the shouted claims are settled with it', r.wasLen, JSON.stringify(r.vows));
    yes('and the TRUE one moves a real number on the ledger',
        r.lenAfter>r.lenBefore, 'your own measure '+r.lenBefore+' → '+r.lenAfter);
  }
  { const r=await pg.evaluate(()=>{
      const S=window.__SS, G=S.G;
      /* the wife claim is true, and true ONLY if she actually crossed */
      let day=-1;
      for(let d=0; d<12*60; d+=12){ G.day=d;
        if(S.rkCrierNow().some(c=>c.id==='booty') && S.rkCrossSeason().boat){ day=d; break; } }
      G.day=day;
      const ashore=(()=>{ G.rkCrossedWife=false; G.wife.body.booty=6; G.rkHolds={};
        G.__rkCross={hold:'naukan',waves:2,gap:0,mine:5,theirs:5,season:S.rkCrossSeason().id};
        S.rkCrossSettle(true,2); return G.wife.body.booty; })();
      const aboard=(()=>{ G.rkCrossedWife=true; G.wife.body.booty=6; G.rkHolds={};
        G.__rkCross={hold:'naukan',waves:2,gap:0,mine:5,theirs:5,season:S.rkCrossSeason().id};
        S.rkCrossSettle(true,2); return G.wife.body.booty; })();
      return {day, ashore, aboard};
    });
    yes('a wife left ashore is not changed by it', r.ashore===6, 'booty '+r.ashore);
    yes('a wife who actually crossed is', r.aboard>6, 'booty 6 → '+r.aboard);
  }
  { const r=await pg.evaluate(()=>{
      const S=window.__SS, G=S.G;
      const h0=G.honor;
      const right=S.rkCrierCall('purse', true);      // true claim, believed
      const h1=G.honor;
      const wrong=S.rkCrierCall('warm', true);       // false claim, believed
      const h2=G.honor;
      const called=S.rkCrierCall('warm', false);     // false claim, called
      const h3=G.honor;
      return {up:h1>h0, down:h2<h1, back:h3>h2, right:right.line, called:called.line};
    });
    yes('believing a true claim is worth something', r.up);
    yes('believing a lie costs you', r.down);
    yes('and calling it on the floor pays', r.back, r.called);
  }

  head('🗺 THE SHEET IS THIS COAST’S OWN');
  { const r=await pg.evaluate(()=>{
      const S=window.__SS, G=S.G;
      const cv=document.createElement('canvas'); cv.width=760; cv.height=420;
      let threw=null;
      const per={};
      S.RK_CROSS_SEASONS.forEach((se,i)=>{
        G.day=i*12+2;
        try{ S.drawStraitMap(cv, 'naukan'); per[se.id]='ok'; }
        catch(e){ per[se.id]=''+e; threw=''+e; }
      });
      G.day=14;
      const px=cv.getContext('2d').getImageData(0,0,cv.width,cv.height).data;
      let ink=0; for(let i=3;i<px.length;i+=4) if(px[i]>8) ink++;
      const pins=(cv.__pins||[]).length;
      const onPlate=(cv.__pins||[]).every(p=>p.x>0 && p.x<cv.width && p.y>0 && p.y<cv.height);
      /* nothing on it is a Roman province */
      const roman=S.RK_HOLDS.some(h=>/Italia|Gallia|Aegyptus|Britannia|Syria/i.test(h.name));
      return {threw, per, ink, pins, onPlate, roman,
              names:S.RK_HOLDS.map(h=>h.name)};
    });
    yes('it draws in all four seasons without throwing', !r.threw, JSON.stringify(r.per));
    yes('and it actually paints', r.ink>60000, r.ink+' px');
    is('seven holds are pinned', r.pins, 7);
    yes('all of them on the plate', r.onPlate);
    yes('and none of them is a Roman province', !r.roman, r.names.slice(0,3).join(' · '));
  }
  { const r=await pg.evaluate(()=>{
      const S=window.__SS;
      const cv=document.createElement('canvas'); cv.width=760; cv.height=420;
      S.drawStraitMap(cv,null);
      const r0=cv.getBoundingClientRect? null : null;
      /* hit-test straight off the stored pin positions */
      document.body.appendChild(cv);
      cv.style.cssText='position:static;width:760px;height:420px';
      const box=cv.getBoundingClientRect();
      const p=cv.__pins.find(x=>x.id==='imaqliq');
      const hit  = S.rkStraitHit(cv, {clientX:box.left+p.x, clientY:box.top+p.y});
      const miss = S.rkStraitHit(cv, {clientX:box.left+4,   clientY:box.top+400});
      cv.remove();
      return {hit, miss};
    });
    is('a click on the rock finds the rock', r.hit, 'imaqliq');
    is('and a click on open water finds nothing', r.miss, null);
  }

  head('THE PROJECT KNOWS HOW FAR IT HAS GOT');
  { const r=await pg.evaluate(()=>{
      const S=window.__SS, G=S.G;
      const at=n=>{ G.rkHolds={};
        S.RK_HOLDS.slice(0,n).forEach(h=>G.rkHolds[h.id]={day:1});
        return {name:S.rkCrossPhase().name, inc:S.rkCrossIncome()}; };
      const out=[0,1,3,5,7].map(at);
      G.rkHolds={};
      return out;
    });
    yes('nothing held is NOT BEGUN', r[0].name==='NOT BEGUN', r[0].name);
    yes('and all seven is the height of the Rkraun',
        /HEIGHT/.test(r[4].name), r[4].name);
    yes('the phases climb in order',
        new Set(r.map(x=>x.name)).size===5, r.map(x=>x.name).join(' → '));
    yes('and the far shore pays more the more of it is yours',
        r[4].inc>r[1].inc, '🪙'+r[1].inc+' → 🪙'+r[4].inc);
  }

  head('THE SCREEN OPENS');
  { const r=await pg.evaluate(()=>{
      const S=window.__SS, G=S.G;
      G.day=14; G.rkHolds={naukan:{day:2}};
      try{ S.openUvraak(); }catch(e){ return {threw:''+e}; }
      const b=document.getElementById('villa-body');
      const txt=b? b.textContent : '';
      return {threw:null, panels:b? b.querySelectorAll('.panel').length : 0,
              canvas:b? b.querySelectorAll('canvas').length : 0,
              lookOver:/THE LOOK-OVER/.test(txt),
              criers:/BEING SHOUTED/.test(txt),
              window:/day/.test(txt),
              berth:/HER BERTH/.test(txt),
              some:/Some of it is true/.test(txt)};
    });
    yes('without throwing', !r.threw, r.threw||'');
    yes('with the plate on it', r.canvas>=1);
    yes('the look-over', r.lookOver);
    yes('the criers', r.criers);
    yes('her berth', r.berth);
    yes('and it says out loud that some of it is true', r.some);
    yes('all of it in panels', r.panels>=6, r.panels+' panels');
  }

  head('PAGE ERRORS');
  if(errs.length) bad('none', errs.slice(0,4).join(' | ')); else ok('none');

  await br.close();
  console.log('\n'+(fail? 'FAILED  '+fail+' of '+(pass+fail) : 'ALL GREEN')+'   ('+pass+' checks)');
  process.exit(fail? 1 : 0);
})();
