/* ✦ V39 — THE CLOTHES COME OFF, SHE SHOWS, AND THE HUB IS A ROOM
   ---------------------------------------------------------------------
   From the round after V38:
     · "do 3" — undressing on the new bodies before the first position:
       his tunic up over his head (the coast's kilt down), her stola
       sliding down her and pooling, the ulvik's bodice first;
     · "do 5" — her pregnancy on the new body, month by month;
     · "show me the breeding hub graphics, make them GOOD" — the hub and
       the breeding house drawn as real rooms, and the quay outside.
   Run against the build before with FILE=…: it fails there.               */
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
  const T=async(fn,arg)=>{ try{ return await pg.evaluate(fn,arg); }catch(e){ return {err:String(e).slice(0,180)}; } };
  const SETUP=(world)=>{ const S=window.__SS; S.newDemo('Kaiq','Leokanis','RkTorvak'); const G=S.G;
    G.world=world; G.rkRank='harra'; G.coin=99999; G.isFemale=false; G.married=true; G.hygiene=90; G.day=400; G.hasVilla=true;
    const sp=S.makeBride(world==='rk'?'rkrai':'roman',false,9,{male:true}); sp.male=false; sp.eth=world==='rk'?'rkrai':'roman';
    sp.name='Ulva Raun'; sp.quirks=[]; sp.flaws=[]; sp.traits=['vakran']; sp.dress=world==='rk'? '#c8a86a' : '#8a2f5a';
    sp.body=Object.assign(sp.body||{},{booty:9,bust:8,waist:8,legs:7,face:8}); G.wife=sp; G.wifeRel=85; G.pregnant=null;
    G.body=G.body||{}; G.body.secret=8; return G; };
  const src='('+SETUP.toString()+')';

  console.log('\n=== ✦ THE CLOTHES COME OFF, ON THE NEW BODIES ===');
  let R=await T((src)=>{ const S=window.__SS; const G=eval(src)('rome'); const got={};
    for(const ut of [10,110,200,250]){ S.setWH('done'); S.startBedScene('fun','long','bed'); S.setBCT(520+ut); S.drawBed();
      const L=S.BEDPOSE_LAST; got[ut]={kind:L&&L.kind, u:S.BC.undressU? [S.BC.undressU.him, S.BC.undressU.her] : null, name:S.BC.poseName}; }
    return got; }, src);
  ok('the bedchamber opens on the two of them undressing, before any position', !R.err && R[10].kind==='undress' && R[110].kind==='undress', R.err||JSON.stringify(R[10]));
  ok('dressed at the start; by the end his tunic is off and her gown is down', !R.err && !!R[10].u && !!R[200].u && R[10].u[0]<0.05 && R[10].u[1]<0.05 && R[200].u[0]>0.99 && R[200].u[1]>0.99, R.err||JSON.stringify([R[10].u,R[200].u]));
  ok('and then the running order starts', !R.err && R[250].kind!=='undress', R.err||R[250].kind);
  R=await T((src)=>{ const S=window.__SS; const G=eval(src)('rk'); G.wife.traits.push('kanvek');
    S.setWH('done'); S.setMediumCensor(true); const KV=S.startRkReward; S.startBedScene('fun','quick','bed'); S.BC.kanvekOnly=true; S.setBCT(560); S.drawBed(); return {kind:S.BEDPOSE_LAST&&S.BEDPOSE_LAST.kind}; }, src);
  ok('her gift is its own thing — the Kanvek does not open with the undress', !R.err && R.kind==='kneel', R.err||R.kind);

  R=await T((src)=>{ const S=window.__SS; const G=eval(src)('rome'); const w=G.wife;
    const cv=document.createElement('canvas'); cv.width=100; cv.height=90; const c=cv.getContext('2d');
    const shot=(F)=>{ c.clearRect(0,0,100,90); S.drawFemFig(c,c,Object.assign({look:w, hip:[50,51], floor:84, ankles:{near:[49,82], far:[52,81.4]}},F)); return c.getImageData(0,0,100,90).data; };
    const dif=(A,B)=>{ let n=0; for(let i=0;i<A.length;i+=4) if(Math.abs(A[i]-B[i])+Math.abs(A[i+1]-B[i+1])+Math.abs(A[i+2]-B[i+2])+Math.abs(A[i+3]-B[i+3])>40) n++; return n; };
    const bare=shot({}), dressed=shot({dress:{col:'#8a2f5a', cut:'stola', u:0}}), half=shot({dress:{col:'#8a2f5a', cut:'stola', u:0.55}}), off=shot({dress:{col:'#8a2f5a', cut:'stola', u:1}});
    const ulv=shot({dress:{col:'#c8a86a', cut:'ulvik', u:0}}), ulvOff=shot({dress:{col:'#c8a86a', cut:'ulvik', u:1}});
    // how much of the gown is on the floor at the end: pixels near her feet that are the gown's colour
    const pink=(d)=>{ let n=0; for(let y=78;y<88;y++) for(let x=30;x<70;x++){ const i=(y*100+x)*4; if(d[i+3]>100 && d[i]>100 && d[i+2]>60 && d[i+1]<90) n++; } return n; };
    return {dressed:dif(bare,dressed), half:dif(dressed,half), offVsBare:dif(bare,off), pool:pink(off), ulv:dif(bare,ulv), ulvOff:dif(bare,ulvOff)}; }, src);
  ok('her stola is a real garment on the new body', !R.err && R.dressed>500, R.err||(R.dressed+' px'));
  ok('half off, it is a different picture — it slides down her', !R.err && R.half>300, R.err||(R.half+' px'));
  ok('and off, she is bare with it pooled at her feet', !R.err && R.offVsBare<500 && R.pool>15, R.err||(R.offVsBare+' px from bare · '+R.pool+' px of it at her feet'));
  ok('the coast dresses her in the ulvik, and it comes off too', !R.err && R.ulv>200 && R.ulvOff<R.ulv*0.6, R.err||(R.ulv+' → '+R.ulvOff));

  console.log('\n=== ❦ SHE SHOWS, MONTH BY MONTH ===');
  R=await T((src)=>{ const S=window.__SS; const G=eval(src)('rome'); const w=G.wife;
    const c=document.createElement('canvas').getContext('2d');
    const dry=(extra)=>S.drawFemFig(c,c,Object.assign({look:w, hip:[50,51], floor:84, dry:true},extra||{}));
    const none=dry(); G.pregnant={due:G.day+27-3*4}; const m4=dry(); G.pregnant={due:G.day}; const m9=dry();
    const bellies=[0,2,4,6,9].map(m=>dry({preg:m}).belly);
    const cv=document.createElement('canvas'); cv.width=100; cv.height=90; const cx=cv.getContext('2d');
    const shot=(F)=>{ cx.clearRect(0,0,100,90); S.drawFemFig(cx,cx,Object.assign({look:w, hip:[50,51], floor:84, ankles:{near:[49,82], far:[52,81.4]}},F)); return cx.getImageData(0,0,100,90).data; };
    const dif=(A,B)=>{ let n=0; for(let i=0;i<A.length;i+=4) if(Math.abs(A[i+3]-B[i+3])>60) n++; return n; };
    const p0=shot({preg:0}), p9=shot({preg:9});
    // the bend in the villa too
    const bc=document.createElement('canvas'); bc.width=140; bc.height=110; const bx=bc.getContext('2d');
    const bend=()=>{ bx.clearRect(0,0,140,110); S.drawWifeFig(bx,70,104,w,1,'bend'); return bx.getImageData(0,0,140,110).data; };
    G.pregnant=null; const b0=bend(); G.pregnant={due:G.day+1}; const b9=bend(); G.pregnant=null;
    return {none:none.belly, m4:m4.preg, m9:m9.preg, bellyAuto:m9.belly, bellies, drawn:dif(p0,p9), bend:dif(b0,b9)}; }, src);
  ok('not pregnant, no belly; pregnant, it is her month', !R.err && R.none===0 && R.m4>=3 && R.m9===9, R.err||JSON.stringify(R));
  ok('it grows every month', !R.err && Array.isArray(R.bellies) && R.bellies.every((b,i)=>i===0 || b>R.bellies[i-1]) && R.bellies[4]>8, R.err||(R.bellies||[]).map(b=>(+b||0).toFixed(1)).join(' → '));
  ok('and you can see it on her: month nine is a different silhouette from month nought', !R.err && R.drawn>40, R.err||(R.drawn+' px'));
  ok('bent over in the villa it shows too', !R.err && R.bend>25, R.err||(R.bend+' px'));

  console.log('\n=== ◆ THE HUB IS A ROOM, AND SO IS THE QUAY ===');
  R=await T((src)=>{ const S=window.__SS; const G=eval(src)('rk'); G.rkHub=true;
    const g=document.getElementById('game'), px=()=>g.getContext('2d').getImageData(0,0,480,270).data;
    const parts={}, B=S.BRD_DRAWS, b0={...B};
    S.setWH('done'); S.startBedScene('heir','night','breed'); S.setBCT(40); S.drawBed(); parts.b40=S.BC.scenePart; const out=px();
    S.setBCT(260); S.drawBed(); parts.b260=S.BC.scenePart; const hallU=px();
    S.setBCT(560); S.drawBed(); parts.b560=S.BC.scenePart;
    S.setWH('done'); S.startBedScene('heir','night','hub'); S.setBCT(40); S.drawBed(); parts.h40=S.BC.scenePart; const hubU=px();
    S.setBCT(400); S.drawBed(); parts.h400=S.BC.scenePart;
    const dif=(A,Bb)=>{ let n=0; for(let i=0;i<A.length;i+=4) if(Math.abs(A[i]-Bb[i])+Math.abs(A[i+1]-Bb[i+1])+Math.abs(A[i+2]-Bb[i+2])>40) n++; return n; };
    // the quay at night is BLUE at the top; the hub is warm cedar
    let blue=0, warm=0; for(let x=0;x<480;x+=4){ const i=(10*480+x)*4; if(out[i+2]>out[i]) blue++; const j=(120*480+x)*4; if(hubU[j]>hubU[j+2]+20) warm++; }
    return {parts, outVsHall:dif(out,hallU), hallVsHub:dif(hallU,hubU), blue, warm, outDraws:B.out-b0.out, hubDraws:B.hub-b0.hub, hallDraws:B.hall-b0.hall}; }, src);
  ok('the breeding house starts outside on the quay, then the clothes, then the tub', !R.err && R.parts && R.parts.b40==='outside' && R.parts.b260==='undress' && R.parts.b560==='tub', R.err||JSON.stringify(R.parts));
  ok('the hub is in the house: no quay, straight to the clothes, then the tub', !R.err && R.parts && R.parts.h40==='undress' && R.parts.h400==='tub', R.err||JSON.stringify(R.parts));
  ok('outside is a night sky over the water', !R.err && R.blue>100, R.err||(R.blue+'/120 blue'));
  ok('the hub is warm cedar, lamp-lit', !R.err && R.warm>60, R.err||(R.warm+'/120 warm'));
  ok('three different rooms: the quay, the hall and the hub', !R.err && R.outVsHall>40000 && R.hallVsHub>30000 && R.outDraws>0 && R.hubDraws>0 && R.hallDraws>0, R.err||JSON.stringify(R));

  console.log('\n--- PAGE ERRORS ---');
  ok('none', errs.length===0, errs.slice(0,3).join(' | '));
  console.log('\n'+(fail? '✗ '+fail+' FAILED' : 'ALL GREEN')+'   ('+(pass+fail)+' checks)');
  await br.close();
  process.exit(fail?1:0);
})();
