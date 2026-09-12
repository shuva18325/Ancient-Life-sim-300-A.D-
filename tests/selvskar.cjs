/* =====================================================================
   ✎ THE SELVSKAR — the one she cuts herself
   ---------------------------------------------------------------------
   Run:  NODE_PATH=/opt/node22/lib/node_modules /opt/node22/bin/node tests/selvskar.cjs
   ===================================================================== */
const {chromium}=require('playwright');
const FILE='file://'+require('path').resolve(__dirname,'..','index.html');
let pass=0, fail=0;
const ok =(n,d)=>{ pass++; console.log('  PASS  '+n+(d?'   '+d:'')); };
const bad=(n,d)=>{ fail++; console.log('  FAIL  '+n+(d?'   '+d:'')); };
const is =(n,a,b)=> (a===b? ok(n,String(a)) : bad(n,'got '+JSON.stringify(a)+' want '+JSON.stringify(b)));
const yes=(n,v,d)=> (v? ok(n,d) : bad(n,d));
const head=t=>console.log('\n--- '+t+' ---');

const setup=`(()=>{
  const S=window.__SS;
  S.newDemo('Kaiq','Leokanis','RkTorvak');
  const G=S.G;
  G.world='rk'; G.isFemale=false; G.married=true; G.coin=9000;
  const her=S.makeBride('rkrai',false,9,{male:true});
  her.male=false; her.eth='rkrai'; her.flaws=[]; her.quirks=[];
  her.body=her.body||{}; her.body.booty=9; her.body.bust=8; her.body.waist=6; her.body.legs=5;
  G.wife=her;
  G.day=20; G.lastTalkDay=10; G.lastLoveDay=10; G.wifeRel=70; G.wifePhys=45;
  G.rkHolds={naukan:{day:3}};
  G.selv=null; G.selvDay=undefined; G.selvSent=0; G.selvDone=0; G.selvIgnored=0;
})()`;

(async()=>{
  const br=await chromium.launch();
  const pg=await br.newPage({viewport:{width:1000,height:800}});
  const errs=[]; pg.on('pageerror',e=>errs.push(''+e));
  await pg.goto(FILE);
  await pg.evaluate(()=>localStorage.setItem('SANDSTEEL_ADULT','1'));
  await pg.reload(); await pg.waitForTimeout(500);
  await pg.evaluate(setup);

  head('NO HAND WILL CUT IT');
  { const r=await pg.evaluate(()=>{
      const S=window.__SS;
      const ids=S.RK_ART_DRESS.map(d=>d.id);
      const R=S.RK_ART_REFUSED;
      /* and it cannot be smuggled back in through the commission call */
      const c=S.raunskarCommission('post','bone','back','booty','bare');
      const used=c && c.ok && S.G.rkArtPending && S.G.rkArtPending.dress;
      if(c && c.ok) S.raunskarRespond('accept');
      return {ids, refused:!!(R&&R.name&&R.why&&R.and), name:R&&R.name, used};
    });
    yes('NOTHING AT ALL is off the commission list', r.ids.indexOf('bare')<0, r.ids.join(', '));
    yes('and the shop explains why in the world, not as a rule', r.refused, r.name);
    yes('asking for it anyway does not get it',
        r.used!=='bare', 'commission fell back to '+r.used);
  }

  head('SHE SENDS IT, AND ONLY FOR A REASON');
  { const r=await pg.evaluate((s)=>{
      eval(s); const S=window.__SS, G=S.G;
      const out={};
      out.on=S.selvskarOn();
      /* away over the water with no word from you */
      G.rkHolds={naukan:{day:3}}; G.lastTalkDay=(G.day|0)-9; G.lastLoveDay=(G.day|0)-1;
      out.over=S.selvskarWhy();
      /* home, nothing landed, but you have not looked at her in a while */
      G.rkHolds={}; G.lastTalkDay=(G.day|0); G.lastLoveDay=(G.day|0)-9; G.wifeRel=72;
      out.focus=S.selvskarWhy();
      /* a house that is not speaking gets nothing */
      G.wifeRel=20; out.cold=S.selvskarWhy();
      G.wifeRel=72;
      /* and she is not sending them every other day */
      G.selvDay=(G.day|0)-1; out.tooSoon=S.selvskarWhy();
      G.selvDay=undefined;
      /* nor to a man on the wrong coast */
      G.world='west'; out.offCoast=S.selvskarOn(); G.world='rk';
      return out;
    }, setup);
    yes('the coast has the whole arrangement', r.on===true);
    is('being over the water is one reason', r.over && r.over.why, 'over');
    is('and being looked past is the other', r.focus && r.focus.why, 'focus');
    is('a house not on speaking terms gets nothing', r.cold, null);
    is('she does not send them every other day', r.tooSoon, null);
    is('and it is a Rkrai arrangement only', r.offCoast, false);
  }

  head('WHAT ARRIVES IS HERS, NOT A SHOP’S');
  { const r=await pg.evaluate((s)=>{
      eval(s); const S=window.__SS, G=S.G;
      const got=S.selvskarArrive('over', 9);
      const W=S.RK_SELV_WHY[got.why];
      return {why:got.why, subj:got.subj, expr:got.expr, note:got.note,
              used:got.used, marks:got.marks|0, sent:G.selvSent|0,
              waiting:S.selvskarWaiting(),
              head:W.head, personal:/\bshore\b|\bcrier\b|\bchart\b|\bequinox\b|\bTen\b|\blaunching\b|\bheadland\b|\bme\b|\bthis\b/i.test(got.note),
              interp:got.note.indexOf('{d}')<0,
              subjIsReal:['booty','bust','waist','legs'].indexOf(got.subj)>=0};
    }, setup);
    is('it comes from over the water', r.why, 'over');
    yes('with a note in her own words', r.personal, r.note);
    yes('and the days actually filled in', r.interp);
    yes('it is of a real part of her', r.subjIsReal, r.subj+' · '+r.expr);
    yes('it is unopened when it lands', r.used===false && r.marks===0);
    yes('and the house knows it is waiting', r.waiting===true, r.head);
  }

  head('THE PLATE IS NOT A PAID HAND’S');
  { const r=await pg.evaluate((s)=>{
      eval(s); const S=window.__SS, G=S.G;
      S.selvskarArrive('focus', 7);
      const cv=document.createElement('canvas'); cv.width=cv.height=430;
      let threw=null;
      try{ S.drawSelvskar(cv, 1); }catch(e){ threw=''+e; }
      const px=cv.getContext('2d').getImageData(0,0,430,430).data;
      let ink=0, warm=0;
      for(let i=0;i<px.length;i+=4){ if(px[i+3]>8){ ink++;
        if(px[i]>150 && px[i+1]>120 && px[i+2]<190) warm++; } }
      /* the corners are OUTSIDE the torn hide — a rectangle would fill them */
      const corner=(x,y)=>cv.getContext('2d').getImageData(x,y,1,1).data[3];
      /* and her garment override is put back the way the raunskar does */
      const clean=(G.wife._skinBody===undefined && G.wife._cov===undefined
                   && G.wife._cutForce===undefined);
      return {threw, ink, warm, corners:[corner(1,1),corner(428,1),corner(1,428),corner(428,428)],
              clean, dress:G.wife.dress};
    }, setup);
    yes('it draws without throwing', !r.threw, r.threw||'');
    yes('and it actually paints', r.ink>90000, r.ink+' px');
    yes('most of it is hide, not shop plate', r.warm>r.ink*0.45, r.warm+' warm px');
    /* the hide's own drop shadow reaches the corners at a few percent
       alpha, so "empty" means no hide in them, not literally zero */
    yes('the hide is torn, so the corners are empty',
        r.corners.every(a=>a<40), JSON.stringify(r.corners));
    yes('and drawing it leaves her ledger entry alone', r.clean===true, 'dress '+r.dress);
  }

  head('✽ SPLAISH');
  { const r=await pg.evaluate((s)=>{
      eval(s); const S=window.__SS;
      S.selvskarArrive('over', 9);
      const cv=document.createElement('canvas'); cv.width=cv.height=430;
      const c=cv.getContext('2d');
      const whiteCount=()=>{ const px=c.getImageData(0,0,430,430).data; let n=0;
        for(let i=0;i<px.length;i+=4)
          if(px[i]>238 && px[i+1]>240 && px[i+2]>238 && px[i+3]>200) n++;
        return n; };
      S.drawSelvskar(cv, 1);
      const before=whiteCount();
      S.selvskarSplashStart();
      const started=!!S.SELV_ANIM, drops=S.SELV_ANIM.drops.length;
      let threw=null, mid=0, land=0, runs=0;
      try{
        for(let t=1; t<=420; t+=16) S.drawSelvskar(cv, t);
        mid=whiteCount();
        for(let t=436; t<=1400; t+=16) S.drawSelvskar(cv, t);
        land=whiteCount();
        runs=S.SELV_ANIM.drops.filter(d=>d.hit && d.run>6).length;
        for(let t=1416; t<=3200; t+=16) S.drawSelvskar(cv, t);
      }catch(e){ threw=''+e; }
      const done=!S.SELV_ANIM || S.SELV_ANIM.done;
      S.SELV_ANIM=null;
      return {before, mid, land, drops, started, threw, done, runs};
    }, setup);
    yes('the plate starts clean', r.before<2600, r.before+' white px');
    yes('the splash starts with real drops', r.started && r.drops>=6, r.drops+' drops');
    yes('it runs without throwing', !r.threw, r.threw||'');
    yes('something is in the air on the way down', r.mid>r.before, r.before+' -> '+r.mid);
    yes('and a lot more of it once it lands', r.land>r.mid*1.4, r.mid+' -> '+r.land);
    yes('the landed ones actually drip', r.runs>=4, r.runs+' running');
    yes('and it finishes rather than looping forever', r.done===true);
  }
  { const r=await pg.evaluate((s)=>{
      eval(s); const S=window.__SS;
      S.selvskarArrive('over', 9);
      /* the clock guard: a first frame at exactly zero used to re-baseline
         the animation every frame, so it never advanced at all */
      S.selvskarSplashStart();
      S.drawSelvskar(document.createElement('canvas'), 0);
      const t0=S.SELV_ANIM.t0;
      S.drawSelvskar(document.createElement('canvas'), 500);
      const t=S.SELV_ANIM.t;
      S.SELV_ANIM=null;
      return {t0, t};
    }, setup);
    is('a zero timestamp is a time, not "not started"', r.t0, 0);
    yes('so the clock advances from it', r.t>0.4, 't='+r.t);
  }

  head('AND IT IS FOR SOMETHING');
  { const r=await pg.evaluate((s)=>{
      eval(s); const S=window.__SS, G=S.G;
      S.selvskarArrive('focus', 8);
      const rel0=G.wifeRel, phys0=G.wifePhys, love0=G.lastLoveDay;
      G.jealousy=30;
      const a=S.selvskarDo();
      const rel1=G.wifeRel, phys1=G.wifePhys, jl=G.jealousy, marks=G.selv.marks;
      const again=S.selvskarDo();
      return {line:a.line, first:a.first, rel:[rel0,rel1], phys:[phys0,phys1],
              jealousy:jl, marks, marks2:G.selv.marks, done:G.selvDone|0,
              againFirst:again.first, loveMoved:G.lastLoveDay!==love0,
              waiting:S.selvskarWaiting()};
    }, setup);
    yes('doing what it is for is worth something', r.rel[1]>r.rel[0], r.rel.join(' -> ')+' 💞');
    yes('and she is easier about you afterwards', r.jealousy<30, 'jealousy '+r.jealousy);
    yes('the plate keeps the marks', r.marks===1 && r.marks2===2, r.marks+' then '+r.marks2);
    yes('but it only counts the first time', r.first===true && r.againFirst===false);
    yes('she says something back', /[“"]/.test(r.line), r.line);
    yes('and it stops being unopened mail', r.waiting===false);
  }
  { const r=await pg.evaluate((s)=>{
      eval(s); const S=window.__SS, G=S.G;
      S.selvskarArrive('focus', 8);
      const rel0=G.wifeRel; G.jealousy=10;
      const a=S.selvskarPutAway();
      return {line:a.line, rel:[rel0,G.wifeRel], jl:G.jealousy,
              ignored:G.selvIgnored|0, waiting:S.selvskarWaiting()};
    }, setup);
    yes('rolling it up and leaving it costs you', r.rel[1]<r.rel[0], r.rel.join(' -> ')+' 💞');
    yes('and she finds out — she asked the courier', /courier/.test(r.line));
    yes('the house keeps that number too', r.ignored===1);
    yes('and it is closed either way', r.waiting===false);
  }

  head('THE SCREEN, AND WHERE IT SHOWS UP');
  { const r=await pg.evaluate((s)=>{
      eval(s); const S=window.__SS, G=S.G;
      S.selvskarArrive('over', 9);
      let threw=null;
      try{ S.openSelvskar(); }catch(e){ threw=''+e; }
      const b=document.getElementById('villa-body');
      const txt=b? b.textContent : '';
      const btns=b? Array.from(b.querySelectorAll('button')).map(x=>x.textContent) : [];
      return {threw, panels:b?b.querySelectorAll('.panel').length:0,
              canv:b?b.querySelectorAll('canvas').length:0,
              doIt:btns.some(t=>/DO WHAT IT IS FOR/.test(t)),
              away:btns.some(t=>/PUT IT AWAY/.test(t)),
              refusal:/WHAT THE HANDS WILL NOT CUT/.test(txt),
              hers:/her own hand/i.test(txt)};
    }, setup);
    yes('it opens without throwing', !r.threw, r.threw||'');
    yes('with the plate on it', r.canv===1);
    yes('the instruction that came with it', r.doIt);
    yes('and the choice not to', r.away);
    yes('it says whose hand it is', r.hers);
    yes('and why no shop would have cut it', r.refusal);
    yes('all of it in panels', r.panels>=3, r.panels+' panels');
  }
  { const r=await pg.evaluate((s)=>{
      eval(s); const S=window.__SS, G=S.G;
      const hidden=()=>{ S.applyHub(); const b=document.getElementById('btn-selvskar');
        return b? b.style.display : 'missing'; };
      G.selv=null; const off=hidden();
      S.selvskarArrive('over', 9); const on=hidden();
      const label=document.getElementById('btn-selvskar').textContent;
      S.selvskarDo(); const after=hidden();
      return {off, on, label, after};
    }, setup);
    is('no button when nothing came', r.off, 'none');
    is('a button when something did', r.on, '');
    yes('and it says which way it arrived', /LAUNCHING|HOUSE-POST/.test(r.label), r.label);
    is('gone again once it is dealt with', r.after, 'none');
  }

  head('PAGE ERRORS');
  if(errs.length) bad('none', errs.slice(0,4).join(' | ')); else ok('none');

  await br.close();
  console.log('\n'+(fail? 'FAILED  '+fail+' of '+(pass+fail) : 'ALL GREEN')+'   ('+pass+' checks)');
  process.exit(fail? 1 : 0);
})();
