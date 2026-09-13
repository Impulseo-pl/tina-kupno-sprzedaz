/* TINA Skup Aut — skrypt strony.
   Statyczny HTML: tresc siedzi w plikach, skrypt obsluguje tylko to, co zywe —
   kalkulator widelek, formularz krokowy, galerie, animacje przewijania. */

/* Adres strony podziekowania — formularz wraca na nia po wyslaniu. */
const ORIGIN = location.origin + location.pathname.replace(/[^/]*$/, '').replace(/\/$/, '');

const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

/* ================= kalkulator widelek ================= */
const ROK_TERAZ=new Date().getFullYear();
const PLN=n=>Math.round(n).toLocaleString('pl-PL').replace(/ /g,' ')+' zł';
const F_STAN={'Jeżdżący, sprawny':1,'Jeżdżący, drobne usterki':.86,'Uszkodzony, ale jeździ':.60,'Powypadkowy, nie jeździ':.38,'Bez ważnego OC lub przeglądu':.80,'Do kasacji, na części':.15};
const F_PAL={'Benzyna':1,'Diesel':1.05,'Benzyna + LPG':.95,'Hybryda':1.12,'Elektryk':1.02};

function wycena(d){
  const rok=parseInt(d.rok,10), km=parseInt(d.km,10)||0;
  if(!rok||rok<1950||rok>ROK_TERAZ+1) return null;
  const wiek=Math.max(0,ROK_TERAZ-rok);
  let v=64000*Math.pow(.883,wiek)+2200;
  if(km>0){
    const norma=Math.max(25000,wiek*15000);
    v*=Math.min(1.16,Math.max(.56,1-((km-norma)/norma)*.20));
  }
  v*=F_PAL[d.paliwo]||1;
  v*=F_STAN[d.stan]||1;
  v*=1+Math.min(.10,(d.plus||0)*.018);
  v*=.82;                                   /* marza na przygotowanie do dalszej sprzedazy */
  v=Math.max(700,v);
  return [Math.round(v*.90/100)*100, Math.round(v*1.09/100)*100];
}

/* ================= formularz krokowy ================= */
function bindForm(){
  const wf=document.getElementById('wf');
  if(!wf) return;
  const $=id=>document.getElementById(id);
  const stps=[].slice.call(wf.querySelectorAll('.stp'));
  const tabs=[].slice.call(wf.querySelectorAll('.wiz div'));
  const back=wf.querySelector('.b-back'), next=wf.querySelector('.b-next'),
        send=wf.querySelector('.b-send'), err=wf.querySelector('.err');
  let i=0, picked=[];

  /* ---------- kalkulator widelek ---------- */
  const calc=()=>{
    const plus=wf.querySelectorAll('.chip input:checked').length;
    const r=wycena({rok:($('rok').value||'').replace(/\D/g,''),km:($('przebieg').value||'').replace(/\D/g,''),
                    paliwo:$('paliwo').value, stan:$('stan').value, plus});
    const v=$('estv'), b=$('estb'), lo=$('estlo');
    if(!v) return;
    if(!r){ v.textContent='Uzupełnij rocznik i przebieg'; v.classList.add('dim');
            b.style.left='36%'; b.style.right='36%'; lo.textContent='gdzie to leży na rynku'; return null; }
    v.classList.remove('dim');
    v.textContent=PLN(r[0])+' – '+PLN(r[1]);
    const MAX=95000;
    const l=Math.min(84,r[0]/MAX*100);
    const rt=Math.min(100-l-6,Math.max(4,100-r[1]/MAX*100));
    b.style.left=l+'%'; b.style.right=rt+'%';
    lo.textContent=r[1]>=45000?'górna półka rynku':(r[1]>=16000?'środek rynku':'dolna półka rynku');
    return r;
  };

  /* ---------- kroki ---------- */
  const show=(k,scroll)=>{
    i=Math.max(0,Math.min(stps.length-1,k));
    stps.forEach((s,j)=>s.classList.toggle('on',j===i));
    tabs.forEach((t,j)=>{ t.classList.toggle('on',j===i); t.classList.toggle('done',j<i); });
    back.style.display=i?'':'none';
    next.style.display=i<stps.length-1?'':'none';
    send.style.display=i===stps.length-1?'':'none';
    err.classList.remove('on');
    if(scroll) wf.scrollIntoView({behavior:'smooth',block:'start'});
  };
  const WYM={0:[['marka','markę'],['model','model'],['rok','rok produkcji'],['przebieg','przebieg']],1:[],2:[],3:[['tel','numer telefonu']]};
  const sprawdz=k=>{
    let pierwszy=null, brak=[];
    (WYM[k]||[]).forEach(p=>{
      const el=$(p[0]), ok=(el.value||'').trim().length>0;
      el.classList.toggle('bad',!ok);
      if(!ok){ brak.push(p[1]); if(!pierwszy) pierwszy=el; }
    });
    if(pierwszy){
      err.textContent='Brakuje: '+brak.join(', ')+'.';
      err.classList.add('on'); pierwszy.focus();
      return false;
    }
    return true;
  };
  next.addEventListener('click',()=>{ if(sprawdz(i)) show(i+1,true); });
  back.addEventListener('click',()=>show(i-1,true));
  tabs.forEach((t,j)=>t.addEventListener('click',()=>{ if(j<i||sprawdz(i)) show(j,true); }));
  wf.addEventListener('keydown',e=>{
    if(e.key!=='Enter'||e.target.tagName==='TEXTAREA') return;
    e.preventDefault();
    if(i<stps.length-1){ if(sprawdz(i)) show(i+1,true); } else send.click();
  });

  /* ---------- zdjecia ---------- */
  const files=$('files'), thumbs=$('thumbs');
  const draw=()=>{ thumbs.innerHTML=picked.map((u,k)=>`<div><img src="${u}" alt="Zdjęcie ${k+1}"><button type="button" data-i="${k}" aria-label="Usuń zdjęcie">×</button></div>`).join(''); };
  files.addEventListener('change',e=>{ for(const f of e.target.files){ if(picked.length>=5)break; picked.push(URL.createObjectURL(f)); } draw(); });
  thumbs.addEventListener('click',e=>{ const b=e.target.closest('button'); if(!b)return; picked.splice(+b.dataset.i,1); draw(); });

  /* ---------- wyslanie ---------- */
  send.addEventListener('click',()=>{
    if(!sprawdz(3)) return;
    if(!$('zgoda').checked){ err.textContent='Zaznacz zgodę na kontakt — bez niej nie możemy oddzwonić.'; $('zgoda').focus(); return; }
    err.textContent='';
    const r=calc();
    const auto=[($('marka').value||'').trim(),($('model').value||'').trim(),($('rok').value||'').trim()].filter(Boolean).join(' ');
    const h=document.getElementById('hwidelki');
    if(h) h.value = r ? (PLN(r[0])+' – '+PLN(r[1])) : 'brak danych do wyliczenia';
    const nx=wf.querySelector('input[name="_next"]');
    if(nx){
      const q=new URLSearchParams();
      if(auto) q.set('a',auto);
      if(r) q.set('w',PLN(r[0])+' – '+PLN(r[1]));
      const t=($('tel').value||'').trim(); if(t) q.set('t',t);
      nx.value=ORIGIN+'/dziekujemy.html'+(q.toString()?'?'+q.toString():'');
    }
    send.disabled=true; send.textContent='Wysyłam…';
    wf.submit();
  });

  wf.addEventListener('input',calc);
  wf.addEventListener('change',calc);
  calc();

  /* ---------- szybka wycena z hero ---------- */
  const qf=document.getElementById('qf');
  if(qf) qf.addEventListener('submit',e=>{
    e.preventDefault();
    const mm=(document.getElementById('qm').value||'').trim().split(/\s+/);
    if(mm[0]) $('marka').value=mm[0];
    if(mm.length>1) $('model').value=mm.slice(1).join(' ');
    const qr=(document.getElementById('qr').value||'').replace(/\D/g,'');
    if(qr) $('rok').value=qr;
    const qt=(document.getElementById('qt').value||'').trim();
    if(qt) $('tel').value=qt;
    calc();
    document.getElementById('wycena').scrollIntoView({behavior:'smooth',block:'start'});
    setTimeout(()=>{ show(0); $(mm[0]?'przebieg':'marka').focus({preventScroll:true}); },420);
  });
}

/* ================= lightbox galerii ================= */
(function(){
  let list=[], idx=0;
  const lb=document.querySelector('.lb[role="dialog"]'), im=lb.querySelector('img'), cap=lb.querySelector('.cap');
  const show=i=>{ idx=(i+list.length)%list.length; const it=list[idx];
    im.src=it.src; im.alt=it.alt||''; cap.innerHTML=`<b>${idx+1} / ${list.length}</b>${esc(it.alt||'')}`; };
  const open=(l,i)=>{ list=l; show(i); lb.classList.add('on'); document.body.style.overflow='hidden'; lb.querySelector('.x').focus(); };
  const close=()=>{ lb.classList.remove('on'); document.body.style.overflow=''; };
  lb.querySelector('.x').addEventListener('click',close);
  lb.querySelector('.p').addEventListener('click',()=>show(idx-1));
  lb.querySelector('.n').addEventListener('click',()=>show(idx+1));
  lb.addEventListener('click',e=>{ if(e.target===lb) close(); });
  document.addEventListener('keydown',e=>{ if(!lb.classList.contains('on'))return;
    if(e.key==='Escape')close(); if(e.key==='ArrowLeft')show(idx-1); if(e.key==='ArrowRight')show(idx+1); });
  /* Na telefonie zdjecia przewija sie palcem, nie szukaniem strzalki. */
  let dotykX=0, dotykY=0;
  lb.addEventListener('touchstart',e=>{ dotykX=e.touches[0].clientX; dotykY=e.touches[0].clientY; },{passive:true});
  lb.addEventListener('touchend',e=>{
    const dx=e.changedTouches[0].clientX-dotykX, dy=e.changedTouches[0].clientY-dotykY;
    if(Math.abs(dx)>48 && Math.abs(dx)>Math.abs(dy)) show(dx<0 ? idx+1 : idx-1);
  },{passive:true});
  document.addEventListener('click',e=>{
    const fig=e.target.closest&&e.target.closest('.shot');
    if(!fig)return;
    const grid=fig.closest('.grid4'); if(!grid)return;
    const imgs=[].slice.call(grid.querySelectorAll('.shot img'));
    open(imgs,imgs.indexOf(fig.querySelector('img')));
  });
})();


/* ================= liczniki ================= */
function counters(){
  document.querySelectorAll('.proof b[data-c]').forEach(el=>{
    if(el.dataset.done)return;
    const r=el.getBoundingClientRect();
    if(r.top>window.innerHeight-40||r.bottom<0)return;
    el.dataset.done='1';
    if(el.dataset.lit){ el.textContent=el.dataset.lit; return; }
    const to=+el.dataset.c, suf=el.dataset.suf||'', t0=performance.now(), D=1100;
    const step=t=>{ const k=Math.min(1,(t-t0)/D), e=1-Math.pow(1-k,3);
      el.textContent=Math.round(to*e)+suf; if(k<1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  });
}


/* ================= odslanianie przy przewijaniu ================= */
const RV_SOLO=['.sechead','.faq','.fgrid','.gscore','.cmpwrap'];
const RV_STAG=['.two','.steps','.duo','.grid4','.brands','.links','.revs','.local','.dchip','.near','.vows','.docs','.proof .in'];
let rvObs=null;
function reveal(){
  if(rvObs) rvObs.disconnect();
  const app=document.getElementById('app');
  rvObs=new IntersectionObserver(es=>{
    es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('on'); rvObs.unobserve(e.target); } });
  },{rootMargin:'0px 0px -6% 0px',threshold:.06});
  RV_SOLO.forEach(s=>app.querySelectorAll(s).forEach(el=>{el.classList.add('rv');rvObs.observe(el);}));
  RV_STAG.forEach(s=>app.querySelectorAll(s).forEach(el=>{
    el.classList.add('rvs');
    [].forEach.call(el.children,(c,i)=>c.style.setProperty('--d',Math.min(i,11)*55+'ms'));
    rvObs.observe(el);
  }));
  /* bezpiecznik: gdyby cokolwiek nie zaskoczylo, po 4 s wszystko widoczne */
  clearTimeout(reveal.t);
  reveal.t=setTimeout(()=>app.querySelectorAll('.rv,.rvs').forEach(el=>el.classList.add('on')),4000);
}


/* ---------- pasek postepu i naglowek ---------- */
(function(){
  const prog=document.querySelector('.prog');
  let tick=false;
  const upd=()=>{
    const y=window.scrollY||0, h=document.documentElement.scrollHeight-window.innerHeight;
    prog.style.width=(h>0?Math.min(100,y/h*100):0)+'%';
    document.body.classList.toggle('scrolled',y>150);
    if(window.counters) counters();
    tick=false;
  };
  addEventListener('scroll',()=>{ if(!tick){ tick=true; requestAnimationFrame(upd); } },{passive:true});
  upd();
})();


/* ---------- kotwice w obrebie podstrony: bez zmiany adresu ---------- */
document.addEventListener('click',e=>{
  const a=e.target.closest && e.target.closest('a[href^="#"]');
  if(!a) return;
  const href=a.getAttribute('href');
  if(href.indexOf('#/')===0) return;
  const id=href.slice(1);
  if(!id) return;
  const el=document.getElementById(id);
  if(!el) return;
  e.preventDefault();
  el.scrollIntoView({behavior:'smooth',block:'start'});
});

bindForm();
reveal();
counters();
