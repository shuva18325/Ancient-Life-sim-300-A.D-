const {chromium}=require('playwright');
const SP='/tmp/claude-0/-home-user-Ancient-Life-sim-300-A-D-/87a00710-54d6-5a2c-805f-b5c20683bd5d/scratchpad/';
let fail=0; const ok=(n,c,d)=>{ if(!c) fail++; console.log('  '+(c?'PASS':'FAIL')+'  '+n+(d!==undefined?'   '+d:'')); };
(async()=>{
  const b=await chromium.launch();
  const pg=await b.newPage({viewport:{width:1200,height:1000},deviceScaleFactor:2});
  const errs=[]; pg.on('pageerror',e=>errs.push(e.message));
  await pg.goto('file:///home/user/Ancient-Life-sim-300-A.D-/index.html');
  await pg.evaluate(()=>localStorage.setItem('SANDSTEEL_ADULT','1'));
  await pg.reload(); await pg.waitForTimeout(400);
  const boot=()=>{ const S=window.__SS;
    S.newDemo('Kaiq','Leokanis','RkTorvak');
    const G=S.G; G.world='rk'; G.isFemale=false; G.coin=99999; G.rkWar=0;
    G.rkPitRuns=0; G.rkPitWins=0; G.rkPitBest=0; };
  await pg.evaluate(boot);
  const r=await pg.evaluate(()=>{
    const S=window.__SS, G=S.G, out={};
    out.on=S.rkWarOn();
    out.ranks=S.RK_WAR_RANKS.length;
    out.needs=S.RK_WAR_RANKS.map(x=>x.need);
    out.rising=out.needs.every((n,i)=>i===0||n>out.needs[i-1]);
    out.rank0=S.rkWarRank().name;
    G.rkWar=64; out.rank5=S.rkWarRank().name;
    G.rkWar=150; out.rankTop=S.rkWarRank().name; out.noNext=(S.rkWarNext()===null);
    // expectation climbs with the ladder
    G.rkWar=0;   out.exp0=S.rkExpectLen();
    G.rkWar=150; out.expTop=S.rkExpectLen();
    out.expLine=S.rkExpectLine();
    // arms law opens up as you climb
    G.rkWar=0;   out.legal0=S.rkArmsList().filter(a=>a.legal).length;
    G.rkWar=150; out.legalTop=S.rkArmsList().filter(a=>a.legal).length;
    out.fined=S.rkArmsList().some(a=>!a.legal||a.fine===0);
    // cards gate on rank
    G.rkWar=0;   out.cards0=S.RK_PIT.filter(c=>S.rkPitOpen(c)).length;
    G.rkWar=150; out.cardsTop=S.RK_PIT.filter(c=>S.rkPitOpen(c)).length;
    // a settled card moves the ladder and pays
    G.rkWar=0; G.coin=5000;
    G.__rkPit={card:'five', n:5};
    const w=S.rkWarSettle(true,5);
    out.win={gain:w.gain, purse:w.purse, rose:!!w.rose, rank:w.rank.name, war:G.rkWar};
    // and a loss still counts the men you put down
    G.rkWar=0; G.__rkPit={card:'five', n:5};
    const l=S.rkWarSettle(false,3);
    out.loss={gain:l.gain, purse:l.purse, war:G.rkWar};
    // the purse rises with the notch
    G.rkWar=0;   out.purseLo=S.rkPitPurse('five',5);
    G.rkWar=150; out.purseHi=S.rkPitPurse('five',5);
    return out;
  });
  console.log('--- ⚔ THE SKARVEK ---');
  ok('the ladder is on the coast', r.on===true);
  ok('eight notches, rising',      r.ranks===8 && r.rising, r.needs.join(' < '));
  ok('and you climb it',           r.rank0!==r.rank5 && r.rank5!==r.rankTop,
     r.rank0+' -> '+r.rank5+' -> '+r.rankTop);
  ok('the top is the top',         r.noNext===true);
  ok('what is expected climbs too', r.expTop>r.exp0, r.exp0+' -> '+r.expTop);
  ok('and it says so',             typeof r.expLine==='string' && r.expLine.length>20);
  ok('the arms law opens with rank', r.legalTop>r.legal0, r.legal0+' -> '+r.legalTop+' legal');
  ok('illegal ones carry a fine',  r.fined===true);
  ok('cards gate on the notch',    r.cardsTop>r.cards0, r.cards0+' -> '+r.cardsTop+' carded');
  ok('a won card pays and promotes', r.win.rose===true && r.win.purse>0,
     '+'+r.win.gain+' notches, 🪙'+r.win.purse+' -> '+r.win.rank);
  ok('a lost card still counts the fallen', r.loss.gain>0 && r.loss.gain<r.win.gain,
     '+'+r.loss.gain+' for 3 of 5');
  ok('the purse rises with the notch', r.purseHi>r.purseLo, r.purseLo+' -> '+r.purseHi);

  // the screen draws
  await pg.evaluate(()=>{ window.__SS.G.rkWar=44; window.__SS.openSkarvek(); });
  await pg.waitForTimeout(400);
  const shot=await pg.evaluate(()=>!!document.querySelector('#villa-body canvas'));
  ok('the post is drawn', shot===true);
  // crop tight on the post graphic so it can be judged
  { const el=await pg.$('#villa-body canvas');
    if(el) await el.screenshot({path:SP+'war_postzoom.png'}); }
  await pg.screenshot({path:SP+'war_post.png', fullPage:false});
  // and taking a card actually enters the field
  const took=await pg.evaluate(()=>{
    const S=window.__SS; S.G.rkWar=64; S.G.coin=99999;
    S.rkPitTake('five');
    return {state:S.state, pit:!!S.G.__rkPit, waves:S.FT&&S.FT.gauntlet? S.FT.gauntlet.total : 0};
  });
  ok('taking THE FIVE opens the field', took.state==='fight', took.state);
  ok('and it is a 1 v 5',               took.waves===5, 'waves '+took.waves);
  await pg.waitForTimeout(600);
  await pg.screenshot({path:SP+'war_field.png', fullPage:false});
  console.log('  pageerrors:', errs.length? errs.slice(0,4).join(' | ') : 'none ✓');
  if(errs.length) fail++;
  console.log(fail? '\n'+fail+' FAILURE(S)' : '\nALL GREEN');
  await b.close(); process.exit(fail?1:0);
})();
