/* 🏮 THE FESTIVALS AND THE VISITORS: every people keeps its own feasts, they do something, and people come to the door */
const {chromium}=require('playwright');
(async()=>{ const br=await chromium.launch(); const pg=await br.newPage({viewport:{width:1280,height:800}}); const errs=[]; pg.on('pageerror',e=>errs.push(''+e));
 await pg.goto('file://'+require('path').resolve(__dirname,'../index.html')); await pg.waitForTimeout(400);
 let fail=0; const ok=(c,m)=>{ console.log((c?'  PASS  ':'  FAIL  ')+m); if(!c) fail++; };
 const r=await pg.evaluate(()=>{ const S=window.__SS, o={};
   const year=(arch,region)=>{ S.newDemo('X',region,arch); const names=[]; for(let d=0;d<20;d++){ const F=S.festToday(d); if(F) names.push(F.name); } return names; };
   o.rome=year('Roman','Italia'); o.han=year('Han','Luoyang');
   S.newDemo('Marcus','Italia','Roman'); const G=S.G; G.married=true; G.wife=G.wife||{name:'Julia'}; G.wifeRel=50; G.coin=500;
   let sat=-1; for(let d=0;d<20;d++){ const F=S.festToday(d); if(F && /SATURNALIA/.test(F.name)) sat=d; }
   G.day=sat; S.festDayTick(); o.afterSat={rel:G.wifeRel, coin:G.coin, log:(G.festLog||[]).length};
   o.next=S.festNext(); S.openVisitor('mother'); const ov=document.getElementById('visit-ov'); o.visit=!!ov && ov.style.display==='flex' && ov.querySelectorAll('#visit-opts button').length>=2;
   ov.querySelector('#visit-opts button').click(); o.visitOut=document.getElementById('visit-out').textContent; o.relAfter=G.wifeRel;
   return o; });
 ok(r.rome.some(n=>/SATURNALIA/.test(n)) && r.rome.some(n=>/LUPERCALIA/.test(n)), 'Rome keeps Saturnalia and Lupercalia ('+r.rome.join(', ')+')');
 ok(r.han.some(n=>/QIXI/.test(n)) && r.han.some(n=>/LANTERN/.test(n)) && !r.han.some(n=>/SATURNALIA/.test(n)), 'the Han keep the New Year, the Lanterns and Qixi, and not Saturnalia ('+r.han.join(', ')+')');
 ok(r.afterSat.rel>50 && r.afterSat.coin<500 && r.afterSat.log===1, 'a feast does something: Saturnalia costs gifts and warms the marriage');
 ok(r.next && r.next.F && r.next.in>0, 'and the next feast is known in advance ('+(r.next&&r.next.F.name)+' in '+(r.next&&r.next.in)+')');
 ok(r.visit && r.visitOut.length>10 && r.relAfter>r.afterSat.rel, 'her mother comes to the door, you choose, and it matters ('+r.visitOut.slice(0,50)+'…)');
 ok(errs.length===0, 'no page errors'+(errs[0]? ' — '+errs[0] : ''));
 console.log(fail? '✗ '+fail+' FAILED' : 'ALL GREEN'); await br.close(); process.exit(fail?1:0); })();
