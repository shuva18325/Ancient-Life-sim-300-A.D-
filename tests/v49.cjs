/* 🦁 V49 — THE ROADMAP'S TEN: THE BEASTS ON BODIES, THE CULTURE BEDCHAMBERS, THE RHYTHM,
   GREEDY AND SIVRAK ROUND TWO, THE ESCALATIONS, COURTSHIP ROUND TWO, AND THE BOTS'
   SECOND GENERATION, THEIR NIGHTS AND THE FOURTH BOT
   ---------------------------------------------------------------------
   From the round that asked for "do 1–10, make sure the graphics are GOOD".
   Run against the build before with FILE=…: it fails there.                */
const {chromium}=require('playwright');
const FILE=process.env.FILE || ('file://'+require('path').resolve(__dirname,'..','index.html'));
let pass=0, fail=0;
const ok=(name,cond,note)=>{ if(cond){pass++; console.log('  PASS  '+name+(note?'   '+note:''));}
                             else {fail++; console.log('  FAIL  '+name+(note?'   '+note:''));} };
(async()=>{
  const br=await chromium.launch();
  const pg=await br.newPage({viewport:{width:1280,height:720}});
  const errs=[]; pg.on('pageerror',e=>errs.push(''+e));
  await pg.goto(FILE);
  await pg.evaluate(()=>{ localStorage.clear(); localStorage.setItem('SANDSTEEL_ADULT','1'); });
  await pg.reload(); await pg.waitForTimeout(500);
  await pg.evaluate(()=>{ window.requestAnimationFrame=()=>0; });
  const T=async(fn,arg)=>{ try{ return await pg.evaluate(fn,arg); }catch(e){ return {err:String(e).slice(0,300)}; } };
  await pg.evaluate(()=>{
    window.__cv=(w,h)=>{ const c=document.createElement('canvas'); c.width=w; c.height=h; return c; };
    window.__crop=(x,y,w,h)=>{ const c=__cv(w,h); c.getContext('2d').drawImage(document.getElementById('game'),x,y,w,h,0,0,w,h); return c; };
    window.__busy=(c,bg)=>{ const d=c.getContext('2d').getImageData(0,0,c.width,c.height).data; let n=0; for(let i=0;i<d.length;i+=4){ if(Math.abs(d[i]-bg[0])+Math.abs(d[i+1]-bg[1])+Math.abs(d[i+2]-bg[2])>40) n++; } return n; };
    window.__diff=(a,b)=>{ const A=a.getContext('2d').getImageData(0,0,a.width,a.height).data, B=b.getContext('2d').getImageData(0,0,b.width,b.height).data;
      let n=0; for(let i=0;i<A.length;i+=4){ if(Math.abs(A[i]-B[i])+Math.abs(A[i+1]-B[i+1])+Math.abs(A[i+2]-B[i+2])>30) n++; } return n; };
    window.__colors=(c)=>{ const d=c.getContext('2d').getImageData(0,0,c.width,c.height).data, s=new Set(); for(let i=0;i<d.length;i+=4) s.add((d[i]>>3)+','+(d[i+1]>>3)+','+(d[i+2]>>3)); return s.size; };
  });

  console.log('\n=== 🦁 R10 · THE BEASTS, ON BODIES OF THEIR OWN ===');
  let R=await T(()=>{ const S=window.__SS; S.newDemo('Marcus','Italia','Roman'); const out={};
    const g=document.getElementById('game').getContext('2d'), BG=[40,60,90];
    const draw=(id, o, classic)=>{ const f=S.makeBeast({tier:4},1); f.beastType=S.BEASTS.find(b=>b.id===id); f.x=240; f.y=210; f.facing=1; f._bfx=1; Object.assign(f,o||{});
      g.setTransform(1,0,0,1,0,0); g.fillStyle='rgb(40,60,90)'; g.fillRect(0,0,480,270);
      S.SETTINGS.classicBodies=!!classic; try{ S.drawGladiator? S.drawGladiator(f) : S.drawBeastNB(f); } finally{ S.SETTINGS.classicBodies=false; }
      return __crop(110,90,220,125); };
    for(const id of ['lion','leopard','bear','bull']){
      const idle=draw(id), atk=draw(id,{atk:true,atkDur:14,atkT:7}), walkA=draw(id,{vx:2,legPhase:0}), walkB=draw(id,{vx:2,legPhase:3.1}), air=draw(id,{onGround:false,vy:-4,y:185}), down=draw(id,{knock:true,onGround:true}), old=draw(id,{},true);
      out[id]={busy:__busy(idle,BG), oldBusy:__busy(old,BG), colors:__colors(idle), oldColors:__colors(old), atk:__diff(idle,atk), walk:__diff(walkA,walkB), air:__diff(idle,air), down:__diff(idle,down), vsOld:__diff(idle,old)}; }
    out.draws=S.BST_DRAWS; return out; });
  const B=R;
  ok('every beast is drawn by the new body, and the classic switch still gives the old sprite', !R.err && ['lion','leopard','bear','bull'].every(id=>R[id].vsOld>600) && R.draws>=20, R.err||JSON.stringify(R).slice(0,300));
  ok('they are proper animals now: bigger than the block sprite, and painted (many more tones)', !R.err && ['lion','leopard','bear','bull'].every(id=>R[id].busy>R[id].oldBusy*1.4 && R[id].colors>R[id].oldColors*1.2 && R[id].colors>80), R.err||JSON.stringify(['lion','leopard','bear','bull'].map(id=>[R[id].busy,R[id].oldBusy,R[id].colors,R[id].oldColors])));
  ok('they walk: the legs are in different places half a stride apart', !R.err && ['lion','leopard','bear','bull'].every(id=>R[id].walk>120), R.err||JSON.stringify(['lion','leopard','bear','bull'].map(id=>R[id].walk)));
  ok('they attack in a pose of their own (a swipe, a rearing maul, a hook of the horns)', !R.err && ['lion','leopard','bear','bull'].every(id=>R[id].atk>150), R.err||JSON.stringify(['lion','leopard','bear','bull'].map(id=>R[id].atk)));
  ok('they leap with the legs reaching and trailing, and they fold up on the sand at the end', !R.err && ['lion','leopard','bear','bull'].every(id=>R[id].air>400 && R[id].down>400), R.err||JSON.stringify(['lion','leopard','bear','bull'].map(id=>[R[id].air,R[id].down])));
  R=await T(()=>{ const S=window.__SS; S.newDemo('Marcus','Italia','Roman'); S.startFight(S.REGION_BY_ID['Italia'], {venatio:true}); const FT=S.FT; const d0=S.BST_DRAWS;
    for(let i=0;i<6;i++) S.drawArena(); return {beast:!!FT.foe.beast, drew:S.BST_DRAWS-d0}; });
  ok('and a real venatio bout draws its beast on the new body', !R.err && R.beast && R.drew>=6, R.err||JSON.stringify(R));

  console.log('\n=== 🐘 THE NORTH AFRICAN ELEPHANT ===');
  R=await T(()=>{ const S=window.__SS; S.newDemo('Marcus','Italia','Roman'); const out={}; const g=document.getElementById('game').getContext('2d'), BG=[40,60,90];
    const draw=(o)=>{ const f=S.makeBeast({tier:4},1); f.beastType=S.BEASTS.find(b=>b.id==='elephant'); f.heavy=true; f.girth=46; f.x=300; f.y=210; f.facing=1; f._bfx=1; Object.assign(f,o||{});
      g.setTransform(1,0,0,1,0,0); g.fillStyle='rgb(40,60,90)'; g.fillRect(0,0,480,270); S.drawGladiator(f); return __crop(140,60,240,155); };
    const idle=draw(), walkA=draw({vx:1.2,legPhase:0}), walkB=draw({vx:1.2,legPhase:3.1});
    const atk=(k)=>{ const f={atk:true,atkDur:30,atkT:15,_elAtk:k}; return draw(f); };
    const sw=atk('swat'), go=atk('gore'), st=atk('stomp');
    const lion=(()=>{ const f=S.makeBeast({tier:4},1); f.beastType=S.BEASTS.find(b=>b.id==='lion'); f.x=300; f.y=210; f.facing=1; f._bfx=1; g.setTransform(1,0,0,1,0,0); g.fillStyle='rgb(40,60,90)'; g.fillRect(0,0,480,270); S.drawGladiator(f); return __crop(140,60,240,155); })();
    out.busy=__busy(idle,BG); out.lionBusy=__busy(lion,BG); out.colors=__colors(idle); out.walk=__diff(walkA,walkB);
    out.sw=__diff(idle,sw); out.go=__diff(idle,go); out.st=__diff(idle,st); out.swSt=__diff(sw,st); out.goSt=__diff(go,st);
    const pools={}; for(const t of [2,3,4]){ pools[t]=new Set(); for(let i=0;i<300;i++) pools[t].add(S.makeBeast({tier:t},1).beastType.id); pools[t]=[...pools[t]]; }
    out.pools=pools; return out; });
  ok('🐘 an elephant is drawn on the new body: enormous next to a lion, and painted', !R.err && R.busy>R.lionBusy*1.8 && R.colors>80, R.err||JSON.stringify(R));
  ok('…it walks, and it has three attacks of its own — a trunk swat, a tusk gore, a rear and stomp', !R.err && R.walk>200 && R.sw>300 && R.go>300 && R.st>300 && R.swSt>300 && R.goSt>300, R.err||JSON.stringify(R));
  ok('…and only the great arenas (tier 4) can afford one', !R.err && R.pools[4].includes('elephant') && !R.pools[3].includes('elephant') && !R.pools[2].includes('elephant'), R.err||JSON.stringify(R.pools));
  R=await T(()=>{ const S=window.__SS; S.newDemo('Marcus','Italia','Roman'); const G=S.G; G.loadout.weapon='hasta'; G.maxHp=G.hp=400;
    S.startFight(S.REGION_BY_ID['Italia'], {venatio:true}); const FT=S.FT, p=FT.p;
    const e=S.makeBeast({tier:4},1); if(e.beastType.id!=='elephant'){ const b=S.BEASTS.find(b=>b.id==='elephant'); e.beastType=b; e.heavy=true; e.girth=46; e.tall=34; e.strideMul=2.1; e.gear.weapon.dmg=b.dmg; e.gear.weapon.reach=b.reach; e.gear.armor.armor=b.armor; e.ai.react=b.react; e.ai.aggr=b.aggr; }
    e.maxHp=e.hp=430; e.x=380; FT.foe=e; p.x=120; p.hp=p.maxHp=400;
    let maxAir=0, inside=0, pThrown=0, atks={}; const hp0=e.hp, php0=p.hp;
    for(let t=0;t<1400;t++){
      if(t%40<20){ p.facing=e.x>p.x?1:-1; if(Math.abs(e.x-p.x)>60 && p.onGround && t%8===0) S.hop(p,p.facing); if(Math.abs(e.x-p.x)<90 && t%18===0) S.doAttack(p,t%36===0?'thrust':'slash'); }
      S.updateFight(1); if(!FT.foe || FT.over) break;
      if(e.atk && e._elAtk) atks[e._elAtk]=1;
      maxAir=Math.max(maxAir, 210-e.y); if(!p.onGround) pThrown++;
      const rel=(p.x-e.x)*e.facing; if(p.onGround && rel<30 && rel>-50) inside++; }
    return {maxAir, inside, pThrown, dmgE:hp0-e.hp, dmgP:php0-p.hp, atks:Object.keys(atks)}; });
  ok('in a real bout it is HEAVY: blows barely move it and it never leaves the ground', !R.err && R.maxAir<2, R.err||JSON.stringify(R));
  ok('…you cannot walk through it — its bulk shoves you out', !R.err && R.inside<8, R.err||JSON.stringify(R));
  ok('…you can wound it with a spear, and it hurts you back with more than one attack', !R.err && R.dmgE>100 && R.dmgP>60 && R.atks.length>=2, R.err||JSON.stringify(R));

  console.log('\n=== 🐎 THE ESSEDARII — CHARIOT FIGHTS ===');
  R=await T(()=>{ const S=window.__SS; S.newDemo('Marcus','Italia','Roman'); const out={}; const g=document.getElementById('game').getContext('2d'), BG=[210,178,122];
    S.startFight(S.REGION_BY_ID['Italia'], {chariot:true}); const FT=S.FT, p=FT.p, e=FT.foe;
    out.both=!!(p.mounted && e.mounted && FT.chariot); out.cars=FT.cars.length; out.onDeck=Math.round(210-p.y);
    const d0=S.BST_DRAWS; S.drawArena(); out.horseDraws=S.BST_DRAWS-d0;
    // one rig alone on plain sand, at a gallop, two strides apart
    const c=p.mounted; FT.cars=[c]; e.x=-600; const em=e.mounted; e.mounted=null;
    const shot=(ph,v)=>{ c.x=150; c.vx=v; c.dir=1; c.sx=1; for(const h of c.horses){ h.legPhase=ph; h.vx=Math.abs(v); } S.chPin(p); g.setTransform(1,0,0,1,0,0); g.fillStyle='rgb(210,178,122)'; g.fillRect(0,0,480,270); S.chDrawScene(); return __crop(110,120,190,95); };
    const a=shot(0,3), b=shot(2.2,3), still=shot(0,0);
    out.busy=__busy(a,BG); out.colors=__colors(a); out.gallop=__diff(a,b);
    out.coats=Object.keys(S.HORSE_COATS).length; e.mounted=em; return out; });
  ok('🐎 a chariot bout puts both men on the platforms of two-horse cars, standing on the deck', !R.err && R.both && R.cars===2 && R.onDeck>=18, R.err||JSON.stringify(R));
  ok('…the teams are painted horses on the beast skeleton (four a frame), in four coats', !R.err && R.horseDraws>=4 && R.coats>=4, R.err||JSON.stringify(R));
  ok('…a rig is big and painted — car, wheels, driver, pole, reins and a pair — and the pair gallops', !R.err && R.busy>5000 && R.colors>150 && R.gallop>600, R.err||JSON.stringify(R));
  R=await T(()=>{ const S=window.__SS; S.newDemo('Marcus','Italia','Roman'); S.startFight(S.REGION_BY_ID['Italia'], {chariot:true}); const FT=S.FT, p=FT.p, e=FT.foe; const c=p.mounted, out={};
    e.x=-900; e.mounted.x=-900; e.mounted.leaving=true;
    S.hold('d',true); let whipV=0; for(let i=0;i<110;i++){ S.updateFight(1); whipV=Math.max(whipV,Math.abs(c.vx)); } S.hold('d',false); out.whipV=whipV; out.maxX=c.x;
    S.hold('a',true); out.turned=0; for(let i=0;i<90;i++){ S.updateFight(1); if(c.dir===-1 && c.vx<-1) out.turned=-1; } S.hold('a',false); out.vx=c.vx;
    for(let i=0;i<400;i++) S.updateFight(1); out.minX=Math.min(c.x, out.maxX); out.inside= c.x>0 && c.x<480;
    S.press('w'); S.updateFight(1); out.down=!p.mounted; out.leaving=!!c.leaving; return out; });
  ok('you drive: A turns the team round, holding the way you go whips them on, and the driver wheels round before the wall', !R.err && R.turned===-1 && R.whipV>2.6 && R.inside, R.err||JSON.stringify(R));
  ok('…and W leaps down from your car, and your driver takes it away', !R.err && R.down && R.leaving, R.err||JSON.stringify(R));
  R=await T(()=>{ const S=window.__SS; S.newDemo('Marcus','Italia','Roman'); S.startFight(S.REGION_BY_ID['Italia'], {chariot:true}); const FT=S.FT, p=FT.p, e=FT.foe; const out={};
    const fc=e.mounted;
    const hp0=fc.hp, ehp0=e.hp; const d1=S.chOnHit(p, e, 20, 'low'); out.carHit=hp0-fc.hp; out.manDmg=d1;
    let k=0; while(!fc.wreck && k++<20) S.chOnHit(p, e, 25, 'low');
    out.wreck=!!fc.wreck; out.thrown=!e.mounted; out.loose=FT.chLoose.length; out.youWrecked=!!FT.youWrecked;
    for(let i=0;i<200;i++) S.updateFight(1); out.gone=!FT.cars.includes(fc); return out; });
  ok('a LOW blow at a man in his car hits the car, not the man — and enough of them wreck it', !R.err && R.carHit>15 && R.manDmg<10 && R.wreck, R.err||JSON.stringify(R));
  ok('…the wheel comes off and rolls away, he is flung out, and his team bolts dragging the wreck off the sand', !R.err && R.thrown && R.loose>=1 && R.youWrecked && R.gone, R.err||JSON.stringify(R));
  R=await T(()=>{ const S=window.__SS; S.newDemo('Marcus','Italia','Roman'); S.startFight(S.REGION_BY_ID['Italia'], {chariot:true}); const FT=S.FT, p=FT.p, e=FT.foe; const out={};
    S.chDismount(p,'down'); for(let i=0;i<30;i++){ p.y=210; p.onGround=true; S.updateFight(0.01); }
    const fc=e.mounted; fc.leaving=false; fc.x=p.x+120; fc.vx=-3; fc.dir=-1; fc.sx=-1; fc.trampleCd=0; e.ai.think=999;
    p.x=200; p.y=210; p.onGround=true; p.vx=0; p.vy=0; const hp0=p.hp; fc.x=p.x+50; S.chTrample(fc, p); out.rode=hp0-p.hp;
    const hp1=p.hp; fc.trampleCd=0; p.x=200; p.y=180; p.onGround=false; S.chTrample(fc, p); out.jumped=hp1-p.hp;
    return out; });
  ok('on foot, a galloping team rides you down — unless you jump it', !R.err && R.rode>10 && R.jumped===0, R.err||JSON.stringify(R));
  R=await T(()=>{ const S=window.__SS; S.newDemo('Marcus','Italia','Roman'); S.G.maxHp=S.G.hp=400;
    S.startFight(S.REGION_BY_ID['Italia'], {chariot:true}); const FT=S.FT, p=FT.p, e=FT.foe; p.hp=p.maxHp=600; let passes=0, hits=0, lowAtWheel=0, last=Math.sign(e.x-p.x), dismount=null;
    for(let t=0;t<2400 && !FT.over;t++){ const s=Math.sign(e.x-p.x); if(s!==last){ passes++; last=s; } if(t===900 && p.mounted) S.chDismount(p,'down');
      const fcHp=p.mounted? p.mounted.hp : null; const php=p.hp; S.updateFight(1); if(p.hp<php) hits++; if(fcHp!==null && p.mounted && p.mounted.hp<fcHp) lowAtWheel++;
      if(!e.mounted && dismount===null) dismount=t; }
    return {passes, hits, lowAtWheel, dismount, eMounted:!!e.mounted}; });
  ok('he drives passes at you, strikes as he goes by, goes for your wheel — and gets down to finish it', !R.err && R.passes>=3 && R.hits>=2 && R.lowAtWheel>=1 && R.dismount!==null, R.err||JSON.stringify(R));

  console.log('\n=== ⚔ THE ARMOURY, REDRAWN ===');
  R=await T(()=>{ const S=window.__SS, out={}; const ids=S.GEAR.weapon.map(w=>w.id); const g=document.getElementById('game').getContext('2d'); const C=S.paletteFor({});
    out.n=ids.length; out.missing=ids.filter(id=>!S.WPN_ART[id]);
    const shots={}; const d0=S.WPN_DRAWS;
    for(const id of ids){ g.setTransform(1,0,0,1,0,0); g.fillStyle='rgb(40,60,90)'; g.fillRect(0,0,120,60); g.save(); g.translate(40,30); g.rotate(-0.35);
      S.setOUTL(true); S.drawWeapon2(id,C); S.setOUTL(false); S.drawWeapon2(id,C); g.restore(); shots[id]=__crop(0,0,120,60); }
    out.draws=S.WPN_DRAWS-d0;
    const px=(c)=> c.getContext? c.getContext('2d').getImageData(0,0,c.width,c.height).data : c;
    const sig=(c0)=>{ const c=px(c0); let h=0; for(let i=0;i<c.length;i+=4) h=(h*31+c[i]*3+c[i+1]*5+c[i+2]*7)>>>0; return h; };
    const blank=ids.filter(id=>id!=='sumo_bare'&&id!=='none').filter(id=>__busy(shots[id],[40,60,90])<20);
    out.blank=blank; out.unique=new Set(ids.map(id=>sig(shots[id]))).size;
    { const c=px(shots.gladius); let dark=0, n=0; for(let i=0;i<c.length;i+=4){ if(!(c[i]===40&&c[i+1]===60&&c[i+2]===90)){ n++; if(c[i]<34&&c[i+1]<24&&c[i+2]<16) dark++; } } out.rim=dark/n; }
    out.vsOld=__diff(shots.katana, (()=>{ g.setTransform(1,0,0,1,0,0); g.fillStyle='rgb(40,60,90)'; g.fillRect(0,0,120,60); g.save(); g.translate(40,30); g.rotate(-0.35); S.drawWeapon2Old('katana',C); g.restore(); return __crop(0,0,120,60); })());
    // the thrown and shot: darts, a repeating crossbow and a throwing-board are no longer drawn as a bow
    const rs={}; for(const id of ['steppe','plumbata','lian_nu','nuqaq','yumi']){ const bw=S.BOWS.find(b=>b.id===id); g.setTransform(1,0,0,1,0,0); g.fillStyle='rgb(40,60,90)'; g.fillRect(0,0,120,60); g.save(); g.translate(40,30); S.drawHeldBow(bw); g.restore(); rs[id]=__crop(0,0,120,60); }
    out.notBows=['plumbata','lian_nu','nuqaq'].map(id=>__diff(rs[id],rs.steppe));
    // the shop's tiles, every one painted
    const ic={}; for(const w of S.GEAR.weapon){ const k=document.createElement('canvas'); k.width=40; k.height=40; S.drawGearIcon(k,'weapon',w); ic[w.id]=k.getContext('2d').getImageData(0,0,40,40).data; }
    out.iconUnique=new Set(Object.values(ic).map(sig)).size;
    // and in a real bout it is the armoury that draws what he holds
    S.newDemo('Marcus','Italia','Roman'); S.startFight(S.REGION_BY_ID['Italia'],{}); const e0=S.WPN_DRAWS; for(let i=0;i<4;i++){ S.updateFight(1); S.drawArena(); } out.inBout=S.WPN_DRAWS-e0;
    return out; });
  ok('⚔ every weapon in the game has its own painting — none left as stacked rectangles, none blank', !R.err && R.missing.length===0 && R.blank.length===0 && R.n>=80, R.err||JSON.stringify({n:R.n, missing:R.missing, blank:R.blank}));
  ok('…all different from each other, ringed in the body’s dark line, and not the old katana', !R.err && R.unique>=R.n-2 && R.rim>0.18 && R.vsOld>30, R.err||JSON.stringify({unique:R.unique, n:R.n, rim:R.rim, vsOld:R.vsOld}));
  ok('…the darts, the repeating crossbow and the throwing-board are drawn as themselves, not as a bow', !R.err && R.notBows.every(d=>d>60), R.err||JSON.stringify(R.notBows));
  ok('…the shop shows the same painting on every tile, and a real bout draws the weapon in hand through it', !R.err && R.iconUnique>=R.n-2 && R.inBout>=2, R.err||JSON.stringify({iconUnique:R.iconUnique, inBout:R.inBout}));

  console.log('\n=== 🏯 R7 · EVERY CULTURE\u2019S BEDCHAMBER, PAINTED ===');
  R=await T(()=>{ const S=window.__SS, out={}; S.newDemo('Marcus','Italia','Roman'); const g=document.getElementById('game').getContext('2d');
    const reg={roman:'Italia', wa:Object.keys(S.REGION_WA_BY_ID)[3], korean:'Goguryeo', han:'Luoyang', persian:Object.keys(S.THEATRE_OF).find(k=>S.THEATRE_OF[k]==='persia'), steppe:'Xianbei Steppe',
               kushan:'Gandhara', tamil:'Chola Country', egyptian:'Aegyptus', celt:'Britannia', germanic:Object.keys(S.THEATRE_OF).find(k=>S.THEATRE_OF[k]==='germania')};
    const stage={}, kinds={}; let t0, ms=0, n=0;
    for(const [c,rg] of Object.entries(reg)){ S.G.current=rg; kinds[c]=S.hallPlan().kind; const d0=S.CH_DRAWS; g.setTransform(1,0,0,1,0,0); g.fillStyle='#140c08'; g.fillRect(0,0,480,270);
      t0=performance.now(); S.drawHall(70,36,240,138,50,true,1); if(c!=='roman'){ ms+=performance.now()-t0; n++; }
      stage[c]={c:__crop(70,36,240,138), drew:S.CH_DRAWS-d0}; }
    for(let i=0;i<30;i++){ S.G.current=reg.persian; t0=performance.now(); S.drawHall(70,36,240,138,i,true,1); ms+=performance.now()-t0; n++; }
    const names=Object.keys(reg).filter(c=>c!=='roman');
    out.vsRome=names.map(c=>[c, __diff(stage[c].c, stage.roman.c), __colors(stage[c].c), stage[c].drew]);
    let minPair=1e9, minWho=''; for(let i=0;i<names.length;i++) for(let j=i+1;j<names.length;j++){ const d=__diff(stage[names[i]].c, stage[names[j]].c); if(d<minPair){ minPair=d; minWho=names[i]+'/'+names[j]; } }
    out.minPair=minPair; out.minWho=minWho; out.avgMs=ms/n; out.kinds=kinds; out.cache=S.CH_CACHE_N;
    // the walk-in, the door, the jar, the bed through the door
    const w=S.makeBride('roman',true,8); w.male=false; S.G.married=true; S.G.hasVilla=true; S.G.wife=w; S.G.wifeRel=80; S.setWH('done');
    const room={}; out.walk=[];
    for(const c of ['roman'].concat(names)){ S.G.current=reg[c]; S.startBedScene('fun','long','bed'); const B=S.BC; const at=(t,wine)=>{ B.t=t; B.tT=t; B.stage=S.bedStage(B); B.wineTaken=!!wine; S.drawBed(); };
      const d0=S.CH_DRAWS; at(40); const full=__crop(0,0,480,270), doorShut=__crop(330,70,110,155), jar=__crop(305,185,35,32); at(40,true); const noJar=__crop(305,185,35,32);
      at(200); const doorOpen=__crop(330,70,110,155); at(430); const bed=__crop(346,150,46,56);
      room[c]={full, bed}; out.walk.push([c, S.CH_DRAWS-d0, __diff(doorShut,doorOpen), __diff(jar,noJar)]); }
    out.walkVsRome=names.map(c=>[c, __diff(room[c].full, room.roman.full)]);
    out.bedVsRome=names.map(c=>[c, __diff(room[c].bed, room.roman.bed)]);
    out.cache2=S.CH_CACHE_N; return out; });
  const R7=R;
  ok('ten peoples have a room of their own on the positions stage — none of them is the cubiculum any more', !R.err && R.vsRome.every(([c,d,col,drew])=>d>240*138*0.3 && drew===1), R.err||JSON.stringify(R.vsRome));
  ok('and each is painted, not blocked in: well over a hundred tones in every one', !R.err && R.vsRome.every(([c,d,col])=>col>120), R.err||JSON.stringify(R.vsRome.map(a=>[a[0],a[2]])));
  ok('no two of them are the same room (Wa is not Korea, Gandhara is not the Tamil south)', !R.err && R.minPair>240*138*0.2, R.err||(R.minWho+' '+R.minPair));
  ok('the whole-screen walk-in is painted in the local style too, and it is not Rome', !R.err && R.walk.slice(1).every(a=>a[1]>=1) && R.walkVsRome.every(([c,d])=>d>480*270*0.3), R.err||JSON.stringify(R.walkVsRome));
  ok('each has its own door, and the door opens (a fusuma slides, the others swing)', !R.err && R.walk.every(a=>a[2]>1500), R.err||JSON.stringify(R.walk.map(a=>[a[0],a[2]])));
  ok('each keeps its own jar for the wine — sake, a bronze hu, a silver ewer, kumis, a surahi, an amphora, a flagon, mead — and it goes when it is taken', !R.err && R.walk.every(a=>a[3]>40), R.err||JSON.stringify(R.walk.map(a=>[a[0],a[3]])));
  ok('the bed through the open door is their own bed: a futon, a canopied lacquer bed, a takht, a charpai, lion legs, a box bed', !R.err && R.bedVsRome.every(([c,d])=>d>60), R.err||JSON.stringify(R.bedVsRome));
  ok('and they are cheap to draw: what never moves is painted once and cached (and the cache stays small)', !R.err && R.avgMs<8 && R.cache2<=80, R.err||(R.avgMs.toFixed(2)+'ms, cache '+R.cache2));

  console.log('\n=== 🛠 YOUR FIXES: THE SEAT, THE BEND, THE FINISH, THE INTRO, THE KANVEK ===');
  const HOUSE=(fem, traits)=>{ const S=window.__SS; S.newDemo('Marcus','Italia','Roman'); const G=S.G; G.coin=99999; G.isFemale=!!fem; G.married=true; G.hygiene=90; G.day=40; G.lastLoveDay=39;
    const sp=S.makeBride('roman',false,9,{male:!!fem}); sp.male=!!fem; sp.quirks=[]; sp.flaws=[]; sp.traits=traits||[]; sp._sexFixed=true; sp.body=Object.assign(sp.body||{},{booty:9,bust:8,legs:7,secret:8}); G.wife=sp; G.wifeRel=85; G.wifePhys=60;
    G.body=G.body||{}; G.body.secret=8; G.skin='#e0b894'; try{ S.syncPlayerLooks(); }catch(e){} return G; };
  await pg.evaluate((src)=>{ window.__HOUSE=eval(src); }, '('+HOUSE.toString()+')');
  R=await T(()=>{ const S=window.__SS, out={};
    let G=__HOUSE(false,['gr_seat']); S.ensureLook(G.wife); out.wifeNowFront=G.wife.traits.includes('gr_front') && !G.wife.traits.includes('gr_seat');
    G.wife.traits=['gr_seat']; const K=S.gazeKindsOf(G.wife); out.kinds=K;
    S.openDomus(); const D=S.DM; D.x=D.wifeX-40; D.face=-1; D.t=99999; D.lastGazeT=-99999;                 // your back to her
    let fired=0; for(let i=0;i<400;i++){ if(S.gazeDue()) fired++; } out.backFired=fired;
    D.face=1; S.startGaze(); out.facingKind=D.gaze&&D.gaze.kind;
    G=__HOUSE(true,['gr_seat']); S.openDomus(); const D2=S.DM; D2.x=D2.wifeX+40; D2.face=1; S.startGaze(); out.husbandKind=D2.gaze&&D2.gaze.kind;
    out.traitMale=!!S.WIFE_TRAITS.find(t=>t.id==='gr_seat').male; return out; });
  ok('🍑 a wife never looks at your seat: Seat-Struck is a husband\u2019s, a wife who had it is Front-Struck, and with your back to her she does not look', !R.err && R.wifeNowFront && !R.kinds.seat && R.kinds.front && R.backFired===0 && R.facingKind==='front' && R.traitMale, R.err||JSON.stringify(R));
  ok('…while a Seat-Struck husband, playing the wife, still looks at yours', !R.err && R.husbandKind==='seat', R.err||R.husbandKind);
  R=await T(()=>{ const S=window.__SS; __HOUSE(false,[]); S.openDomus(); const D=S.DM; D.x=D.wifeX-30; D.face=1; S.startVillaLove(D.wifeX,false,true); const sc=D.scene;
    const at=(t)=>{ sc.t=t; S.drawDomus(); const R2=S.PAIR_LAST.R; return {join:R2.join, seat:R2.seat, rs:R2.rs, root:R2.hisRoot, tip:R2.hisTip}; };
    let back=null, deep=null, maxGap=0, minGap=99;
    for(let t=262;t<330;t++){ const f=at(t), g=Math.hypot(f.root[0]-f.join[0], f.root[1]-f.join[1]); if(g>maxGap){ maxGap=g; back=f; } if(g<minGap){ minGap=g; deep=f; } }
    const inSeat=Math.hypot(back.join[0]-back.seat[0], back.join[1]-back.seat[1])/back.rs;
    return {inSeat, maxGap, minGap, belowSeat: back.join[1] > back.seat[1]}; });
  ok('🍑 in the bend he goes in where she opens — the notch under her seat, on her outline, not the middle of it', !R.err && R.inSeat>0.85 && R.belowSeat, R.err||JSON.stringify(R));
  ok('…and the stroke shows: a length of him out between them at the back of it, all of him in at the bottom', !R.err && R.maxGap>3.5 && R.minGap<1.6, R.err||JSON.stringify(R));
  R=await T(()=>{ const S=window.__SS, out={};
    const run=(mode)=>{ __HOUSE(false,[]); S.openDomus(); const D=S.DM; D.x=D.wifeX-30; D.face=1; S.startVillaLove(D.wifeX,false,true); const sc=D.scene;
      for(let i=0;i<660;i++){ sc.t+=1; S.updateVillaLove(1); } S.drawDomus(); const asked=sc.asked, acts=S.sceneActions().map(a=>a.t).join('|');
      S.villaLoveFinish(mode); let k=0; while(D.scene && sc.t-sc.chooseT<200 && k++<400){ sc.t+=1; S.updateVillaLove(1); S.drawDomus(); }
      const F=sc.fx; return {asked, acts, fx:!!F, splats:F? F.splats.length : 0, pulses:F? F.pulse|0 : 0, drips:F? F.drips.filter(d=>d.len>0.5).length : 0, burst:(sc.burst||[]).length}; };
    out.love=run('love'); out.heir=run('heir'); return out; });
  ok('💞 FOR LOVE: he is out, and it lands on her in ropes — and it stays there (no square pixels)', !R.err && R.love.fx && R.love.splats>=10 && R.love.burst===0, R.err||JSON.stringify(R.love));
  ok('🌾 FOR AN HEIR: held, in four pulses at the join, and a little of it follows him down her thigh after', !R.err && R.heir.fx && R.heir.pulses>=4 && R.heir.drips>=1 && R.heir.splats===0, R.err||JSON.stringify(R.heir));
  ok('the ask is two cards, and two buttons on touch', !R.err && R.love.asked && /FOR LOVE/.test(R.love.acts) && /FOR AN HEIR/.test(R.love.acts), R.err||R.love.acts);
  R=await T(()=>{ const S=window.__SS; const G=__HOUSE(false,['esc_big']); G.traits=['esc_big']; S.openDomus(); const D=S.DM; D.x=D.wifeX-30; D.face=1; S.startEscalation('big','self',D.wifeX); const sc=D.scene;
    let k=0; while(D.scene && !sc.asked && k++<9000){ sc.t+=1; S.updateEscalate(1); } S.drawDomus(); S.escFinish('love');
    k=0; while(D.scene && sc.t-sc.chooseT<120 && k++<400){ sc.t+=1; S.updateEscalate(1); S.drawDomus(); } return {fx:!!sc.fx, splats:sc.fx? sc.fx.splats.length : 0}; });
  ok('and the escalations finish the same way', !R.err && R.fx && R.splats>=6, R.err||JSON.stringify(R));
  R=await T(()=>{ const S=window.__SS, out={}; const g=document.getElementById('game').getContext('2d');
    const shot=(mode, wa)=>{ const G=__HOUSE(false,[]); if(wa) G.current=Object.keys(S.REGION_WA_BY_ID)[3]; S.setWH(null); S.startBedScene(mode,'long','bed'); const W0=S.WH; W0.t=40;
      const d0=S.CH_DRAWS; S.drawWifeHappy(); return {c:__crop(0,0,480,270), room:S.CH_DRAWS-d0, dur:S.WH_DUR}; };
    const a=shot('heir',true), b=shot('fun',true); out.room=a.room; out.dur=a.dur; out.diff=__diff(a.c,b.c); out.colors=__colors(a.c); return out; });
  ok('💞 SHE LIGHTS UP: her own room behind her, a lit portrait, and the night named — an heir and a night for love look different', !R.err && R.room>=1 && R.diff>200 && R.colors>300 && R.dur>=100, R.err||JSON.stringify(R));
  R=await T(()=>{ const S=window.__SS; S.newDemo('Kaiq','Leokanis','RkTorvak'); const G=S.G; G.married=true; G.coin=9999; G.hygiene=90; G.day=40; G.lastLoveDay=39; G.body=G.body||{}; G.body.secret=8;
    const w=S.makeBride('rkrai',true,8); w.male=false; w.eth='rkrai'; w.traits=['kanvek']; w._sexFixed=true; G.wife=w; G.wifeRel=80; S.setWH('done');
    S.openDomus(); S.startRkReward(); const D=S.DM; D.reward.ph='go'; D.reward.t=97; S.updateRkReward(0);
    let i=0, zMax=0, len=0; while(S.BC && S.BC.t<700 && i++<3000){ S.updateBed(1); S.drawBed(); zMax=Math.max(zMax, S.BC? S.BC.camZ||0 : 0); const L=S.BEDPOSE_LAST; if(L && L.vi===22 && L.him && L.him.root && L.her && L.her.mouth) len=Math.max(len, Math.hypot(L.him.root[0]-L.her.mouth[0], L.him.root[1]-L.her.mouth[1])); }
    return {zMax, len, kan:!!(S.BC&&S.BC.kanvekOnly)}; });
  ok('✧ THE KANVEK is not a small picture in a box: the camera comes in close on her and him', !R.err && R.zMax>2.3, R.err||JSON.stringify(R));
  ok('…and you can see him going into her mouth: a length of him between his root and her lips', !R.err && R.len>2, R.err||JSON.stringify(R));

  console.log('\n=== 🚪 AND THE REST ===');
  R=await T(()=>window.__SS.BUILD_STAMP);
  ok('the build says V49', typeof R==='string' && /V49/.test(R), String(R));
  ok('no page errors anywhere', errs.length===0, errs.slice(0,3).join(' | '));
  console.log('\n'+(fail? fail+' FAILED, ' : 'ALL GREEN   ')+'('+pass+' checks)');
  await br.close(); process.exit(fail?1:0);
})();
