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

  console.log('\n=== 🚪 AND THE REST ===');
  R=await T(()=>window.__SS.BUILD_STAMP);
  ok('the build says V49', typeof R==='string' && /V49/.test(R), String(R));
  ok('no page errors anywhere', errs.length===0, errs.slice(0,3).join(' | '));
  console.log('\n'+(fail? fail+' FAILED, ' : 'ALL GREEN   ')+'('+pass+' checks)');
  await br.close(); process.exit(fail?1:0);
})();
