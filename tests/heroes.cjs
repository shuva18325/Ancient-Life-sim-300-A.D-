/* ⭐ HEROES OF THE AGE: real people on their real dates — portraits, audiences, duels, commands, and history keeping its dead */
const {chromium}=require('playwright');
(async()=>{ const br=await chromium.launch(); const pg=await br.newPage({viewport:{width:1280,height:860}}); const errs=[]; pg.on('pageerror',e=>errs.push(''+e));
 await pg.goto('file://'+require('path').resolve(__dirname,'../index.html')); await pg.waitForTimeout(500);
 let fail=0; const ok=(c,m)=>{ console.log((c?'  PASS  ':'  FAIL  ')+m); if(!c) fail++; };
 const r=await pg.evaluate(()=>{ const S=window.__SS, o={};
   S.newDemo('Liu','Luoyang','Han'); const G=S.G; G.world='east'; G.current='Luoyang'; G.coin=9000; G.generals=[]; G.detachments=G.detachments||[];
   G.day=0; S.heroDayTick(); o.y0=S.heroYear();
   const alive=(id,day)=>{ G.day=day; return S.HEROES.find(h=>h.id===id); };
   G.day=0; o.lubuLegend=S.HEROES.find(h=>h.id==='lubu').kind==='legend';
   G.day=3; S.heroDayTick(); o.log3=(G.heroLog||[]).map(e=>e.t.slice(0,30));
   o.guanyuNeedsLiuBei=S.heroCanRecruit('guanyu').ok===false;
   for(let i=0;i<5;i++){ G.day=3+i*2; S.heroAudience('liubei'); }
   o.liuFavor=G.heroes.liubei.favor; o.guanyuNow=S.heroCanRecruit('guanyu').ok;
   G.day=3; o.zhugeNotYet=S.heroCanRecruit('zhugeliang').why;
   // serve, then history takes him
   G.generals.push(S.heroGeneral('guanyu')); o.guanPower=G.generals[0].power;
   G.day=Math.ceil((220-200)*2.4)+1; S.heroDayTick(); o.guanGone=!G.generals.some(g=>g.hero==='guanyu'); o.caoDead=(G.heroLog||[]).some(e=>/Cao Cao dies/.test(e.t));
   o.year=S.heroYear(); S.enterMap(); o.btn=!!document.getElementById('btn-heroes'); S.openHeroes(); o.cards=document.querySelectorAll('#heroes-ov canvas[data-p]').length;
   // a portrait actually drew something
   const cv=document.querySelector('#heroes-ov canvas[data-p]'); const d=cv.getContext('2d').getImageData(55,40,1,1).data; o.portrait=d[3]>0;
   return o; });
 ok(r.y0===200, 'the story starts in 200');
 ok(r.lubuLegend, 'Lü Bu, dead at Xiapi in 199, is a legend — not a living man');
 ok(r.log3.some(t=>/Sun Ce/.test(t)) && r.log3.some(t=>/GUANDU/.test(t)), 'in the first days Sun Ce dies and Guandu is fought ('+r.log3.length+' entries)');
 ok(r.guanyuNeedsLiuBei && r.guanyuNow, 'Guan Yu serves you only once Liu Bei favours you (favour '+r.liuFavor+')');
 ok(/three times/.test(r.zhugeNotYet||'') || /not yet/.test(r.zhugeNotYet||''), 'Zhuge Liang cannot be had before 207 ('+r.zhugeNotYet+')');
 ok(r.guanPower>=2, 'a hero leads his army at his own measure (×'+r.guanPower+')');
 ok(r.guanGone && r.caoDead, 'and in 220 history takes Guan Yu, even from your service, and Cao Cao dies ('+r.year+')');
 ok(r.btn && r.cards>=20 && r.portrait, 'the map has the HEROES button, and the screen draws every portrait ('+r.cards+')');
 ok(errs.length===0, 'no page errors'+(errs[0]? ' — '+errs[0] : ''));
 console.log(fail? '✗ '+fail+' FAILED' : 'ALL GREEN'); await br.close(); process.exit(fail?1:0); })();
