/* 🗣 V43–V44 — THE NAMES, NEAR HER, AND THEIR LITTLE PICTURES — ALL OF THEM
   ---------------------------------------------------------------------
   From the round that asked:
     · "why does THE BOOTY DESTROYER and the names appear every time I walk —
        fix it, maybe near the wife";
     · "add custom animated emojis for the booty destroyer and the other
        names — a length going into a booty";
     · "expand this idea, add 1–2 ideas of your own";
     · and then: "do ALL animated".
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

  console.log('\n=== 🍑 THE LITTLE PICTURES — ALL OF THEM ===');
  R=await T(()=>{ const S=window.__SS; const cv=document.getElementById('game'), c=cv.getContext('2d'); const out={missing:[], blank:[], still:[], errs:[]};
    const all=[]; for(const cult of ['rome','rk']){ S.VILLAGE_NAMES[cult].forEach(n=>all.push([Object.assign({cult},n),false])); S.VILLAGE_NAMES_F[cult].forEach(n=>all.push([Object.assign({cult},n),false]));
      S.VILLAGE_HOUSE[cult].forEach(n=>all.push([Object.assign({cult},n),true])); }
    const got=all.map(([n,h])=>S.titleEmojiKind(n,h));
    all.forEach(([n,h],i)=>{ if(!got[i]) out.missing.push(n.cult+':'+n.id+(h?' (house)':'')); });
    out.names=all.length; out.unique=new Set(got.filter(Boolean)).size;
    const kinds=[...new Set(Object.values(S.TITLE_EMOJI).concat(Object.values(S.TITLE_EMOJI_HOUSE)))];
    const snap=()=>{ const d=c.getImageData(200,100,40,40).data; let h=0, n=0, amax=0; for(let i=0;i<d.length;i+=4){ if(d[i+3]>0){ n++; amax=Math.max(amax,d[i+3]); h=(h*31 + d[i]*3 + d[i+1]*7 + d[i+2] + i)%1000000007; } } return {h,n,amax}; };
    for(const k of kinds){ try{
      c.setTransform(1,0,0,1,0,0); c.globalAlpha=1; c.clearRect(0,0,480,270); S.drawTitleEmoji(k,220,120,0); const a0=snap();
      let moved=false; for(const t of [5,11,17,23,37,53,90,150]){ c.clearRect(0,0,480,270); S.drawTitleEmoji(k,220,120,t); if(snap().h!==a0.h){ moved=true; break; } }
      if(a0.n<6) out.blank.push(k); if(!moved) out.still.push(k); }catch(e){ out.errs.push(k+': '+e.message); } }
    /* and a fading name fades its picture with it — the old pictures reset the alpha half-way through */
    out.fadeMax=0; for(const k of ['hearts','steam','notes','seals','quiet','destroyer','racks']){ c.clearRect(0,0,480,270); c.globalAlpha=1; S.drawTitleEmojiFaded(k,220,120,7,0.3); out.fadeMax=Math.max(out.fadeMax, snap().amax); }
    c.globalAlpha=0.3; S.drawTitleEmoji('hearts',220,120,7); out.alphaAfter=c.globalAlpha; c.globalAlpha=1;
    const K=(cult,id,h)=>S.titleEmojiKind({cult,id},h);
    out.pick={ destroyer:K('rk','destroyer'), destroyer2:K('rk','destroyer2'), queen:K('rk','queen'), satRome:K('rome','satisfier'), satRk:K('rk','satisfier'),
      common:K('rome','common'), plain:K('rk','plain'), matron:K('rome','matron'), hand:K('rk','hand'), destroyed:K('rk','destroyed',true), venusHouse:K('rome','venus',true), venusHer:K('rome','venus') };
    out.kinds=kinds.length; return out; });
  ok('every name — his, hers and the house’s, in Rome and on the coast, the plain ones too — has its own picture, no two alike', !R.err && R.missing.length===0 && R.names===43 && R.unique===43, R.err||JSON.stringify([R.missing,R.names,R.unique]));
  ok('the Destroyer is the length going in and the one measured twice harder still; the Queen a crowned peach; the Satisfier a heart in Rome, a stamp on the coast',
    !R.err && R.pick.destroyer==='destroyer' && R.pick.destroyer2==='obliterate' && R.pick.queen==='crownpeach' && R.pick.satRome==='hearts' && R.pick.satRk==='stamp' && R.pick.destroyed==='destroyed' && R.pick.venusHouse==='twohearts' && R.pick.venusHer==='shell', R.err||JSON.stringify(R.pick));
  ok('and the plain names move too: the village still thinking, a gull on the post, the matron’s distaff, a hand waving from the shore',
    !R.err && R.pick.common==='mull' && R.pick.plain==='gullpost' && R.pick.matron==='distaff' && R.pick.hand==='wave', R.err||JSON.stringify(R.pick));
  ok('all '+(R.kinds||'')+' pictures draw, and every one of them moves', !R.err && R.kinds===43 && R.blank.length===0 && R.still.length===0 && R.errs.length===0, R.err||JSON.stringify([R.blank,R.still,R.errs]));
  ok('a fading name fades its picture evenly, all in one piece, and the alpha is handed back as it was', !R.err && R.fadeMax>0 && R.fadeMax<=0.3*255+2 && Math.abs(R.alphaAfter-0.3)<1e-6, R.err||JSON.stringify([R.fadeMax,R.alphaAfter]));

  console.log('\n=== 🖼 ON EVERY PAGE THE NAME IS WRITTEN ===');
  R=await T(async ([SETUP])=>{ const S=window.__SS; const setup=eval(SETUP); setup(false, 10); S.G.wifePhys=90;
    S.openVillageTalk(); const b=document.getElementById('villa-body');
    const cs=[...b.querySelectorAll('canvas.temoji')];
    const hash=(c)=>{ const d=c.getContext('2d').getImageData(0,0,c.width,c.height).data; let h=0; for(let i=0;i<d.length;i+=4) if(d[i+3]) h=(h*31+d[i]+d[i+1]*3+d[i+2]*7+i)%1000000007; return h; };
    const h0=cs.map(hash), t0=S.TITLE_EMOJI_T;
    await new Promise(r=>setTimeout(r,700));
    const h1=cs.map(hash);
    const pos=cs.map(c=>getComputedStyle(c).position), box=cs.map(c=>{ const r=c.getBoundingClientRect(); return [Math.round(r.width),Math.round(r.height)]; });
    /* and when the board is closed, its pictures stop being painted */
    S.openVillageTalk(); await new Promise(r=>setTimeout(r,100));
    const stale=[...S.TITLE_EMOJI_LIVE].filter(c=>!c.isConnected).length;
    return {n:cs.length, moved:h0.filter((h,i)=>h!==h1[i]).length, ticked:S.TITLE_EMOJI_T-t0, static:pos.every(p=>p==='static'), big:box.every(([w,h])=>w>=30 && h>=24),
      mine:b.innerHTML.includes(S.villageName().name), stale}; }, [SETUP]);
  ok('the village board: your name, theirs, the house and the whole street, each with its picture, moving', !R.err && R.n>=5 && R.moved>=Math.ceil(R.n*0.6) && R.ticked>10 && R.mine, R.err||JSON.stringify(R));
  ok('laid out in the text, not thrown over the page by the full-screen canvas rule', !R.err && R.static && R.big, R.err||JSON.stringify(R));
  ok('and a board that is gone stops being painted', !R.err && R.stale===0, R.err||JSON.stringify(R));
  R=await T(async ([SETUP])=>{ const S=window.__SS; const setup=eval(SETUP); setup(false, 10);
    S.openBodyMap(S.selfSubject(),'villa'); const v=document.getElementById('bodymap-verdict'); const inMap=v.querySelectorAll('canvas.temoji').length;
    S.G.villageName=null; S.villageNameNews(); await new Promise(r=>setTimeout(r,1300));
    const tt=document.getElementById('hud-toast'); const inToast=tt.querySelectorAll('canvas.temoji').length, toastText=tt.textContent;
    const last=(S.G.villageNameLog||[]).slice(-1)[0]||{};
    return {inMap, inToast, named:toastText.includes(S.villageName().name), logId:last.id, logCult:last.cult,
      old:S.titleByName('THE LONG POST','him'), oldHouse:S.titleByName('THE COLD LONGHOUSE','house')}; }, [SETUP]);
  ok('the body map writes it with its picture, and so does the news the day a name lands', !R.err && R.inMap>=1 && R.inToast===1 && R.named, R.err||JSON.stringify(R));
  ok('the record keeps which name it was, and an old line still finds its picture by the name', !R.err && !!R.logId && !!R.logCult && R.old && R.old.id==='long' && R.oldHouse && R.oldHouse.id==='cold', R.err||JSON.stringify(R));
  R=await T(([SETUP])=>{ const S=window.__SS; const setup=eval(SETUP); setup(false, 10);
    S.openBodyMap(S.selfSubject(),'villa');
    const t=document.getElementById('bodymap-title'); let box=t.parentElement; while(box && !box.classList.contains('scrollbox')) box=box.parentElement;
    box.scrollTop=0; const tr=t.getBoundingClientRect(), br=box.getBoundingClientRect();
    const kids=[...box.children].filter(k=>getComputedStyle(k).display!=='none');
    const squeezed=kids.filter(k=>k.scrollHeight>k.clientHeight+2 && getComputedStyle(k).overflowY==='visible').map(k=>(k.id||k.className)+' '+k.clientHeight+'/'+k.scrollHeight);
    const v=document.getElementById('bodymap-verdict').getBoundingClientRect();
    return {titleIn: tr.top>=br.top-1, verdictReach: v.top>=br.top-1, squeezed}; }, [SETUP]);
  ok('the body map’s top — its title and the name the village calls you — can be scrolled to; no row of buttons is crushed under the next', !R.err && R.titleIn && R.verdictReach && R.squeezed.length===0, R.err||JSON.stringify(R));
  R=await T(()=>{ const S=window.__SS; const N={id:'destroyer2', cult:'rk', name:'THE BOOTY DESTROYER'};
    return {big:S.villaRevealLine(11,false,N).N===N, small:S.villaRevealLine(5,false,N).N===null}; });
  ok('and the look over her shoulder — “So THAT is why they call you…” — carries the name to draw its picture', !R.err && R.big && R.small, R.err||JSON.stringify(R));

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
