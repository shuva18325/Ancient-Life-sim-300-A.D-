/* 🗣 THE VILLAGE, THE MEASURE, THE BEND AND THE COAST'S OWN CUT
   ---------------------------------------------------------------------
   Everything a player sent back from the last round, as checks:
     · "impossible should be like 10-13 inches", and then "still too short" —
       his length is sized in real inches, per man, and IMPOSSIBLE is 14–18;
     · the front view shrank him to a stub when he got hard;
     · "he might be smiling because he is hard";
     · "wife satisfiers … booty destroyer" — the village names him, and now
       her, the house and the street, with a board that shows all of it;
     · "the current bend-over has become a joke" — it is a posed figure now,
       and a scene can say the garment is up or off;
     · "in the Rkrai why did you use the old bust model dress" — the coast
       portrait was a sealed parka that showed nothing at any bust;
     · and the real figure never showed a child, the years or a scar.

   Run against the build before this round with FILE=file:///…/old.html:
   each check fails there for the reason it was written — except the few
   that are rails rather than regressions (she is a figure and not a blob
   at every depth; the cloth is over the nipples; no page errors), which
   were true before and have to stay true.                                  */
const {chromium}=require('playwright');
const FILE=process.env.FILE || ('file://'+require('path').resolve(__dirname,'..','index.html'));
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
    const G=S.G; G.world='rk'; G.rkRank='harra'; G.isFemale=false; G.married=true; G.day=40;
    G.hasBodyMap=true; G.hasSecretMap=true; G.wifePhys=80; G.wifeRel=80;
    const her=S.makeBride('rkrai',false,9,{male:true});
    her.male=false; her.eth='rkrai'; her.name='Ulva Raun'; her.traits=[]; her.quirks=[]; her.flaws=[];
    her.body=Object.assign(her.body||{},{bust:10,booty:10,legs:7,face:8}); her.looks=8;
    G.wife=her; G.body=G.body||{}; G.body.secret=10;
  });
  const T=async(fn,arg)=>{ try{ return await pg.evaluate(fn,arg); }catch(e){ return {err:String(e).slice(0,160)}; } };

  console.log('\n=== 📏 HIS MEASURE, IN INCHES ===');
  let R=await T(()=>{
    const S=window.__SS, o={};
    const man=(nm,v)=>({male:true, name:nm, body:{secret:v}});
    o.imp=[]; for(const nm of ['Aqal','Torvak','Kraun','Leok','Sivrek','Harran','Uqtar','Denik']) o.imp.push(S.lengthInches(man(nm,11),1).hard);
    o.five=S.lengthInches(man('Aqal',5),1).hard;
    o.same=S.lengthInches(man('Nalkir',8),1).hard===S.lengthInches(man('Nalkir',8),1).hard;
    o.differ=new Set(['Aqal','Torvak','Kraun','Leok'].map(n=>S.lengthInches(man(n,8),1).hard.toFixed(2))).size>1;
    o.rest=S.lengthInches(man('Aqal',11),0).now < S.lengthInches(man('Aqal',11),1).now;
    return o; });
  ok('IMPOSSIBLE is 14–18 inches hard, for every man', !R.err && R.imp.every(x=>x>=14 && x<=18), R.err||R.imp.map(x=>x.toFixed(1)).join(' '));
  ok('an ordinary rank-5 man is an ordinary 5.9–6.4 in', !R.err && R.five>=5.9 && R.five<=6.4, R.err||R.five.toFixed(2));
  ok('the same man measures the same every time', R.same===true);
  ok('and two men of one rank are not identical', R.differ===true);
  ok('he is shorter at rest than hard', R.rest===true);

  console.log('\n=== ⬆ HARD, FACING YOU, IS NOT A STUB ===');
  R=await T(()=>{
    const S=window.__SS;
    const cv=document.createElement('canvas'); cv.width=240; cv.height=320; const c=cv.getContext('2d');
    const span=(aro)=>{ c.clearRect(0,0,240,320); c.save(); c.translate(120,200); c.scale(10,10);
      S.drawLength(c,{x:0,y:0,L:8,D:1.6,aro,view:'front',skin:'#c89868',hair:'#2a1a10',lw:0.3,T:0,throb:false}); c.restore();
      const d=c.getImageData(0,0,240,320).data; let y0=1e9,y1=-1,x0=1e9,x1=-1;
      for(let y=0;y<320;y++) for(let x=0;x<240;x++) if(d[(y*240+x)*4+3]>40){ y0=Math.min(y0,y); y1=Math.max(y1,y); x0=Math.min(x0,x); x1=Math.max(x1,x); }
      return {h:y1-y0, w:x1-x0, top:y0}; };
    return {rest:span(0), hard:span(1)}; });
  const hardReach = R.err? 0 : Math.hypot(R.hard.h, R.hard.w);
  ok('front-on and hard, it reaches its whole length (8 in rest → 11.4 hard, 10 px/in)', !R.err && hardReach>=0.95*114,
     R.err || ('reach '+hardReach.toFixed(0)+' px · '+R.hard.w+'×'+R.hard.h));
  ok('and it goes UP — the tip stands three quarters of its length above the root', !R.err && R.hard.top < 200-0.75*114, R.err||('top at '+R.hard.top+' (root 200)'));

  console.log('\n=== ☺ HE SMILES ===');
  R=await T(()=>{
    const S=window.__SS, G=S.G;
    const him={male:true,self:true,skin:'#c89868',hair:'#2a1a10',body:{face:7,hairq:6,bust:7,waist:7,booty:7,legs:7,secret:8}};
    const M=S.chartLandmarks(him);
    const cv=document.createElement('canvas'); cv.width=200; cv.height=200; const c=cv.getContext('2d');
    const face=(aro)=>{ c.fillStyle='#101010'; c.fillRect(0,0,200,200); c.save();
      c.translate(100, 100-(M.headY-M.headH*0.13)*12); c.scale(12,12);
      S.drawRealFig(c,him,'front',undefined,{showLen:false,aro}); c.restore();
      return c.getImageData(40,70,120,60).data; };
    const out={};
    const dif=(a,b)=>{ let n=0; for(let i=0;i<a.length;i+=4) if(Math.abs(a[i]-b[i])+Math.abs(a[i+1]-b[i+1])+Math.abs(a[i+2]-b[i+2])>36) n++; return n; };
    const force=(f)=>{ if('HARD_FACE_FORCE' in S) S.HARD_FACE_FORCE=f; };
    force('grin');     G.world='rk';   out.rk=dif(face(0), face(1));
    force('sheepish'); G.world='rome'; out.rome=dif(face(0), face(1));
    force('stoic');    out.stoic=dif(face(0), face(1));
    /* NOT ALWAYS A SMILE: roll forty rises and count the faces */
    force('auto'); G.world='rk'; const seen={}, pub={};
    if(S.hardFace){ for(let i=0;i<200;i++){ S.HARD_ROLL=i; if(i<40) seen[S.hardFace(him,'chart').id]=1; pub[S.hardFace(him,'public').id]=(pub[S.hardFace(him,'public').id]||0)+1; } }
    out.kinds=Object.keys(seen); out.pubGrin=(pub.grin||0); out.pubQuiet=(pub.sheepish||0)+(pub.stoic||0);
    /* and it holds for the length of one rise */
    if(S.hardFace){ S.HARD_ROLL=7; const a1=S.hardFace(him,'chart').id, a2=S.hardFace(him,'chart').id; out.stable=(a1===a2); }
    G.world='rk';
    return out; });
  ok('picked GRINNING, his mouth turns up and the teeth show', !R.err && R.rk>150, R.err||(R.rk+' px'));
  ok('picked SHEEPISH, a small smile and the colour comes up', !R.err && R.rome>120, R.err||(R.rome+' px'));
  ok('picked STRAIGHT-FACED, hard and it barely moves his face', !R.err && R.stoic < R.rk*0.35, R.err||(R.stoic+' px'));
  ok('left on AUTO he does NOT always smile — forty rises, at least four different faces', !R.err && (R.kinds||[]).length>=4, R.err||(R.kinds||[]).join(','));
  ok('in PUBLIC EYES he grins rarely and mostly keeps it quiet', !R.err && R.pubGrin<=24 && R.pubQuiet>=100, R.err||('grin '+R.pubGrin+' · straight-faced or sheepish '+R.pubQuiet+' of 200'));
  ok('and one rise is one face — it does not flicker', R.stable===true);

  console.log('\n=== 🗣 WHAT THE VILLAGE CALLS THEM ===');
  R=await T(()=>{
    const S=window.__SS, G=S.G, o={};
    const set=(world,v,phys)=>{ G.world=world; G.body.secret=v; G.wifePhys=phys; };
    set('rk',11,80); o.rk11=(S.villageName()||{}).name;
    set('rk',8,85);  o.rk8=(S.villageName()||{}).name;
    set('rome',9,80); o.rome9=(S.villageName()||{}).name;
    set('rome',2,30); o.rome2=(S.villageName()||{}).name;
    set('rk',10,80);
    o.her=(S.villageNameF()||{}).name;
    o.house=(S.villageHouseName()||{}).name;
    G.wife.body.booty=10; G.wife.body.bust=6; o.queen=(S.villageNameF()||{}).name;
    G.world='rome'; G.wife.body.booty=6; G.wife.body.bust=10; o.hills=(S.villageNameF()||{}).name;
    G.world='rk'; G.wife.body.booty=10; G.wife.body.bust=10;
    const st=S.villageStreet(), st2=S.villageStreet();
    o.n=st.length; o.stable=JSON.stringify(st.map(h=>h.him.name+h.him.inches))===JSON.stringify(st2.map(h=>h.him.name+h.him.inches));
    o.named=st.every(h=>h.him.vn && h.her.vn);
    o.clash=st.some(h=>h.him.name.split(' ')[0]==='Kaiq' || h.her.name==='Ulva');
    o.rank=S.villageRank();
    return o; });
  ok('rank 11 on the coast: THE BOOTY DESTROYER', R.rk11==='THE BOOTY DESTROYER', R.err||R.rk11);
  ok('rank 8 with a delighted wife: THE WIFE SATISFIER', R.rk8==='THE WIFE SATISFIER', R.err||R.rk8);
  ok('Rome, rank 9, a pleased wife: THE WIFE SATISFIER', R.rome9==='THE WIFE SATISFIER', R.err||R.rome9);
  ok('Rome, rank 2: THE LITTLE SENATOR', R.rome2==='THE LITTLE SENATOR', R.err||R.rome2);
  ok('and HER: a bust-10, seat-10 coast wife is THE WHOLE LARDER', R.her==='THE WHOLE LARDER', R.err||R.her);
  ok('a seat-10 coast wife alone is THE BOOTY QUEEN', R.queen==='THE BOOTY QUEEN', R.err||R.queen);
  ok('a bust-10 Roman wife is THE EIGHTH AND NINTH HILLS', R.hills==='THE EIGHTH AND NINTH HILLS', R.err||R.hills);
  ok('the house: THE DESTROYER AND THE DESTROYED', R.house==='THE DESTROYER AND THE DESTROYED', R.err||R.house);
  ok('the street is five households, the same five every time', R.n===5 && R.stable===true, R.err||(R.n+' · stable '+R.stable));
  ok('every neighbour and his wife has a name', R.named===true);
  ok('nobody on the street shares your or your wife’s first name', R.clash===false);
  ok('and he is ranked against them', !!(R.rank && R.rank.of===6 && R.rank.place>=1), R.err||JSON.stringify(R.rank));

  R=await T(async()=>{
    const S=window.__SS, G=S.G; G.villageName=null; G.villageNameF=null; G.villageHouse=null; G.villageNameLog=[];
    S.villageNameNews();
    const log=G.villageNameLog.map(e=>e.who);
    S.openBodyMap(G.wife,'villa'); await new Promise(r=>setTimeout(r,60));
    const card=document.getElementById('bodymap-verdict').innerText;
    const btn=document.querySelector('#bodymap-verdict [data-vtalk]'); if(btn) btn.click();
    await new Promise(r=>setTimeout(r,60));
    const h2=document.getElementById('villa-h2').textContent, cards=document.querySelectorAll('#villa-body .shopcard').length;
    document.getElementById('btn-villa-back').click(); await new Promise(r=>setTimeout(r,60));
    const back=(document.querySelector('.screen.on')||{}).id;
    const reset=String(document.getElementById('btn-villa-back').onclick).indexOf('enterMap')>=0;
    const inch=S.fmtLen(10); S.SETTINGS.metric=true; const cm=S.fmtLen(10); S.SETTINGS.metric=false;
    return {log, herCard:/The village calls her/.test(card), h2, cards, back, reset, inch, cm}; });
  ok('the day it lands the house hears his, hers and the house’s — and writes them down', !R.err && ['him','her','house'].every(k=>R.log.indexOf(k)>=0), R.err||R.log.join(','));
  ok('her body-map card says what the village calls her', R.herCard===true);
  ok('THE WHOLE STREET opens the board, with a card for each', /VILLAGE CALLS EVERYONE/.test(R.h2||'') && R.cards>=4, R.err||(R.h2+' · '+R.cards+' cards'));
  ok('and BACK goes back to her chart, and lets go of the button', R.back==='scr-bodymap' && R.reset===true, R.err||(R.back+' · reset '+R.reset));
  ok('Settings → Measures reads it in centimetres', R.inch==='10.0 in' && R.cm==='25.4 cm', R.err||(R.inch+' / '+R.cm));

  console.log('\n=== 🍑 THE BEND ===');
  R=await T(()=>{
    const S=window.__SS, G=S.G; G.world='rk';
    const w=G.wife; w.skin='#e6bd94'; w.dress='#e8c04a'; w.hair='#3a2618';
    const cv=document.createElement('canvas'); cv.width=120; cv.height=110; const c=cv.getContext('2d');
    const draw=(k,opt)=>{ c.clearRect(0,0,120,110); if(opt) S.BEND_OPT=opt; S.drawWifeFigTest(c,50,104,w,k,'bend',0);
      const d=c.getImageData(0,0,120,110).data; let x0=1e9,x1=-1,y0=1e9,y1=-1,skin=0,n=0;
      for(let y=0;y<110;y++) for(let x=0;x<120;x++){ const i=(y*120+x)*4; if(d[i+3]<200) continue;
        if(d[i]<40 && d[i+1]<30 && d[i+2]<30) continue;                  // the soft floor shadow
        n++; x0=Math.min(x0,x); x1=Math.max(x1,x); y0=Math.min(y0,y); y1=Math.max(y1,y);
        if(Math.abs(d[i]-230)+Math.abs(d[i+1]-189)+Math.abs(d[i+2]-148)<70) skin++; }
      return {w:x1-x0, h:y1-y0, skin, n, data:Array.from(d)}; };
    const up=draw(0.1), down=draw(1), lifted=draw(1,{lifted:true}), bare=draw(1,{bare:true});
    let dl=0; for(let i=0;i<down.data.length;i+=4) if(Math.abs(down.data[i]-lifted.data[i])+Math.abs(down.data[i+1]-lifted.data[i+1])>40) dl++;
    return {up:{w:up.w,h:up.h}, down:{w:down.w,h:down.h,n:down.n,skin:down.skin}, lifted:{skin:lifted.skin}, bare:{skin:bare.skin}, dl}; });
  ok('barely begun she is standing — taller than wide', !R.err && R.up.h > R.up.w, R.err||(R.up.w+'×'+R.up.h));
  ok('all the way down she is folded — wider than tall', !R.err && R.down.w > R.down.h*0.95, R.err||(R.down.w+'×'+R.down.h));
  ok('and she is a figure, not a blob: a real area of sprite', !R.err && R.down.n>450, R.err||(R.down.n+' px'));
  ok('a scene can say the cloth is UP — and under it is her', !R.err && R.lifted.skin > R.down.skin+60 && R.dl>60, R.err||('skin '+R.down.skin+' → '+R.lifted.skin+' · '+R.dl+' px differ'));
  ok('or OFF — the lower half, and more of her again', !R.err && R.bare.skin >= R.lifted.skin && R.bare.skin > R.down.skin+60, R.err||('skin '+R.down.skin+' → '+R.bare.skin));

  console.log('\n=== 👗 THE COAST PORTRAIT WEARS THE COAST’S CUT ===');
  R=await T(()=>{
    const S=window.__SS, G=S.G; G.world='rk'; G.rkRank=S.RK_RANKS[0].id;
    const mk=(eth,bust,extra)=>{ const w=S.makeBride(eth,false,9,{male:true}); w.male=false; w.eth=eth; w.traits=[]; w.quirks=[]; w.flaws=[];
      w.skin='#e6bd94'; w.dress='#e8c04a'; w.age=22; w.body=Object.assign(w.body||{},{face:8,hairq:7,bust,waist:8,booty:6,legs:8}); return Object.assign(w,extra||{}); };
    const chest=(w)=>{ const cv=document.createElement('canvas'); cv.width=148; cv.height=148; S.drawBridePortrait(cv,w,false,0);
      /* the bust itself: below the collar, above the belt, clear of her face and of the arm on her hip */
      const d=cv.getContext('2d').getImageData(62,47,24,22).data; let skin=0, nip=0;
      for(let i=0;i<d.length;i+=4){ const r=d[i],g=d[i+1],b=d[i+2];
        if(Math.abs(r-230)+Math.abs(g-189)+Math.abs(b-148)<46) skin++;
        if(Math.abs(r-175)+Math.abs(g-110)+Math.abs(b-93)<26) nip++; }
      return {skin, nip}; };
    const o={};
    o.rk3=chest(mk('rkrai',3)); o.rk10=chest(mk('rkrai',10)); o.rk10lace=chest(mk('rkrai',10,{rkTitleForced:'bosom'}));
    o.parka=chest(mk('rkrai',10,{_cutForce:'parka'}));
    G.world='rome'; o.rome10=chest(mk('roman',10)); G.world='rk';
    return o; });
  ok('a bust-10 coast wife’s portrait shows her bust — not a sealed parka', !R.err && R.rk10.skin > R.parka.skin*2 + 60, R.err||('ulvik '+R.rk10.skin+' · parka '+R.parka.skin));
  ok('more of it than a Roman gown at the same bust', !R.err && R.rk10.skin > R.rome10.skin, R.err||('coast '+R.rk10.skin+' · Rome '+R.rome10.skin));
  ok('and it grows with her: bust 10 shows more than bust 3', !R.err && R.rk10.skin > R.rk3.skin + 40, R.err||(R.rk3.skin+' → '+R.rk10.skin));
  ok('the cloth is over the nipples, whatever the neckline — even the Ulvanne V', !R.err && R.rk10.nip===0 && R.rk10lace.nip===0, R.err||('plain '+R.rk10.nip+' · lace '+R.rk10lace.nip));

  console.log('\n=== 🤰 THE REAL FIGURE: A CHILD, THE YEARS, A SCAR ===');
  R=await T(()=>{
    const S=window.__SS;
    const cv=document.createElement('canvas'); cv.width=220; cv.height=300; const c=cv.getContext('2d');
    const shot=(w,view,sc)=>{ c.clearRect(0,0,220,300); c.save(); c.translate(110,290); c.scale(sc||3.6,sc||3.6);
      S.drawRealFig(c,w,view||'front',undefined,{}); c.restore(); return c.getImageData(0,0,220,300).data; };
    const dif=(A,B)=>{ let n=0; for(let i=0;i<A.length;i+=4) if(Math.abs(A[i]-B[i])+Math.abs(A[i+1]-B[i+1])+Math.abs(A[i+2]-B[i+2])>30) n++; return n; };
    const her=(o)=>Object.assign({male:false,skin:'#e6bd94',hair:'#4a2a18',body:{face:8,hairq:7,bust:8,waist:7,booty:8,legs:7},age:24},o);
    const him=(o)=>Object.assign({male:true,skin:'#c89868',hair:'#2a1a10',body:{face:7,hairq:6,bust:7,waist:7,booty:7,legs:7,secret:6},age:30},o);
    const o={};
    o.preg=dif(shot(her({preg:0})), shot(her({preg:9})));
    o.pregSide=dif(shot(her({preg:0}),'side'), shot(her({preg:9}),'side'));
    o.early=dif(shot(her({preg:0})), shot(her({preg:2})));
    const grey=(d)=>{ let s=0,n=0; for(let i=0;i<d.length;i+=4){ if(d[i+3]<200) continue; const mx=Math.max(d[i],d[i+1],d[i+2]), mn=Math.min(d[i],d[i+1],d[i+2]); s+=(mx-mn); n++; } return s/Math.max(1,n); };
    o.old=dif(shot(her({age:24})), shot(her({age:60})));
    const scars=[{zone:'torso',u:0.3,v:0.4,len:4,sev:3,side:1},{zone:'face',u:0.7,v:0.4,len:3,sev:1,side:-1}];
    o.scar=dif(shot(him({})), shot(him({scars})));
    return o; });
  ok('month nine shows — a belly in front of her', !R.err && R.preg>250, R.err||(R.preg+' px'));
  ok('and in profile it comes out past her', !R.err && R.pregSide>200, R.err||(R.pregSide+' px'));
  ok('month two barely shows at all', !R.err && R.early < R.preg*0.25, R.err||(R.early+' px'));
  ok('at sixty the years are on her — grey, lines, a softer jaw', !R.err && R.old>300, R.err||(R.old+' px'));
  ok('and a man’s scars are where the blade went in', !R.err && R.scar>20, R.err||(R.scar+' px'));

  console.log('\n--- PAGE ERRORS ---');
  ok('none', errs.length===0, errs.slice(0,3).join(' | '));
  console.log('\n'+(fail? '✗ '+fail+' FAILED' : 'ALL GREEN')+'   ('+(pass+fail)+' checks)');
  await br.close();
  process.exit(fail?1:0);
})();
