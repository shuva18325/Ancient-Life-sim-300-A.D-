/* 🛏 V38 — THE NEW BODIES IN EVERY WOOHOO, THE BREEDING HOUSES, THE COAST
   ---------------------------------------------------------------------
   From the round that asked for a SUPER BIG update:
     · "once you build in the villa it says build your place in Asia Minor,
       even though I'm in Alaska";
     · "after the bend woohoo, once the husband comes to her — not even
       pants down — it's still old models";
     · "when she bends down in the Rkrai dress it looks like ovals with
       some skin";
     · "rework the Kanvek with the better bodies — rework ALL woohoos";
     · "breeding houses for the Rkrai: the poor go to the breeding house,
       the rich have their own hubs, the grown kids are sent there".
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
  const SETUP=(world,opt)=>{ opt=opt||{}; const S=window.__SS; S.newDemo('Kaiq','Leokanis','RkTorvak'); const G=S.G;
    G.world=world; G.rkRank='harra'; G.coin=99999; G.isFemale=false; G.married=true; G.hygiene=90; G.day=400; G.lastLoveDay=399;
    G.hasVilla=(opt.villa!==false);
    const sp=S.makeBride(world==='rk'?'rkrai':'roman',false,9,{male:true}); sp.male=false; sp.eth=world==='rk'?'rkrai':'roman';
    sp.name='Ulva Raun'; sp.quirks=[]; sp.flaws=[]; sp.traits=['vakran','tempting'];
    sp.body=Object.assign(sp.body||{},{booty:10,bust:9,waist:8,legs:7,face:8,secret:5}); G.wife=sp; G.wifeRel=85; G.wifePhys=60;
    G.body=G.body||{}; G.body.secret=9; return G; };
  const src='('+SETUP.toString()+')';

  console.log('\n=== 🗺 THE COAST BUILDS ON THE COAST ===');
  let R=await T((src)=>{ const S=window.__SS; const G=eval(src)('rk'); G.married=false; S.openVilla();
    const t=document.body.innerText, opts=[...document.querySelectorAll('select option')].map(o=>o.value);
    const set=Object.keys(S.legacySet());
    const g2={world:'rk', legacy:{prov:'Asia Minor', level:2, day:10}}; const m=S.migrate(g2);
    return {asia:(t.match(/Asia Minor/g)||[]).length, rome:/All Rome takes note/.test(t), hasLeo:opts.indexOf('Leokanis')>=0, set, moved:m.legacy.prov}; }, src);
  ok('the villa on the coast never offers Asia Minor', !R.err && R.asia===0, R.err||(R.asia+' mentions'));
  ok('it offers the coast’s own seats, capital first', !R.err && R.hasLeo && R.set[0]==='Leokanis', R.err||R.set.join(','));
  ok('an old coast save seated in “Asia Minor” is moved home, same wealth band', !R.err && R.moved==='Leokanis', R.err||R.moved);

  console.log('\n=== 🍑 AFTER THE BEND — HE IS THE NEW BODY THE WHOLE WAY ===');
  R=await T((src)=>{ const S=window.__SS; const G=eval(src)('rome'); S.openDomus(); const D=S.DM; D.kids=[]; D.x=D.wifeX-60; D.face=1;
    S.startTempt(); const X=D.tempt; X.invited=false; X.fdir=1; X.x=D.wifeX; X.shelf=X.x+14;
    const phases=[['bend',120],['approach',60],['resist',10],['look',40],['took',120],['held',40]], got={};
    for(const [ph,t] of phases){ X.ph=ph; X.t=t; if(ph==='resist'){ X.hold=20; } if(ph==='look'){ X.round=1; X.mk=0.4; X.zc=0.5; X.zw=0.3; }
      if(ph!=='bend' && ph!=='approach') D.x=X.x-24;
      const m0=S.MAN_DRAWS, p0=S.PAIR_DRAWS; S.drawDomus(); got[ph]=(S.MAN_DRAWS>m0 || S.PAIR_DRAWS>p0); }
    X.ph='took'; X.t=120; D.x=X.x-24; S.drawDomus(); const lastGap=X.lastGap;
    S.startVillaLove(X.x,false,true); const gap0=D.scene&&D.scene.gap0;
    return {got, lastGap, gap0}; }, src);
  ok('every phase of the tempt draws him with the new figure (bend · approach · resist · look · took · held)', !R.err && Object.values(R.got||{}).every(Boolean), R.err||JSON.stringify(R.got));
  ok('and the woohoo picks him up from where he was standing (no jump)', !R.err && R.gap0!==null && R.gap0!==undefined && Math.abs((R.lastGap-3.6)-R.gap0)<0.6, R.err||(R.lastGap+' → '+R.gap0));

  console.log('\n=== 👗 THE COAST BEND IS NOT OVALS ===');
  R=await T((src)=>{ const S=window.__SS; const G=eval(src)('rk'); const w=G.wife;
    const cv=document.createElement('canvas'); cv.width=160; cv.height=110; const c=cv.getContext('2d');
    const shot=(opt)=>{ c.clearRect(0,0,160,110); S.BEND_OPT=opt; const Q=S.drawWifeFig(c,80,104,w,1,'bend'); S.BEND_OPT=null; return {Q, d:c.getImageData(0,0,160,110).data}; };
    const A=shot(null), B=shot({lifted:true});                        // dressed, and the same bend with the skirt pushed up
    const SC=[80+A.Q.SC[0], 104+A.Q.SC[1]], r=A.Q.rs; let same=0, n=0;
    for(let y=Math.round(SC[1]+r*0.15); y<Math.round(SC[1]+r); y++) for(let x=Math.round(SC[0]-r); x<Math.round(SC[0]+r); x++){
      if((x-SC[0])**2+(y-SC[1])**2 > r*r*0.85) continue; const i=(y*160+x)*4; if(A.d[i+3]<10) continue; n++;
      if(Math.abs(A.d[i]-B.d[i])+Math.abs(A.d[i+1]-B.d[i+1])+Math.abs(A.d[i+2]-B.d[i+2])<40) same++; }
    return {frac: same/Math.max(1,n), n}; }, src);
  ok('bent over in the short coast cut, the lower curve of her seat is HER, not a cloth oval', !R.err && R.frac>0.35, R.err||(Math.round(R.frac*100)+'% of it is the same as bare, over '+R.n+' px'));

  console.log('\n=== 🛏 EVERY POSITION, ON THE NEW BODIES ===');
  R=await T((src)=>{ const S=window.__SS; const G=eval(src)('rk'); G.hasPool=true; G.hasWardrobe=true; const res={}, errs=[];
    for(let vi=0; vi<=26; vi++){ const place=[8,9,10].includes(vi)? 'pool' : [11,12,13].includes(vi)? 'bath' : [14,15,16].includes(vi)? 'wardrobe' : 'bed';
      S.setWH('done'); S.startBedScene('fun','night',place); const BC=S.BC; if(!BC){ res[vi]='noBC'; continue; }
      BC.forcePose=vi; S.setBCT(600+vi*7); const n0=S.BEDPOSE_DRAWS;
      try{ S.drawBed(); }catch(e){ errs.push(vi+':'+e.message); }
      const L=S.BEDPOSE_LAST; res[vi]= (S.BEDPOSE_DRAWS>n0 && L && L.vi===vi && L.him && L.her && L.him.head && L.her.head)? 'ok' : 'old'; }
    S.setMediumCensor(false); S.setWH('done'); S.startBedScene('fun','night','bed'); S.BC.forcePose=2; S.setBCT(700); const h0=S.BEDPOSE_DRAWS; S.drawBed(); const heavy=S.BEDPOSE_DRAWS>h0; S.setMediumCensor(true);
    return {res, errs, heavy}; }, src);
  const bad=R.res? Object.entries(R.res).filter(([k,v])=>v!=='ok').map(([k])=>k) : ['?'];
  ok('all 27 positions (bed, lagoon, bath, wardrobe, the cultures, the coast and the tubs) draw the two new figures', !R.err && bad.length===0 && R.errs.length===0, R.err||('not new: '+(bad.join(',')||'none')+(R.errs.length? ' · '+R.errs[0] : '')));
  ok('and the silhouette setting still gets its silhouettes', !R.err && R.heavy===false);

  console.log('\n=== ✧ THE KANVEK ===');
  R=await T((src)=>{ const S=window.__SS; const G=eval(src)('rk'); G.wife.traits.push('kanvek');
    S.setWH('done'); S.startBedScene('fun','quick','bed'); const BC=S.BC; BC.forcePose=22; S.setBCT(620); S.drawBed();
    const L=S.BEDPOSE_LAST, him=L&&L.him, her=L&&L.her;
    const hand=him&&him.hand, head=her&&her.head, mouth=her&&her.mouth, tip=him&&him.tip;
    return {kind:L&&L.kind, handOnHead: hand&&head? Math.hypot(hand[0]-head[0], hand[1]-head[1]) : 99,
            kneeling: her&&her.knee? her.knee[1] > her.hip[1] : false, higher: him&&her? him.head[1] < her.head[1]-10 : false, finAt:!!BC.finAt}; }, src);
  ok('she kneels, he stands, and her head is well below his', !R.err && R.kind==='kneel' && R.kneeling && R.higher, R.err||JSON.stringify(R));
  ok('his hand is on her head — she put it there', !R.err && R.handOnHead<7, R.err||(R.handOnHead.toFixed(1)+' px'));
  ok('and the finish knows where her face is', !R.err && R.finAt===true);

  console.log('\n=== ◆ THE BREEDING HOUSE ===');
  R=await T((src)=>{ const S=window.__SS; let G=eval(src)('rk',{villa:false});
    const coin0=G.coin; S.setWH('done'); S.startBedScene('heir','long','bed'); const poorPlace=S.BC&&S.BC.place, fee=coin0-G.coin;
    S.setBCT(300); const n0=S.BEDPOSE_DRAWS; S.drawBed(); const drew=S.BEDPOSE_DRAWS>n0;
    S.setWH('done'); S.startBedScene('fun','long','bed'); const funPlace=S.BC.place;
    G=eval(src)('rk'); G.rkHub=false; S.setWH('done'); S.startBedScene('heir','long','hub'); const noHub=S.BC.place;
    G.rkHub=true; S.setWH('done'); S.startBedScene('heir','long','hub'); const hub=S.BC.place;
    G=eval(src)('rome',{villa:false}); S.setWH('done'); S.startBedScene('heir','long','breed'); const rome=S.BC.place;
    return {poorPlace, fee, drew, funPlace, noHub, hub, rome}; }, src);
  ok('a poor coast house trying for a child goes to the breeding house', !R.err && R.poorPlace==='breed', R.err||R.poorPlace);
  ok('and pays the fee at the door', !R.err && R.fee===12, R.err||(R.fee+'d'));
  ok('the tubs are drawn with the two of them in them, on the new bodies', !R.err && R.drew===true);
  ok('pleasure, not a child, still happens at home', !R.err && R.funPlace==='bed', R.err||R.funPlace);
  ok('no hub, no hub — a rich house that has built one gets its own', !R.err && R.noHub==='bed' && R.hub==='hub', R.err||(R.noHub+' / '+R.hub));
  ok('and there is no breeding house in Rome', !R.err && R.rome==='bed', R.err||R.rome);

  R=await T((src)=>{ const S=window.__SS; const G=eval(src)('rk');
    const img=(place,vi)=>{ S.setWH('done'); S.startBedScene('heir','long',place); S.BC.forcePose=vi; S.setBCT(300); S.drawBed(); return document.getElementById('game').getContext('2d').getImageData(0,0,480,270).data; };
    const dif=(A,B)=>{ let n=0; for(let i=0;i<A.length;i+=4) if(Math.abs(A[i]-B[i])+Math.abs(A[i+1]-B[i+1])+Math.abs(A[i+2]-B[i+2])>40) n++; return n; };
    G.rkHub=true; const hub=img('hub',9), pub=img('breed',9); S.setMediumCensor(true); const bed=img('bed',9);
    return {hubVsPub:dif(hub,pub), pubVsBed:dif(pub,bed)}; }, src);
  ok('the hub is its own room, not the public hall re-coloured', !R.err && R.hubVsPub>6000, R.err||(R.hubVsPub+' px'));
  ok('and the breeding house is not the bedchamber', !R.err && R.pubVsBed>12000, R.err||(R.pubVsBed+' px'));

  R=await T((src)=>{ const S=window.__SS; const G=eval(src)('rk');
    const kid=(age,spAge,wedAgo)=>({name:'Toruk Raun', sex:'m', born:G.day-2.4*age, wed:true, livesHome:true, wedDay:G.day-2.4*wedAgo, spouse:{name:'Aneq Varro', male:false, age:spAge}});
    const minor=kid(16,16,0), adult=kid(24,22,2); G.children=[minor, adult];
    const list=S.rkBreedKids().map(c=>c.name+'/'+c.born);
    const r1=S.rkSendKidsToBreed(minor);
    const rnd=Math.random; Math.random=()=>0.01; const r2=S.rkSendKidsToBreed(adult); Math.random=rnd;
    const again=S.rkSendKidsToBreed(adult);
    S.openVilla(); const t=document.body.innerText;
    return {n:list.length, minorOk:r1.ok, adultOk:r2.ok, hit:r2.hit, kids:adult.kids|0, again:again.ok, card:/BREEDING HOUSE/.test(t), send:/SEND TORUK/.test(t), hubBtn:/BUILD A BREEDING HUB/.test(t)}; }, src);
  ok('only the grown couple is offered — a sixteen-year-old is not', !R.err && R.n===1 && R.minorOk===false, R.err||JSON.stringify(R));
  ok('sending the grown couple can bring a grandchild', !R.err && R.adultOk && R.hit && R.kids===1, R.err||JSON.stringify(R));
  ok('once a month, not every day', !R.err && R.again===false);
  ok('the villa on the coast has the breeding house card, the send button and the hub to build', !R.err && R.card && R.send && R.hubBtn, R.err||JSON.stringify(R));
  R=await T((src)=>{ const S=window.__SS; eval(src)('rome'); S.openVilla(); return {card:/KAN’S SECOND PAGE/.test(document.body.innerText)}; }, src);
  ok('and Rome has none of it', !R.err && R.card===false);

  console.log('\n=== 🚪 THE DOORWAY BEFORE THE LAMPS GO DOWN ===');
  R=await T((src)=>{ const S=window.__SS; eval(src)('rome'); const got={};
    for(const [place,t] of [['bed',60],['bed',200],['bed',300],['bed',450],['pool',200],['pool',370]]){
      S.setWH('done'); S.startBedScene('fun','long',place); S.setBCT(t); const s0=S.SIL_DRAWS, f0=S.BEDPOSE_DRAWS; S.drawBed(); got[place+t]=(S.SIL_DRAWS>s0) || t===60; }
    return got; }, src);
  ok('the doorway gag is played by the new bodies’ own silhouettes, in the bedchamber and at the lagoon', !R.err && Object.values(R).every(Boolean), R.err||JSON.stringify(R));

  console.log('\n=== 🏛 THE ARDOR ===');
  R=await T((src)=>{ const S=window.__SS; eval(src)('rome'); S.openDomus(); const D=S.DM; D.ardor={ph:'wind', heat:60, need:10, got:6, stage:2, t:0};
    const m0=S.MAN_DRAWS; S.drawDomus(); return {drew:S.MAN_DRAWS>m0}; }, src);
  ok('getting hard in the hall is the new body, the tunic tenting on him', !R.err && R.drew===true, R.err);

  console.log('\n--- PAGE ERRORS ---');
  ok('none', errs.length===0, errs.slice(0,3).join(' | '));
  console.log('\n'+(fail? '✗ '+fail+' FAILED' : 'ALL GREEN')+'   ('+(pass+fail)+' checks)');
  await br.close();
  process.exit(fail?1:0);
})();
