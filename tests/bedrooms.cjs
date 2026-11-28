/* 🕯 THE ROOM THEY ARE IN: every people's own bedchamber behind the positions, no purple void */
const {chromium}=require('playwright');
(async()=>{ const br=await chromium.launch(); const pg=await br.newPage({viewport:{width:1000,height:700}}); const errs=[]; pg.on('pageerror',e=>errs.push(''+e));
 await pg.goto('file://'+require('path').resolve(__dirname,'../index.html')); await pg.waitForTimeout(400);
 let fail=0; const ok=(c,m)=>{ console.log((c?'  PASS  ':'  FAIL  ')+m); if(!c) fail++; };
 const r=await pg.evaluate(()=>{ const S=window.__SS, o={}; S.newDemo('M','Rome','Roman'); const fams=['roman','han','wa','steppe','india','persian','celt','rkrai','egyptian','ice'];
   const sig=(f,vi)=>{ const cv=document.createElement('canvas'); cv.width=480; cv.height=270; const c=cv.getContext('2d'); S.bedCultureRoom(c,480,270,{place:'bed', lastVi:vi},300,f); const d=c.getImageData(0,0,480,270).data; let h=0, purple=0, n=0; for(let i=0;i<d.length;i+=16){ h=(h*31+d[i]+d[i+1]*3+d[i+2]*7)%1000000007; const R=d[i],G=d[i+1],B=d[i+2]; if(B>R+12 && B>G+30 && R>G+8) purple++; n++; } return {h, purple:purple/n}; };
   const base=fams.map(f=>sig(f,0)); o.unique=new Set(base.map(x=>x.h)).size; o.purple=Math.max(...base.map(x=>x.purple));
   o.swing=fams.every((f,i)=>sig(f,35).h!==base[i].h);
   return o; });
 ok(r.unique===10, 'ten peoples, ten different rooms ('+r.unique+')');
 ok(r.purple<0.02, 'no purple void left ('+(r.purple*100).toFixed(1)+'% purple pixels at most)');
 ok(r.swing, 'the room follows the pose: the swing hangs where the back opens onto the night');
 ok(errs.length===0, 'no page errors'+(errs[0]? ' — '+errs[0] : ''));
 console.log(fail? '✗ '+fail+' FAILED' : 'ALL GREEN'); await br.close(); process.exit(fail?1:0); })();
