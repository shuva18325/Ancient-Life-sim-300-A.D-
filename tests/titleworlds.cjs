/* ✦ THE TITLE SHOWS EVERY WORLD: Rome · Han, the Ice, the Rkrai coast and Wa turn behind the menu, each named */
const {chromium}=require('playwright');
(async()=>{ const br=await chromium.launch(); const pg=await br.newPage({viewport:{width:1280,height:800}}); const errs=[]; pg.on('pageerror',e=>errs.push(''+e)); pg.on('console',m=>{ if(m.type()==='error') errs.push(m.text()); });
 await pg.goto('file://'+require('path').resolve(__dirname,'../index.html')); await pg.waitForTimeout(600);
 let fail=0; const ok=(c,m)=>{ console.log((c?'  PASS  ':'  FAIL  ')+m); if(!c) fail++; };
 const CY=12.5+2.6, sig=[];
 for(let i=0;i<4;i++){ await pg.evaluate((v)=>window.__SS.setTitleT(v), i*CY+5); await pg.waitForTimeout(i? 1500 : 400);
   sig.push(await pg.evaluate(()=>{ const c=document.getElementById('titlebg').getContext('2d'); const pts=[[150,500],[1700,500],[960,1000],[300,200],[1600,850]]; return pts.map(([x,y])=>Array.from(c.getImageData(x,y,1,1).data.slice(0,3)).join(',')).join('|'); })); }
 ok(new Set(sig).size===4, 'four different scenes turn behind the menu ('+new Set(sig).size+' distinct)');
 await pg.evaluate((v)=>window.__SS.setTitleT(v), 12.5+1.3); await pg.waitForTimeout(500);
 const mid=await pg.evaluate(()=>{ const c=document.getElementById('titlebg').getContext('2d'); return Array.from(c.getImageData(150,500,1,1).data.slice(0,3)).join(','); });
 ok(mid!==sig[0].split('|')[0] && mid!==sig[1].split('|')[0], 'and one dissolves into the next rather than cutting');
 ok(errs.length===0, 'no errors'+(errs[0]? ' — '+errs[0] : ''));
 console.log(fail? '✗ '+fail+' FAILED' : 'ALL GREEN'); await br.close(); process.exit(fail?1:0); })();
