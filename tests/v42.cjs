/* 🚶 V42 — THE HALL ON THE NEW BODIES, THE CREATION TABLE, THE KIT, AND THE ESCALATORS
   ---------------------------------------------------------------------
   From the round that asked for:
     · "do [roadmap item] 1" — the villa walkers onto the woohoo figures;
     · "in character selection the body map doesn't work";
     · "in Rkrai and Japan and other countries you can't see all the characters";
     · "they advertise gear and stuff but they don't give it — add more gear";
     · "a resisting animation for when she bends — one is looking, one is
        preparing, one is getting hard";
     · "escalators: Big — slap her and a woohoo happens; Medium — a romantic
        slap and now she wants it; same for husband; custom in-villa woohoos".
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

  console.log('\n=== 🗺 THE BODY MAP AT THE CREATION TABLE ===');
  let R=await T(()=>{ const S=window.__SS; const errs=[]; const on=(e)=>errs.push(String(e.message||e)); window.addEventListener('error', on);
    document.getElementById('btn-new').click(); S.createPreviewMap();
    const views=[...document.querySelectorAll('#bodymap-views button')].length, subs=[...document.querySelectorAll('#bodymap-subviews button')].length;
    const noCareer=!S.G;
    document.getElementById('btn-bodymap-back').click();
    const backOnCreate=getComputedStyle(document.getElementById('scr-create')).display!=='none';
    window.removeEventListener('error', on);
    return {views, subs, noCareer, backOnCreate, errs}; });
  ok('from a fresh page the chart opens with its views and toggles, no career needed', !R.err && R.views>=4 && R.subs>=3 && R.errs.length===0, R.err||JSON.stringify(R));
  ok('and BACK returns to the creation table', !R.err && R.backOnCreate);
  R=await T(()=>{ const S=window.__SS; S.newDemo('Kaiq','Leokanis','RkTorvak'); const name0=S.G.name;
    document.getElementById('btn-new').click(); S.createPreviewMap(); const during=!!S.G;
    document.getElementById('btn-bodymap-back').click(); return {during, after:!!S.G && S.G.name===name0}; });
  ok('with an old career loaded the preview charts no career, and hands the old one back', !R.err && R.during===false && R.after===true, R.err||JSON.stringify(R));

  console.log('\n=== 🃏 EVERY CARD, IN EVERY WORLD ===');
  R=await T(async ()=>{ const S=window.__SS; S.SETTINGS.rkUnlocked=true; document.getElementById('btn-new').click(); const out={};
    for(let wi=0; wi<document.querySelectorAll('#world-row button').length; wi++){
      document.querySelectorAll('#world-row button')[wi].click(); await new Promise(r=>requestAnimationFrame(r));
      const cb=document.getElementById('create-body'), cards=[...document.getElementById('card-list').children], seen=new Set();
      for(let y=0; y<=cb.scrollHeight; y+=Math.max(40,cb.clientHeight/2)){ cb.scrollTop=y; await new Promise(r=>requestAnimationFrame(r));
        const Rr=cb.getBoundingClientRect(); cards.forEach((c,i)=>{ const b=c.getBoundingClientRect(); if(b.top>=Rr.top-1 && b.top<Rr.bottom-20) seen.add(i); }); }
      out[S.sel.world]={n:cards.length, seen:seen.size, h:Math.round(document.getElementById('card-list').getBoundingClientRect().height)}; }
    return out; });
  const worlds=R.err? [] : Object.keys(R);
  ok('Rome, the East, Japan and the Rkrai shore: every card can be scrolled into view', !R.err && worlds.length>=4 && worlds.every(k=>R[k].seen===R[k].n && R[k].h>100), R.err||JSON.stringify(R));
  R=await T(()=>{ const S=window.__SS, sel=S.sel; document.getElementById('btn-new').click();
    sel.world='east'; sel.arch=null; sel.roll=null; S.openCreate();
    const rb=[...document.querySelectorAll('#class-row button')]; rb[rb.length-1].click();
    const got={};
    for(const key of ['SteppeRider','Tamil','Cataphract']){ const c=[...document.getElementById('card-list').children].find(x=>x.firstChild.textContent===S.ARCHETYPES[key].name);
      c.click(); got[key]=sel.arch===key && !document.getElementById('btn-create-go').disabled; }
    return got; });
  ok('on the eastern sheet the horse-archer, the Tamil champion and the Kushan cataphract can be chosen', !R.err && R.SteppeRider && R.Tamil && R.Cataphract, R.err||JSON.stringify(R));

  console.log('\n=== 🐎 THE KIT THE CARD PROMISES IS THE KIT YOU GET ===');
  R=await T(()=>{ const S=window.__SS, o={};
    const k=(a,soc)=>S.startKitFor(a,soc);
    o.samurai=k('WaSamurai','samurai'); o.teppo=k('WaTeppo','kokujin'); o.ikki=k('WaIkki','hyakusho'); o.ronin=k('WaRonin','samurai');
    o.aqalik=k('RkAqalik','kaiq'); o.steppe=k('SteppeRider','hundredriders'); o.daimyo=k('WaTaisho','daimyo');
    S.newDemo('Tadanaga','Owari','WaSamurai'); o.gSam={mount:S.G.mount, owned:S.G.owned.weapon};
    S.newDemo('Magoichi','Owari','WaTeppo'); o.gTep={bow:S.G.bow, bows:S.G.bowsOwned};
    S.newDemo('Aqa','Leokanis','RkAqalik'); o.gAq={boat:S.G.boat};
    return o; });
  ok('the samurai gets the horse under him and the second sword', !R.err && R.samurai.mount===2 && R.samurai.spare.weapon.indexOf('wakizashi')>=0 && R.gSam.mount===2 && R.gSam.owned.indexOf('wakizashi')>=0, R.err||JSON.stringify(R.gSam));
  ok('the gunner gets his matchlock, the ikki man his clay bomb, the rōnin his pair', !R.err && R.teppo.bow==='tanegashima' && R.gTep.bow==='tanegashima' && R.ikki.bow==='horoku' && R.ronin.spare.weapon.indexOf('wakizashi')>=0, R.err||JSON.stringify(R.gTep));
  ok('the water-hand gets the skin boat; a chief of a hundred gets his hundred riders', !R.err && R.aqalik.boat && R.gAq.boat===true && R.steppe.men===100 && R.steppe.mount===2 && R.daimyo.men===3000, R.err||JSON.stringify(R.steppe));
  R=await T(()=>{ const S=window.__SS; document.getElementById('btn-new').click(); S.sel.world='wa'; S.sel.arch=null; S.openCreate();
    document.querySelectorAll('#class-row button')[3].click();
    const card=[...document.getElementById('card-list').children].find(c=>/GUNNER/.test(c.textContent));
    return {txt:card? card.textContent : ''}; });
  ok('and the card SAYS so — the gunner card names the matchlock', !R.err && /Tanegashima/.test(R.txt), R.err||R.txt.slice(0,120));
  R=await T(()=>{ const S=window.__SS; return {rk:S.mountOf(2,'rk').name, wa:S.mountOf(3,'wa').name, west:S.mountOf(2,'west').name}; });
  ok('the stable speaks the local language: a dog sled on the coast, remounts in Japan', !R.err && /sled/i.test(R.rk) && /remount/i.test(R.wa) && R.west==='Horse', R.err||JSON.stringify(R));

  console.log('\n=== ⚔ MORE ON THE RACK ===');
  R=await T(()=>{ const S=window.__SS; const G2=S.GEAR, ids={weapon:['clava','scissor_blade','contus','lancea','jian','ge','vel','tessen','otsuchi','tusk_club','ice_chisel'],
      shield:['clipeus','pelta','han_dun','rib_shield'], helmet:['galea_legionis','galea_equitum','he_guan','pagri','hachigane','eboshi_kabuto','slit_goggles','tusk_hood','storm_hood'],
      armor:['lorica_plumata','linothorax','pijia','steppe_lamellar','tatami_do','kusari']};
    const missing=[]; for(const sl in ids) for(const id of ids[sl]) if(!G2[sl].some(g=>g.id===id)) missing.push(sl+':'+id);
    const bows=['plumbata','lian_nu','nuqaq'].filter(id=>!S.bowOf(id));
    const nbMissing=ids.helmet.filter(h=>!S.NB_HELM[h]).concat(ids.armor.filter(a=>!S.NB_ARMOR[a]));
    // every one draws on a fighter and on the shelf
    S.newDemo('Kaiq','Italia','Roman'); const cv=document.getElementById('game'), c=cv.getContext('2d'); const errs=[];
    const icon=document.createElement('canvas'); icon.width=icon.height=40;
    for(const sl in ids) for(const id of ids[sl]){
      const f=S.makeFighter({x:240,y:230,facing:1});
      f.gear={weapon:S.gearOf('weapon',sl==='weapon'? id : 'gladius'), shield:S.gearOf('shield',sl==='shield'? id : 'none'), helmet:S.gearOf('helmet',sl==='helmet'? id : 'none'), armor:S.gearOf('armor',sl==='armor'? id : 'subarmalis')};
      c.setTransform(1,0,0,1,0,0); try{ S.drawGladiator(f); }catch(e){ errs.push(id+': '+e.message); }
      try{ S.drawGearIcon(icon, sl, S.gearOf(sl,id)); }catch(e){ errs.push('icon '+id+': '+e.message); } }
    for(const id of ['plumbata','lian_nu','nuqaq']){ try{ S.drawRangedIcon(icon, S.bowOf(id)); }catch(e){ errs.push('ranged '+id+': '+e.message); } }
    return {missing, bows, nbMissing, errs}; });
  ok('33 new pieces exist — weapons, shields, helmets, armour and three ranged', !R.err && R.missing.length===0 && R.bows.length===0, R.err||JSON.stringify([R.missing,R.bows]));
  ok('every new helmet and harness is drawn on the new body, and every piece on a fighter and a shop icon', !R.err && R.nbMissing.length===0 && R.errs.length===0, R.err||JSON.stringify([R.nbMissing,R.errs.slice(0,3)]));

  console.log('\n=== 🚶 THE HALL WALKS ON THE NEW BODIES ===');
  R=await T(()=>{ const S=window.__SS; S.newDemo('Marcus','Italia','Roman'); const G=S.G; G.married=true; G.isFemale=false; G.hasVilla=true; G.day=40;
    const w=S.makeBride('roman',true,8); w.male=false; w.traits=[]; w.flaws=[]; G.wife=w; G.wifeRel=80; S.openDomus();
    const f0=S.FEM_DRAWS, m0=S.MAN_DRAWS; S.drawDomus(); const fem=S.FEM_DRAWS-f0, man=S.MAN_DRAWS-m0;
    S.SETTINGS.classicBodies=true; const f1=S.FEM_DRAWS, m1=S.MAN_DRAWS; S.drawDomus(); const femC=S.FEM_DRAWS-f1, manC=S.MAN_DRAWS-m1; S.SETTINGS.classicBodies=false;
    const outside=S.nbHallOn();
    return {fem, man, femC, manC, outside}; });
  ok('the wife and you are drawn as the woohoo figures in the hall', !R.err && R.fem>=1 && R.man>=1, R.err||JSON.stringify(R));
  ok('the classic switch still brings back the old sprites, and outside the hall nothing changes', !R.err && R.femC===0 && R.manC===0 && R.outside===false, R.err||JSON.stringify(R));
  R=await T(()=>{ const S=window.__SS; const out={};
    const cv=document.getElementById('game'), c=cv.getContext('2d');
    const probe=(dir)=>{ S.NB_HALL=true; c.setTransform(1,0,0,1,0,0); c.clearRect(0,0,480,270);
      const L=S.withFace(dir, 200, ()=>S.drawHallFem(c, 240, 214, S.G.wife, 0, 'idle')); S.NB_HALL=false; return L&&L.head; };
    const r=probe(1), l=probe(-1);
    out.faces=!!(r && l && r[0]>240 && l[0]<240);
    // walking plants the feet by distance: the same x gives the same pose
    const pose=(d)=>S.femWalkPose(S.G.wife,{mode:'walk', ph:d*Math.PI/(2*4.6)},62,108).ankles.near[0];
    out.planted = Math.abs(pose(100)-pose(100))<1e-9 && Math.abs(pose(100)-pose(104))>0.1;
    return out; });
  ok('the walker faces the way it is going, and its feet are set by the distance walked', !R.err && R.faces && R.planted, R.err||JSON.stringify(R));
  R=await T(()=>{ const S=window.__SS; const errs=[]; const cv=document.getElementById('game'), c=cv.getContext('2d');
    S.NB_HALL=true; for(const id of ['stiff','hand','lead','shoulder','bridal']) for(const dir of [1,-1]){ try{ S.drawEscortPair(240,214,100,{id,speed:1},dir,S.playerLook(),S.G.wife); }catch(e){ errs.push(id+': '+e.message); } }
    try{ S.drawEscortPairNB(240,214,100,{id:'hand',speed:1},1,S.playerLook(),S.G.wife,{herLeads:true}); }catch(e){ errs.push('herLeads: '+e.message); }
    S.NB_HALL=false; return {errs}; });
  ok('the escort\'s five holds draw on the new figures, both ways, and she can lead', !R.err && R.errs.length===0, R.err||R.errs.join(' · '));

  console.log('\n=== 🧊 HOW HE HOLDS OUT ===');
  R=await T(()=>{ const S=window.__SS; const o={};
    o.styles=S.RESIST_ORDER.filter(k=>S.traitById(S.RESIST_STYLES[k].trait)).length;
    o.byTrait=S.resistStyleOf({traits:['rs_whistler']}); o.priapic=S.resistStyleOf({traits:['priapic']});
    o.stable=S.resistStyleOf({name:'Gaius'})===S.resistStyleOf({name:'Gaius'});
    const L=(p)=>S.resistTells('looker',p,0); o.looker=[L(0.1).hands||'side', L(0.5).hands, L(0.7).hands, L(0.95).faceId];
    const P=(p)=>S.resistTells('prep',p,0); o.prep=[P(0.3).hands, P(0.9).step>0];
    const H=(p)=>S.resistTells('hard',p,0); o.hard=[H(0.5).hands, H(0.5).aroAdd>0];
    return o; });
  ok('six ways of holding out, each a trait: looking, preparing, rising, pacing, praying, whistling', !R.err && R.styles===6 && R.byTrait==='whistler' && R.priapic==='hard' && R.stable, R.err||JSON.stringify(R));
  ok('and they get worse in stages: the looker glances, covers, peeks, stares', !R.err && R.looker[1]==='eyes' && R.looker[2]==='peek' && R.looker[3]==='hypnotized', R.err||JSON.stringify(R.looker));
  ok('the preparer goes to his belt and then takes the step; the quick one covers up, and rises faster', !R.err && R.prep[0]==='belt' && R.prep[1] && R.hard[0]==='cover' && R.hard[1], R.err||JSON.stringify([R.prep,R.hard]));
  R=await T(()=>{ const S=window.__SS; S.newDemo('Marcus','Italia','Roman'); const G=S.G; G.married=true; G.isFemale=false; G.hasVilla=true; G.day=40;
    const w=S.makeBride('roman',true,8); w.male=false; w.traits=['tempting']; G.wife=w; G.wifeRel=80; S.openDomus(); const D=S.DM; const errs=[];
    for(const st of ['rs_looker','rs_prep','rs_hard','rs_pacer','rs_prayer','rs_whistler']) for(const hold of [90,50,10]){
      G.traits=[st]; D.tempt={ph:'resist', t:120, k:1, x:260, hits:2, hold, locks:true, prop:null, beat:null, shelf:274, fdir:1, shook:true};
      try{ S.drawDomus(); }catch(e){ errs.push(st+hold+': '+e.message); } }
    const drain=(st)=>{ G.traits=[st]; D.tempt={ph:'resist', t:0, k:1, x:260, hits:0, hold:100, locks:true, fdir:1}; S.updateTempt(10); return 100-D.tempt.hold; };
    const dp=drain('rs_prayer'), dh=drain('rs_hard');
    // and the husband in the drop, while she baits
    S.newDemo('Livia','Italia','Roman'); const G2=S.G; G2.married=true; G2.isFemale=true; G2.hasVilla=true; G2.day=40;
    const h=S.makeBride('roman',true,8,{male:true}); h.male=true; h.traits=['rs_prayer']; G2.wife=h; S.openDomus();
    S.DM.drop={ph:'bait', t:40, x:200, prop:{draw(){}}, husbX:300, k:1, locks:true, shakes:1, stage:0, noticed:30, pull:60};
    try{ S.drawDomus(); }catch(e){ errs.push('drop: '+e.message); }
    return {errs, dp, dh, dropStyle:S.DM.drop.style}; });
  ok('every style draws through the resist, and the devout lose slower than the quick', !R.err && R.errs.length===0 && R.dp < R.dh, R.err||JSON.stringify(R));
  ok('the husband has his own tells while she baits him in the drop', !R.err && R.dropStyle==='prayer', R.err||JSON.stringify(R));

  console.log('\n=== 🔺 THE ESCALATORS ===');
  R=await T(()=>{ const S=window.__SS, o={};
    const setup=(traits,flaws,fem)=>{ S.newDemo(fem?'Livia':'Marcus','Italia','Roman'); const G=S.G; G.married=true; G.isFemale=!!fem; G.hasVilla=true; G.day=40;
      const w=S.makeBride('roman',true,8,fem? {male:true} : undefined); w.male=!!fem; w.traits=traits||[]; w.flaws=flaws||[]; w.quirks=[]; G.wife=w; G.wifeRel=80; G.wifePhys=70; S.openDomus(); return G; };
    let G=setup(['esc_big']); o.big=S.escAfterSlap({k:'ok',bond:1},'slap','spouse',260) && S.DM.scene && S.DM.scene.kind==='escalate';
    G=setup(['esc_big']); o.bigBad=S.escAfterSlap({k:'bad',bond:-3},'slap','spouse',260);
    G=setup(['esc_mid']); o.midSlap=S.escAfterSlap({k:'ok'},'slap','spouse',260); o.midRom=S.escAfterSlap({k:'ok'},'romantic','spouse',260);
    G=setup(['esc_slow']); o.slow=[1,2,3].map(()=>S.escAfterSlap({k:'ok'},'slap','spouse',260));
    G=setup(['esc_turn']); o.turnRom=S.escAfterSlap({k:'ok'},'romantic','spouse',260); o.turnSlap=S.escAfterSlap({k:'ok'},'slap','spouse',260);
    G=setup(['esc_spark']); S.escAfterSlap({k:'ok'},'slap','spouse',260); o.spark=!!S.DM.escSpark;
    G=setup(['esc_big'],['esc_cool']); o.cool=S.escAfterSlap({k:'ok'},'slap','spouse',260); o.coolStill=S.escAfterSlap({k:'ok'},'slap','spouse',260);
    G=setup(['esc_big']); G.loveDay=G.day; G.loveQuick=99; o.spent=S.escAfterSlap({k:'ok'},'slap','spouse',260);
    G=setup(['esc_big'],[],true); o.husband=S.escAfterSlap({k:'ok'},'slap','spouse',260) && S.DM.scene.leaderMale===true;
    G=setup([],[],true); G.traits=['esc_big']; o.self=S.escAfterSlap({k:'ok'},'slap','self',260) && S.DM.scene.who==='self';
    return o; });
  ok('BIG: a slap that lands well goes straight into it, in the hall — a bad one does not', !R.err && R.big && R.bigBad===false, R.err||JSON.stringify(R));
  ok('MEDIUM: only the romantic one; an ordinary slap gets the look', !R.err && R.midSlap===false && R.midRom===true);
  ok('SLOW BURN catches on the third; TURNS THE TABLES on a slap; THE SPARK schedules the low shelf', !R.err && R.slow[0]===false && R.slow[1]===false && R.slow[2]===true && R.turnRom===false && R.turnSlap===true && R.spark);
  ok('the DE-ESCALATOR stops it for the day, and a spent day stops it too', !R.err && R.cool===false && R.coolStill===false && R.spent===false);
  ok('the same for a husband — he leads — and for you when he slaps you', !R.err && R.husband && R.self, R.err||JSON.stringify([R.husband,R.self]));
  R=await T(()=>{ const S=window.__SS; const out={}; const errs=[];
    for(const [esc,fem] of [['big',0],['mid',0],['turn',0],['slow',0],['big',1],['mid',1],['turn',1],['slow',1]]){
      S.newDemo(fem?'Livia':'Marcus','Italia','Roman'); const G=S.G; G.married=true; G.isFemale=!!fem; G.hasVilla=true; G.day=40;
      const w=S.makeBride('roman',true,8,fem? {male:true} : undefined); w.male=!!fem; w.traits=['esc_'+esc]; w.flaws=[]; w.quirks=[]; G.wife=w; G.wifeRel=80; G.wifePhys=70; S.openDomus();
      if(esc==='slow'){ S.escAfterSlap({k:'ok'},'slap','spouse',260); S.escAfterSlap({k:'ok'},'slap','spouse',260); }
      S.escAfterSlap({k:'ok'}, esc==='mid'? 'romantic' : 'slap', 'spouse', 260);
      const D=S.DM, kinds=new Set(), vis=new Set(); let g=0, braced=null;
      while(D.scene && g<9000){ g++; D.scene.t+=1; try{ S.updateEscalate(1); }catch(e){ errs.push(esc+': '+e.message); break; }
        if(D.scene && (g%37===0)){ const st=D.scene.plan[D.scene.si]; kinds.add(st.k); if(st.vi!==undefined) vis.add(st.vi);
          try{ S.drawDomus(); }catch(e){ errs.push(esc+' draw: '+e.message); break; }
          if(st.at==='brace' && braced===null){ const B=D.scene.brace; braced=[150,162,236,248,322,334].indexOf(B.face)>=0; } } }
      out[esc+(fem?'H':'W')]={ended:!D.scene, woohoo:G.woohooAll||0, kinds:[...kinds].join(','), vis:[...vis].join(','), braced}; }
    return {out, errs}; });
  const allEnded = !R.err && Object.values(R.out).every(v=>v.ended && v.woohoo===1 && /undress/.test(v.kinds) && /pose/.test(v.kinds));
  ok('all eight custom villa woohoos play through: intro, the lead, the undress, the positions, the finish', allEnded && R.errs.length===0, R.err||JSON.stringify(R).slice(0,400));
  ok('and the ones against a column are against one of the hall\'s own columns', !R.err && Object.values(R.out).filter(v=>v.braced!==null).every(v=>v.braced===true), R.err||JSON.stringify(R.out));
  R=await T(()=>{ const S=window.__SS; const c=[]; for(let i=0;i<400;i++){ const t=S.rollTraits(10,false,'roman'); c.push(...t); }
    const adultOn=c.filter(t=>/^esc_|^rs_/.test(t)).length;
    localStorage.setItem('SANDSTEEL_ADULT','0'); return {adultOn}; });
  ok('with mature content on, the escalators and the resist styles turn up on spouses', !R.err && R.adultOn>0, R.err||JSON.stringify(R));
  await pg.reload(); await pg.waitForTimeout(400);
  R=await T(()=>{ const S=window.__SS; const c=[]; for(let i=0;i<400;i++){ const t=S.rollTraits(10,false,'roman'); c.push(...t); }
    S.newDemo('Marcus','Italia','Roman'); const G=S.G; G.married=true; const w=S.makeBride('roman',true,8); w.traits=['esc_big']; G.wife=w; S.openDomus();
    const fired=S.escAfterSlap({k:'ok'},'slap','spouse',260);
    G.traits=['esc_big','rs_looker','smart']; let kidEsc=0;
    for(let i=0;i<300;i++){ const kid=S.inheritDNA(i%2===0); kidEsc+=(kid.traits||[]).filter(t=>/^esc_|^rs_/.test(t)).length; }   // (a child's OWN trait roll could land on one — 300 children, not one)
    return {adultOff:c.filter(t=>/^esc_|^rs_/.test(t)).length, fired, kidEsc}; });
  ok('with it off they never roll and never fire; and a child never inherits them', !R.err && R.adultOff===0 && R.fired===false && R.kidEsc===0, R.err||JSON.stringify(R));

  ok('no page errors anywhere', errs.length===0, errs.slice(0,2).join(' | '));
  console.log('\n'+(fail? '✗ '+fail+' FAILED' : 'ALL GREEN')+'   ('+(pass+fail)+' checks)');
  await br.close(); process.exit(fail?1:0);
})();
