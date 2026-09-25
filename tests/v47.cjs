/* 📸 V47 — THE NEW BODIES, EVERYWHERE: PORTRAITS, COURTSHIP, THE WALK-IN, THE SIVRAK, AND YOUR EYES
   ---------------------------------------------------------------------
   From the round that asked for:
     · "in the Rkrai give the option to wear the jungle suit";
     · "make the portrait replace the old bodies — the wife choosing and the
        husband choosing portraits use the new bodies — maybe different poses";
     · "and the courtship, new bodies too";
     · "in the bedchamber she walks too fast to the scene, please fix";
     · "and looking at the front of the tunic, etc."
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
  await pg.evaluate(()=>{ window.requestAnimationFrame=()=>0; });
  const T=async(fn,arg)=>{ try{ return await pg.evaluate(fn,arg); }catch(e){ return {err:String(e).slice(0,200)}; } };
  /* helpers that live in the page: a canvas, how busy it is, and how different two are */
  const HELPERS=()=>pg.evaluate(()=>{
    window.__cv=(w,h)=>{ const c=document.createElement('canvas'); c.width=w; c.height=h; return c; };
    window.__busy=(c)=>{ const d=c.getContext('2d').getImageData(0,0,c.width,c.height).data; let n=0; for(let i=3;i<d.length;i+=4) if(d[i]>0) n++; return n; };
    window.__diff=(a,b)=>{ const A=a.getContext('2d').getImageData(0,0,a.width,a.height).data, B=b.getContext('2d').getImageData(0,0,b.width,b.height).data;
      let n=0; for(let i=0;i<A.length;i+=4){ if(Math.abs(A[i]-B[i])+Math.abs(A[i+1]-B[i+1])+Math.abs(A[i+2]-B[i+2])>30) n++; } return n; };
    window.__green=(c,x,y,w,h)=>{ const d=c.getContext('2d').getImageData(x,y,w,h).data; let n=0;
      for(let i=0;i<d.length;i+=4){ const r=d[i],g=d[i+1],b=d[i+2]; if(g>r+18 && g>b+8 && g>50) n++; } return n; };
  });
  await HELPERS();
  /* a household: fem=true makes you the wife and the spouse a husband */
  const SETUP=`(function(fem, o){ o=o||{}; const S=window.__SS;
    S.newDemo(fem?'Livia':(o.rk?'Kaiq':'Marcus'), o.rk?'Leokanis':'Italia', o.rk?'RkTorvak':'Roman'); const G=S.G; G.married=true; G.isFemale=!!fem; G.hasVilla=true; G.coin=20000;
    const w=S.makeBride(o.eth||'roman',true,8,fem? {male:true} : undefined); w.male=!!fem; w.traits=o.traits||[]; w.flaws=[]; w.quirks=[];
    G.wife=w; G.wifeRel=o.rel===undefined? 80 : o.rel; G.wifePhys=70; if(o.domus!==false) S.openDomus(); return G; })`;

  console.log('\n=== 📸 THE PORTRAITS ARE THE NEW BODIES ===');
  let R=await T(()=>{ const S=window.__SS; S.newDemo('Marcus','Italia','Roman');
    const brides=[], grooms=[];
    for(let i=0;i<40;i++){ const b=S.makeBride(['roman','greek','gaul','egyptian'][i%4], i%2===0, 6); b.male=false; brides.push(b); }
    for(let i=0;i<30;i++){ const g=S.makeBride('roman', i%2===0, 6, {male:true}); g.male=true; grooms.push(g); }
    const fp=brides.map(S.portraitPoseOf), mp=grooms.map(S.portraitPoseOf);
    return { fKinds:[...new Set(fp)], mKinds:[...new Set(mp)], stable:brides.every(b=>S.portraitPoseOf(b)===S.portraitPoseOf(b)),
             mInList:mp.every(p=>S.PORTRAIT_POSES_M.includes(p)), fInList:fp.every(p=>S.PORTRAIT_POSES_F.includes(p)) }; });
  ok('brides stand in different poses — at least four different ones across forty — and each keeps hers', !R.err && R.fKinds.length>=4 && R.stable && R.fInList, R.err||JSON.stringify(R));
  ok('grooms have poses of their own (and no hand in the hair)', !R.err && R.mKinds.length>=3 && R.mInList && !R.mKinds.includes('hair'), R.err||JSON.stringify(R));

  R=await T(()=>{ const S=window.__SS; const g={SW:9, WW:6.5, HW:8, sy:-60, cy:-52, wy:-40, hy:-32, ny:-66, HH:10, male:false, t:0};
    const A=(p,s)=>S.portraitArm(p,s,g);
    return { hipsBoth:!!(A('hips',1)&&A('hips',-1)), hipOne:!!A('hip',1) && !A('hip',-1), hangNone:!A('hang',1)&&!A('hang',-1),
             crossed: A('cross',1).hx<0 && A('cross',-1).hx>0, hairUp: A('hair',1).hy < g.sy, waveUp: A('wave',1).hy < g.sy,
             clasp: Math.abs(A('clasp',1).hx)<2 }; });
  ok('each pose puts the hands somewhere: both on the hips, one on the hip, arms crossed over, a hand up in the hair, a wave, hands clasped', !R.err && Object.values(R).every(Boolean), R.err||JSON.stringify(R));

  R=await T(()=>{ const S=window.__SS; S.newDemo('Marcus','Italia','Roman');
    const b=S.makeBride('roman',true,8); b.male=false;
    S.SETTINGS.classicBodies=false; const nw=__cv(148,148); S.drawBridePortrait(nw,b);
    S.SETTINGS.classicBodies=true;  const old=__cv(148,148); S.drawBridePortrait(old,b); S.SETTINGS.classicBodies=false;
    const bare=__cv(148,148); const drew=S.drawPortraitFigure(bare.getContext('2d'),148,148,b,{bare:true});
    const p1=__cv(148,148); b._pose='hips'; S.drawBridePortrait(p1,b); const p2=__cv(148,148); b._pose='cross'; S.drawBridePortrait(p2,b); delete b._pose;
    return { newVsOld:__diff(nw,old), drew, bareBusy:__busy(bare), poseDiff:__diff(p1,p2) }; });
  ok('the bride’s portrait is drawn on the new body — not the old block figure (the classic switch still gives the old one)', !R.err && R.newVsOld>800 && R.drew===true && R.bareBusy>1500, R.err||JSON.stringify(R));
  ok('and the pose shows: hands on hips and arms folded are different pictures', !R.err && R.poseDiff>60, R.err||JSON.stringify(R));

  R=await T(()=>{ const S=window.__SS; S.newDemo('Livia','Italia','Roman'); S.G.isFemale=true;
    const g=S.makeBride('roman',true,8,{male:true}); g.male=true;
    S.SETTINGS.classicBodies=false; const nw=__cv(148,148); S.drawGroomPortrait(nw,g);
    S.SETTINGS.classicBodies=true;  const old=__cv(148,148); S.drawGroomPortrait(old,g); S.SETTINGS.classicBodies=false;
    const p1=__cv(148,148); g._pose='hips'; S.drawGroomPortrait(p1,g); const p2=__cv(148,148); g._pose='belt'; S.drawGroomPortrait(p2,g); delete g._pose;
    return { newVsOld:__diff(nw,old), poseDiff:__diff(p1,p2) }; });
  ok('the husband’s portrait is on the new body too, and posed', !R.err && R.newVsOld>800 && R.poseDiff>40, R.err||JSON.stringify(R));

  R=await T(()=>{ const S=window.__SS; const out={};
    for(const eth of ['roman','rkrai','wa','han','gaul']){ S.newDemo('Marcus','Italia','Roman'); const b=S.makeBride(eth,true,8); b.male=false;
      const c=__cv(148,148), o=__cv(148,148);
      try{ S.drawBridePortrait(c,b); S.SETTINGS.classicBodies=true; S.drawBridePortrait(o,b); S.SETTINGS.classicBodies=false; out[eth]=__diff(c,o); }catch(e){ S.SETTINGS.classicBodies=false; out[eth]='ERR '+e.message; } }
    S.newDemo('Marcus','Italia','Roman'); const pr=S.makeBride('roman',true,8); pr.male=false; const c2=__cv(148,148);
    try{ S.drawBridePortrait(c2,pr,true,6); out.preg=__busy(c2); }catch(e){ out.preg='ERR '+e.message; }
    return out; });
  ok('every culture’s room takes the new figure (Rome, the coast, Wa, Han, Gaul) — and the bedroom’s bare, expecting sprite', !R.err && ['roman','rkrai','wa','han','gaul'].every(k=>typeof R[k]==='number' && R[k]>800) && R.preg>1500, R.err||JSON.stringify(R));

  R=await T(()=>{ const S=window.__SS; S.newDemo('Marcus','Italia','Roman'); const out={}, nipc={};
    const want={roman:null, wa:'kimono', han:'hanfu', ming:'hanfu', korean:'hanbok', kushan:'sari', tamil:'sari', nanban:'gown', steppe:'kaftan'};
    /* where her nipples are, if anything showed them: skin her pure green and look right there */
    for(const e in want){ const b=S.makeBride(e,true,8); b.male=false; out[e]=S.portraitDressInfo(b).garment;
      b._pose='hips'; b.skin='#00ff00'; b.dress='#8a2f5a'; b.age=22;   /* hands on hips: the arms are out of the way */ b.body=Object.assign(b.body||{},{bust:10});
      const c=__cv(148,148); S.drawBridePortrait(c,b);
      const M=S.chartLandmarks(b), top=M.headY-M.headH-5, k=140/(-17.5-top), r=0.95+10*0.6, by2=M.chestY+2.8+r*0.10, bx=r*0.78+0.55;
      let n=0; for(const q of [-1,1]){ const X=Math.round(74+q*(bx+r*0.1)*k), Y=Math.round(5+(by2+r*0.2-top)*k);
        const d=c.getContext('2d').getImageData(X-2,Y-2,5,5).data; for(let i=0;i<d.length;i+=4) if(d[i+1]>d[i]+50 && d[i+1]>d[i+2]+50) n++; }
      nipc[e]=n; }
    /* and the same probe finds them on a figure with nothing on, so it is looking in the right place */
    { const b=S.makeBride('roman',true,8); b.male=false; b.skin='#00ff00'; b.age=22; b.body=Object.assign(b.body||{},{bust:10});
      const M=S.chartLandmarks(b), top=M.headY-M.headH-5, k=140/(-17.5-top), r=0.95+10*0.6, by2=M.chestY+2.8+r*0.10, bx=r*0.78+0.55;
      const c=__cv(148,148), x=c.getContext('2d'); x.save(); x.translate(74,5-top*k); x.scale(k,k); S.drawRealFig(x,b,'front',undefined,{dressed:false, pose:'hips'}); x.restore();
      let n=0; for(const q of [-1,1]){ const X=Math.round(74+q*(bx+r*0.1)*k), Y=Math.round(5+(by2+r*0.2-top)*k);
        const d=x.getImageData(X-2,Y-2,5,5).data; for(let i=0;i<d.length;i+=4) if(d[i+1]>d[i]+50 && d[i+1]>d[i+2]+50) n++; }
      nipc.probe=n; }
    const wa=S.makeBride('wa',true,8); wa.male=false; wa._pose='hang'; const a=__cv(148,148); S.drawBridePortrait(a,wa);
    const ro=Object.assign({},wa,{eth:'roman'}); const b=__cv(148,148); S.drawBridePortrait(b,ro);
    const gm=S.makeBride('wa',true,8,{male:true}); gm.male=true;
    return {out, want, nipc, kimonoVsStola:__diff(a,b), groom:S.portraitDressInfo(gm).garment}; });
  ok('each people’s garment comes with the new body: kimono, hanfu, hanbok, sari, gown, kaftan — and a Roman stola', !R.err && Object.keys(R.want).every(k=>R.out[k]===R.want[k]) && R.groom==='kimono', R.err||JSON.stringify(R.out));
  ok('and it shows: a bride from Wa in her kimono is a different picture from the same woman in a stola', !R.err && R.kimonoVsStola>400, R.err||JSON.stringify({d:R.kimonoVsStola}));
  ok('every garment covers her (nothing shows through at bust 10)', !R.err && R.nipc.probe>20 && Object.keys(R.want).every(k=>R.nipc[k]===0), R.err||JSON.stringify(R.nipc));

  R=await T(()=>{ const S=window.__SS; S.newDemo('Kaiq','Leokanis','RkTorvak'); const w=S.makeBride('rkrai',true,8); w.male=false; w._pose='hang';
    const nw=__cv(148,148); w._plate=true; S.drawBridePortrait(nw,w); delete w._plate;
    S.SETTINGS.classicBodies=true; const old=__cv(148,148); S.drawBridePortrait(old,w); S.SETTINGS.classicBodies=false;
    const off=__cv(320,320); let sv=true; try{ S.G.married=true; S.G.wife=w; S.selvskarFigure && S.selvskarFigure(w); }catch(e){ sv=e.message; }
    return {plateVsClassic:__diff(nw,old), plateLeft:w._plate===undefined, sv}; });
  ok('the coast’s commissions and the hide sketch still crop the full-length plate they were measured on', !R.err && R.plateVsClassic===0 && R.plateLeft && R.sv===true, R.err||JSON.stringify(R));

  R=await T(()=>{ const S=window.__SS; S.newDemo('Marcus','Italia','Roman'); const G=S.G; G.married=true; G.hasVilla=true;
    const w=S.makeBride('roman',true,8); w.male=false; G.wife=w; G.wifeRel=92; G.day=200;
    G.children=[{name:'Gaius Minor', sex:'m', born:150, body:{face:6,bust:6,waist:6,booty:6,legs:6,hairq:6}},{name:'Tertia', sex:'f', born:195}];
    S.openPortrait(); const cv=document.getElementById('portrait-cv'); const a=__cv(cv.width,cv.height); a.getContext('2d').drawImage(cv,0,0);
    S.SETTINGS.classicBodies=true; S.openPortrait(); const b=__cv(cv.width,cv.height); b.getContext('2d').drawImage(cv,0,0); S.SETTINGS.classicBodies=false;
    const c2=__cv(480,250); const fn=S.familyPortraitNew(c2.getContext('2d'), 92, false);
    return {fn, diff:__diff(a,b), busy:__busy(c2)}; });
  ok('the family portrait stands the house on the new bodies — full length, facing the painter', !R.err && R.fn===true && R.diff>1500 && R.busy>4000, R.err||JSON.stringify(R));

  R=await T(()=>{ const S=window.__SS; S.newDemo('Marcus','Italia','Roman'); const G=S.G; G.age=24; G.coin=99999; G.fame=999; G.married=false;
    S.openMarry(false); const imgs=[...document.querySelectorAll('#marry-body img')];
    return { n:imgs.length, ok:imgs.every(i=>/^data:image\/png/.test(i.src||'')) }; });
  ok('the TAKE A WIFE screen draws its portraits without a hitch', !R.err && R.ok && R.n>0, R.err||JSON.stringify(R));

  console.log('\n=== 💬 COURTSHIP, ON THE NEW BODIES ===');
  R=await T(()=>{ const S=window.__SS; S.newDemo('Marcus','Italia','Roman'); S.G.married=false;
    S.startCourtship('poor'); if(!S.CT) return {noCT:true};
    const nw=__cv(440,140); S.SETTINGS.classicBodies=false; S.drawCourtScene(nw);
    const old=__cv(440,140); S.SETTINGS.classicBodies=true; S.drawCourtScene(old); S.SETTINGS.classicBodies=false;
    return { diff:__diff(nw,old), busy:__busy(nw), exprLeft:S.HALL_EXPR }; });
  ok('the courting scene stands two new-body figures in the street (not the old rig)', !R.err && !R.noCT && R.diff>600 && R.busy>40000, R.err||JSON.stringify(R));
  ok('and the faces it borrows for them are handed back afterwards', !R.err && R.exprLeft===null, R.err||JSON.stringify(R));
  R=await T(()=>{ const S=window.__SS; if(!S.CT) return {noCT:true}; const a=__cv(440,140), b=__cv(440,140);
    S.CT.prog=5; S.drawCourtScene(a); S.CT.prog=95; S.drawCourtScene(b); return {d:__diff(a,b)}; });
  ok('and the scene moves with the conversation — a cold start looks different from a warm finish', !R.err && !R.noCT && R.d>300, R.err||JSON.stringify(R));

  console.log('\n=== 🚶 THE WALK TO THE BEDCHAMBER DOOR ===');
  R=await T(()=>{ const S=window.__SS, out={};
    for(const fem of [false,true]){ S.newDemo('X','Italia','Roman'); S.G.isFemale=fem; let mx=0, prev=S.preludeWalkX(0,346);
      for(let t=1;t<=130;t++){ const x=S.preludeWalkX(t,346); mx=Math.max(mx, x-prev); prev=x; }
      out[fem?'him':'her']={maxPerFrame:+mx.toFixed(3), end:S.preludeWalkX(124,346), start:S.preludeWalkX(0,346)}; }
    let mo=0, po=S.preludeOtherX(236,346); for(let t=237;t<352;t++){ const x=S.preludeOtherX(t,346); mo=Math.max(mo,x-po); po=x; }
    out.other={maxPerFrame:+mo.toFixed(3), end:S.preludeOtherX(352,346)};
    return out; });
  ok('she walks to the door — under a pixel a frame (it was over two: a sprint) — and still gets there on cue', !R.err && R.her.maxPerFrame<0.9 && R.her.end===280, R.err||JSON.stringify(R));
  ok('he walks it too when you are the wife, on his shorter stride', !R.err && R.him.maxPerFrame<0.7 && R.him.end===280, R.err||JSON.stringify(R));
  ok('and the one who answers the call walks to the door as well, instead of dashing (under a pixel a frame, same mark)', !R.err && R.other.maxPerFrame<0.9 && R.other.end===362, R.err||JSON.stringify(R));
  R=await T(([SETUP])=>{ const S=window.__SS, errs=[];
    for(const fem of [false,true]) for(const place of ['bed','pool']){ eval(SETUP)(fem,{domus:false}); S.setWH('done'); S.startBedScene('fun','long',place); const B=S.BC;
      for(const t of [0,10,40,80,120,129,240,300,350]){ B.t=t; B.stage=S.bedStage(B); B.tT=t; try{ S.drawBed(); }catch(e){ errs.push(place+(fem?'/f':'/m')+'@'+t+': '+e.message); } } }
    return {errs}; }, [SETUP]);
  ok('the whole walk-in draws, for either of you, in the bedchamber and the bath', !R.err && R.errs.length===0, R.err||R.errs.slice(0,3).join(' | '));

  console.log('\n=== ❦ THE SIVRAK, CHOSEN ===');
  R=await T(([SETUP])=>{ const S=window.__SS; const out={};
    eval(SETUP)(false,{rk:true, eth:'rkrai'}); out.rkIds=S.tabletMenu().filter(m=>/^svk_/.test(m.id)).map(m=>m.id+':'+m.ok);
    eval(SETUP)(false,{}); out.romeIds=S.tabletMenu().filter(m=>/^svk_/.test(m.id)).length;
    return out; }, [SETUP]);
  ok('on the coast the tablet offers it plainly: wear one yourself, or ask them to', !R.err && R.rkIds.join(',')==='svk_me:true,svk_them:true', R.err||JSON.stringify(R));
  ok('and in Rome it does not (it is the coast’s own garment)', !R.err && R.romeIds===0, R.err||JSON.stringify(R));

  R=await T(([SETUP])=>{ const S=window.__SS; const G=eval(SETUP)(false,{rk:true, eth:'rkrai'}); const out={};
    out.before=S.rkSivrakOn('self'); S.sivrakSelf(); out.on=S.rkSivrakOn('self'); out.wifeStill=S.rkSivrakOn('wife');
    S.sivrakSelf(); out.off=S.rkSivrakOn('self'); S.sivrakSelf(); out.back=S.rkSivrakOn('self');
    const mr=Math.random; Math.random=()=>0.999; out.refused=S.sivrakSpouse(); out.wifeAfterNo=S.rkSivrakOn('wife');
    Math.random=()=>0.0; out.askedAgain=S.sivrakSpouse(); out.wifeAfterAgain=S.rkSivrakOn('wife');
    G.rkSivrakAskDay=-1; G.rkSivrakAskNo=false; out.yes=S.sivrakSpouse(); Math.random=mr; out.wifeOn=S.rkSivrakOn('wife'); out.who=G.rkSivrak.who;
    out.leaf=!!S.hallDressOf(G.wife).leaf;
    S.sivrakSpouse(); out.wifeOff=S.rkSivrakOn('wife'); out.meStill=S.rkSivrakOn('self');
    return out; }, [SETUP]);
  ok('you can put yours on — and only yours', !R.err && !R.before && R.on && !R.wifeStill, R.err||JSON.stringify(R));
  ok('take it off and put it back on as the evening goes', !R.err && !R.off && R.back, R.err||JSON.stringify(R));
  ok('ask them: they can say no — and a no stands for the day', !R.err && R.refused===false && !R.wifeAfterNo && R.askedAgain===false && !R.wifeAfterAgain, R.err||JSON.stringify(R));
  ok('and a yes puts her in leaf beside you (the two of you: “both”), which she can take off on her own', !R.err && R.yes && R.wifeOn && R.who==='both' && R.leaf && !R.wifeOff && R.meStill, R.err||JSON.stringify(R));

  R=await T(([SETUP])=>{ const S=window.__SS; const G=eval(SETUP)(false,{rk:true, eth:'rkrai'}); const D=S.DM; D.x=D.wifeX-50; D.face=1;
    const c=document.getElementById('game'), box=[Math.max(0,Math.round(D.x-20)), 130, 110, 90];
    S.drawDomus(); const g0=__green(c,...box);
    S.sivrakSelf(); const mr=Math.random; Math.random=()=>0; S.sivrakSpouse(); Math.random=mr;
    S.drawDomus(); const g1=__green(c,...box);
    return {g0,g1}; }, [SETUP]);
  ok('and it is drawn: the two of you in the hall go green with leaf', !R.err && R.g1>R.g0+120, R.err||JSON.stringify(R));

  R=await T(([SETUP])=>{ const S=window.__SS; const G=eval(SETUP)(true,{rk:true, eth:'rkrai'}); const D=S.DM; D.x=D.wifeX-50;
    const c=document.getElementById('game'), box=[Math.max(0,Math.round(D.wifeX-20)), 130, 50, 90];
    S.drawDomus(); const g0=__green(c,...box); const mr=Math.random; Math.random=()=>0; const y=S.sivrakSpouse(); Math.random=mr;
    S.drawDomus(); const g1=__green(c,...box); return {y, on:S.rkSivrakOn('wife'), g0, g1}; }, [SETUP]);
  ok('a husband asked says yes the same way, and wears his kilt of leaf', !R.err && R.y && R.on && R.g1>R.g0+60, R.err||JSON.stringify(R));

  console.log('\n=== 👀 AND YOU CAN LOOK TOO ===');
  R=await T(([SETUP])=>{ const S=window.__SS; const out={};
    let G=eval(SETUP)(true,{}); let D=S.DM; D.x=D.wifeX-40; D.wifeDir=-1; out.tunic=S.plookKind(); D.wifeDir=1; out.hisSeat=S.plookKind();
    G=eval(SETUP)(false,{}); D=S.DM; D.x=D.wifeX-40; D.wifeDir=-1; out.front=S.plookKind(); D.wifeDir=1; out.herSeat=S.plookKind();
    out.menu=S.tabletMenu().some(m=>m.id==='plook' && m.ok);
    return out; }, [SETUP]);
  ok('what you look at depends on which way they face: the front of his tunic, her front, or their seat', !R.err && R.tunic==='tunic' && R.hisSeat==='seat' && R.front==='front' && R.herSeat==='seat', R.err||JSON.stringify(R));
  ok('and it is on the tablet', !R.err && R.menu, R.err||JSON.stringify(R));

  R=await T(([SETUP])=>{ const S=window.__SS; const G=eval(SETUP)(true,{rel:85}); const D=S.DM; D.x=D.wifeX-40; D.wifeDir=-1; D.face=1;
    S.press('g'); S.updateDomus? S.updateDomus(1) : null; const viaKey=!!D.plook;
    if(!D.plook) S.startPlayerLook();
    const out={viaKey, busy:S.hallBusy(), inBeats:S.HALL_BEATS.includes('plook'), kind:D.plook&&D.plook.kind};
    D.plook.noticeAt=30; const c=document.getElementById('game');
    for(let i=0;i<20;i++){ D.t++; S.updatePlayerLook(1); }
    S.drawDomus(); out.drawn=true;
    for(let i=0;i<20;i++){ D.t++; S.updatePlayerLook(1); }
    out.noticed=D.plook&&D.plook.noticed; out.react=D.plook&&D.plook.react; out.turned=D.wifeDir===Math.sign(D.x-D.wifeX);
    D.x=D.wifeX-200; S.updatePlayerLook(1); out.walkedOff=!D.plook;
    return out; }, [SETUP]);
  ok('G looks (the key is wired, not just printed on the help bar)', !R.err && R.viaKey, R.err||JSON.stringify(R));
  ok('the look is a hall beat — nothing else starts over it', !R.err && R.busy && R.inBeats && R.kind==='tunic', R.err||JSON.stringify(R));
  ok('after a moment they notice, turn to you, and a warm husband takes it well', !R.err && R.noticed && R.react==='bold' && R.turned, R.err||JSON.stringify(R));
  ok('walk off and the look ends', !R.err && R.walkedOff, R.err||JSON.stringify(R));

  R=await T(([SETUP])=>{ const S=window.__SS; const out={};
    for(const [rel,want] of [[15,'cold'],[50,'shy']]){ const G=eval(SETUP)(false,{rel}); const D=S.DM; D.x=D.wifeX-40; D.wifeDir=-1;
      S.startPlayerLook(); D.plook.noticeAt=1; for(let i=0;i<4;i++) S.updatePlayerLook(1); out[want]=D.plook&&D.plook.react; }
    return out; }, [SETUP]);
  ok('a cold wife is not in the mood to be looked at; a middling one goes pink', !R.err && R.cold==='cold' && R.shy==='shy', R.err||JSON.stringify(R));

  R=await T(([SETUP])=>{ const S=window.__SS; const G=eval(SETUP)(true,{rel:85}); const D=S.DM; D.x=D.wifeX-40; D.wifeDir=-1; D.face=1;
    const c=document.getElementById('game'); const bx=Math.round(D.wifeX-14);
    const grab=()=>{ const cc=__cv(28,30); cc.getContext('2d').drawImage(c,bx,172,28,30,0,0,28,30); return cc; };
    S.drawDomus(); const a=grab();
    S.startPlayerLook(); D.plook.noticeAt=999; for(let i=0;i<150;i++){ D.t++; S.updatePlayerLook(1); }
    S.drawDomus(); const b=grab(); return {d:__diff(a,b)}; }, [SETUP]);
  ok('and the front of his tunic, looked at long enough, does what tunics do', !R.err && R.d>25, R.err||JSON.stringify(R));

  console.log('\n=== 🚪 AND THE GATE ===');
  await pg.evaluate(()=>{ localStorage.setItem('SANDSTEEL_ADULT','0'); });
  await pg.reload(); await pg.waitForTimeout(400);
  await pg.evaluate(()=>{ window.requestAnimationFrame=()=>0; }); await HELPERS();
  R=await T(([SETUP])=>{ const S=window.__SS; const G=eval(SETUP)(false,{rk:true, eth:'rkrai'});
    const can=S.rkSivrakCan().ok, self=S.sivrakSelf(), on=S.rkSivrakOn('self'), look=S.startPlayerLook();
    const menu=S.tabletMenu(), svk=menu.filter(m=>/^svk_/.test(m.id)&&m.ok).length, pl=menu.some(m=>m.id==='plook'&&m.ok);
    const c=document.createElement('canvas'); c.width=c.height=148; const b=S.makeBride('roman',true,8); b.male=false; let portrait=true; try{ S.drawBridePortrait(c,b,true); }catch(e){ portrait=e.message; }
    return {can, self, on, look, svk, pl, portrait}; }, [SETUP]);
  ok('with mature content off: no sivrak, no looking, and the portraits still draw (clothed)', !R.err && !R.can && !R.self && !R.on && !R.look && R.svk===0 && !R.pl && R.portrait===true, R.err||JSON.stringify(R));
  R=await T(()=>{ const S=window.__SS; const out={};
    S.newDemo('Kaiq','Leokanis','RkTorvak'); const w=S.makeBride('rkrai',true,8); w.male=false; out.coast=S.portraitDressInfo(w).garment;
    S.newDemo('Marcus','Italia','Roman'); const b=S.makeBride('roman',true,8); b.male=false; b._pose='hang';
    const dressed=__cv(148,148), bare=__cv(148,148);
    S.drawPortraitFigure(dressed.getContext('2d'),148,148,b,{});
    const c=bare.getContext('2d'), M=S.chartLandmarks(b), top=M.headY-M.headH-5, k=140/(-17.5-top);
    c.save(); c.translate(74, 5-top*k); c.scale(k,k); S.drawRealFig(c,b,'front',undefined,{dressed:false, pose:'hang'}); c.restore();
    out.dressVsNot=__diff(dressed,bare);
    return out; });
  ok('and the portrait dresses them anyway — a stola over the linen, and a coast woman in her parka rather than the ulvik', !R.err && R.coast==='parka' && R.dressVsNot>1500, R.err||JSON.stringify(R));

  R=await T(()=>window.__SS.BUILD_STAMP);
  ok('the build says V47', typeof R==='string' && /V47/.test(R), String(R));
  ok('no page errors anywhere', errs.length===0, errs.slice(0,3).join(' | '));
  await br.close();
  console.log(fail? `\n${fail} FAILED, ${pass} passed` : `\nALL GREEN   (${pass} checks)`);
  process.exit(fail?1:0);
})();
