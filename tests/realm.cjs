/* 🐉 THE REALM: an Eastern dynasty ruled province by province */
const {chromium}=require('playwright');
(async()=>{ const br=await chromium.launch(); const pg=await br.newPage({viewport:{width:1280,height:900}}); const errs=[]; pg.on('pageerror',e=>errs.push(''+e));
 await pg.goto('file://'+require('path').resolve(__dirname,'../index.html')); await pg.waitForTimeout(400);
 let fail=0; const ok=(c,m)=>{ console.log((c?'  PASS  ':'  FAIL  ')+m); if(!c) fail++; };
 const r=await pg.evaluate(()=>{ const S=window.__SS, o={}; S.newDemo('Liu','Luoyang','Han'); const G=S.G; G.world='east'; G.current='Luoyang'; G.emperor=true; G.titles={Luoyang:1,'Yan Province':1};
   G.dynasty={zh:'晉', n:'Jin', ph:'metal', col:'#c8c8d0', era:['泰始','Taishi'], eras:['泰始'], cap:'Luoyang', capZh:'洛陽', legit:8, how:'sword', fate:'duke', day:0, eraDay:0}; G.generals=[];
   const E=S.realmInit(); o.prov=Object.keys(E.prov).length; o.mine=Object.values(E.prov).filter(p=>p.owner==='you').length; o.cao=E.prov['Xuchang'].owner;
   const t0=E.treasury; S.realmSeason(); o.income=E.treasury-t0; o.season=E.season; o.log=E.log.length;
   E.prov['Yan Province'].tax='high'; const l0=E.prov['Yan Province'].loyal; S.realmSeason(); o.highTaxLoyal=E.prov['Yan Province'].loyal<l0 || E.prov['Yan Province'].owner!=='you';
   S.openRealm(); o.screen=document.getElementById('scr-realm').classList.contains('on'); o.offices=document.querySelectorAll('#realm-court select').length; o.works=document.querySelectorAll('#realm-court button').length;
   const d=document.getElementById('realm-cv').getContext('2d').getImageData(360,270,1,1).data; o.map=d[3]>0;
   return o; });
 ok(r.prov===20 && r.mine===2 && r.cao==='han_cao', 'twenty provinces: yours, and Cao Cao still holds Xuchang');
 ok(r.income!==0 && r.season===1 && r.log>0, 'a season collects taxes, pays the armies and writes the annals ('+(r.income>=0? '+' : '')+r.income+')');
 ok(r.highTaxLoyal, 'high taxes cost the people’s hearts');
 ok(r.screen && r.offices===5 && r.works>=4 && r.map, 'the screen: the map of the realm, five offices of the court, the great works');
 ok(errs.length===0, 'no page errors'+(errs[0]? ' — '+errs[0] : ''));
 console.log(fail? '✗ '+fail+' FAILED' : 'ALL GREEN'); await br.close(); process.exit(fail?1:0); })();
