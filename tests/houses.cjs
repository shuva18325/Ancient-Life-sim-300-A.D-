/* 🏠 EVERY PEOPLE'S OWN HOUSE
   "Different maps. Different houses." hallStyle() read the province's
   culture and seven styles had a shell, so Parthia, Persis, Armenia,
   Arabia, Egypt, the Tarim oases, the stilt-house south and the Tibetan
   plateau all lived in an Italian atrium with a Roman kitchen behind the
   door. Each people's row already named its hall; now it is read.       */
const {chromium}=require('playwright');
const FILE=process.env.FILE || ('file://'+require('path').resolve(__dirname,'..','index.html'));
let pass=0, fail=0;
const ok=(name,cond,note)=>{ if(cond){pass++; console.log('  PASS  '+name+(note?'   '+note:''));}
                             else {fail++; console.log('  FAIL  '+name+(note?'   '+note:''));} };
(async()=>{
  const br=await chromium.launch();
  const pg=await br.newPage({viewport:{width:960,height:540}});
  const errs=[]; pg.on('pageerror',e=>errs.push(''+e));
  await pg.goto(FILE); await pg.waitForTimeout(400);
  const R=await pg.evaluate(async ()=>{ const S=window.__SS, out={};
    for(const reg of ['Italia','Luoyang','Ctesiphon','Aegyptus','Funan','Loulan','Bod','Margiana']){
      S.newDemo('Wei','Italia','Murmillo'); const G=S.G; const east=!!(S.REGION_EAST_BY_ID&&S.REGION_EAST_BY_ID[reg]); G.world=east?'east':'west'; G.current=reg;
      G.married=true; G.isFemale=false; G.hasVilla=true; G.day=40; G.coin=9000;
      const w=S.makeBride(S.localCulture().id,true,8); w.male=false; G.wife=w; G.wifeRel=80;
      let err=null, sig=0; try{ S.openDomus(); await new Promise(r=>setTimeout(r,120)); S.drawDomus();
        const d=document.getElementById('game').getContext('2d').getImageData(0,20,480,180).data; for(let i=0;i<d.length;i+=97) sig=(sig*31+d[i]+d[i+1]*7+d[i+2]*13)|0; }catch(e){ err=String(e).slice(0,120); }
      out[reg]={hs:S.hallStyle(), err, sig, door:S.doorPlan().bedStyle}; }
    return out; });
  ok('Rome stays an atrium and Luoyang a Han compound', R.Italia.hs==='atrium' && R.Luoyang.hs==='courtyard', JSON.stringify([R.Italia.hs,R.Luoyang.hs]));
  ok('Ctesiphon and Merv live in an iwan house', R.Ctesiphon.hs==='iwan' && R.Margiana.hs==='iwan', R.Ctesiphon.hs+' '+R.Margiana.hs);
  ok('Egypt in mud brick on the Nile, Funan on piles, Loulan in an oasis house, Bod in a black tent', R.Aegyptus.hs==='nile' && R.Funan.hs==='stilt' && R.Loulan.hs==='oasis' && R.Bod.hs==='yaktent', JSON.stringify(['Aegyptus','Funan','Loulan','Bod'].map(k=>R[k].hs)));
  ok('every one of them draws, with no errors', Object.values(R).every(v=>!v.err), JSON.stringify(Object.entries(R).filter(([k,v])=>v.err)));
  ok('and they are different pictures, not one picture relabelled', new Set(Object.values(R).map(v=>v.sig)).size===Object.keys(R).length, '');
  ok('the doors belong to the house: carved teak in Parthia, felt in the tent, lattice on piles', R.Ctesiphon.door==='teak' && R.Bod.door==='felt' && R.Funan.door==='lattice', JSON.stringify([R.Ctesiphon.door,R.Bod.door,R.Funan.door]));
  ok('no page errors', errs.length===0, errs.slice(0,3).join(' | '));
  console.log('\n'+pass+' passed, '+fail+' failed');
  await br.close(); process.exit(fail?1:0);
})();
