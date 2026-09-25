/* 🗣 V43 — THE NAMES, NEAR HER, AND THEIR LITTLE PICTURES
   ---------------------------------------------------------------------
   From the round that asked:
     · "why does THE BOOTY DESTROYER and the names appear every time I walk —
        fix it, maybe near the wife";
     · "add custom animated emojis for the booty destroyer and the other
        names — a length going into a booty";
     · "expand this idea, add 1–2 ideas of your own".
   Run against the build before with FILE=…: it fails there.               */
const {chromium}=require('playwright');
const FILE=process.env.FILE || ('file://'+require('path').resolve(__dirname,'..','index.html'));
let pass=0, fail=0;
const ok=(name,cond,note)=>{ if(cond){pass++; console.log('  PASS  '+name+(note?'   '+note:''));}
                             else {fail++; console.log('  FAIL  '+name+(note?'   '+note:''));} };
(async()=>{
  const br=await chromium.launch();
  const pg=await br.newPage({viewport:{width:1366,height:768}});
  const errs=[]; pg.on('pageerror',e=>errs.push(''+e));
  await pg.goto(FILE);
  await pg.evaluate(()=>{ localStorage.clear(); localStorage.setItem('SANDSTEEL_ADULT','1'); });
  await pg.reload(); await pg.waitForTimeout(500);
  const T=async(fn,arg)=>{ try{ return await pg.evaluate(fn,arg); }catch(e){ return {err:String(e).slice(0,200)}; } };
  /* a married man with a villa, standing in his hall; `fem` makes it her hall and him the husband */
  const SETUP=`(function(fem, secret, booty){ const S=window.__SS;
    S.newDemo(fem?'Livia':'Marcus','Italia','Roman'); const G=S.G; G.married=true; G.isFemale=!!fem; G.hasVilla=true; G.day=40;
    G.body=G.body||{}; G.body.secret=secret||8;
    const w=S.makeBride('roman',true,8,fem? {male:true} : undefined); w.male=!!fem; w.traits=[]; w.flaws=[]; w.quirks=[];
    w.body=w.body||{}; if(fem) w.body.secret=secret||8; else w.body.booty=booty||9;
    G.wife=w; G.wifeRel=80; G.wifePhys=70; S.openDomus(); return S.DM; })`;
  const frames=`(function(n){ const S=window.__SS; for(let i=0;i<n;i++){ S.DM.t++; S.drawDomus(); } })`;

  console.log('\n=== 🚪 NOT EVERY TIME YOU WALK IN ===');
  let R=await T(([SETUP,frames])=>{ const S=window.__SS; const setup=eval(SETUP), run=eval(frames);
    const D=setup(false); const startGap=Math.abs(D.x-D.wifeX);
    run(40); const atDoor=D.titleA||0, quip0=!!D.walkQuip;
    D.x=D.wifeX-44; run(30); const near=D.titleA, dbg=Object.assign({}, D._titleDbg);
    D.x=D.wifeX-150; run(30); const away=D.titleA;
    return {startGap, atDoor, quip0, near, away, mine:dbg.mine, sp:dbg.sp, name:S.villageName()&&S.villageName().name}; }, [SETUP,frames]);
  ok('walking into the hall, far from her, no name comes up any more', !R.err && R.startGap>58 && R.atDoor===0 && !R.quip0, R.err||JSON.stringify(R));
  ok('walk over to her and your name fades in over you, hers over her', !R.err && R.near>0.9 && !!R.mine && !!R.sp, R.err||JSON.stringify(R));
  ok('and walk off again and it fades back out', !R.err && R.away===0, R.err||JSON.stringify(R));

  R=await T(([SETUP,frames])=>{ const S=window.__SS; const setup=eval(SETUP), run=eval(frames);
    const D=setup(false); D.x=D.wifeX-44; run(30); const a0=D.titleA;
    D.scene={kind:'test'}; for(let i=0;i<30;i++) S.drawHallTitles(214); const inScene=D.titleA; D.scene=null;
    const old=S.ADULT; return {a0, inScene}; }, [SETUP,frames]);
  ok('something already happening in the hall and the names get out of the way', !R.err && R.a0>0.9 && R.inScene===0, R.err||JSON.stringify(R));

  console.log('\n=== 💬 SHE SAYS IT, ONCE A VISIT ===');
  R=await T(([SETUP,frames])=>{ const S=window.__SS; const setup=eval(SETUP), run=eval(frames);
    let D=setup(false); const N=S.villageName();
    D.x=D.wifeX-44; run(30); const line=D.walkQuip&&D.walkQuip.line; D.walkQuip=null;
    D.x=D.wifeX-150; run(20); D.x=D.wifeX-44; run(30); const again=!!D.walkQuip;
    S.domusExit && 0; D=setup(false); D.x=D.wifeX-44; run(30); const nextVisit=!!D.walkQuip;
    return {line, name:N&&N.name, again, nextVisit}; }, [SETUP,frames]);
  ok('the first time you come near, she says your name out loud', !R.err && !!R.line && R.line.includes(R.name), R.err||JSON.stringify(R));
  ok('not every time — once a visit, and again the next visit', !R.err && R.again===false && R.nextVisit===true, R.err||JSON.stringify(R));

  console.log('\n=== 🏠 AND STANDING TOGETHER, THE HOUSE ===');
  R=await T(([SETUP,frames])=>{ const S=window.__SS; const setup=eval(SETUP), run=eval(frames);
    const D=setup(false); S.G.wifePhys=90; D.x=D.wifeX-44; run(60); const farHouse=D._titleDbg.house;
    D.x=D.wifeX-20; run(80); const dbg=D._titleDbg; const H=S.villageHouseName();
    return {farHouse, house:dbg.house, want:H&&H.id, clash:dbg.L.clash, r1y:dbg.L.r1.y, r2y:dbg.L.r2.y, x1:dbg.L.r1.x, x2:dbg.L.r2.x, w1:dbg.L.r1.w, w2:dbg.L.r2.w, s1:dbg.L.r1.side, s2:dbg.L.r2.side, hy:dbg.L.house&&dbg.L.house.y}; }, [SETUP,frames]);
  ok('a little apart there is no house name; right next to each other it comes up between you', !R.err && !R.farHouse && !!R.house && R.house===R.want, R.err||JSON.stringify(R));
  ok('and the names part at the midpoint instead of printing over each other, pictures on the outer sides', !R.err && R.clash && R.r1y===R.r2y && R.x1+R.w1/2<=R.x2-R.w2/2 && R.s1===-R.s2 && R.hy<R.r1y, R.err||JSON.stringify(R));
  R=await T(()=>{ const S=window.__SS; const N={id:'destroyer',name:'THE BOOTY DESTROYER'}, M={id:'queen',name:'THE BOOTY QUEEN'};
    const a=S.hallTitleLayout(200,300,N,M,false,false), b=S.hallTitleLayout(200,214,N,M,true,true);
    const e=S.hallTitleLayout(470,478,N,M,false,false);
    return {apart:a.r1.y===a.r2.y && !a.clash && a.r1.x===200 && a.r2.x===300, lifted:b.r1.y<a.r1.y, charmClear:b.r1.y<=214-112,
      onScreen:e.r1.x-e.r1.w/2-22>=0 && e.r2.x+e.r2.w/2+22<=480}; });
  ok('far enough apart each sits over its owner; with the ardor charm up the row clears it; nothing runs off the edge', !R.err && R.apart && R.lifted && R.charmClear && R.onScreen, R.err||JSON.stringify(R));

  console.log('\n=== 🍑 THE LITTLE PICTURES ===');
  R=await T(()=>{ const S=window.__SS; const cv=document.getElementById('game'), c=cv.getContext('2d'); const out={missing:[], blank:[], still:[], errs:[]};
    const all=[]; for(const cult of ['rome','rk']){ S.VILLAGE_NAMES[cult].forEach(n=>all.push(n)); S.VILLAGE_NAMES_F[cult].forEach(n=>all.push(n)); }
    const plain=new Set(['common','plain','matron','hand']);
    all.forEach(n=>{ if(!plain.has(n.id) && !S.titleEmojiKind(n)) out.missing.push(n.id); });
    const kinds=[...new Set(Object.values(S.TITLE_EMOJI).concat(['twohearts']))];
    const snap=()=>{ const d=c.getImageData(200,100,40,40).data; let h=0, n=0; for(let i=0;i<d.length;i+=4){ if(d[i+3]>0){ n++; h=(h*31 + d[i]*3 + d[i+1]*7 + d[i+2] + i)%1000000007; } } return {h,n}; };
    for(const k of kinds){ try{
      c.setTransform(1,0,0,1,0,0); c.clearRect(0,0,480,270); S.drawTitleEmoji(k,220,120,0,false); const a=snap();
      let moved=false; for(const t of [5,11,17,23,37,53]){ c.clearRect(0,0,480,270); S.drawTitleEmoji(k,220,120,t,false); if(snap().h!==a.h){ moved=true; break; } }
      if(a.n<6) out.blank.push(k); if(!moved) out.still.push(k); }catch(e){ out.errs.push(k+': '+e.message); } }
    out.kinds=kinds.length; out.destroyer=S.titleEmojiKind({id:'destroyer'}); out.queen=S.titleEmojiKind({id:'queen'}); out.houseD=S.titleEmojiKind({id:'destroyed'},true);
    out.houseVenus=S.titleEmojiKind({id:'venus'},true); out.herVenus=S.titleEmojiKind({id:'venus'});
    return out; });
  ok('every name but the plain ones has its own picture', !R.err && R.missing.length===0, R.err||JSON.stringify(R.missing));
  ok('the Booty Destroyer is the length going in, the Queen a crowned peach, the house the Destroyer’s too', !R.err && R.destroyer==='destroyer' && R.queen==='crownpeach' && R.houseD==='destroyer' && R.houseVenus==='twohearts' && R.herVenus==='shell', R.err||JSON.stringify(R));
  ok('all '+(R.kinds||'')+' pictures draw, and every one of them moves', !R.err && R.blank.length===0 && R.still.length===0 && R.errs.length===0, R.err||JSON.stringify([R.blank,R.still,R.errs]));

  console.log('\n=== 🙋 HER HALL, AND THE GATE ===');
  R=await T(([SETUP,frames])=>{ const S=window.__SS; const setup=eval(SETUP), run=eval(frames);
    const D=setup(true, 9); D.x=D.wifeX-44; run(30); const dbg=Object.assign({},D._titleDbg);
    const mine=S.villageNameF(), his=S.villageName(S.G.wife);
    return {a:D.titleA, mine:dbg.mine, sp:dbg.sp, wantMine:mine&&mine.id, wantHis:his&&his.id, line:D.walkQuip&&D.walkQuip.line}; }, [SETUP,frames]);
  ok('in her own hall it is her name over her, his over the husband, and he says hers', !R.err && R.a>0.9 && R.mine===R.wantMine && R.sp===R.wantHis && !!R.line, R.err||JSON.stringify(R));
  await pg.evaluate(()=>{ localStorage.setItem('SANDSTEEL_ADULT','0'); });
  await pg.reload(); await pg.waitForTimeout(400);
  R=await T(([SETUP,frames])=>{ const S=window.__SS; const setup=eval(SETUP), run=eval(frames);
    const D=setup(false); D.x=D.wifeX-20; run(80); return {a:D.titleA||0, quip:!!D.walkQuip, n:S.villageName()}; }, [SETUP,frames]);
  ok('with the adult content off there are no names, no pictures and no tease', !R.err && R.a===0 && !R.quip && !R.n, R.err||JSON.stringify(R));

  ok('no page errors anywhere', errs.length===0, errs.slice(0,3).join(' | '));
  await br.close();
  console.log(fail? `\n${fail} FAILED, ${pass} passed` : `\nALL GREEN   (${pass} checks)`);
  process.exit(fail?1:0);
})();
