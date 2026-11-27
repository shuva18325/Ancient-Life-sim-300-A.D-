// every people on the Asia sheet fields its own army style; the hats and HD sprites draw without error
const {chromium}=require('playwright');
(async()=>{ const br=await chromium.launch(); const pg=await br.newPage(); const errs=[]; pg.on('pageerror',e=>errs.push(''+e));
 await pg.goto('file://'+require('path').resolve(__dirname,'../index.html')); await pg.waitForTimeout(500);
 const r=await pg.evaluate(()=>{ const S=window.__SS; S.newDemo('Marcus','Italia','Roman'); const P=S.ASIA_PEOPLES, out={none:[], shared:{}, bad:[], hd:0};
   for(const p of Object.keys(P)){ const s=S.armyStyleOfPeople(p); if(!s){ out.none.push(p); continue; } (out.shared[s]=out.shared[s]||[]).push(p);
     const st=S.armyStyle(s); if(!st.name || !st.tunic) out.bad.push(p); const sp=S.nbStyleSprite(st,0,false); if(!sp || sp.width!==34) out.bad.push(p+':sprite'); }
   const hd=S.nbStyleSprite(S.armyStyle('wusun'),1,false,4); out.hd=hd.width;
   // a hat that is drawn shows up as pixels above the head
   const px=(id)=>{ const c=S.nbStyleSprite(S.armyStyle(id),1,false,4).getContext('2d').getImageData(0,0,136,136).data; let top=999; for(let y=0;y<136;y++) for(let x=70;x<80;x++) if(c[(y*136+x)*4+3]>100){ top=Math.min(top,y); } return top; };
   out.tops={wusun:px('wusun'), qiang:px('qiang')};
   out.dup=Object.entries(out.shared).filter(([s,a])=>a.length>1).map(([s,a])=>s+':'+a.join(','));
   return out; });
 let fail=0; const ok=(c,m)=>{ console.log((c?'  ok  ':'  FAIL ')+m); if(!c) fail++; };
 ok(r.none.length===0, 'every Asian people has its own style'+(r.none.length? ' — missing '+r.none.join(' ') : ''));
 ok(r.dup.length===0, 'no two peoples share one style'+(r.dup.length? ' — '+r.dup.join(' ') : ''));
 ok(r.bad.length===0, 'each style resolves and draws'+(r.bad.length? ' — '+r.bad.join(' ') : ''));
 ok(r.hd===136, 'the HD sprite is four times the size');
 ok(r.tops.wusun < r.tops.qiang, 'the Wusun pointed cap stands above a bare Qiang head ('+r.tops.wusun+' < '+r.tops.qiang+')');
 ok(errs.length===0, 'no page errors'+(errs.length? ' — '+errs[0] : ''));
 console.log(fail? fail+' FAILED' : 'ALL GREEN'); await br.close(); process.exit(fail?1:0); })();
