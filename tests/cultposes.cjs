/* ✦ THE COUNTRIES' OWN POSITIONS, AND HOW HE GOES IN
   A player: "when I said make custom woohoos I meant actual different positions, different entry styles" and "a culture
   in India might use different positions and animations than a Roman woohoo". Nine new positions (27–35) with their own
   bodies, each sheet's running order carrying the ones its own books name; and an entry and a rhythm per country. */
const {chromium}=require('playwright');
const SETUP=()=>{ const S=window.__SS; S.newDemo('Marcus','Italia','Roman'); const G=S.G;
    G.world='rome'; G.coin=99999; G.isFemale=false; G.married=true; G.hygiene=90; G.day=400; G.lastLoveDay=399; G.hasVilla=true;
    const sp=S.makeBride('roman',false,9,{male:true}); sp.male=false; sp.eth='roman'; sp.name='Julia'; sp.quirks=[]; sp.flaws=[]; sp.traits=['tempting'];
    sp.body=Object.assign(sp.body||{},{booty:8,bust:8,waist:7,legs:7,face:8,secret:5}); G.wife=sp; G.wifeRel=85; G.wifePhys=60; G.body=G.body||{}; G.body.secret=8; return G; };
(async()=>{ const br=await chromium.launch(); const pg=await br.newPage({viewport:{width:1000,height:700}}); const errs=[]; pg.on('pageerror',e=>errs.push(''+e));
 await pg.goto('file://'+require('path').resolve(__dirname,'../index.html')); await pg.evaluate(()=>localStorage.setItem('SANDSTEEL_ADULT','1')); await pg.reload(); await pg.waitForTimeout(400);
 let fail=0; const ok=(c,m)=>{ console.log((c?'  PASS  ':'  FAIL  ')+m); if(!c) fail++; };
 const r=await pg.evaluate((src)=>{ const S=window.__SS; eval(src)(); const out={};
   const KINDS={27:'away',28:'squat',29:'shoulders',30:'flat',31:'lotus',32:'knelt',33:'floorbend',34:'wrapped',35:'swing',36:'kotatsu',37:'chausu',38:'divan'};
   // every new position draws two bodies, for every sheet that plays it, and gets that sheet's name for it
   out.draw=[]; out.named=[]; out.joined=[];
   for(const key of Object.keys(S.POSE_LORE)){ const L=S.POSE_LORE[key]; const order=L.order||[]; S.setBedKey(key);
     for(const vi of order.filter(v=>v>=27)){ S.setWH('done'); S.startBedScene('fun','night','bed'); const BC=S.BC; BC.forcePose=vi; S.setBCT(520+320+100);
       const n0=S.BEDPOSE_DRAWS; try{ S.drawBed(); }catch(e){ out.draw.push(key+'/'+vi+':'+e.message); continue; }
       const LL=S.BEDPOSE_LAST; if(!(S.BEDPOSE_DRAWS>n0 && LL && LL.vi===vi && LL.kind===KINDS[vi] && LL.him && LL.her && LL.him.head && LL.her.head)) out.draw.push(key+'/'+vi);
       const nm=(L.names&&L.names[vi]) || (L.inherit && S.POSE_LORE[L.inherit].names && S.POSE_LORE[L.inherit].names[vi]);
       if(nm && BC.poseName!==nm) out.named.push(key+'/'+vi+' "'+BC.poseName+'"');
       // the two of them are actually together: his root within reach of her body
       const h=LL.him, w=LL.her; if(h && w && h.root && w.hip && Math.hypot(h.root[0]-w.hip[0], h.root[1]-w.hip[1])>22) out.joined.push(key+'/'+vi+' '+Math.round(Math.hypot(h.root[0]-w.hip[0], h.root[1]-w.hip[1]))); } }
   S.setBedKey(null);
   // the sheets differ: how many sheets carry at least one position no other sheet in the West or the East started with
   out.newBySheet={}; for(const key of Object.keys(S.POSE_LORE)){ const o=S.POSE_LORE[key].order||[]; out.newBySheet[key]=o.filter(v=>v>=27).length; }
   // the way in, by country
   const at=(key,vt,T)=>{ S.setBedKey(key); const r=S.bedStroke(vt,T||1000,0.36); S.setBedKey(null); return r; };
   out.press=[0,10,20,30,40].map(v=>at('roman',v).out); out.tease=[0,6,12,18,24,30].map(v=>at('han',v).out); out.sudden=[0,9,12,14,20].map(v=>at('steppe',v).out);
   out.guide=at('kushan',20).guide; out.coast=at('rkrai',10);
   // nine shallow, one deep
   const ds=[]; for(let T=0; T<200; T+=0.5){ S.setBedKey('han'); ds.push(S.bedStroke(100,T,0.36)); } S.setBedKey(null);
   out.nineLabels=[...new Set(ds.map(d=>d.label))]; out.maxShallow=Math.max(...ds.filter(d=>/· /.test(d.label)).map(d=>d.d)); out.maxDeep=Math.max(...ds.filter(d=>/one deep$/.test(d.label)).map(d=>d.d));
   // the Kamasutra's strokes, in turn
   const ks=new Set(); for(let T=0; T<800; T+=1){ S.setBedKey('kushan'); ks.add((S.bedStroke(100,T,0.36).label||'').split(' — ')[0]); } S.setBedKey(null); out.kama=[...ks];
   return out; }, '('+SETUP.toString()+')');
 ok(r.draw.length===0, 'every country’s own position draws the two of them, as itself'+(r.draw.length? ' — '+r.draw.slice(0,6).join(', ') : ''));
 ok(r.named.length===0, 'and each is called what that country calls it'+(r.named.length? ' — '+r.named.slice(0,4).join(', ') : ''));
 ok(r.joined.length===0, 'and they are together, not two figures near each other'+(r.joined.length? ' — '+r.joined.slice(0,6).join(', ') : ''));
 const withNew=Object.entries(r.newBySheet).filter(([k,n])=>n>0).map(([k])=>k);
 ok(['roman','greek','han','korean','kushan','tamil','wa','steppe','celt','persian'].every(k=>withNew.includes(k)), 'Rome, Greece, Han, Korea, the Kamasutra, Tamilakam, Wa, the steppe, the Celts and Persia each play positions of their own ('+withNew.length+' sheets)');
 ok(r.press[0]>0.95 && r.press[4]<0.05 && r.press[2]<r.press[0], 'Rome: he presses in, slowly — out, then halfway, then home ('+r.press.map(v=>v.toFixed(2)).join(' → ')+')');
 const dips=r.tease.filter((v,i)=>i>0 && v<r.tease[i-1]).length, rises=r.tease.filter((v,i)=>i>0 && v>r.tease[i-1]).length;
 ok(dips>=1 && rises>=1 && Math.min(...r.tease)>0.35, 'Han: the tip, and out, and the tip — in and out at the entrance before he goes in ('+r.tease.map(v=>v.toFixed(2)).join(' ')+')');
 ok(r.sudden[0]===1 && r.sudden[1]===1 && r.sudden[3]<0.5 && r.sudden[4]===0, 'the steppe: one stroke, all the way, no warning ('+r.sudden.map(v=>v.toFixed(2)).join(' ')+')');
 ok(r.guide===true, 'the Kamasutra’s country: her hand guides him in');
 ok(r.coast && r.coast.out===0 && r.coast.label===null, 'and the coast keeps the tempo it already has');
 ok(r.nineLabels.some(l=>/一/.test(l)) && r.nineLabels.some(l=>/九/.test(l)) && r.nineLabels.some(l=>/one deep$/.test(l)), '九淺一深: it counts the nine shallow, then the one deep');
 ok(r.maxShallow < 0.45 && r.maxDeep > 0.95, 'and the shallow ones ARE shallow, the deep one deep ('+r.maxShallow.toFixed(2)+' vs '+r.maxDeep.toFixed(2)+')');
 ok(['upasṛpta','manthana','hula','avamardana','pīḍitaka','nirghāta','varāhaghāta','vṛṣāghāta','caṭakavilāsa'].every(n=>r.kama.includes(n)), 'the Kamasutra’s nine strokes of the man all come round in turn');
 ok(errs.length===0, 'no page errors'+(errs[0]? ' — '+errs[0] : ''));
 console.log(fail? '✗ '+fail+' FAILED' : 'ALL GREEN'); await br.close(); process.exit(fail?1:0); })();
