/* ⚔ THE WARS OF THE OTHER WORLDS: Wa, the Rkrai shore and the Ice field their own armies and fight their own campaigns */
const {chromium}=require('playwright');
(async()=>{ const br=await chromium.launch(); const pg=await br.newPage({viewport:{width:1280,height:900}}); const errs=[]; pg.on('pageerror',e=>errs.push(''+e));
 await pg.goto('file://'+require('path').resolve(__dirname,'../index.html')); await pg.waitForTimeout(400);
 let fail=0; const ok=(c,m)=>{ console.log((c?'  PASS  ':'  FAIL  ')+m); if(!c) fail++; };
 const r=await pg.evaluate(()=>{ const S=window.__SS, o={};
   S.newDemo('K','Owari','WaSamurai'); o.waMine=S.armyStyleMine(); o.waList=S.campaignsForWorld().length; o.waHere=S.armyStyleHere();
   S.openWorldWars(); o.waCards=document.querySelectorAll('#wars-list .shopcard').length; document.getElementById('wars-ov').style.display='none';
   S.newDemo('A','The Taurus Mountains','IceHunter'); o.iceMine=S.armyStyleMine(); o.iceList=S.campaignsForWorld()[0].id;
   S.newDemo('M','Rome','Roman'); o.west=S.armyStyleMine(); o.westList=S.campaignsForWorld().length>5;
   const keys=S.armyStyleKeys(); o.styles=['wa_ashigaru','wa_samurai','wa_teppo','wa_sohei','wa_ikki','wako','wa_oda','wa_takeda','rk_house','rk_rival','ice_band','ice_rival'].every(k=>keys.includes(k));
   return o; });
 ok(/^wa_/.test(r.waMine) && /^wa_/.test(r.waHere) && r.waList>=10, 'Wa fields its own clan army ('+r.waMine+') against '+r.waHere+', with '+r.waList+' Sengoku campaigns');
 ok(r.waCards===3, 'the war screen offers three wars');
 ok(r.iceMine==='ice_band' && r.iceList, 'the Ice fights as the band, against other bands');
 ok(r.west==='legion' && r.westList, 'Rome is still the legion');
 ok(r.styles, 'every new army style exists');
 ok(errs.length===0, 'no page errors'+(errs[0]? ' — '+errs[0] : ''));
 console.log(fail? '✗ '+fail+' FAILED' : 'ALL GREEN'); await br.close(); process.exit(fail?1:0); })();
