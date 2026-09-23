/* 🧍‍♂️🍑 THE TWO OF THEM TOGETHER
   ---------------------------------------------------------------------
   What a player sent back after the bend was rebuilt:
     · "the updated bend just does NOT appear in the game" — on the coast
       the clam and the curio drew her from BEHIND, standing up straight,
       and never used the new bend at all;
     · "add the part where he gets in, reveals his length, does the woohoo,
       and make the graphics good" — the villa's woohoo was a block sprite
       with a pixel line for his measure and a beige bar over the join;
     · "impossible is STILL too short — the long and immense and impossible,
       make them bigger".
   Every scene that puts the two of them together goes through drawPair
   now: her, the new bend; him, posed off her; composited in depth.

   Run against the build before with FILE=file:///…/old.html: it fails
   there, because none of it was there.                                     */
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
  /* one house, set up fresh for each block */
  const SETUP=(world,fem)=>{ const S=window.__SS; S.newDemo('Kaiq','Leokanis','RkTorvak'); const G=S.G;
    G.world=world; G.rkRank='harra'; G.coin=99999; G.isFemale=!!fem; G.married=true; G.hygiene=90; G.day=40; G.lastLoveDay=39;
    const sp=S.makeBride(world==='rk'?'rkrai':'roman',false,9,{male:true}); sp.male=!!fem; sp.eth=world==='rk'?'rkrai':'roman';
    sp.name=fem? 'Torvak Ruun' : 'Ulva Raun'; sp.quirks=[]; sp.flaws=[]; sp.traits=['curious','vakran'];
    sp.body=Object.assign(sp.body||{},{booty:10,bust:9,legs:7,secret:9}); G.wife=sp; G.wifeRel=85; G.wifePhys=60;
    G.body=G.body||{}; G.body.secret=11; return G; };
  const setupSrc='('+SETUP.toString()+')';

  console.log('\n=== 📏 BIGGER AT THE TOP ===');
  let R=await T(()=>{ const S=window.__SS, man=(nm,v)=>({male:true,name:nm,body:{secret:v}});
    const r=(v)=>{ const I=S.lengthInches(man('Aqal',v),1); return {hard:I.hard, ratio:I.rest/I.hard}; };
    return {long:[S.lengthInches(man('Aqal',7),1).hard, S.lengthInches(man('Torvak',7),1).hard],
            imm:S.lengthInches(man('Aqal',10),1).hard, r5:r(5).ratio, r11:r(11).ratio}; });
  ok('LONG is eight inches and up', !R.err && R.long.every(x=>x>=7.8 && x<=8.8), R.err||R.long.map(x=>x.toFixed(1)).join(' '));
  ok('IMMENSE is past eleven', !R.err && R.imm>=11.5, R.err||R.imm.toFixed(1));
  ok('and a big man hangs heavier — more of him shows at rest', !R.err && R.r11 > R.r5+0.08, R.err||(R.r5.toFixed(2)+' → '+R.r11.toFixed(2)));

  console.log('\n=== 🏛 THE VILLA\'S WOOHOO: HE COMES IN, UNDRESSES, SHOWS, AND THEN ===');
  R=await T((src)=>{ const S=window.__SS; eval(src)('rome');
    S.openDomus(); const D=S.DM; D.x=D.wifeX-30; D.face=1; S.startVillaLove(D.wifeX,false,true);
    const at=(t)=>{ D.scene.t=t; const n0=S.PAIR_DRAWS; S.drawDomus(); const L=S.PAIR_LAST; return {drew:S.PAIR_DRAWS>n0, R:L&&L.R}; };
    const dist=(a,b)=>(a&&b)? Math.hypot(a[0]-b[0],a[1]-b[1]) : 999;
    const walk=at(20), rev=at(178), act1=at(262), act2=at(266);
    const IN=S.lengthInches(S.pairHimLook(),1);
    return { drew:walk.drew && rev.drew && act1.drew,
      dressedTip: !!(walk.R&&walk.R.hisTip), revealTip: !!(rev.R&&rev.R.hisTip),
      revealLen: rev.R&&rev.R.hisTip&&rev.R.hisRoot? dist(rev.R.hisTip, rev.R.hisRoot) : 0, hard:IN.hard,
      apartAtReveal: dist(rev.R&&rev.R.hisHip, rev.R&&rev.R.join), joined: dist(act1.R&&act1.R.hisHip, act1.R&&act1.R.join),
      beat: Math.abs(((act1.R&&act1.R.hisHip)||[0])[0]-((act2.R&&act2.R.hisHip)||[0])[0]),
      herBent: act1.R && act1.R.head && act1.R.seat ? (act1.R.head[1] > act1.R.seat[1]-8) : false }; }, setupSrc);
  ok('the scene is drawn by the pair — her new bend and him, posed off her', R.drew===true, R.err);
  ok('walking in he is dressed: nothing of him showing', !R.err && R.dressedTip===false);
  ok('THE REVEAL: undressed, and all of him showing', !R.err && R.revealTip===true);
  ok('at his real length — IMPOSSIBLE, well over a hand', !R.err && R.revealLen >= R.hard*0.8, R.err||(R.revealLen.toFixed(1)+' px for '+R.hard.toFixed(1)+' in'));
  ok('and he is still a step back from her when he shows it', !R.err && R.apartAtReveal > 8, R.err||(R.apartAtReveal.toFixed(1)+' px'));
  ok('then he is IN: his hips at her, where she is, not near her', !R.err && R.joined < 7, R.err||(R.joined.toFixed(1)+' px'));
  ok('and the beat moves him', !R.err && R.beat > 0.6, R.err||(R.beat.toFixed(2)+' px between two ticks'));
  ok('while she stays bent over', R.herBent===true);

  console.log('\n=== 🐚 THE COAST: THE CLAM USES THE NEW BEND ===');
  R=await T((src)=>{ const S=window.__SS; eval(src)('rk');
    S.openDomus(); const D=S.DM; D.x=D.wifeX-40; S.startClam(); const X=D.clam;
    const at=(ph,t,ex)=>{ X.ph=ph; X.t=t; Object.assign(X,ex||{}); const n0=S.PAIR_DRAWS; S.drawDomus(); const L=S.PAIR_LAST; return {drew:S.PAIR_DRAWS>n0, k:L&&L.k, R:L&&L.R}; };
    const dist=(a,b)=>(a&&b)? Math.hypot(a[0]-b[0],a[1]-b[1]) : 999;
    const hold=at('hold',30,{bend:0.42,pt:20}), grab=at('grab',30,{bend:0.42,gp:0.9}), bend=at('bend',80,{bend:0.98,kind:'rode'});
    return { drew:hold.drew && grab.drew && bend.drew, k:bend.k, joined:dist(hold.R&&hold.R.hisHip, hold.R&&hold.R.join),
      hairHand: dist(grab.R&&grab.R.hisHand, grab.R&&grab.R.head),
      bentLow: bend.R && bend.R.head && bend.R.seat ? bend.R.head[1] > bend.R.seat[1]-6 : false,
      dirOK: hold.R && hold.R.hisHip && hold.R.join ? hold.R.hisHip[0] < hold.R.join[0] : false }; }, setupSrc);
  ok('the clam is drawn by the pair, in profile — not from behind', R.drew===true, R.err);
  ok('when she bends for the two she owes, she BENDS — all the way', !R.err && R.k>=0.9 && R.bentLow===true, R.err||('k '+R.k));
  ok('while she holds him, he is at her', !R.err && R.joined < 7, R.err||(R.joined.toFixed(1)+' px'));
  ok('✊ the contest: his hand is in her hair', !R.err && R.hairHand < 9, R.err||(R.hairHand.toFixed(1)+' px from her head'));
  ok('and he is behind her, on the side he came from', R.dirOK===true);

  console.log('\n=== 🔎 THE COAST: THE CURIO USES IT TOO ===');
  R=await T((src)=>{ const S=window.__SS; eval(src)('rk');
    S.openDomus(); const D=S.DM; D.clam=null; D.x=D.wifeX+40; S.startCurio(); const C=D.curio;
    const at=(ph,t,ex)=>{ C.ph=ph; C.t=t; Object.assign(C,ex||{}); const n0=S.PAIR_DRAWS; S.drawDomus(); const L=S.PAIR_LAST; return {drew:S.PAIR_DRAWS>n0, k:L&&L.k, R:L&&L.R}; };
    const dist=(a,b)=>(a&&b)? Math.hypot(a[0]-b[0],a[1]-b[1]) : 999;
    const look=at('look',80,{bend:1}), woo0=at('woohoo',4,{bend:1,rub:0}), woo=at('woohoo',120,{bend:1,rub:1.5});
    return { drew:look.drew && woo.drew, k:look.k, apart:dist(look.R&&look.R.hisHip, look.R&&look.R.join),
      joined:dist(woo.R&&woo.R.hisHip, woo.R&&woo.R.join), dressedAtStart: !!(woo0.drew && woo0.R && woo0.R.hisHip && !woo0.R.hisTip),
      mirrored: woo.R && woo.R.dir===-1 && woo.R.hisHip && woo.R.join ? woo.R.hisHip[0] > woo.R.join[0] : false }; }, setupSrc);
  ok('the curio is drawn by the pair: she is bent right over the thing', R.drew===true && R.k>=0.95, R.err||('k '+R.k));
  ok('he stands off while she is looking', !R.err && R.drew===true && R.apart > 10 && R.apart < 60, R.err||(R.apart.toFixed(1)+' px'));
  ok('the woohoo starts with his kilt still on', R.dressedAtStart===true);
  ok('and then he is in', !R.err && R.joined < 7, R.err||(R.joined.toFixed(1)+' px'));
  ok('coming from her RIGHT, the whole pair turns round', R.mirrored===true);

  console.log('\n=== 🪞 SHE FACES HER SHELF · AND A WOMAN PLAYING IT ===');
  R=await T((src)=>{ const S=window.__SS; eval(src)('rome');
    S.openDomus(); const D=S.DM; D.wifeDir=-1; D.x=D.wifeX+60; S.startTempt(); const X=D.tempt;
    let g=0; while(D.tempt && D.tempt.ph!=='resist' && D.tempt.ph!=='invited' && g++<2000) S.updateTempt(1);
    const behind = X.fdir===-1 && D.x > X.x;
    eval(src)('rome', true);
    S.openDomus(); const D2=S.DM; D2.x=D2.wifeX-30; D2.face=1; S.startVillaLove(D2.wifeX,false,true); D2.scene.t=262; S.drawDomus();
    const L=S.PAIR_LAST, G=S.G;
    return { behind, herIsPlayer: !!(L && L.w && !L.w.male && L.w!==G.wife), himIsHusband: !!(L && L.look && L.look.name===G.wife.name) }; }, setupSrc);
  ok('her shelf on her left: she faces it, and he walks up BEHIND her', R.behind===true, R.err);
  ok('played as a woman, SHE is the one bent over', R.herIsPlayer===true);
  ok('and her husband is the man', R.himIsHusband===true);

  console.log('\n=== 👀 AND SHE LOOKS BACK AT WHAT HE HAS ===');
  R=await T(()=>{ const S=window.__SS, N={name:'THE BOOTY DESTROYER'};
    const a=S.villaRevealLine(11,false,N), b=S.villaRevealLine(8,false,null), c=S.villaRevealLine(2,false,null), f=S.villaRevealLine(11,true,N);
    return {a:a.lines.join(' / '), aE:a.expr, brace:a.brace, b:b.lines[0], c:c.lines[0], f:f.lines[0]}; });
  ok('an IMPOSSIBLE man: her eyes go wide, and she has heard what the village calls him', !R.err && /very wide/.test(R.a) && /BOOTY DESTROYER/.test(R.a) && R.brace===true, R.err||R.a);
  ok('a LONG one gets a grin', !R.err && /grins/.test(R.b), R.err||R.b);
  ok('a small one — she is very kind about it', !R.err && /kind/.test(R.c), R.err||R.c);
  ok('played as a woman, it is YOU looking back', !R.err && /^~ you look back/.test(R.f), R.err||R.f);

  console.log('\n--- PAGE ERRORS ---');
  ok('none', errs.length===0, errs.slice(0,3).join(' | '));
  console.log('\n'+(fail? '✗ '+fail+' FAILED' : 'ALL GREEN')+'   ('+(pass+fail)+' checks)');
  await br.close();
  process.exit(fail?1:0);
})();
