/* 🏡 HOUSE & GROUNDS: the house painted at its stage for each people, the room furnished, the garden planted */
const {chromium}=require('playwright');
(async()=>{ const br=await chromium.launch(); const pg=await br.newPage({viewport:{width:1280,height:900}}); const errs=[]; pg.on('pageerror',e=>errs.push(''+e));
 await pg.goto('file://'+require('path').resolve(__dirname,'../index.html')); await pg.waitForTimeout(400);
 let fail=0; const ok=(c,m)=>{ console.log((c?'  PASS  ':'  FAIL  ')+m); if(!c) fail++; };
 const r=await pg.evaluate(()=>{ const S=window.__SS, o={}; S.newDemo('Marcus','Rome','Roman'); const G=S.G; G.hasVilla=true; G.coin=50000; G.slaves=3;
   const fams=['roman','han','wa','steppe','india','persian','celt','rkrai','egyptian','ice']; o.paint=[];
   fams.forEach(f=>{ const sig=[]; for(let st=0;st<5;st++){ const cv=document.createElement('canvas'); cv.width=900; cv.height=300; const c=cv.getContext('2d'); S.grPaint(c,900,300,f,st,2);
     const d=c.getImageData(0,0,900,240).data; let n=0; for(let i=0;i<d.length;i+=4) n=(n*31+d[i]+d[i+1]*3+d[i+2]*7)%1000000007; sig.push(n); }
     o.paint.push([f, sig.every((v,i)=>i===0||v!==sig[i-1])]); });
   S.openGrounds(); o.open=!!document.getElementById('gr-house') && document.getElementById('grounds-ov').style.display!=='none';
   const w0=S.houseTier? S.houseTier().i : null; const c0=G.coin; document.getElementById('gr-build').click(); o.built=G.coin<c0 && (G.houseInvest||0)>0;
   document.getElementById('gr-tree').click(); document.getElementById('gr-water').click(); document.getElementById('gr-dog').click(); o.garden=G.grounds.trees===1 && G.grounds.water && G.grounds.pets.length===1;
   const room=document.getElementById('gr-room'), rc=room.getBoundingClientRect(); room.dispatchEvent(new MouseEvent('click',{clientX:rc.left+5,clientY:rc.top+50,bubbles:true}));
   const pick=document.querySelectorAll('#gr-pick button'); o.picks=pick.length; if(pick[0]) pick[0].click(); o.slot=G.grounds.slots[0];
   o.comfort=S.grComfort(); G.married=true; G.wifeRel=40; o.fam=S.grFam(); return o; });
 ok(r.paint.every(p=>p[1]), 'ten peoples, five stages each, every stage painted differently ('+r.paint.filter(p=>!p[1]).map(p=>p[0]).join(',')+')');
 ok(r.open, 'the house & grounds screen opens');
 ok(r.built, 'paying the builders raises the house a stage');
 ok(r.garden, 'a tree, a fountain and a dog go into the garden');
 ok(r.picks>=8 && r.slot==='triclinium', 'a Roman room is furnished from Roman pieces ('+r.slot+')');
 ok(r.comfort>3, 'furniture and garden make comfort ('+r.comfort+')');
 ok(errs.length===0, 'no page errors'+(errs[0]? ' — '+errs[0] : ''));
 console.log(fail? '✗ '+fail+' FAILED' : 'ALL GREEN'); await br.close(); process.exit(fail?1:0); })();
