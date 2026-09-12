/* THE KANVEK — and the thing this test actually exists to hold down is that
   SHE IS ON HER KNEES.

   The first cut of this pose went through the figure rig, which hangs a
   straight spine off a pair of hips and has no joint at the waist, so what
   came out was two people standing next to each other with a steam band
   between them. Nothing in the code said so — it drew clean, it threw no
   error, and every suite stayed green. The only way to catch it is to LOOK
   at the pixels, so that is what this does: it renders the pose on its own,
   reads the frame back, and asserts the shape of her.

   Three things have to be true at once, and all three were false before:
     · she is DOWN — her skin is on the boards, over a run of rows, not one
       stray pixel, which is a knee and a shin and a thigh
     · the TOP of her sits well under a standing man rather than beside him
     · and she reaches ACROSS — her skin arrives at his side of the floor,
       which is the difference between leaning in and standing there        */
const {chromium}=require('playwright');
const FILE='file:///home/user/Ancient-Life-sim-300-A.D-/index.html';
let pass=0, fail=0;
const ok=(name,cond,note)=>{ if(cond){pass++; console.log('  PASS  '+name+(note?'   '+note:''));}
                             else {fail++; console.log('  FAIL  '+name+(note?'   '+note:''));} };

(async()=>{
  const br=await chromium.launch();
  const pg=await br.newPage({viewport:{width:960,height:600}});
  const errs=[]; pg.on('pageerror',e=>errs.push(''+e));
  await pg.goto(FILE);
  await pg.evaluate(()=>localStorage.setItem('SANDSTEEL_ADULT','1'));
  await pg.reload(); await pg.waitForTimeout(400);

  console.log('\n=== ✧ THE KANVEK ===');
  const R = await pg.evaluate(()=>{
    const S=window.__SS, out={};
    S.newDemo('Kaiq','Leokanis','RkTorvak');
    const G=S.G; G.world='rk'; G.married=true; G.isFemale=false; G.hasVilla=true;
    const w=S.makeBride('rkrai',false,9,{male:true});
    w.male=false; w.eth='rkrai'; w.flaws=[]; w.quirks=[]; w.traits=[];
    w.body={face:10,hairq:7,bust:7,waist:5,booty:10,legs:7}; w.age=24;
    w.skin='#e6bd94'; G.wife=w; G.body=G.body||{}; G.body.secret=5;

    out.offWithout = S.kanvekOn(w);
    w.traits=['kanvek'];
    out.onWith = S.kanvekOn(w);
    out.sign = S.kanvekSign(w);                       // a ten in the face reads loudest
    out.word = S.RK_KANVEK && S.RK_KANVEK.word;
    out.hersNotHis = !!(S.RK_KANVEK && /about her/i.test(S.RK_KANVEK.what||'')
                                       && /opposite way round/i.test(S.RK_KANVEK.what||''));
    out.grateful   = !!(S.RK_KANVEK && /grateful/i.test(S.RK_KANVEK.right||''));

    const order=S.rkPoseOrder();
    out.order=order; out.leads=(order[0]===22); out.i=order.indexOf(22);
    out.name=S.poseName(22,'?');

    /* ---- and now the pixels ---- */
    S.setWH('done'); S.startBedScene('long','love','bed');
    const cv=document.getElementById('game'), gc=cv.getContext('2d');
    const T=520+out.i*160+60;
    S.setBCT(T);
    gc.save(); gc.setTransform(1,0,0,1,0,0);
    gc.fillStyle='#000000'; gc.fillRect(0,0,cv.width,cv.height); gc.restore();
    S.drawShadowPlay(S.BC, T);                        // straight, with no camera on it
    const D=gc.getImageData(0,0,cv.width,cv.height).data;
    /* HER skin, and only hers — his is a different colour on purpose, so the
       two of them can be told apart in a frame where they are touching */
    const her=[0xe6,0xbd,0x94];
    const isHer=(x,y)=>{ const k=(y*cv.width+x)*4;
      return Math.abs(D[k]-her[0])<20 && Math.abs(D[k+1]-her[1])<20 && Math.abs(D[k+2]-her[2])<20; };
    const rowHas=(y,x0,x1)=>{ for(let x=x0;x<x1;x++) if(isHer(x,y)) return true; return false; };
    const rowCount=(y,x0,x1)=>{ let n=0; for(let x=x0;x<x1;x++) if(isHer(x,y)) n++; return n; };

    const gx=70, gw=240, cx0=gx+gw/2, base=36+138-8;  // the play box drawShadowPlay works in
    out.base=base;
    // 1 · SHE IS DOWN. Skin within three pixels of the boards, out to her side.
    out.onTheBoards = rowHas(base-3, cx0-10, cx0+46) || rowHas(base-4, cx0-10, cx0+46);
    out.floorSpan   = rowCount(base-4, cx0-10, cx0+46);
    // 2 · and she is down over a RANGE, not one stray pixel: knee, shin, thigh
    let low=0; for(let y=base-8;y<base-1;y++) if(rowHas(y, cx0-6, cx0+46)) low++;
    out.lowRows=low;
    // 3 · HER HIGHEST POINT. Kneeling upright, the top of her is her own back
    //     and seat, and it has to sit well under his shoulders.
    let top=-1; for(let y=base-60;y<base;y++){ if(rowHas(y, cx0-4, cx0+48)){ top=y; break; } }
    out.herTop=top; out.herTopAbove=base-top;
    // 4 · and she reaches ACROSS to him: her skin has to arrive at his side
    let reach=999; for(let x=cx0-40;x<cx0+48;x++){ let hit=false;
      for(let y=base-40;y<base;y++) if(isHer(x,y)){hit=true;break;}
      if(hit){ reach=x; break; } }
    out.herLeftEdge=reach; out.reachesHim=(reach < cx0-12);
    return out;
  });

  ok('the trait is what turns it on',        R.offWithout===false && R.onWith===true);
  ok('and the coast reads it as HERS',       R.hersNotHis, R.word);
  ok('and the right thing to feel is grateful', R.grateful);
  ok('a ten in the face is the plainest sign', !!R.sign && R.sign.k==='plain' && R.sign.face===10,
     (R.sign&&R.sign.k)+' at face '+(R.sign&&R.sign.face));
  ok('her gift leads the running order',     R.leads, 'order '+R.order.join(','));
  ok('and it is named as her gift, not his', /HER gift/i.test(R.name||''), R.name);

  console.log('\n--- AND SHE IS ON HER KNEES (read off the frame) ---');
  ok('there is skin on the boards',          R.onTheBoards, 'span '+R.floorSpan+'px at the floor');
  ok('and it is a leg, not a stray pixel',   R.floorSpan>=8, R.floorSpan+' px wide');
  ok('she occupies the bottom of the frame', R.lowRows>=5, R.lowRows+' of 7 rows above the boards');
  ok('the top of her is well under a standing man',
     R.herTopAbove>0 && R.herTopAbove<=34, 'her highest point is '+R.herTopAbove+'px off the floor');
  ok('and she reaches across to him',        R.reachesHim, 'her left edge at cx0'+(R.herLeftEdge-190>=0?'+':'')+(R.herLeftEdge-190));

  console.log('\n--- PAGE ERRORS ---');
  ok('none', errs.length===0, errs.join(' | '));

  console.log('\n'+(fail? '✗ '+fail+' FAILED   ('+(pass+fail)+' checks)'
                        : 'ALL GREEN   ('+pass+' checks)'));
  await br.close();
  process.exit(fail?1:0);
})();
