/* 🌊 THE MAPS ARE ALIVE: ships on the lanes, caravans on the roads, the weather of the season */
const {chromium}=require('playwright');
(async()=>{ const br=await chromium.launch(); const pg=await br.newPage({viewport:{width:1280,height:800}}); const errs=[]; pg.on('pageerror',e=>errs.push(''+e));
 await pg.goto('file://'+require('path').resolve(__dirname,'../index.html')); await pg.waitForTimeout(400);
 let fail=0; const ok=(c,m)=>{ console.log((c?'  PASS  ':'  FAIL  ')+m); if(!c) fail++; };
 const r=await pg.evaluate(()=>{ const S=window.__SS, o={};
   o.ships=['roman','indian','junk'].map(st=>{ const cv=S.shipSprite(st,0,4), d=cv.getContext('2d').getImageData(0,0,cv.width,cv.height).data; let n=0; for(let i=3;i<d.length;i+=4) if(d[i]>40) n++; return n; });
   S.newDemo('Marcus','Italia','Roman'); const seasons=[]; const px={};
   for(const day of [0,5,10,15]){ S.G.day=day; seasons.push(S.mapSeason()); px[day]=[S.weatherTest('west','snow'), S.weatherTest('east','rain')]; }
   o.seasons=seasons; o.px=px;
   S.G.day=0; S.enterMap(); return o; });
 await pg.waitForTimeout(600);
 const layer=await pg.evaluate(()=>{ const cv=document.getElementById('silk-layer'); if(!cv) return {ok:false}; const d=cv.getContext('2d').getImageData(0,0,cv.width,cv.height).data; let n=0; for(let i=3;i<d.length;i+=4) if(d[i]>40) n++; return {ok:cv.style.display!=='none', n}; });
 ok(r.ships.every(n=>n>400), 'a Roman merchantman, an Indian ship and a junk are each drawn as a real ship ('+r.ships.join('/')+' px)');
 ok(JSON.stringify(r.seasons)==='[0,1,2,3]', 'the year turns through its four seasons');
 const n=(s)=>+String(s).split(' ')[1]||0;
 ok(n(r.px[15][0])>n(r.px[5][0]), 'winter brings the snow down on the north ('+r.px[5][0]+' → '+r.px[15][0]+')');
 ok(n(r.px[5][1])>n(r.px[15][1]) , 'summer brings the monsoon over India ('+r.px[15][1]+' → '+r.px[5][1]+')');
 ok(layer.ok && layer.n>200, 'and the Roman sheet has its life layer drawn over it ('+layer.n+' px)');
 ok(errs.length===0, 'no page errors'+(errs[0]? ' — '+errs[0] : ''));
 console.log(fail? '✗ '+fail+' FAILED' : 'ALL GREEN'); await br.close(); process.exit(fail?1:0); })();
