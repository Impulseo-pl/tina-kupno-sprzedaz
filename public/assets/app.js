/* TINA Skup Aut — skrypt strony.
   Tresc generuje Astro, skrypt obsluguje tylko to, co zywe: formularz krokowy,
   galerie ze zdjeciami, liczniki i animacje przewijania.
   Kwot nie liczymy nigdzie — wycene podaje czlowiek przez telefon. */

/* Adres strony podziekowania — formularz wraca na nia po wyslaniu. */
const ORIGIN = location.origin + location.pathname.replace(/[^/]*$/, '').replace(/\/$/, '');

const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

/* ================= wysylka zgloszen =================
   Formularze ida POST-em na /api/zgloszenie (Cloudflare Pages Function), ktora
   wysyla maila przez Resend. Gdy cokolwiek pojdzie nie tak, nie gubimy zgloszenia
   po cichu — pokazujemy numer telefonu i nie kasujemy wpisanych danych. */
const TEL_KONTAKT = '692 493 797';
function awaria(form, powod){
  let box=form.querySelector('.uwaga');
  if(!box){
    box=document.createElement('p');
    box.className='uwaga';
    const akcje=form.querySelector('.actions');
    (akcje||form).parentNode.insertBefore(box, akcje||null);
  }
  box.innerHTML=(powod ? powod+' ' : 'Nie udało się wysłać zgłoszenia. ')+
                'Zadzwoń: <a href="tel:+48692493797">'+TEL_KONTAKT+'</a>.';
  box.scrollIntoView({behavior:'smooth',block:'center'});
}

/* Zwraca true, gdy zgloszenie doszlo. Zalaczniki podaje sie osobno, bo lista
   miniatur moze sie roznic od zawartosci <input type=file>. */
async function wyslij(form, pliki){
  const fd=new FormData(form);
  fd.delete('attachment');
  (pliki||[]).forEach(f=>fd.append('zdjecia[]', f));
  const r=await fetch('/api/zgloszenie',{method:'POST',body:fd});
  let j={};
  try{ j=await r.json(); }catch(e){}
  if(r.ok && j.ok) return true;
  throw new Error(j.blad||'');
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
  const draw=()=>{ thumbs.innerHTML=picked.map((p,k)=>`<div><img src="${p.u}" alt="Zdjęcie ${k+1}"><button type="button" data-i="${k}" aria-label="Usuń zdjęcie">×</button></div>`).join(''); };
  files.addEventListener('change',e=>{ for(const f of e.target.files){ if(picked.length>=5)break; picked.push({f:f,u:URL.createObjectURL(f)}); } draw(); e.target.value=''; });
  thumbs.addEventListener('click',e=>{ const b=e.target.closest('button'); if(!b)return; picked.splice(+b.dataset.i,1); draw(); });

  /* ---------- wyslanie ---------- */
  send.addEventListener('click',async ()=>{
    if(!sprawdz(3)) return;
    if(!$('zgoda').checked){ err.textContent='Zaznacz zgodę na kontakt — bez niej nie możemy oddzwonić.'; $('zgoda').focus(); return; }
    err.textContent='';
    const auto=[($('marka').value||'').trim(),($('model').value||'').trim(),($('rok').value||'').trim()].filter(Boolean).join(' ');
    const q=new URLSearchParams();
    if(auto) q.set('a',auto);
    const nr=($('tel').value||'').trim(); if(nr) q.set('t',nr);

    const napis=send.textContent;
    send.disabled=true; send.textContent='Wysyłam…';
    try{
      await wyslij(wf, picked.map(p=>p.f));
      location.href=ORIGIN+'/dziekujemy'+(q.toString()?'?'+q.toString():'');
    }catch(e){
      send.disabled=false; send.textContent=napis;
      awaria(wf, e.message);
    }
  });

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
const RV_STAG=['.two','.steps','.duo','.grid4','.brands','.links','.revs','.local','.dchip','.near','.vows','.docs','.proces','.proof .in'];
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


/* ---------- telefon: rozwijana lista „Więcej” w pasku ---------- */
(function(){
  const btn=document.querySelector('.wiecej'), menu=document.getElementById('menu-wiecej');
  if(!btn||!menu) return;
  const zamknij=()=>{ btn.setAttribute('aria-expanded','false'); menu.hidden=true; };
  btn.addEventListener('click',e=>{
    e.stopPropagation();
    const otwarte=btn.getAttribute('aria-expanded')==='true';
    btn.setAttribute('aria-expanded',otwarte?'false':'true');
    menu.hidden=otwarte;
  });
  /* Klikniecie obok listy albo Escape ja zwija. */
  document.addEventListener('click',e=>{ if(!menu.hidden && !menu.contains(e.target)) zamknij(); });
  addEventListener('keydown',e=>{ if(e.key==='Escape') zamknij(); });
  /* Po obrocie telefonu na szeroki ekran lista jest niepotrzebna. */
  addEventListener('resize',()=>{ if(innerWidth>1000) zamknij(); });
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

/* ---------- formularze bez kreatora ---------- */
document.querySelectorAll('form[data-strona]:not(#wf)').forEach(function (f) {
  f.addEventListener('submit', async function (e) {
    e.preventDefault();
    if(!f.reportValidity()) return;
    const btn=f.querySelector('button[type=submit]');
    const napis=btn ? btn.textContent : '';
    if(btn){ btn.disabled=true; btn.textContent='Wysyłam…'; }
    try{
      await wyslij(f, null);
      location.href=ORIGIN+'/dziekujemy';
    }catch(err){
      if(btn){ btn.disabled=false; btn.textContent=napis; }
      awaria(f, err.message);
    }
  });
});
