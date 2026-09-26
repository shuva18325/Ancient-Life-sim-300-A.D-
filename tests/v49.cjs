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

  console.log('\n=== 🚪 AND THE REST ===');
  R=await T(()=>window.__SS.BUILD_STAMP);
  ok('the build says V49', typeof R==='string' && /V49/.test(R), String(R));
  ok('no page errors anywhere', errs.length===0, errs.slice(0,3).join(' | '));
  console.log('\n'+(fail? fail+' FAILED, ' : 'ALL GREEN   ')+'('+pass+' checks)');
  await br.close(); process.exit(fail?1:0);
})();
