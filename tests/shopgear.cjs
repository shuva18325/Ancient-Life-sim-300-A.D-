/* ⛨ THE ARMOURY PAINTS WHAT IT SELLS: armour and helmets drawn from the real harness, high resolution, every world */
const {chromium}=require('playwright');
(async()=>{ const br=await chromium.launch(); const pg=await br.newPage({viewport:{width:1280,height:900}}); const errs=[]; pg.on('pageerror',e=>errs.push(''+e));
 await pg.goto('file://'+require('path').resolve(__dirname,'../index.html')); await pg.waitForTimeout(400);
 let fail=0; const ok=(c,m)=>{ console.log((c?'  PASS  ':'  FAIL  ')+m); if(!c) fail++; };
 const r=await pg.evaluate(()=>{ const S=window.__SS, o={}; S.newDemo('M','Rome','Roman');
   const sig=(cat,id)=>{ const cv=S.gearHDIcon(cat,id,128), d=cv.getContext('2d').getImageData(0,0,128,128).data; let h=0, n=0; for(let i=0;i<d.length;i+=4){ h=(h*31+d[i]+d[i+1]*3+d[i+2]*7)%1000000007; } return {h, w:cv.width}; };
   for(const cat of ['armor','helmet']){ const ids=S.GEAR_IDS(cat).filter(i=>i!=='none'); const hs=ids.map(i=>sig(cat,i)); o[cat]={n:ids.length, uniq:new Set(hs.map(x=>x.h)).size, hd:hs.every(x=>x.w===128)}; }
   return o; });
 ok(r.armor.hd && r.armor.uniq===r.armor.n, 'every armour ('+r.armor.n+') painted at 128px from the real harness, no two alike ('+r.armor.uniq+')');
 ok(r.helmet.hd && r.helmet.uniq===r.helmet.n, 'every helmet ('+r.helmet.n+') painted at 128px, no two alike ('+r.helmet.uniq+')');
 ok(errs.length===0, 'no page errors'+(errs[0]? ' — '+errs[0] : ''));
 console.log(fail? '✗ '+fail+' FAILED' : 'ALL GREEN'); await br.close(); process.exit(fail?1:0); })();
