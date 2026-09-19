/* ◐ THE RISING, THE LEDGER, AND THE CHART THAT TURNS
   ---------------------------------------------------------------------
   Three things, and the first one is the one with a real trap in it.

   A rise that is a TOGGLE needs no test: it is true or it is false. A rise
   that is an ANIMATION has to arrive — and the first cut of this one went
   up to 1.05 and stayed there, which meant the level never matched its own
   target, arouseSettled() was false for ever and the chart's animation loop
   never stopped. It looked perfect. Nothing threw. The only way to catch it
   is to run the ramp to the end and ask whether it says it is finished.

   Then the ledger, which has to survive a change of day and has to refuse
   to keep his page in her house. And then the solid, which has to actually
   TURN — two yaws that render identically is a still picture with a
   compass drawn on it.                                                    */
const {chromium}=require('playwright');
const FILE='file:///home/user/Ancient-Life-sim-300-A.D-/index.html';
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

  const setup=()=>pg.evaluate(()=>{
    const S=window.__SS;
    S.newDemo('Kaiq','Leokanis','RkTorvak');
    const G=S.G; G.world='rk'; G.married=true; G.isFemale=false; G.hasVilla=true; G.day=40;
    G.hasBodyMap=true; G.hasSecretMap=true;
    const w=S.makeBride('rkrai',false,9,{male:true});
    w.male=false; w.eth='rkrai'; w.flaws=[]; w.quirks=[]; w.traits=['kanvek','tempting','curious','vakran'];
    w.body={face:9,hairq:7,bust:9,waist:8,booty:10,legs:8}; w.skin='#e6bd94';
    G.wife=w; G.body=G.body||{}; G.body.secret=9;
    G.wifeRel=90; G.wifePhys=90; G.hygiene=90;
    G.aroLog=[]; G.aroCount=0; G.aroDay=-1; G.aroAll=0;
    S.setSecretAroused(false);
    for(let i=0;i<200;i++) S.arouseTick(33);
  });

  console.log('\n=== ◐ IT RISES, AND IT ARRIVES ===');
  await setup();
  let R=await pg.evaluate(()=>{
    const S=window.__SS, o={};
    o.restLv=S.secretAroLv; o.restSettled=S.arouseSettled();
    S.rouse('urvaak');
    const climb=[]; let over=0, frames=0;
    for(let i=0;i<200;i++){ S.arouseTick(33); climb.push(S.secretAroLv);
      if(S.secretAroLv>1.0001) over=Math.max(over,S.secretAroLv);
      if(!S.arouseSettled()) frames=i+1; }
    o.peak=over; o.upFrames=frames; o.endLv=S.secretAroLv; o.upSettled=S.arouseSettled();
    /* it has to be MONOTONE all the way UP TO THE PEAK, or it is not a rise,
       it is a wobble. Past the peak it is SUPPOSED to come back down — that is
       the overshoot relaxing — so the check stops where the climb stops. */
    let top=0; for(let i=1;i<climb.length;i++) if(climb[i]>climb[top]) top=i;
    let dips=0; for(let i=1;i<=top;i++) if(climb[i]<climb[i-1]-1e-9) dips++;
    o.dips=dips; o.topAt=top;
    o.quarter=climb[7];                       // where it is a quarter of a second in
    S.setSecretAroused(false);
    let downFrames=0;
    for(let i=0;i<400;i++){ S.arouseTick(33); if(!S.arouseSettled()) downFrames=i+1; }
    o.downFrames=downFrames; o.downLv=S.secretAroLv; o.downSettled=S.arouseSettled();
    return o;
  });
  ok('at rest it is nought, and it says so',  R.restLv===0 && R.restSettled===true);
  ok('it climbs rather than cutting',         R.dips===0 && R.quarter>0.05 && R.quarter<0.99,
     'a quarter-second in: '+R.quarter.toFixed(2)+' · peaks at frame '+R.topAt);
  ok('and it overshoots a little at the top', R.peak>1.0 && R.peak<1.10, 'peak '+R.peak.toFixed(3));
  ok('AND THEN IT ARRIVES — settles back to exactly full',
     Math.abs(R.endLv-1)<1e-9 && R.upSettled===true, 'ends at '+R.endLv.toFixed(4));
  ok('it comes down SLOWER than it went up',  R.downFrames > R.upFrames*1.6,
     'up '+R.upFrames+' frames · down '+R.downFrames);
  ok('and it settles at nought too',          R.downLv===0 && R.downSettled===true);

  console.log('\n=== ◐ AND THE LEDGER KNOWS WHY ===');
  await setup();
  R=await pg.evaluate(()=>{
    const S=window.__SS, G=S.G, o={};
    ['urvaak','tempt','tempt','slap'].forEach(k=>S.rouse(k));
    o.today=S.arouseToday();
    o.why=S.arouseByWhy(7).map(r=>r.why+'×'+r.n);
    o.top=S.arouseByWhy(7)[0];
    o.named=S.arouseByWhy(7).every(r=>r.w && r.w.name && r.w.line && r.w.icon);
    o.stand=S.arouseStanding().k;
    o.logToday=S.arouseLog().length;
    /* A NEW DAY IS A NEW PAGE, and the old page is still in the book */
    G.day=41; S.rouse('curio');
    o.newDay=S.arouseToday(); o.newLog=S.arouseLog().length;
    o.stillCounts=S.arouseByWhy(7).length>1;
    o.perDay=S.arousePerDay();
    /* and it forgets eventually rather than growing for ever */
    for(let i=0;i<S.AROUSE_KEEP+20;i++) S.rouse('bend');
    o.capped=(G.aroLog||[]).length<=S.AROUSE_KEEP;
    /* HIS PAGE, NOT HERS */
    G.isFemale=true; const before=(G.aroLog||[]).length;
    const took=S.rouse('slap');
    o.hersRefused=(took===false) && ((G.aroLog||[]).length===before);
    G.isFemale=false;
    return o;
  });
  ok('four risings, and it says four',        R.today===4, R.why.join(' · '));
  ok('grouped by reason, commonest first',    R.top && R.top.why==='tempt' && R.top.n===2);
  ok('and every reason has a name and a why', R.named===true);
  ok('the day has a reading of its own',      R.stand==='ord', R.stand);
  ok('a new day is a new page',               R.newDay===1 && R.newLog===1);
  ok('and the old page is still in the book', R.stillCounts===true && R.perDay>0,
     R.perDay.toFixed(2)+' a day');
  ok('the ledger forgets rather than growing for ever', R.capped===true);
  ok('AND IT IS HIS PAGE — her house keeps none', R.hersRefused===true);

  console.log('\n=== ◐ AND EVERY CAUSE WRITES ITSELF DOWN ===');
  await setup();
  R=await pg.evaluate(()=>{
    const S=window.__SS, G=S.G, o={};
    const reasons=(n)=>(G.aroLog||[]).slice(-n).map(r=>r.why);
    const fresh=()=>{ G.aroLog=[]; G.aroCount=0; G.aroDay=-1; };
    const got={};
    S.openDomus();
    const D=S.DM;
    const clear=()=>{ S.HALL_BEATS.forEach(b=>{ D[b]=null; }); };
    const real=Math.random; Math.random=()=>0;
    // the low shelf
    fresh(); clear(); S.startTempt();          got.tempt=reasons(1)[0];
    // her, looking
    fresh(); clear(); S.startCurio();           got.curio=reasons(1)[0];
    // she called him over
    fresh(); clear(); S.startClam();            got.clam=reasons(1)[0];
    // the urvaak
    fresh(); clear(); G.letoutDay=-99; G.letoutCount=0; S.tryLetout();  got.urvaak=reasons(1)[0];
    // the hand
    fresh(); clear(); G.slapDay=G.day; G.slapCount=0; S.doSlap('test'); got.slap=reasons(1)[0];
    // the leaf
    fresh(); clear(); S.rkSivrakWear('both');   got.sivrak=reasons(1)[0];
    // and something came for you
    fresh(); clear(); S.selvskarArrive('focus',4); got.selvskar=reasons(1)[0];
    Math.random=real; clear();
    o.got=got;
    o.allKnown=Object.keys(got).every(k=>got[k]===k);
    o.missing=Object.keys(got).filter(k=>got[k]!==k).map(k=>k+'→'+got[k]);
    return o;
  });
  ok('the low shelf, her looking, the clam, the urvaak, the hand, the leaf and the letter',
     R.allKnown===true, R.missing.length? R.missing.join(' · ') : '7 causes, 7 right reasons');

  console.log('\n=== ⬔ AND THE CHART TURNS ===');
  R=await pg.evaluate(()=>{
    const S=window.__SS, G=S.G, o={};
    /* the profile is built off the SCORES, or it is a mannequin */
    const lean={male:false, skin:'#e6bd94', body:{face:5,hairq:5,bust:3,waist:5,booty:2,legs:5}};
    const full={male:false, skin:'#e6bd94', body:{face:5,hairq:5,bust:9,waist:5,booty:10,legs:5}};
    const A=S.bodyRings(lean), B=S.bodyRings(full);
    o.hipGrows = B.hipR > A.hipR*1.4;
    o.rises = A.torso.every((r,i)=>i===0 || r.y>A.torso[i-1].y);       // monotone up the figure
    o.seatBehind = A.torso.some(r=>r.zc<0);                            // the rump sits back
    o.bustForward= B.torso.some(r=>r.zc>0.5);                          // and the bust forward
    /* and it draws, and two yaws are two pictures */
    const cv=document.createElement('canvas'); cv.width=320; cv.height=300;
    const c=cv.getContext('2d');
    const shot=(yaw)=>{ c.clearRect(0,0,320,300); S.drawBody3D(c, full, 160, 270, 3.2, yaw);
      const D=c.getImageData(0,0,320,300).data; let n=0, sx=0;
      for(let i=3;i<D.length;i+=4) if(D[i]>40){ n++; sx+=((i-3)/4)%320; }
      return {n, cx:n? sx/n : 0}; };
    const f=shot(0), s90=shot(Math.PI/2), b=shot(Math.PI);
    o.ink=f.n; o.turns = Math.abs(f.cx-s90.cx)>0.5 || Math.abs(f.n-s90.n)>140;
    o.frontVsBack = Math.abs(f.n-b.n)>0;      // a rump behind is not a bust in front
    o.wideFront = f.n > s90.n;                // and she is wider seen from the front
    /* ---- AND IT IS ONE BODY. Two things went wrong here and neither threw:
       the arm was carried out on a fixed offset and hung in the air with a
       bar of background between it and the shoulder, and the bust was painted
       after the torso unconditionally so it showed through her back. Both are
       only findable by reading the pixels. ---- */
    const CY=270, SC=3.2;
    const rowRuns=(yaw, modelY)=>{               // gaps in one scanline of the figure
      c.clearRect(0,0,320,300); S.drawBody3D(c, full, 160, CY, SC, yaw, {plate:false, compass:false});
      const y=Math.round(CY-modelY*SC);
      const D=c.getImageData(0,y,320,1).data;
      const runs=[]; let on=false, x0=0;
      for(let x=0;x<320;x++){ const a=D[x*4+3]>40;
        if(a&&!on){ on=true; x0=x; } else if(!a&&on){ on=false; runs.push([x0,x]); } }
      if(on) runs.push([x0,320]);
      return runs;
    };
    /* at the shoulder the arm is JOINED ON — one run, not three */
    const sh=rowRuns(0, 58.0);
    o.shoulderRuns=sh.length; o.shoulderW=sh.length? sh[sh.length-1][1]-sh[0][0] : 0;
    /* and it is still an arm and not a sleeve: at the wrist, below the waist,
       the arms stand clear of the body */
    o.armsClear = rowRuns(0, 36.0).length>=1;
    /* THE BUST DOES NOT SHOW THROUGH HER BACK. It sits inside the ribcage
       ring, so it never changes the outline and a width test cannot see it —
       what it does is put two lit masses in the middle of the chest. The
       torso alone is a solid of revolution and renders the same at yaw and
       yaw+PI. Counting HUMPS rather than total light, because two masses
       side by side put two peaks across the chest and a bare ribcage — a
       solid of revolution under one lamp — puts at most one. */
    const humps=(yaw)=>{
      c.clearRect(0,0,320,300); S.drawBody3D(c, full, 160, CY, SC, yaw, {plate:false, compass:false});
      const y=Math.round(CY-55.2*SC), half=Math.round(7*SC);
      const D=c.getImageData(160-half, y, half*2, 1).data;
      const L=[]; for(let i=0;i<D.length;i+=4)
        L.push(D[i+3]>40? (D[i]*0.3+D[i+1]*0.59+D[i+2]*0.11) : -1);
      const sm=L.map((_,i)=>{ let s=0,n=0;
        for(let k=-2;k<=2;k++){ const v=L[i+k]; if(v!==undefined&&v>=0){s+=v;n++;} }
        return n? s/n : -1; });
      let peaks=0;
      for(let i=3;i<sm.length-3;i++){
        if(sm[i]<0) continue;
        if(sm[i]>=sm[i-3]+2 && sm[i]>=sm[i+3]+2) { peaks++; i+=4; }
      }
      return peaks;
    };
    o.bustFront=humps(0); o.bustBack=humps(Math.PI);
    o.noBustBehind = o.bustFront>=2 && o.bustBack<o.bustFront;
    /* the toggle is remembered */
    S.set3D(true);  o.on=S.bodyMap3D;
    S.set3D(false); o.off=S.bodyMap3D;
    return o;
  });
  ok('the profile is built off the scores',  R.hipGrows===true);
  ok('and it stacks up the figure in order', R.rises===true);
  ok('the seat sits behind and the bust in front', R.seatBehind===true && R.bustForward===true);
  ok('the solid actually draws',             R.ink>2000, R.ink+' px of it');
  ok('AND IT TURNS — front and side are two pictures', R.turns===true && R.frontVsBack===true);
  ok('wider seen from the front than the side', R.wideFront===true);
  ok('and the switch is a switch',           R.on===true && R.off===false);
  ok('THE ARMS ARE JOINED ON — no daylight at the shoulder',
     R.shoulderRuns===1, R.shoulderRuns+' run(s) across the shoulder, '+R.shoulderW+'px wide');
  ok('and the bust does not show through her back',
     R.noBustBehind===true, 'humps across the chest: front '+R.bustFront+' · back '+R.bustBack);

  /* ◐ THE TWO THINGS A PERSON ACTUALLY REPORTED, and neither of them was a
     thrown error. The switch existed and was labelled "⬚ FLAT" — a
     description of what you are already looking at — and it was built only
     on front/side/back, so on the secret graph, which is where anyone
     reading a measurement sits, there was no button at all. And the rise
     animated the DRAWING while the rule underneath it stayed nailed to the
     resting score, so the part of the chart you watch never moved. */
  console.log('\n=== ◐ AND YOU CAN SEE IT HAPPEN ===');
  await setup();
  R=await pg.evaluate(async()=>{
    const S=window.__SS, G=S.G, o={};
    S.set3D(false); S.setBodyMapWalk(false); S.setSecretSub('profile'); S.setSecretAroused(false);
    S.openBodyMap({self:true, male:true, skin:'#caa06a', body:G.body, name:'Kaiq', looks:7}, 'villa');
    await new Promise(r=>setTimeout(r,120));
    const subs=()=>[...document.querySelectorAll('#bodymap-subviews button')].map(b=>b.textContent.trim());
    const row =()=>{ const r=document.getElementById('bodymap-subviews');
                     return {vis:r.clientWidth, content:r.scrollWidth}; };
    o.frontSubs=subs(); o.frontRow=row();
    /* it says 3D wherever you are, including the view that has no solid */
    const secret=[...document.querySelectorAll('#bodymap-views button')].find(x=>/SECRET/.test(x.textContent));
    secret.click(); await new Promise(r=>setTimeout(r,120));
    o.secretSubs=subs(); o.secretRow=row();
    o.saysThreeD = o.frontSubs.some(t=>/3D/.test(t)) && o.secretSubs.some(t=>/3D/.test(t));
    o.noOverflow = o.frontRow.content<=o.frontRow.vis+1 && o.secretRow.content<=o.secretRow.vis+1;
    /* and from the secret graph the switch takes you to a view that has one */
    const d3=[...document.querySelectorAll('#bodymap-subviews button')].find(b=>/3D/.test(b.textContent));
    if(d3){ d3.click(); await new Promise(r=>setTimeout(r,140));
      o.tookYouThere = (S.bodyMap3D===true) && !/SECRET/.test(
        (document.querySelector('#bodymap-views button.gold')||{textContent:''}).textContent);
    } else o.tookYouThere='no switch on this view at all';
    /* ---- back to the graph, and does the RULE move? ---- */
    S.set3D(false); secret.click(); await new Promise(r=>setTimeout(r,120));
    const cv=document.getElementById('bodymap-cv'), c=cv.getContext('2d');
    const band=()=>c.getImageData(0,195,cv.width,36).data;      // the rule, the ticks and the ▲
    /* THE RUN MADE GOOD, measured as a width. Diffing the band is not enough:
       the bar's COLOUR tracks the measure too, so a bar pinned to the resting
       score still repaints and still looks like movement. Its right-hand edge
       is the thing that has to travel. */
    const barEdge=()=>{ const row=c.getImageData(0,208,cv.width,1).data;
      /* the bar is chopped into segments by the tick strokes drawn over it, so
         this walks the runs and takes the right edge of the last SUBSTANTIAL
         one — a lone stray pixel further out on the plate is not the bar, and
         taking the last hit of any size found one at 256 in every render and
         reported the bar as never moving. */
      const runs=[]; let on=false, x0=0;
      for(let x=0;x<=250;x++){ const i=x*4;
        const r=row[i], g=row[i+1], b=row[i+2];
        const hit = (x<250) && b>r+8 && b>60 && (r+g+b)>90;   // the purple run, not the grey plate
        if(hit&&!on){ on=true; x0=x; } else if(!hit&&on){ on=false; if(x-x0>=3) runs.push(x); }
      }
      return runs.length? runs[runs.length-1] : -1; };
    const settle=async()=>{ for(let i=0;i<400 && !S.arouseSettled();i++){ S.arouseTick(33);
                              await new Promise(r=>setTimeout(r,0)); }
                            S.redrawBodyMap(); };
    S.setSecretAroused(false); await settle();
    const rest=Uint8ClampedArray.from(band()); o.restEdge=barEdge();
    S.setSecretAroused(true);  await settle();
    const up=band(); o.upEdge=barEdge();
    let diff=0; for(let i=0;i<up.length;i+=4) if(Math.abs(up[i]-rest[i])>12 ||
                                                  Math.abs(up[i+2]-rest[i+2])>12) diff++;
    o.ruleRepainted=diff;
    o.ruleMoved = o.upEdge > o.restEdge + 6;
    /* and it is a TRAVEL, not a jump: intermediate levels are their own pictures */
    S.setSecretAroused(false); await settle();
    S.setSecretAroused(true);
    const seen={};
    for(let i=0;i<40;i++){ S.arouseTick(33); S.redrawBodyMap();
      const D=band(); let h=2166136261;
      for(let k=0;k<D.length;k+=4) h=(Math.imul(h^D[k],16777619)^D[k+2])>>>0;
      seen[h]=1; }
    o.stages=Object.keys(seen).length;
    return o;
  });
  ok('the switch says 3D wherever you are standing', R.saysThreeD===true,
     R.secretSubs.join(' | '));
  ok('and no button sits off the end of the row',    R.noOverflow===true,
     'front '+R.frontRow.content+'/'+R.frontRow.vis+'px · secret '+R.secretRow.content+'/'+R.secretRow.vis+'px');
  ok('from the secret graph it takes you to a view that has a solid',
     R.tookYouThere===true, R.tookYouThere===true? '' : String(R.tookYouThere));
  ok('THE RULE MOVES, not just the drawing',        R.ruleMoved===true,
     'the run ends at '+R.restEdge+'px at rest and '+R.upEdge+'px roused ('
     +R.ruleRepainted+' px of the band repainted)');
  ok('and it travels through it rather than cutting', R.stages>=8, R.stages+' distinct stages in 40 frames');

  console.log('\n--- PAGE ERRORS ---');
  ok('none', errs.length===0, errs.join(' | '));

  console.log('\n'+(fail? '✗ '+fail+' FAILED   ('+(pass+fail)+' checks)'
                        : 'ALL GREEN   ('+pass+' checks)'));
  await br.close();
  process.exit(fail?1:0);
})();
