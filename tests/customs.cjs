/* 📜 THE CUSTOMS OF THE COUNTRY
   ---------------------------------------------------------------------
   "Make them feel culturally distinct… marriage customs, family
   traditions, taboos, expectations… STOP MAKING CIVILIZATIONS FEEL LIKE
   RESKINS OF EACH OTHER." Before this, every household on earth named
   its son Titus, every wife burned with jealousy at the same rate, no
   night was ever closed, and the Han row scored from-behind as improper
   when the Mawangdui manuals list it among the ordinary postures.       */
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
  const T=async(fn,arg)=>{ try{ return await pg.evaluate(fn,arg); }catch(e){ return {err:String(e).slice(0,200)}; } };
  const SETUP=(o)=>{ const S=window.__SS; S.newDemo('Marcus','Italia','Murmillo'); const G=S.G;
    G.world=o.world||'west'; G.current=o.where||'Italia'; G.cultureOverride=o.house||null;
    G.coin=9999; G.isFemale=false; G.married=true; G.day=o.day||100; G.hasVilla=true; G.pregnant=null;
    if(o.name) G.name=o.name;
    const w=S.makeBride(o.wife||'roman',false,8,o.people? {people:o.people} : {people:null}); w.male=false; w.quirks=[]; w.flaws=[]; w.traits=[];
    w.name=o.wname||w.name; G.wife=w; G.wifeRel=70; G.jealousy=0; return G; };
  const src='('+SETUP.toString()+')';

  console.log('\n=== 📜 EVERY PEOPLE HAS A ROW OF ITS OWN ===');
  let R=await T(()=>{ const C=window.__SS.CUSTOMS; const ids=Object.keys(C);
    const bad=ids.filter(k=>{ const r=C[k]; return !r.inherit && (!r.frame || !r.wed || !r.wed.steps || !r.src); });
    return {n:ids.length, bad, frames:new Set(ids.map(k=>C[k].frame)).size}; });
  ok('at least twenty peoples, each with its own rite, frame and sources', !R.err && R.n>=20 && !R.bad.length && R.frames>=20, R.err||JSON.stringify(R));

  console.log('\n=== 🏮 HAN: FROM BEHIND IS IN THE MANUALS; THE CALENDAR IS NOT ===');
  R=await T((src)=>{ const S=window.__SS; const G=eval(src)({world:'east', where:'Luoyang', house:'han', wife:'han', name:'Cao Ang'});
    const C=S.customsHere(); S.setWH('done'); S.startBedScene('fun','long','bed'); S.BC.forcePose=2; S.setBCT(900); S.drawBed();
    const rear=S.BC.poseSrc; S.BC.forcePose=3; S.drawBed(); const ride=S.BC.poseSrc;
    const days=[]; for(let d=0; d<64; d++){ const t=S.customsTabooToday(d); if(t) days.push(t.bad? 'bad' : t.good? 'good' : 'x'); }
    return {frame:C&&C.frame, rear, ride, bad:days.filter(x=>x==='bad').length, good:days.filter(x=>x==='good').length}; }, src);
  ok('a Han house reads the Han customs', !R.err && /HAN/.test(R.frame||''), R.err||R.frame);
  ok('the rear posture is captioned with the Mawangdui verdict, not Rome’s', !R.err && /虎步/.test(R.rear||''), R.err||R.rear);
  ok('her astride is one of the Nine Postures', !R.err && /魚接鱗/.test(R.ride||''), R.err||R.ride);
  ok('the almanac closes some days and blesses others', !R.err && R.bad>=4 && R.good>=4, R.err||JSON.stringify(R));
  R=await T((src)=>{ const S=window.__SS; eval(src)({world:'east', where:'Luoyang', house:'han', wife:'han'});
    let bad=null, good=null; for(let d=0; d<64; d++){ const t=S.customsTabooToday(d); if(t&&t.bad&&bad===null) bad=d; if(t&&t.good&&good===null) good=d; }
    return {bad:S.customsConceive({day0:bad, seen:{}}), good:S.customsConceive({day0:good, seen:{}})}; }, src);
  ok('a forbidden day costs the child; a day of heavenly virtue helps it', !R.err && R.bad.add<-0.1 && R.good.add>0.04, R.err||JSON.stringify(R));
  R=await T(()=>window.__SS.TABOO? window.__SS.TABOO.han : null);
  R=await T((src)=>{ const S=window.__SS; const G=eval(src)({world:'east', where:'Luoyang', house:'han', wife:'han', name:'Cao Ang'});
    const n=[]; for(let i=0;i<8;i++){ n.push(S.customsChildName(true)); n.push(S.customsChildName(false)); } return n; }, src);
  ok('a Han son is named surname-first, in Chinese — not “Titus … filius”', !R.err && R.every(x=>/^Cao /.test(x)) && !R.some(x=>/filius|Julia|Titus/.test(x)), R.err||R.slice(0,4).join(' · '));

  console.log('\n=== 🏛 ROME: LUCRETIUS, AND THE NAMES STAY ROMAN ===');
  R=await T((src)=>{ const S=window.__SS; eval(src)({});
    return {rear:S.customsConceive({seen:{2:1}, day0:100}), plain:S.customsConceive({seen:{0:1}, day0:100}), son:S.customsChildName(true)}; }, src);
  ok('more ferarum helps a Roman couple trying for a child (Lucretius IV.1263)', !R.err && Math.abs(R.rear.add-0.06)<1e-9 && R.plain.add===0, R.err||JSON.stringify(R));
  ok('a Roman son is still a Roman name', !R.err && /filius/.test(R.son), R.err||R.son);

  console.log('\n=== 🔥 PARTHIA: DASHTĀN SHUTS THE DOOR ===');
  R=await T((src)=>{ const S=window.__SS; eval(src)({world:'east', where:'Ctesiphon', wife:'persian', people:'parthian', wname:'Musa'});
    const out=[]; for(let d=100; d<112; d++){ const t=S.customsTabooToday(d); out.push(t&&t.block? 1 : 0); }
    return {out, line:(S.customsTabooToday(100+out.indexOf(1))||{}).note}; }, src);
  ok('one night in six she is in dashtān and the door is shut', !R.err && R.out.filter(x=>x).length===2 && /dashtān/i.test(R.line||''), R.err||JSON.stringify(R));

  console.log('\n=== 🪷 KUSHAN: ṚTU, AND EVEN NIGHTS GIVE SONS ===');
  R=await T((src)=>{ const S=window.__SS; eval(src)({world:'east', where:'Gandhara', wife:'kushan', people:null, wname:'Sumitra'});
    let even=null; for(let d=100; d<120; d++){ const t=S.customsTabooToday(d); if(t && t.kind==='ritu-even'){ even=d; break; } }
    const cz=S.customsConceive({day0:even, seen:{}}); return {even, cz}; }, src);
  ok('an even night of her season is better for a child and leans toward a son', !R.err && R.even!==null && R.cz.add>=0.06 && R.cz.sonP>0.5, R.err||JSON.stringify(R));

  console.log('\n=== 💢 JEALOUSY BURNS AT HER PEOPLE’S RATE ===');
  R=await T((src)=>{ const S=window.__SS; const out={};
    for(const [k,o] of [['roman',{wife:'roman'}],['germanic',{wife:'germanic', people:null}],['buyeo',{wife:'korean', people:'buyeo'}],['wa',{wife:'wa', people:null}]]){
      const G=eval(src)(o); out[k]=S.customsJealMul(); }
    return out; }, src);
  ok('a Germanic wife is quicker to jealousy than a Roman; a Buyeo or Wa wife far slower', !R.err && R.germanic>R.roman && R.buyeo<0.5 && R.wa<0.7, R.err||JSON.stringify(R));

  console.log('\n=== 💍 THE WEDDING, AND THE CARD ===');
  R=await T((src)=>{ const S=window.__SS; eval(src)({wife:'germanic', people:null, where:'Germania Magna'});
    const line=S.customsWeddingLine(S.G.wife); const b=document.createElement('div'); S.buildCustomsCard(b);
    return {line, html:b.innerHTML.length, marry:/HOW THEY MARRY/.test(b.innerHTML), bed:/THE BEDCHAMBER/.test(b.innerHTML)}; }, src);
  ok('a Germanic wedding names the gifts going the other way', !R.err && /OTHER WAY/.test(R.line||'') && /oxen/.test(R.line||''), R.err||(R.line||'').slice(0,90));
  ok('the villa card lays out the marriage rite and the bedchamber', !R.err && R.marry && R.bed && R.html>800, R.err||JSON.stringify(R));
  R=await T((src)=>{ const S=window.__SS; eval(src)({world:'east', where:'Yueban', wife:'steppe', people:'xiongnu'});
    const C=S.customsHere(); return {frame:C&&C.frame, fam:C&&C.family, names:C&&C.names&&C.names.m[0]}; }, src);
  ok('the last northern Xiongnu keep the levirate — and inherit the steppe’s family line', !R.err && /XIONGNU/.test(R.frame||'') && !!R.fam && R.names==='Modu', R.err||JSON.stringify(R));

  console.log('\n=== 🕯 A WHOLE NIGHT THROUGH, WITH THE CUSTOMS ON ===');
  R=await T((src)=>{ const S=window.__SS; const G=eval(src)({world:'east', where:'Luoyang', house:'han', wife:'han'});
    S.setWH('done'); S.startBedScene('heir','quick','bed'); for(const v of [0,2,3,7]){ S.BC.forcePose=v; S.setBCT(900); S.drawBed(); }
    const seen=Object.keys(S.BC.seen||{}).length; S.finishBedNow(); return {seen, after:!!S.getBC()}; }, src);
  ok('the night records what was done and finishes cleanly', !R.err && R.seen>=4 && R.after===false, R.err||JSON.stringify(R));

  ok('no page errors', errs.length===0, errs.slice(0,3).join(' | '));
  console.log('\n'+pass+' passed, '+fail+' failed');
  await br.close(); process.exit(fail?1:0);
})();
