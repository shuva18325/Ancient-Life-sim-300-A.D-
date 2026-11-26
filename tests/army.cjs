/* 🦅 THE ARMY — the Legions path fights its campaigns, and the command your rank gives you is a real force.
   Run against the build before with FILE=…: it fails there. */
const {chromium}=require('playwright');
const FILE=process.env.FILE || ('file://'+require('path').resolve(__dirname,'..','index.html'));
let pass=0, fail=0;
const ok=(name,cond,note)=>{ if(cond){pass++; console.log('  PASS  '+name+(note?'   '+note:''));} else {fail++; console.log('  FAIL  '+name+(note?'   '+note:''));} };
(async()=>{
  const br=await chromium.launch(); const pg=await br.newPage({viewport:{width:1280,height:720}}); const errs=[]; pg.on('pageerror',e=>errs.push(''+e));
  await pg.goto(FILE); await pg.waitForTimeout(500); await pg.evaluate(()=>{ window.requestAnimationFrame=()=>0; });
  const T=async(fn,arg)=>{ try{ return await pg.evaluate(fn,arg); }catch(e){ return {err:String(e).slice(0,300)}; } };
  let R=await T(()=>{ const S=window.__SS; S.newDemo('Marcus','Italia','Roman'); S.G.coin=500; S.openLegion(); const P=S.armyPowerDetail(); const txt=document.getElementById('scr-legion').innerText;
    return {size:P.size, atk:P.atk, fed:/FED BY ROME/.test(txt), starving:/STARVING/.test(txt), force:(txt.match(/YOUR FORCE — ([\d,]+) men/)||[])[1]}; });
  ok('🦅 the 600 men a tribune commands are a real force: YOUR FORCE says 600, not 0', !R.err && R.size===600 && R.force==='600' && R.atk>500, R.err||JSON.stringify(R));
  ok('…and Rome feeds them: not "STARVING" with nothing of your own to feed', !R.err && R.fed && !R.starving, R.err||JSON.stringify(R));
  R=await T(()=>{ const S=window.__SS; S.newDemo('Marcus','Italia','Roman'); const o=[1,2,3].map(d=>S.campaignOdds? S.campaignOdds({diff:d}) : null); return o; });
  ok('the odds are a fight, not a massacre: an easy campaign is better than even, a hard one is possible', !R.err && R[0]>0.55 && R[1]>0.3 && R[2]>0.18 && R[2]<R[1] && R[1]<R[0], R.err||JSON.stringify(R));
  R=await T(()=>{ const S=window.__SS; S.newDemo('Marcus','Italia','Roman'); S.G.coin=500; S.openLegion(); const before=S.G.campaigns||0; const btn=[...document.querySelectorAll('#legion-body button')].find(b=>/TAKE THE FIELD/.test(b.textContent)); btn.click();
    const st=S.state; let k=0; while(S.state==='battle' && k++<400){ S.updateBattle? S.updateBattle(1) : 0; S.drawBattle? S.drawBattle() : 0; if(S.BT && S.BT.ended) break; }
    return {st, before, hasUpd:!!S.updateBattle}; });
  ok('⚔ TAKE THE FIELD is FOUGHT: the battle plays before the result', !R.err && R.st==='battle', R.err||JSON.stringify(R));
  await pg.waitForTimeout(1200);                                           // the field holds for a moment, then the result
  R=await T(()=>({state:window.__SS.state, camp:window.__SS.G.campaigns||0, scr:(document.querySelector('.screen.on')||{}).id}));
  ok('…and when it is over you are back at the legion with the campaign counted', !R.err && R.state==='legion' && R.camp===1 && R.scr==='scr-legion', R.err||JSON.stringify(R));
  ok('no page errors', errs.length===0, errs.slice(0,3).join(' | '));
  console.log(fail? fail+' FAILED, ('+(pass+fail)+' checks)' : 'ALL GREEN   ('+pass+' checks)'); await br.close(); process.exit(fail?1:0);
})();
