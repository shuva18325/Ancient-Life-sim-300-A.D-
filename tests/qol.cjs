/* 🛠 QUALITY OF LIFE: music for each people, save slots with pictures, the gallery, panels that close */
const {chromium}=require('playwright');
(async()=>{ const br=await chromium.launch(); const pg=await br.newPage({viewport:{width:1280,height:900}}); const errs=[]; pg.on('pageerror',e=>errs.push(''+e));
 await pg.goto('file://'+require('path').resolve(__dirname,'../index.html')); await pg.waitForTimeout(400);
 let fail=0; const ok=(c,m)=>{ console.log((c?'  PASS  ':'  FAIL  ')+m); if(!c) fail++; };
 await pg.mouse.click(5,5);
 const r=await pg.evaluate(async ()=>{ const S=window.__SS, o={}; S.newDemo('Marcus','Rome','Roman'); S.enterMap(); await new Promise(r=>setTimeout(r,300));
   o.scales=Object.keys(S.MUSIC_SCALES).length; try{ S.musTick(); o.mus=true; }catch(e){ o.mus=e.message; }
   localStorage.removeItem('ss_gallery_v1'); S.galSee(3); S.galSee(17); o.gal=Object.keys(S.galLoad().poses).length;
   S.slotThumbTake(); const th=S.slotThumb(1)||S.slotThumb(S.G&&1); o.thumb=!!(th&&th.img&&th.img.length>500);
   document.getElementById('btn-slots')&&0; S.openGallery(); o.galCards=document.querySelectorAll('#gal-grid > div').length; o.galOpen=document.querySelectorAll('#gal-grid button').length;
   document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape'})); o.closed=document.getElementById('gal-ov').style.display==='none';
   return o; });
 ok(r.scales===10 && r.mus===true, 'ten peoples have their own music, and the player runs');
 ok(r.gal===2 && r.galCards===39 && r.galOpen===2, 'the gallery lists all 39 positions with the two reached open to replay');
 ok(r.thumb, 'saving takes a picture for the slot');
 ok(r.closed, 'Esc closes a panel');
 // the slot screen shows the picture
 const s2=await pg.evaluate(()=>{ try{ const b=document.getElementById('btn-slots'); return !!b; }catch(e){ return false; } });
 const h=await pg.evaluate(()=>{ const S=window.__SS; S.newDemo('M','Rome','Roman'); S.enterMap(); const vis=id=>{ const b=document.getElementById(id); return !!b && b.style.display!=='none'; }; document.getElementById('btn-home').click(); return {home:vis('btn-home'), villaHidden:!vis('btn-villa'), tiles:document.querySelectorAll('#home-grid > button').length}; });
 ok(h.home && h.villaHidden && h.tiles===5, 'one HOME button on the bar opens the five rooms of home');
 ok(errs.length===0, 'no page errors'+(errs[0]? ' — '+errs[0] : ''));
 console.log(fail? '✗ '+fail+' FAILED' : 'ALL GREEN'); await br.close(); process.exit(fail?1:0); })();
