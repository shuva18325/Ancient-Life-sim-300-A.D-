/* 👤 WHAT A PERSON WEARS ON THEIR HEAD
   ---------------------------------------------------------------------
   "A person from Tibet, Parthia, Germania, Palmyra, Han China, Britannia,
   Arabia should immediately feel visually distinct… wives, family
   members, nobles." The portrait gave the East its garments and gave
   everyone else a colour, so a Palmyrene and a Parthian were the same
   woman in two dyes; the figure walking the villa did not know her people
   at all; and a Han child looked like a Roman one.                       */
const {chromium}=require('playwright');
const FILE=process.env.FILE || ('file://'+require('path').resolve(__dirname,'..','index.html'));
let pass=0, fail=0;
const ok=(name,cond,note)=>{ if(cond){pass++; console.log('  PASS  '+name+(note?'   '+note:''));}
                             else {fail++; console.log('  FAIL  '+name+(note?'   '+note:''));} };
(async()=>{
  const br=await chromium.launch();
  const pg=await br.newPage({viewport:{width:960,height:700}});
  const errs=[]; pg.on('pageerror',e=>errs.push(''+e));
  await pg.goto(FILE); await pg.waitForTimeout(400);
  const T=async(fn,arg)=>{ try{ return await pg.evaluate(fn,arg); }catch(e){ return {err:String(e).slice(0,200)}; } };

  console.log('\n=== 👤 EVERY PEOPLE THE USER NAMED HAS A LOOK OF ITS OWN ===');
  let R=await T(()=>{ const S=window.__SS; S.newDemo('Marcus','Italia','Murmillo');
    const L={tibet:['steppe','bod'], parthia:['persian','parthian'], germania:['germanic','marcomanni'], palmyra:['greek','palmyrene'], han:['han',null], britannia:['celt','caledonian'], arabia:['persian','arab']};
    const out={}; for(const k in L){ const b=S.makeBride(L[k][0],true,8,{people:L[k][1]}); if(L[k][1]) b.people=L[k][1]; out[k]=S.folkLookId(b); }
    return out; });
  const ids=R.err? [] : Object.values(R);
  ok('Tibet, Parthia, Germania, Palmyra, Han, Britannia and Arabia each get a different look', !R.err && ids.every(x=>!!x) && new Set(ids).size===ids.length, R.err||JSON.stringify(R));

  console.log('\n=== 📸 THE PORTRAIT CHANGES ===');
  R=await T(()=>{ const S=window.__SS; S.newDemo('Marcus','Italia','Murmillo'); const out={};
    for(const [eth,ppl] of [['greek','palmyrene'],['persian','parthian'],['han',null],['steppe','wuhuan'],['celt','caledonian']]){
      const b=S.makeBride(eth,true,8,{people:ppl}); if(ppl) b.people=ppl; b._pose='hang';
      const grab=(noFolk)=>{ const k=document.createElement('canvas'); k.width=148; k.height=148; const c=k.getContext('2d'); S.drawPortraitFigure(c,148,148,b,{face:'flat', noFolk}); return c.getImageData(0,0,148,148).data; };
      const a=grab(true), f=grab(false); let d=0; for(let i=0;i<a.length;i+=4) if(Math.abs(a[i]-f[i])+Math.abs(a[i+1]-f[i+1])+Math.abs(a[i+2]-f[i+2])>30) d++;
      out[ppl||eth]=d; }
    return out; });
  ok('the headwear actually lands on the portrait for each of five peoples', !R.err && Object.values(R).every(n=>n>=40), R.err||JSON.stringify(R));

  console.log('\n=== 🏛 AND ON THE FIGURE WALKING THE HOUSE ===');
  R=await T(()=>{ const S=window.__SS; S.newDemo('Marcus','Italia','Murmillo'); const out={};
    for(const [eth,ppl,male] of [['greek','palmyrene',false],['persian','parthian',true],['han',null,false],['steppe','sarmatian',true]]){
      const b=S.makeBride(eth,true,8,{people:ppl, male}); b.male=male; if(ppl) b.people=ppl;
      const k=document.createElement('canvas'); k.width=120; k.height=140; const c=k.getContext('2d');
      const R2= male? S.drawHallMan(c,60,130,60,null,null,b,0,'idle') : S.drawHallFem(c,60,130,b,0,'idle',0);
      const k2=document.createElement('canvas'); k2.width=120; k2.height=140; const c2=k2.getContext('2d'); b.folkLook=null;
      male? S.drawHallMan(c2,60,130,60,null,null,b,0,'idle') : S.drawHallFem(c2,60,130,b,0,'idle',0);
      const a=c.getImageData(0,0,120,140).data, z=c2.getImageData(0,0,120,140).data; let d=0; for(let i=3;i<a.length;i+=4) if(Math.abs(a[i]-z[i])>60 || Math.abs(a[i-3]-z[i-3])>40) d++;
      out[(ppl||eth)+(male?'♂':'♀')]=d; }
    return out; });
  ok('the villa figures wear it too, men and women', !R.err && Object.values(R).every(n=>n>=6), R.err||JSON.stringify(R));

  console.log('\n=== 🧒 A HAN CHILD IS NOT A ROMAN CHILD ===');
  R=await T(()=>{ const S=window.__SS; S.newDemo('Cao Ang','Italia','Murmillo'); const G=S.G; const ch={sex:'m', born:G.day-48, hair:'#1e1610', skin:'#d8b08a', name:'x'};
    const grab=(cul)=>{ G.cultureOverride=cul; const k=document.createElement('canvas'); k.width=80; k.height=120; const c=k.getContext('2d'); S.drawKidProfile(c,40,110,ch,{k:2,age:4},1); return c.getImageData(0,0,80,120).data; };
    const h=grab('han'), r=grab('roman'), n=grab('greek'); let dh=0, dr=0; for(let i=0;i<h.length;i+=4){ if(Math.abs(h[i]-n[i])+Math.abs(h[i+3]-n[i+3])>40) dh++; if(Math.abs(r[i]-n[i])+Math.abs(r[i+3]-n[i+3])>40) dr++; }
    return {han:dh, roman:dr}; });
  ok('the Han child wears the 總角 tufts and the Roman boy the bulla', !R.err && R.han>=10 && R.roman>=6, R.err||JSON.stringify(R));

  ok('no page errors', errs.length===0, errs.slice(0,3).join(' | '));
  console.log('\n'+pass+' passed, '+fail+' failed');
  await br.close(); process.exit(fail?1:0);
})();
