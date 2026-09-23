/* 🧍 THE BODY MAP, AND THE THINGS A PLAYER CALLED A JOKE
   ---------------------------------------------------------------------
   Every check here is a thing somebody looked at and reported, and not one
   of them was a thrown error. The REAL figure was built out of rectangles.
   Getting hard walked a LONG man up into IMMENSE and read him at 10.2 of
   10. The staring views, with REAL on, drew a man standing still with no
   eyes on him at all. The solid had nothing where his length is, and was
   shaped like an hourglass because his hips were built off his shoulder
   score. On the Rkrai coast a bust-10 wife with no office was put in the
   plain ulvik, her arms were painted over her bust, and a stripe of raw
   yellow dress sat at her waist. In the hall, the rise was a stick poking
   out sideways from a man who was facing you.

   Written against functions both builds have, so it can be run against
   the build before the fix — set FILE — and fail there for each of them.   */
const {chromium}=require('playwright');
const FILE=process.env.FILE || 'file:///home/user/Ancient-Life-sim-300-A.D-/index.html';
let pass=0, fail=0;
const ok=(name,cond,note)=>{ if(cond){pass++; console.log('  PASS  '+name+(note?'   '+note:''));}
                             else {fail++; console.log('  FAIL  '+name+(note?'   '+note:''));} };

(async()=>{
  const br=await chromium.launch();
  const pg=await br.newPage({viewport:{width:960,height:900}});
  const errs=[]; pg.on('pageerror',e=>errs.push(''+e));
  await pg.goto(FILE);
  await pg.evaluate(()=>localStorage.setItem('SANDSTEEL_ADULT','1'));
  await pg.reload(); await pg.waitForTimeout(400);
  await pg.evaluate(()=>{
    const S=window.__SS;
    S.newDemo('Kaiq','Leokanis','RkTorvak');
    const G=S.G; G.married=true; G.isFemale=false; G.hasVilla=true; G.day=40;
    G.hasBodyMap=true; G.hasSecretMap=true; G.body=G.body||{};
    Object.assign(G.body,{face:7,hairq:6,bust:7,waist:7,booty:7,legs:7,secret:8});
    window.__me ={self:true,male:true,skin:'#c89868',hair:'#2a1a10',body:G.body,name:'Kaiq',looks:7};
    window.__her={male:false,skin:'#e6bd94',hair:'#4a2a18',body:{face:8,hairq:8,bust:8,waist:8,booty:8,legs:7}};
  });

  console.log('\n=== ◐ THE NAMES: HARD IS NOT A PROMOTION ===');
  let R=await pg.evaluate(()=>{
    const S=window.__SS, o={};
    const rn=S.rousedName||(()=>null);
    o.names=[1,3,5,8,10,11].map(v=>(S.restName? S.restName('profile',v):'?')+'→'+rn('profile',v));
    o.long = rn('profile',8)==='ELONGATED' && rn('profile',10)==='EXTRA LARGE' && rn('profile',11)==='MONUMENTAL'
          && rn('profile',3)==='RAISED' && rn('profile',5)==='STANDING' && rn('profile',1)==='PERKED';
    o.girth= rn('girth',8)==='ENGORGED' && rn('girth',10)==='EXTRA THICK';
    o.rump = rn('behind',8)===null;
    /* the rank is what he is; the DIGITS are what he is right now */
    o.dig = S.lengthDigits? [S.lengthDigits(8,0), S.lengthDigits(8,1)] : [0,0];
    const P=S.lengthPose? S.lengthPose(0.35) : {swell:0,lift:1};
    o.staged = P.swell > P.lift+0.2 && (S.lengthPose? S.lengthPose(1).flush===1 && S.lengthPose(0.6).flush<0.5 : false);
    return o;
  });
  ok('every rank has its own name for when he is hard', R.long===true, R.names.join(' · '));
  ok('and girth has its own; the rump does not rise at all', R.girth===true && R.rump===true);
  ok('the length in digits climbs — the rank never does', R.dig[1] > R.dig[0]*1.35,
     R.dig.map(d=>d.toFixed(1)).join(' → ')+' digiti');
  ok('the rise has an order: it swells first, lifts second, flushes last', R.staged===true);

  console.log('\n=== ◐ THE STUDY ===');
  R=await pg.evaluate(()=>{
    const S=window.__SS, o={};
    if(!S.drawLength){ o.none=true; return o; }
    const cv=document.createElement('canvas'); cv.width=200; cv.height=200; const c=cv.getContext('2d');
    const rest=S.drawLength(c,{x:60,y:80,L:50,D:14,aro:0,skin:'#c89868',T:0});
    const hard=S.drawLength(c,{x:60,y:80,L:50,D:14,aro:1,skin:'#c89868',T:0});
    o.hangs = rest.tipY > 80+20; o.stands = hard.tipY < 80 && hard.tipX > rest.tipX+15;
    o.longer = hard.len > rest.len*1.3;
    return o;
  });
  ok('at rest it HANGS from the root; hard it stands out and up', R.hangs===true && R.stands===true);
  ok('and it is longer standing than hanging', R.longer===true);

  console.log('\n=== 🧍 THE REAL FIGURE IS NOT MADE OF RECTANGLES ===');
  R=await pg.evaluate(()=>{
    const S=window.__SS, o={};
    const cv=document.createElement('canvas'); cv.width=260; cv.height=330; const c=cv.getContext('2d');
    const draw=(w,view,opt)=>{ c.clearRect(0,0,260,330); c.save(); c.translate(130,318); c.scale(4.2,4.2);
      try{ S.drawChartFig(c,w,view,undefined,opt); }catch(e){} c.restore(); return c.getImageData(0,0,260,330).data; };
    /* A SILHOUETTE BUILT OF RECTANGLES has a left edge that sits still for
       rows and then JUMPS. One built of curves creeps — a pixel or two a
       row. Count the rows where the outline creeps. */
    const creep=(D)=>{ let prev=-1, n=0, tot=0;
      for(let y=0;y<330;y++){ let x0=-1; for(let x=0;x<260;x++){ if(D[(y*260+x)*4+3]>128){ x0=x; break; } }
        if(x0<0){ prev=-1; continue; }
        if(prev>=0){ tot++; const d=Math.abs(x0-prev); if(d>=1 && d<=3) n++; }
        prev=x0; }
      return tot? n/tot : 0; };
    o.creepHer=creep(draw(window.__her,'front')); o.creepHim=creep(draw(window.__me,'front',{showLen:true}));
    const hash=(D)=>{ let h=2166136261; for(let i=3;i<D.length;i+=16) h=(Math.imul(h^D[i],16777619))>>>0; return h; };
    const F=draw(window.__her,'front'), Sd=draw(window.__her,'side'), B=draw(window.__her,'back');
    o.three = hash(F)!==hash(Sd) && hash(F)!==hash(B) && hash(Sd)!==hash(B);
    /* his length is ON him in REAL, where the chart may show it */
    const groin=(D)=>{ let n=0; for(let y=180;y<240;y++) for(let x=110;x<150;x++){ const i=(y*260+x)*4; n+=D[i]+D[i+1]+D[i+2]; } return n; };
    const withL=draw(window.__me,'front',{showLen:true}), noL=draw(window.__me,'front',{showLen:false});
    let diff=0; for(let y=150;y<250;y++) for(let x=100;x<160;x++){ const i=(y*260+x)*4;
      if(Math.abs(withL[i]-noL[i])+Math.abs(withL[i+1]-noL[i+1])+Math.abs(withL[i+2]-noL[i+2])>40) diff++; }
    o.lenOn=diff;
    /* and in public he is covered: linen at the groin */
    const pub=draw(window.__me,'front',{clothed:'public'}); let lin=0;
    for(let y=150;y<250;y++) for(let x=100;x<160;x++){ const i=(y*260+x)*4;
      if(pub[i+3]>200 && pub[i]>200 && pub[i+1]>190 && pub[i+2]>160) lin++; }
    o.linen=lin;
    return o;
  });
  ok('her outline is CURVED — it creeps from row to row instead of stepping', R.creepHer>0.30,
     Math.round(R.creepHer*100)+'% of rows creep');
  ok('and so is his', R.creepHim>0.30, Math.round(R.creepHim*100)+'% of rows creep');
  ok('front, side and back are three drawings, not one flipped', R.three===true);
  ok('his length is on the REAL figure', R.lenOn>60, R.lenOn+' px of him');
  ok('and down a public colonnade he is wearing something', R.linen>80, R.linen+' px of linen');

  console.log('\n=== 👁 THE STARING VIEWS, WITH REAL ON ===');
  R=await pg.evaluate(async()=>{
    const S=window.__SS, o={};
    const wait=(ms)=>new Promise(r=>setTimeout(r,ms));
    const cv=document.getElementById('bodymap-cv'), c=cv.getContext('2d');
    S.SETTINGS.bluntBody=true; S.set3D(false); S.setBodyMapWalk(false);
    const eyesOn=async(view)=>{ S.openBodyMap(window.__me,'villa'); await wait(60);
      const b=[...document.querySelectorAll('#bodymap-views button')].find(x=>x.textContent.toUpperCase().includes(view));
      if(b) b.click(); await wait(80); S.redrawBodyMap && S.redrawBodyMap();
      const D=c.getImageData(0,30,310,236).data; let gold=0, lav=0;
      for(let i=0;i<D.length;i+=4){ if(D[i]>220 && D[i+1]>170 && D[i+1]<225 && D[i+2]<150) gold++;
                                     if(D[i]>170 && D[i+2]>200 && D[i+1]<200) lav++; }
      return {gold, lav}; };
    o.pub=await eyesOn('PUBLIC'); o.sp=await eyesOn('SPOUSE');
    S.SETTINGS.bluntBody=false;
    /* the eyes land on HIS parts: the anchors come off his own landmarks */
    if(S.realAnchors && S.chartLandmarks){ const A=S.realAnchors(window.__me), M=S.chartLandmarks(window.__me);
      o.anch = A.bust[1] > M.shY+69 && A.bust[1] < M.waistY+69 && A.booty[1] < A.bust[1] && A.secret[1] > A.waist[1]; }
    return o;
  });
  ok('PUBLIC EYES still has its eyes when the figure is REAL', R.pub.gold+R.pub.lav>150,
     (R.pub.gold+R.pub.lav)+' px of eyes and lines');
  ok('and so does SPOUSE’S EYES', R.sp.gold+R.sp.lav>150, (R.sp.gold+R.sp.lav)+' px');
  ok('the eyes are aimed at the real figure’s own chest, shoulders and groin', R.anch===true);

  console.log('\n=== ⬔ THE SOLID ===');
  R=await pg.evaluate(()=>{
    const S=window.__SS, o={};
    const P=S.bodyRings(window.__me);
    o.hip=P.hipR; o.sh=P.shoulder; o.notHourglass = P.hipR < P.shoulder*0.80;
    const cv=document.createElement('canvas'); cv.width=260; cv.height=380; const c=cv.getContext('2d');
    const shot=(yaw,opts)=>{ c.clearRect(0,0,260,380); S.drawBody3D(c, window.__me, 130, 350, 3.9, yaw, Object.assign({plate:false,compass:false},opts)); return c.getImageData(0,0,260,380).data; };
    const dif=(A,B)=>{ let n=0; for(let i=0;i<A.length;i+=4) if(Math.abs(A[i]-B[i])+Math.abs(A[i+1]-B[i+1])+Math.abs(A[i+2]-B[i+2])+Math.abs(A[i+3]-B[i+3])>40) n++; return n; };
    o.side = dif(shot(Math.PI/2,{aro:1}), shot(Math.PI/2,{aro:1,len:false}));
    o.back = dif(shot(Math.PI,{aro:0}),   shot(Math.PI,{aro:0,len:false}));
    return o;
  });
  ok('a man’s solid is not an hourglass — his hips are not built off his shoulders', R.notHourglass===true,
     'hips '+R.hip.toFixed(1)+' · shoulders '+R.sh.toFixed(1));
  ok('his length is on the solid, standing out in profile', R.side>60, R.side+' px of it');
  ok('and from behind the body is in front of it', R.back<15, R.back+' px show through');

  console.log('\n=== 🔥 GET HARD, WHEREVER HE CAN SHOW IT ===');
  R=await pg.evaluate(async()=>{
    const S=window.__SS, o={};
    const wait=(ms)=>new Promise(r=>setTimeout(r,ms));
    S.SETTINGS.bluntBody=true; S.set3D(false); S.setBodyMapWalk(false); S.setSecretAroused(false);
    for(let i=0;i<400;i++) S.arouseTick(33);
    const subs=()=>[...document.querySelectorAll('#bodymap-subviews button')].map(b=>b.textContent.trim());
    const go=async(view)=>{ const b=[...document.querySelectorAll('#bodymap-views button')].find(x=>x.textContent.toUpperCase().includes(view));
      if(b) b.click(); await wait(80); return subs(); };
    S.openBodyMap(window.__me,'villa'); await wait(80);
    o.front=await go('FRONT'); o.side=await go('SIDE'); o.pub=await go('PUBLIC');
    o.onFront = o.front.some(t=>/GET HARD/.test(t)) && o.side.some(t=>/GET HARD/.test(t));
    o.notPublic = !o.pub.some(t=>/GET HARD|SOFTEN|RISING/.test(t));
    /* press it, let the chart's own loop run, and read the button when it lands */
    await go('FRONT');
    const tg=[...document.querySelectorAll('#bodymap-subviews button')].find(b=>/GET HARD/.test(b.textContent));
    if(tg) tg.click();
    for(let i=0;i<60 && !S.arouseSettled();i++) await wait(100);
    await wait(250);
    o.after=subs().find(t=>/SOFTEN|RISING|GET HARD|AROUSED/.test(t))||'—';
    S.setSecretAroused(false); for(let i=0;i<400;i++) S.arouseTick(33); S.SETTINGS.bluntBody=false;
    return o;
  });
  ok('GET HARD is on his front and side views, not just the secret graph', R.onFront===true, R.front.join(' | '));
  ok('and not in PUBLIC EYES — the mob does not get this one', R.notPublic===true);
  ok('when the rise lands the button says SOFTEN, not RISING… for ever', /SOFTEN/.test(R.after), R.after);

  console.log('\n=== ◆ THE RKRAI COAST: SHE IS DRESSED TO BE READ ===');
  R=await pg.evaluate(()=>{
    const S=window.__SS, G=S.G, o={};
    const mk=(eth,bu,dress,extra)=>{ const w=S.makeBride(eth,false,9,{male:true});
      w.male=false; w.eth=eth; w.traits=[]; w.quirks=[]; w.flaws=[]; w.skin='#e6bd94'; w.dress=dress; w.hair='#3a2618';
      w.body=Object.assign({face:7,hairq:6,bust:bu,waist:7,booty:6,legs:6},extra||{}); return w; };
    const rk=mk('rkrai',10,'#e8c04a'), rkB=mk('rkrai',6,'#e8c04a',{booty:10}), ro=mk('roman',10,'#e8c04a');
    G.world='rk'; G.wife=rk;
    /* A KAIQ HOUSE — the lowest post, where no office is in reach, so she
       holds no seat at all. That is the house where a bust-10 wife was put
       in the plain ulvik; a house of rank seats her and hands her the cut. */
    const rankWas=G.rkRank; G.rkRank=S.RK_RANKS[0].id;
    o.titled=!!S.rkWifeTitle(rk);
    o.cut=S.rkCut(rk).name; o.cutB=S.rkCut(rkB).name;
    G.rkRank=rankWas;
    const cv=document.createElement('canvas'); cv.width=60; cv.height=92; const c=cv.getContext('2d');
    const draw=(w,world)=>{ G.world=world; G.wife=w; c.clearRect(0,0,60,92); S.drawWifeFigTest(c,30,88,w,0,'idle',0); return c.getImageData(0,0,60,92).data; };
    const isSkin=(r,g,b)=>Math.abs(r-0xe6)<22 && Math.abs(g-0xbd)<26 && Math.abs(b-0x94)<30;
    const isYellow=(r,g,b)=>r>200 && g>160 && b<110;
    const count=(D,y0,y1,x0,x1,f)=>{ let n=0; for(let y=y0;y<y1;y++) for(let x=x0;x<x1;x++){ const i=(y*60+x)*4; if(D[i+3]>0 && f(D[i],D[i+1],D[i+2])) n++; } return n; };
    /* where her chest is: find the rows of the bodice from the top of the dress */
    const Drk=draw(rk,'rk'), Dro=draw(ro,'rome');
    // the bust band: rows 24..40 of this 92-row frame, the width of her
    o.rkSkin=count(Drk,24,40,14,46,isSkin); o.roSkin=count(Dro,24,40,14,46,isSkin);
    /* no raw gown colour at her waist on the coast (below the bust, above the
       skirt). Checked with a BLUE gown: a yellow one collides with the gold
       beads of her office band, which are supposed to be there. The old
       cinch was the gown shaded by -8; tanned hide made FROM the gown is a
       different colour and does not count. */
    const rkBlue=mk('rkrai',10,'#40a0e0');
    const Dbl=draw(rkBlue,'rk');
    const isRawGown=(r,g,b)=>Math.abs(r-60)<14 && Math.abs(g-156)<14 && Math.abs(b-220)<16;
    o.rkYellowWaist=count(Dbl,30,56,14,46,isRawGown);
    /* her arms do not paint over her bust: on the covered Roman one, the
       dress runs OUT PAST where the arms hang */
    let widest=0; for(let y=24;y<40;y++){ let n=0; for(let x=0;x<60;x++){ const i=(y*60+x)*4; if(isYellow(Dro[i],Dro[i+1],Dro[i+2])) n++; } widest=Math.max(widest,n); }
    o.romeBustW=widest;
    return o;
  });
  ok('a bust-10 wife with NO office (a kaiq house) is cut for her bust, not a sack',
     R.titled===false && /ULVANNE/.test(R.cut), (R.titled? 'she holds a seat — test is not testing it · ' : '')+R.cut);
  ok('and a wife whose best part is her seat is cut for that', /RHAUNEK/.test(R.cutB), R.cutB);
  ok('on the coast her bust is SHOWN — more skin at the chest than a Roman gown', R.rkSkin>=R.roSkin+14,
     'Rkrai '+R.rkSkin+' px of skin · Rome '+R.roSkin);
  ok('no stripe of raw dress colour at her waist', R.rkYellowWaist===0, R.rkYellowWaist+' px');
  ok('her arms are not painted over her bust — it runs out past them', R.romeBustW>=20, R.romeBustW+' px across');

  console.log('\n=== 🏛 GET HARD IN THE HALL, ON A MAN WHO IS FACING YOU ===');
  R=await pg.evaluate(()=>{
    const S=window.__SS, G=S.G, o={};
    const cv=document.getElementById('game'), ctx=cv.getContext('2d');
    const at=(world,st,decent)=>{ G.world=world; const me=S.playerLook();
      ctx.fillStyle='#3a2c20'; ctx.fillRect(0,0,480,270);
      ctx.save(); ctx.translate(100,200); S.drawHusbandFig(ctx,0,0,70,null,null,me,0,'idle'); ctx.restore();
      if(st>0) S.drawTunicBump(100,200,me,st,1000,1,!!decent);
      return ctx.getImageData(70,140,60,62).data; };
    const centroid=(A,B)=>{ let n=0,sx=0; for(let i=0;i<A.length;i+=4) if(Math.abs(A[i]-B[i])+Math.abs(A[i+1]-B[i+1])+Math.abs(A[i+2]-B[i+2])>30){ n++; sx+=((i/4)%60); } return {n, cx:n? sx/n-30 : 99}; };
    const r0=at('rome',0), r3=at('rome',3), rH=at('rome',2.5), r2=at('rome',2);
    o.tunic=centroid(r0,r3);
    o.k0=at('rk',0); o.kilt=centroid(o.k0, at('rk',3)); delete o.k0;
    let d=0; for(let i=0;i<rH.length;i+=4) if(Math.abs(rH[i]-r2[i])>20) d++; o.climb=d;
    return o;
  });
  ok('the tunic tents in the MIDDLE of him, not off one hip', R.tunic.n>8 && Math.abs(R.tunic.cx)<=3,
     R.tunic.n+' px, centred '+R.tunic.cx.toFixed(1)+' px off his middle');
  ok('and on the coast the kilt lifts in the middle too', R.kilt.n>8 && Math.abs(R.kilt.cx)<=1.5,
     R.kilt.n+' px, centred '+R.kilt.cx.toFixed(1)+' px off');
  ok('it CLIMBS: half a stage is its own picture', R.climb>0, R.climb+' px between stage 2 and 2.5');

  console.log('\n--- PAGE ERRORS ---');
  ok('none', errs.length===0, errs.join(' | '));
  console.log('\n'+(fail? '✗ '+fail+' FAILED   ('+(pass+fail)+' checks)' : 'ALL GREEN   ('+pass+' checks)'));
  await br.close();
  process.exit(fail?1:0);
})();
