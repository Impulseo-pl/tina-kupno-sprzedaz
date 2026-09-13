/* ---------- ustawienia wspolne ----------
   ROOT ustawia generator w kazdej podstronie; w zrodle (_src/app.html) go nie ma,
   wiec plik dziala dalej jako podglad z adresami po hashu. */
const STATIC = !!window.STATIC;
const ROOT   = window.ROOT || '';
const ORIGIN = new URL(ROOT || './', location.href).href.replace(/\/+$/,'');
const FORM_ENDPOINT = 'https://formsubmit.co/rafal.kocimski@o2.pl';

function idzDo(v){
  if(!STATIC){ location.hash=v; return; }
  const h=String(v).replace(/^#/,'');
  location.href = (h==='/'||h==='') ? (ROOT||'./') : ROOT + h.replace(/^\//,'') + '/';
}

const IMG = {
  hero:"img/hero.jpg", hero2:"img/hero2.jpg",
  cars:[
    {s:"img/auto-01.jpg",  n:"Opel Movano",    t:"furgon"},
    {s:"img/auto-02.jpg",  n:"BMW serii 1",    t:"osobowy"},
    {s:"img/auto-03.jpg",  n:"VW Golf GTI",    t:"osobowy"},
    {s:"img/auto-04.jpg",  n:"Ford Mondeo",    t:"kombi"},
    {s:"img/auto-05.jpg",  n:"Audi A6",        t:"osobowy"},
    {s:"img/auto-06.jpg",  n:"Citroën Jumper", t:"furgon"},
    {s:"img/auto-07.jpg",  n:"VW Transporter", t:"bus 9-osobowy"},
    {s:"img/auto-08.jpg",  n:"Dodge Charger",  t:"powypadkowy", d:1},
    {s:"img/auto-09.jpg",  n:"Mercedes W124",  t:"klasyk"},
    {s:"img/auto-10.jpg",  n:"VW Crafter",     t:"skrzyniowy"},
    {s:"img/auto-11.jpg", n:"Peugeot Boxer",  t:"furgon"},
    {s:"img/auto-12.jpg", n:"Suzuki Swift",   t:"osobowy"},
    {s:"img/auto-13.jpg", n:"Audi A4",        t:"uszkodzony tył", d:1},
    {s:"img/auto-14.jpg", n:"Dacia Duster",   t:"SUV"},
    {s:"img/auto-15.jpg", n:"Honda Civic",    t:"osobowy"},
    {s:"img/auto-16.jpg", n:"Land Cruiser",   t:"terenowy"},
    {s:"img/auto-17.jpg", n:"Fiat Fiorino",   t:"dostawczy"},
    {s:"img/auto-18.jpg", n:"Toyota Tundra",  t:"pickup"}
  ]
};

const CITIES=[
 {s:"sochaczew",v:140,vk:110,n:"Sochaczew",loc:"w Sochaczewie",pri:1,area:"powiat sochaczewski",
  lead:"Sochaczew i cały powiat obsługujemy z bazy — po zgłoszeniu do południa zwykle jesteśmy na miejscu tego samego dnia.",
  near:["Teresin","Brochów","Iłów","Rybno","Nowa Sucha","Młodzieszyn"]},
 {s:"plock",v:320,vk:2040,n:"Płock",loc:"w Płocku",pri:1,area:"powiat płocki",
  lead:"Do Płocka jeździmy stale — osiedla, okolice Wisły i cały powiat. Auta niejeżdżące zabieramy lawetą.",
  near:["Gostynin","Sierpc","Wyszogród","Gąbin","Bodzanów","Słupno"]},
 {s:"warszawa",v:5400,vk:6470,n:"Warszawa",loc:"w Warszawie",pri:1,area:"Warszawa i okolice",
  lead:"Cała Warszawa, ze wszystkimi dzielnicami. Umawiamy się pod blokiem, na parkingu albo w garażu podziemnym.",
  near:["Śródmieście","Mokotów","Wola","Praga-Południe","Białołęka","Ursynów","Bemowo","Targówek","Bielany","Wawer","Ochota","Żoliborz","Ursus","Włochy","Wilanów","Rembertów","Wesoła","Praga-Północ"]},
 {s:"piaseczno",v:390,vk:610,n:"Piaseczno",loc:"w Piasecznie",pri:1,area:"powiat piaseczyński",
  lead:"Piaseczno i południowe okolice Warszawy. Przyjeżdżamy też po godzinach, jeśli tak Ci wygodniej.",
  near:["Konstancin-Jeziorna","Góra Kalwaria","Lesznowola","Józefosław","Tarczyn"]},
 {s:"radom",v:720,vk:2100,n:"Radom",loc:"w Radomiu",area:"powiat radomski",
  lead:"Radom i południe Mazowsza. Przy większych odległościach umawiamy konkretną godzinę, żebyś nie czekał.",
  near:["Pionki","Kozienice","Zwoleń","Szydłowiec","Iłża","Białobrzegi"]},
 {s:"pruszkow",v:390,vk:0,n:"Pruszków",loc:"w Pruszkowie",area:"powiat pruszkowski",
  lead:"Pruszków i zachodnie przedmieścia Warszawy — zwykle w promieniu jednego dnia od zgłoszenia.",
  near:["Piastów","Brwinów","Michałowice","Ożarów Mazowiecki","Milanówek"]},
 {s:"siedlce",v:390,vk:780,n:"Siedlce",loc:"w Siedlcach",area:"powiat siedlecki",
  lead:"Siedlce i wschodnie Mazowsze. Kupujemy też auta od firm i gospodarstw z okolicznych gmin.",
  near:["Sokołów Podlaski","Węgrów","Mordy","Łuków","Mińsk Mazowiecki"]},
 {s:"legionowo",v:320,vk:0,n:"Legionowo",loc:"w Legionowie",area:"powiat legionowski",
  lead:"Legionowo, Jabłonna i okolice Zalewu Zegrzyńskiego. Dojazd bezpłatny niezależnie od stanu auta.",
  near:["Jabłonna","Nieporęt","Serock","Wieliszew","Nowy Dwór Mazowiecki"]},
 {s:"grodzisk-mazowiecki",v:110,vk:0,n:"Grodzisk Mazowiecki",loc:"w Grodzisku Mazowieckim",area:"powiat grodziski",
  lead:"Grodzisk i okolica wzdłuż linii WKD. Auta bez przeglądu i bez OC też odbieramy.",
  near:["Milanówek","Podkowa Leśna","Brwinów","Mszczonów","Żyrardów"]},
 {s:"ostrow-mazowiecka",v:140,vk:0,n:"Ostrów Mazowiecka",loc:"w Ostrowi Mazowieckiej",area:"powiat ostrowski",
  lead:"Ostrów Mazowiecka i północno-wschodnie Mazowsze przy trasie S8.",
  near:["Małkinia Górna","Brok","Wyszków","Zambrów","Ostrołęka"]},
 {s:"garwolin",v:140,vk:0,n:"Garwolin",loc:"w Garwolinie",area:"powiat garwoliński",
  lead:"Garwolin i okolice przy trasie na Lublin. Odbieramy też auta stojące od lat w stodole albo garażu.",
  near:["Pilawa","Łaskarzew","Żelechów","Dęblin","Otwock"]},
 {s:"gostynin",v:140,vk:0,n:"Gostynin",loc:"w Gostyninie",area:"powiat gostyniński",
  lead:"Gostynin i pogranicze Mazowsza z Kujawami — jeździmy tam razem z trasą płocką.",
  near:["Płock","Kutno","Łąck","Sanniki","Kowal"]},
 {s:"otwock",v:110,vk:0,n:"Otwock",loc:"w Otwocku",area:"powiat otwocki",
  lead:"Otwock i cała linia otwocka. Auta powypadkowe i niejeżdżące zabieramy lawetą.",
  near:["Józefów","Karczew","Celestynów","Wiązowna","Góra Kalwaria"]},
 {s:"zyrardow",v:90,vk:0,n:"Żyrardów",loc:"w Żyrardowie",area:"powiat żyrardowski",
  lead:"Żyrardów i okolice — blisko naszej bazy w Sochaczewie, więc terminy są krótkie.",
  near:["Mszczonów","Radziejowice","Wiskitki","Grodzisk Mazowiecki","Sochaczew"]},
 {s:"minsk-mazowiecki",v:110,vk:0,n:"Mińsk Mazowiecki",loc:"w Mińsku Mazowieckim",area:"powiat miński",
  lead:"Mińsk Mazowiecki i wschodnie okolice stolicy przy trasie na Siedlce.",
  near:["Sulejówek","Halinów","Kałuszyn","Siennica","Cegłów"]},
 {s:"ciechanow",v:90,vk:0,n:"Ciechanów",loc:"w Ciechanowie",area:"powiat ciechanowski",
  lead:"Ciechanów i północne Mazowsze. Kupujemy też auta dostawcze od lokalnych firm.",
  near:["Płońsk","Mława","Przasnysz","Glinojeck","Pułtusk"]},
 {s:"sierpc",v:90,vk:0,n:"Sierpc",loc:"w Sierpcu",area:"powiat sierpecki",
  lead:"Sierpc i okolice — wjeżdżamy tu przy okazji tras płockich, więc dojazd jest szybki.",
  near:["Płock","Bieżuń","Żuromin","Raciąż","Lipno"]},
 {s:"wyszkow",v:90,vk:0,n:"Wyszków",loc:"w Wyszkowie",area:"powiat wyszkowski",
  lead:"Wyszków i dolina Bugu. Odbieramy auta również z działek i domków letniskowych.",
  near:["Serock","Pułtusk","Tłuszcz","Radzymin","Ostrów Mazowiecka"]},
 {s:"plonsk",v:70,vk:0,n:"Płońsk",loc:"w Płońsku",area:"powiat płoński",
  lead:"Płońsk przy trasie S7, po drodze między Warszawą a Gdańskiem — terminy są elastyczne.",
  near:["Ciechanów","Nowy Dwór Mazowiecki","Raciąż","Sochocin","Nasielsk"]}
];

const BRANDS=[
 {s:"niemieckich",n:"Niemieckie",d:"niemieckich",f:"de",m:"Audi · BMW · Mercedes · Volkswagen · Opel · Porsche"},
 {s:"japonskich", n:"Japońskie", d:"japońskich", f:"jp",m:"Toyota · Honda · Mazda · Nissan · Suzuki · Mitsubishi"},
 {s:"koreanskich",n:"Koreańskie",d:"koreańskich",f:"kr",m:"Kia · Hyundai · SsangYong"},
 {s:"francuskich",n:"Francuskie",d:"francuskich",f:"fr",m:"Renault · Peugeot · Citroën · DS"},
 {s:"angielskich",n:"Angielskie",d:"angielskich",f:"gb",m:"Land Rover · Jaguar · Mini · Bentley"},
 {s:"amerykanskich",n:"Amerykańskie",d:"amerykańskich",f:"us",m:"Ford · Jeep · Dodge · Chevrolet · Tesla"},
 {s:"wloskich",  n:"Włoskie",   d:"włoskich",  f:"it",m:"Fiat · Alfa Romeo · Lancia · Iveco"},
 {s:"czeskich",  n:"Czeskie",   d:"czeskich",  f:"cz",m:"Škoda"}
];

const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const telBtn=(cls)=>`<a class="tel ${cls||''}" href="tel:+48693649549"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/></svg>693 649 549</a>`;

function shots(list){
  return `<div class="grid4">${list.map(c=>`<figure class="shot"><img src="${c.s}" alt="${esc(c.n)}, ${esc(c.t)}" loading="lazy">
    <figcaption><b>${esc(c.n)}</b><span class="${c.d?'dm':''}">${esc(c.t)}</span></figcaption></figure>`).join('')}</div>`;
}

const CHIPS=['Bezwypadkowy','Garażowany','Fabryczny lakier','Serwisowany w ASO','Pierwszy właściciel','Zarejestrowany w Polsce','Komplet kluczy','Książka serwisowa'];

function form(city){
  return `<div class="darker" id="wycena"><div class="w"><section><div class="fgrid">
    <div class="fintro">
      <p class="eyebrow">Wycena online</p>
      <h2 style="margin-top:14px"><span class="kw" data-v="online">Wycena auta</span><br><span class="gold">w piętnaście minut</span></h2>
      <p>Cztery krótkie kroki. Widełki widzisz od razu na ekranie, jeszcze zanim ktokolwiek do Ciebie zadzwoni.</p>
      <div class="est sticky-est">
        <span class="elb">Orientacyjne widełki</span>
        <div class="val dim" id="estv">Uzupełnij rocznik i przebieg</div>
        <div class="bar"><i id="estb"></i></div>
        <div class="scale"><span>0 zł</span><span id="estlo" style="color:#8f96a3">gdzie to leży na rynku</span><span>95 000 zł</span></div>
        <p class="note">Wyliczenie na danych rynkowych — to nie jest oferta. Widełki potwierdzamy przez telefon, ostateczną kwotę po oględzinach. I nie zmieniamy jej przy podpisie.</p>
      </div>
      <div class="or">
        <span class="eyebrow">Wolisz od razu porozmawiać</span>
        ${telBtn()}
      </div>
    </div>
    <form class="card" id="wf" autocomplete="off" novalidate method="POST" action="${FORM_ENDPOINT}" enctype="multipart/form-data">
      <input type="hidden" name="_subject" value="Wycena auta ze strony tinaskupaut.pl">
      <input type="hidden" name="_next" value="">
      <input type="hidden" name="_captcha" value="false">
      <input type="hidden" name="_template" value="table">
      <input type="hidden" name="Widelki" id="hwidelki" value="">
      <input type="hidden" name="Strona" value="${city?esc(city.n):'strona glowna'}">
      <input type="text" name="_honey" style="display:none" tabindex="-1" autocomplete="off">
      <div class="wiz">
        <div class="on" data-w="0"><i><em>I</em></i>Auto</div>
        <div data-w="1"><i><em>II</em></i>Stan</div>
        <div data-w="2"><i><em>III</em></i>Zdjęcia</div>
        <div data-w="3"><i><em>IV</em></i>Kontakt</div>
      </div>
      <div class="pad">

        <div class="stp on">
          <fieldset>
            <legend>Pojazd</legend>
            <div class="g g3">
              <div class="f"><label for="marka">Marka <i>*</i></label><input id="marka" name="Marka" placeholder="Audi"></div>
              <div class="f"><label for="model">Model <i>*</i></label><input id="model" name="Model" placeholder="A4 Avant"></div>
              <div class="f"><label for="rok">Rok produkcji <i>*</i></label><input id="rok" name="Rok produkcji" inputmode="numeric" maxlength="4" placeholder="2012"></div>
            </div>
            <div class="g g3" style="margin-top:14px">
              <div class="f"><label for="przebieg">Przebieg (km) <i>*</i></label><input id="przebieg" name="Przebieg km" inputmode="numeric" placeholder="186 000"></div>
              <div class="f"><label for="paliwo">Paliwo</label><select id="paliwo" name="Paliwo"><option>Benzyna</option><option>Diesel</option><option>Benzyna + LPG</option><option>Hybryda</option><option>Elektryk</option></select></div>
              <div class="f"><label for="poj">Pojemność (cm³)</label><input id="poj" name="Pojemnosc" inputmode="numeric" placeholder="1968"></div>
            </div>
          </fieldset>
        </div>

        <div class="stp">
          <fieldset>
            <legend>Stan techniczny</legend>
            <div class="f"><label for="stan">W jakim stanie jest auto</label><select id="stan" name="Stan techniczny">
              <option>Jeżdżący, sprawny</option><option>Jeżdżący, drobne usterki</option>
              <option>Uszkodzony, ale jeździ</option><option>Powypadkowy, nie jeździ</option>
              <option>Bez ważnego OC lub przeglądu</option><option>Do kasacji, na części</option></select></div>
            <div class="f" style="margin-top:14px"><label for="cena">Oczekiwana cena (zł)</label><input id="cena" name="Oczekiwana cena" inputmode="numeric" placeholder="18 000"></div>
          </fieldset>
          <fieldset>
            <legend>Co się zgadza</legend>
            <div class="chips">${CHIPS.map((t,i)=>`<label class="chip"><input type="checkbox" id="c${i}" name="Auto" value="${esc(t)}"><span>${t}</span></label>`).join('')}</div>
            <div class="f" style="margin-top:16px"><label for="uwagi">Dodatkowe informacje</label>
              <textarea id="uwagi" name="Dodatkowe informacje" placeholder="Np. wymieniony rozrząd w zeszłym roku, rysa na tylnym błotniku, auto stoi w garażu i nie odpala."></textarea></div>
          </fieldset>
        </div>

        <div class="stp">
          <fieldset>
            <legend>Zdjęcia auta — do pięciu</legend>
            <label class="drop"><b>Dodaj zdjęcia</b>
              <small>Przód, tył, wnętrze, licznik i ewentualne uszkodzenia. JPG lub PNG, maksymalnie 5 plików.</small>
              <input type="file" id="files" name="attachment" accept="image/*" multiple></label>
            <div class="thumbs" id="thumbs"></div>
            <p style="margin-top:14px;font-size:14.5px;color:var(--muted)">Zdjęcia nie są obowiązkowe — możesz ten krok pominąć. Oszczędzają jednak jeden dojazd, bo widzimy stan auta jeszcze przed wyjazdem.</p>
          </fieldset>
        </div>

        <div class="stp">
          <fieldset>
            <legend>Kontakt</legend>
            <div class="g g2">
              <div class="f"><label for="tel">Numer telefonu <i>*</i></label><input id="tel" name="Telefon" inputmode="tel" placeholder="600 000 000"></div>
              <div class="f"><label for="miasto">Miejscowość</label><input id="miasto" name="Miejscowosc" value="${city?esc(city.n):''}" placeholder="Sochaczew"></div>
            </div>
            <div class="f" style="margin-top:14px"><label for="kiedy">Kiedy najlepiej oddzwonić</label><select id="kiedy" name="Kiedy oddzwonic">
              <option>Jak najszybciej</option><option>Dziś przed 12:00</option><option>Dziś po południu</option>
              <option>Jutro rano</option><option>Wieczorem, po 17:00</option></select></div>
            <label class="zgoda"><input type="checkbox" id="zgoda" name="Zgoda" value="tak"><span>Wyrażam zgodę na kontakt telefoniczny w sprawie wyceny auta i na przetwarzanie moich danych przez TINA Rafał Kocimski. Szczegóły w <a href="#/polityka-prywatnosci" target="_blank" rel="noopener">polityce prywatności</a>. <i>*</i></span></label>
          </fieldset>
        </div>

        <div class="wnav">
          <button type="button" class="btn plain b-back" style="display:none">Wstecz</button>
          <span class="sp"></span>
          <button type="button" class="btn k b-next">Dalej</button>
          <button type="button" class="btn k b-send" style="display:none">Wyślij zgłoszenie</button>
        </div>
        <p class="err"></p>
      </div>
    </form>
  </div></section></div></div>`;
}

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
      nx.value=ORIGIN+'/dziekujemy/'+(q.toString()?'?'+q.toString():'');
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


const FAQ=[
 ["Ile trwa wycena i czy jest darmowa?","Widełki podajemy przez telefon w kilkanaście minut. Wycena jest darmowa i nie zobowiązuje do sprzedaży — jeśli kwota Ci nie pasuje, po prostu nie podpisujesz umowy."],
 ["Czy odbierzecie auto, które nie jeździ?","Tak. Auta niejeżdżące i powypadkowe zabieramy lawetą, transport jest po naszej stronie."],
 ["Czy kupicie auto bez ważnego OC albo przeglądu?","Tak. Brak OC lub przeglądu nie blokuje sprzedaży — wpływa tylko na kwotę."],
 ["Czy mogę sprzedać auto w imieniu członka rodziny?","Tak, jeśli masz pisemne pełnomocnictwo od właściciela oraz dowód rejestracyjny. Przy współwłasności potrzebne są podpisy obu właścicieli."],
 ["Kiedy dostanę pieniądze?","Na miejscu, zaraz po podpisaniu umowy kupna-sprzedaży. Gotówką albo przelewem — jak wolisz."],
 ["Kto załatwia formalności po sprzedaży?","My. Umowę przygotowujemy na miejscu, a zgłoszenie zbycia i sprawy z ubezpieczycielem bierzemy na siebie."],
 ["Czy kupujecie auta w kredycie lub leasingu?","Tak, po wcześniejszym ustaleniu warunków wykupu z bankiem albo leasingodawcą.",1],
 ["Skup aut — ile płacą za samochód?","Tyle, ile jest wart na rynku, pomniejszone o nasz koszt przygotowania go do dalszej sprzedaży. Widełki podajemy przez telefon, ostateczną kwotę po oględzinach — i nigdy nie zmieniamy jej w trakcie podpisywania umowy."],
 ["Gdzie szybko sprzedać auto?","Najszybciej w skupie: jedna rozmowa, jedne oględziny, gotówka tego samego dnia. Ogłoszenie na portalu potrafi wisieć tygodniami, a i tak kończy się oglądaczami i negocjacjami pod domem."],
 ["Sprzedałem auto — co dalej?","Umowę kupna-sprzedaży zgłaszasz do wydziału komunikacji w ciągu 30 dni i informujesz ubezpieczyciela. Przy sprzedaży do nas robimy to za Ciebie i przekazujemy komplet dokumentów."],
 ["Czy można sprzedać auto bez OC?","Tak. Brak polisy nie blokuje sprzedaży — auto odbieramy lawetą, żeby nie jeździć nim po drodze publicznej bez ubezpieczenia."],
 ["Czy skupujecie samochody używane od firm?","Tak. Odkupujemy pojedyncze auta firmowe, całe floty, auta poleasingowe oraz pojazdy od korporacji taksówkarskich i szkół jazdy. Wystawiamy fakturę."]
];
const faq=l=>l.map(q=>`<details${q[2]?'':''}><summary>${esc(q[0])}</summary><p>${esc(q[1])}</p></details>`).join('');

const cityLinks=(light)=>`<div class="links ${light?'light':''}">${CITIES.map(c=>`<a href="#/skup-aut-${c.s}" class="${c.pri?'pri':''}"><b>Skup aut ${esc(c.n)}</b><small>${esc(c.area)}</small><em class="vol">skup ${c.v}/mies${c.vk?` · komis ${c.vk}/mies`:''}</em></a>`).join('')}</div>`;
const brandTiles=()=>`<div class="brands">${BRANDS.map(b=>`<a class="brand" href="#/skup-aut-${b.s}"><span class="flag f-${b.f}"></span><b>Skup aut ${esc(b.d)}</b><span>${esc(b.m)}</span></a>`).join('')}</div>`;

/* ================= strona główna ================= */
function cityPage(c){
  const cf=[
    [`Ile czekam na dojazd ${c.loc}?`, c.lead],
    [`Czy odbierzecie auto ${c.loc}, jeśli nie odpala?`, `Tak. Auta niejeżdżące zabieramy lawetą — ${c.loc} i w całym obszarze, jakim jest ${c.area}. Transport jest po naszej stronie.`],
    [`Skup aut ${c.n} — ile płacą za samochód?`, `Tyle, ile auto jest warte na rynku, pomniejszone o koszt przygotowania go do dalszej sprzedaży. Widełki podajemy przez telefon, ostateczną kwotę ${c.loc} po oględzinach.`],
    ...FAQ.slice(2,6)
  ];
  const isWwa = c.s==='warszawa';
  return `
  <div class="chero">
    <img src="${IMG.hero2}" alt="">
    <div class="w">
      <p class="crumb"><a href="#/">TINA</a> / Skup aut ${esc(c.n)}</p>
      <h1><span class="kw" data-v="${c.v} wyszukiwań/mies">Skup aut ${esc(c.n)}</span></h1>
      <p class="lede">${esc(c.lead)}</p>
      <div class="acts"><a class="btn g" href="#wycena">Wyceń auto ${esc(c.loc)}</a>${telBtn()}</div>
      <p style="margin-top:22px;font-size:14px;color:var(--onk-mut)">Skup samochodów, auto skup i komis samochodowy ${esc(c.loc)} oraz w całym obszarze, jakim jest ${esc(c.area)}.</p>
    </div>
  </div>

  ${form(c)}

  ${vowsSection()}

  <div class="w"><section>
    <div class="sechead">
      <p class="eyebrow">Obszar</p>
      <h2>${isWwa?'<span class="kw" data-v="5 400/mies">Skup aut Warszawa</span> we <span class="gold">wszystkich dzielnicach</span>':'<span class="kw" data-v="'+c.v+'/mies">Auto skup '+esc(c.n)+'</span> — <span class="gold">gdzie dojeżdżamy</span>'}</h2>
      <div class="hr"></div>
      <p>${isWwa?'Warszawa w całości — od Białołęki po Wilanów. Umawiamy się tam, gdzie stoi auto.':`${esc(c.n)} to dla nas ${esc(c.area)} plus okoliczne gminy. Jeśli Twojej miejscowości nie ma na liście, i tak zadzwoń — prawie zawsze jesteśmy w stanie podjechać.`}</p>
    </div>
    <div class="local">
      <div class="box">
        <h3>${isWwa?'Dzielnice':'Obsługujemy też'}</h3>
        <div class="near">${isWwa
          ? DISTRICTS.map(d=>`<a href="#/skup-aut-warszawa-${d.s}">${esc(d.n)}</a>`).join('')
          : c.near.map(n=>`<span>${esc(n)}</span>`).join('')}</div>
      </div>
      <div class="box">
        <h3>Jak to wygląda</h3>
        <ul class="tick">
          <li>Dojazd ${esc(c.loc)} bezpłatny, niezależnie od stanu auta</li>
          <li>Godzinę ustalasz Ty — także wieczorem i w sobotę</li>
          <li>Gotówka albo przelew od razu po podpisaniu umowy</li>
          <li>Auta niejeżdżące odbieramy lawetą</li>
        </ul>
      </div>
    </div>
  </section></div>

  ${isWwa?`<div class="dark"><div class="w"><section>
    <div class="sechead">
      <p class="eyebrow">Osiemnaście dzielnic</p>
      <h2><span class="kw" data-v="5 400/mies">Skup aut Warszawa</span> <span class="gold">dzielnica po dzielnicy</span></h2>
      <div class="hr"></div>
      <p>Każda dzielnica ma własną stronę: dojazd, obsługiwane osiedla i formularz wyceny od razu na górze.</p>
    </div>
    ${districtLinks()}
  </section></div></div>`:''}

  <div class="dark"><div class="w"><section>
    <div class="sechead">
      <p class="eyebrow">Realizacje</p>
      <h2>Auta, które <span class="gold">już odkupiliśmy</span></h2>
      <div class="hr"></div>
    </div>
    ${shots(IMG.cars.slice(4,12))}
  </section></div></div>

  <div class="w"><section>
    <div class="sechead">
      <p class="eyebrow">Druga strona</p>
      <h2><span class="kw" data-v="${c.vk?c.vk+'/mies':'do sprawdzenia'}">Komis samochodowy ${esc(c.n)}</span></h2>
      <div class="hr"></div>
      <p>${c.vk>500?`Uwaga: ${esc(c.n)} szuka w Google komisu i samochodów używanych częściej niż skupu. Ta sekcja to druga połowa rynku, której konkurencja nie obsługuje.`:`Nie tylko odkupujemy auta ${esc(c.loc)} — także sprzedajemy sprawdzone samochody używane.`}</p>
    </div>
    <div class="duo">
      <div class="box">
        <h3>Samochody używane ${esc(c.n)}</h3>
        <ul class="tick">
          <li>Każde auto sprawdzone przed wystawieniem na sprzedaż</li>
          <li>Historia pojazdu i przebieg zweryfikowane</li>
          <li>Umowa i komplet dokumentów, bez niespodzianek</li>
          <li>Szukamy auta na zamówienie, pod Twój budżet</li>
        </ul>
      </div>
      <div class="box no">
        <h3>Aktualna oferta</h3>
        <p style="font-size:16px">Auta schodzą i dochodzą z tygodnia na tydzień, więc aktualną listę podajemy przez telefon. Zadzwoń i powiedz, czego szukasz — powiemy, co stoi i w jakiej cenie.</p>
        <div style="margin-top:20px"><a class="btn k" href="#wycena">Zapytaj o dostępne auta</a></div>
      </div>
    </div>
  </section></div>

  <div class="w"><section>
    <div class="sechead">
      <p class="eyebrow">Marki</p>
      <h2>Skup samochodów ${esc(c.n)}<br><span class="gold">wszystkie marki</span></h2>
      <div class="hr"></div>
    </div>
    ${brandTiles()}
  </section></div>

  <div class="w"><section style="padding-top:0">
    <div class="sechead">
      <p class="eyebrow">Pytania</p>
      <h2>Skup aut ${esc(c.n)}<br><span class="gold">najczęstsze pytania</span></h2>
      <div class="hr"></div>
    </div>
    <div class="faq">${faq(cf)}</div>
  </section></div>

  <div class="dark"><div class="w"><section>
    <div class="sechead">
      <p class="eyebrow">Oraz w miastach w okolicy</p>
      <h2>Skup aut <span class="gold">na Mazowszu</span></h2>
      <div class="hr"></div>
    </div>
    ${cityLinks()}
  </section></div></div>`;
}

/* ================= podstrona marek ================= */
function brandPage(b){
  return `
  <div class="chero">
    <img src="${IMG.hero2}" alt="">
    <div class="w">
      <p class="crumb"><a href="#/">TINA</a> / Skup aut ${esc(b.d)}</p>
      <h1>Skup aut <span class="gold">${esc(b.d)}</span></h1>
      <p class="lede">${esc(b.m)} — odkupujemy je w każdym stanie, w całym województwie mazowieckim. Wycena przez telefon, gotówka przy odbiorze.</p>
      <div class="acts"><a class="btn g" href="#wycena">Wyceń auto</a>${telBtn()}</div>
    </div>
  </div>

  ${form(null)}

  ${vowsSection()}

  <div class="w"><section>
    <div class="sechead">
      <p class="eyebrow">Zakres</p>
      <h2>Co odkupujemy z <span class="gold">tej grupy</span></h2>
      <div class="hr"></div>
    </div>
    <div class="duo">
      <div class="box">
        <h3>Marki</h3>
        <p style="font-size:17px">${esc(b.m)}</p>
        <p style="margin-top:14px;color:var(--muted)">Lista nie jest zamknięta — jeśli Twojej marki tu nie ma, zadzwoń i zapytaj.</p>
      </div>
      <div class="box no">
        <h3>W jakim stanie</h3>
        <ul class="tick">
          <li>Sprawne i jeżdżące</li>
          <li>Uszkodzone i powypadkowe</li>
          <li>Bez ważnego OC albo przeglądu</li>
          <li>Do kasacji i na części</li>
        </ul>
      </div>
    </div>
  </section></div>

  <div class="dark"><div class="w"><section>
    <div class="sechead">
      <p class="eyebrow">Realizacje</p>
      <h2>Auta, które <span class="gold">już odkupiliśmy</span></h2>
      <div class="hr"></div>
    </div>
    ${shots(IMG.cars.slice(0,8))}
  </section></div></div>

  <div class="w"><section>
    <div class="sechead">
      <p class="eyebrow">Pozostałe grupy</p>
      <h2>Skupujemy auta <span class="gold">wszystkich marek</span></h2>
      <div class="hr"></div>
    </div>
    ${brandTiles()}
  </section></div>

  <div class="dark"><div class="w"><section>
    <div class="sechead">
      <p class="eyebrow">Obszar działania</p>
      <h2>Skup aut <span class="gold">na Mazowszu</span></h2>
      <div class="hr"></div>
    </div>
    ${cityLinks()}
  </section></div></div>`;
}


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

/* ================= szybka wycena w hero ================= */
const quickForm=()=>`<form class="qf" id="qf" autocomplete="off">
  <div class="row">
    <div><label for="qm">Marka i model</label><input id="qm" placeholder="Audi A4 Avant"></div>
    <div><label for="qr">Rocznik</label><input id="qr" inputmode="numeric" maxlength="4" placeholder="2012"></div>
    <div><label for="qt">Twój telefon</label><input id="qt" inputmode="tel" placeholder="600 000 000"></div>
    <button class="btn g" type="submit">Wyceń auto</button>
  </div>
  <p class="hint">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d4af37" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.2 2"/></svg>
    Widełki podajemy od razu na stronie, dokładną kwotę przez telefon. Wycena jest darmowa i nie zobowiązuje do sprzedaży.
  </p>
</form>`;

/* ================= pasek dowodu ================= */
const proofBar=()=>`<div class="proof"><div class="w"><div class="in">
  <div><b data-c="480" data-suf="+">0</b><span>odkupionych aut</span></div>
  <div><b data-c="24" data-suf=" h">0</b><span>zwykle tyle do odbioru</span></div>
  <div><b data-c="0" data-lit="0 zł">0</b><span>za dojazd i lawetę</span></div>
  <div><b data-c="15" data-suf=" lat">0</b><span>na rynku od 2011</span></div>
</div></div></div>`;

/* ================= nasze zasady ================= */
const VOWS=[
 ['M12 2 4 5.5v6c0 5 3.4 9.4 8 10.5 4.6-1.1 8-5.5 8-10.5v-6L12 2z|m8.5 12 2.5 2.5 4.5-5',
  'Cena z telefonu nie zmienia się przy podpisie',
  'Najczęstsza zagrywka w tej branży: kwota przez telefon wysoka, a na miejscu nagle „no wie Pan, jednak…”. U nas jeśli auto zgadza się z opisem, płacimy dokładnie tyle, ile powiedzieliśmy.'],
 ['M3 12h4l2-7 4 14 2-7h6',
  'Dojazd i laweta kosztują zero — także wtedy, gdy się nie dogadamy',
  'Przyjeżdżamy na własny koszt. Jeśli po obejrzeniu auta kwota Ci nie pasuje, po prostu nie podpisujesz umowy i nie płacisz nic.'],
 ['M2 8h20v11H2z|M2 8l4-5h12l4 5|M12 12v4|M9.5 13.6h5',
  'Pieniądze zanim auto ruszy z miejsca',
  'Kolejność jest zawsze ta sama: umowa, wypłata gotówką albo przelewem, dopiero potem ładujemy auto. Nigdy odwrotnie.'],
 ['M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z|M14 2v6h6|M8.5 14.5l2 2 4-4.5',
  'Papiery bierzemy na siebie',
  'Umowę kupna-sprzedaży przygotowujemy na miejscu. Zgłoszenie zbycia w wydziale komunikacji i sprawę z ubezpieczycielem załatwiamy za Ciebie.']
];
const vowsSection=()=>`<div class="darker"><div class="w"><section>
  <div class="sechead">
    <p class="eyebrow">Cztery zasady, od których nie odstępujemy</p>
    <h2>Na czym możesz <span class="gold">polegać</span></h2>
    <div class="hr"></div>
    <p>W skupie aut najwięcej ludzi sparzyło się nie na cenie, tylko na tym, że ktoś zmienił zdanie w ostatniej chwili. Dlatego zaczynamy od tego.</p>
  </div>
  <div class="vows">${VOWS.map(v=>`<div class="vow">
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#d4af37" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${v[0].split('|').map(p=>`<path d="${p}"/>`).join('')}</svg>
    <div><h3>${v[1]}</h3><p>${v[2]}</p></div>
  </div>`).join('')}</div>
</section></div></div>`;

/* ================= porownanie sciezek sprzedazy ================= */
const CMP=[
 ['Ile to trwa','Jeden dzień od telefonu','Od trzech tygodni do kilku miesięcy','Dwa do sześciu tygodni'],
 ['Kto ogląda auto','My, jeden raz, o umówionej godzinie','Kilkunastu nieznajomych pod Twoim domem','Handlarz, w swoim tempie'],
 ['Cena','Ustalona przez telefon i niezmieniana przy podpisie','Najwyższa z możliwych, ale po długim czekaniu','Zwykle najniższa, plus prowizja'],
 ['Formalności','Po naszej stronie, łącznie ze zgłoszeniem zbycia','Wszystko robisz sam','Zależy od komisu'],
 ['Auto niejeżdżące albo powypadkowe','Odbieramy lawetą, transport gratis','Praktycznie nie do sprzedania','Zwykle odmawiają'],
 ['Kiedy masz pieniądze','Na miejscu, przed załadowaniem auta','Kiedy trafi się kupiec i zrobi przelew','Dopiero gdy komis sprzeda auto'],
 ['Ryzyko','Żadne — umowa i wypłata przy Tobie','Fałszywe przelewy, oglądacze, jazdy próbne','Auto stoi u nich, Ty czekasz']
];
const compareSection=()=>`<div class="w"><section id="porownanie">
  <div class="sechead">
    <p class="eyebrow">Trzy drogi, jedna decyzja</p>
    <h2>Skup, ogłoszenie czy <span class="gold">komis</span></h2>
    <div class="hr"></div>
    <p>Nie każdemu opłaca się skup — jeśli masz trzy miesiące i mocne nerwy, na ogłoszeniu wyciśniesz więcej. Poniżej uczciwie, czym się to różni.</p>
  </div>
  <div class="cmpwrap"><table class="cmp">
    <thead><tr><th></th><th class="us">TINA — skup</th><th>Ogłoszenie na portalu</th><th>Komis w rozliczeniu</th></tr></thead>
    <tbody>${CMP.map(r=>`<tr><th>${r[0]}</th><td class="us y">${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td></tr>`).join('')}</tbody>
  </table></div>
  <p style="margin-top:18px;font-size:15px;color:var(--muted);text-align:center">Zależy Ci na najwyższej kwocie i masz czas? Wystaw ogłoszenie. Zależy Ci, żeby mieć to z głowy w tym tygodniu — zadzwoń do nas.</p>
</section></div>`;

/* ================= dokumenty ================= */
const DOCS=[
 [1,'Dowód rejestracyjny','Sam dokument wystarczy. Jeśli zginął, powiedz o tym przez telefon — da się to obejść, tylko potrzebujemy wiedzieć wcześniej.'],
 [1,'Dowód osobisty właściciela','Do spisania umowy. Przy współwłasności potrzebne są dokumenty i podpisy obu osób.'],
 [1,'Komplet kluczyków','Jeden kluczyk zamiast dwóch nie blokuje sprzedaży, wpływa tylko na kwotę.'],
 [0,'Polisa OC','Jeśli jest aktualna — zabierz. Nie ma polisy? Też kupimy, wtedy przyjedziemy lawetą.'],
 [0,'Karta pojazdu','Wydawano ją do 2020 roku. Jeśli auto nigdy jej nie miało, nie jest potrzebna.'],
 [0,'Umowa lub faktura zakupu','Przydaje się, gdy w dowodzie jest jeszcze poprzedni właściciel.']
];
const docsSection=()=>`<div class="w"><section id="dokumenty" style="padding-top:0">
  <div class="sechead">
    <p class="eyebrow">Zanim przyjedziemy</p>
    <h2>Co warto <span class="gold">przygotować</span></h2>
    <div class="hr"></div>
    <p>Nic z tego nie musisz kompletować przed telefonem. To lista na spotkanie — żeby wszystko poszło za jednym razem.</p>
  </div>
  <div class="docs">${DOCS.map(d=>`<div class="doc${d[0]?'':' opt'}"><b>${d[1]}</b><p>${d[2]}</p></div>`).join('')}</div>
  <p style="margin-top:20px;font-size:15px;color:var(--muted);max-width:76ch">Sprzedajesz auto w imieniu kogoś z rodziny? Potrzebne będzie pisemne pełnomocnictwo od właściciela. Auto po zmarłej osobie albo w spadku — zadzwoń, powiemy dokładnie, co przygotować.</p>
</section></div>`;

/* ================= mapa zasiegu ================= */
/* ================= dane strukturalne dla Google ================= */
function jsonld(kind,obj){
  document.querySelectorAll('script[data-ld]').forEach(s=>s.remove());
  const biz={"@context":"https://schema.org","@type":"AutoDealer",
    "name":"TINA Skup Aut","legalName":"TINA Rafał Kocimski",
    "description":"Skup aut za got\u00f3wk\u0119 i sprzeda\u017c samochod\u00f3w u\u017cywanych na Mazowszu. Dzia\u0142amy od 2011 roku.",
    "url":location.origin+location.pathname,
    "logo":new URL("img/logo.png",location.href).href,
    "image":new URL("img/logo.png",location.href).href,
    "telephone":["+48693649549","+48692493797"],
    "email":"rafal.kocimski@o2.pl",
    "taxID":"5222345044","vatID":"PL5222345044",
    "foundingDate":"2011",
    "areaServed":CITIES.map(c=>({"@type":"City","name":c.n})),
    "address":{"@type":"PostalAddress","streetAddress":"Przyszła 2B","postalCode":"96-513",
      "addressLocality":"Koz\u0142\u00f3w Biskupi","addressRegion":"mazowieckie","addressCountry":"PL"},
    "priceRange":"$$"};
  const put=o=>{const s=document.createElement('script');s.type='application/ld+json';s.setAttribute('data-ld','1');s.textContent=JSON.stringify(o);document.head.appendChild(s);};
  put(biz);
  if(obj&&obj.faq&&obj.faq.length) put({"@context":"https://schema.org","@type":"FAQPage",
    "mainEntity":obj.faq.map(q=>({"@type":"Question","name":q[0],"acceptedAnswer":{"@type":"Answer","text":q[1]}}))});
  if(obj&&obj.crumbs) put({"@context":"https://schema.org","@type":"BreadcrumbList",
    "itemListElement":obj.crumbs.map((c,i)=>({"@type":"ListItem","position":i+1,"name":c}))});
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

/* ================= nawigacja z mapy ================= */
document.addEventListener('click',e=>{
  const g=e.target.closest&&e.target.closest('[data-go]');
  if(g){ idzDo(g.getAttribute('data-go')); }
});
document.addEventListener('keydown',e=>{
  if(e.key!=='Enter')return;
  const g=e.target.closest&&e.target.closest('[data-go]');
  if(g){ idzDo(g.getAttribute('data-go')); }
});

const DISTRICTS=[
 {s:"mokotow",n:"Mokotów",loc:"na Mokotowie",v:90,
  lead:"Mokotów obsługujemy codziennie — od Sadyby po Służew. Umawiamy się pod blokiem albo w garażu podziemnym, bez wjeżdżania na płatny parking.",
  near:["Sadyba","Stegny","Służew","Ksawerów","Sielce","Wierzbno","Wyględów","Czerniaków"]},
 {s:"srodmiescie",n:"Śródmieście",loc:"na Śródmieściu",v:70,
  lead:"W Śródmieściu największym problemem jest miejsce na oględziny — bierzemy to na siebie. Możemy podjechać wieczorem, kiedy strefa jest już wolna.",
  near:["Powiśle","Muranów","Stare Miasto","Nowe Miasto","Solec","Ujazdów","Za Żelazną Bramą"]},
 {s:"wola",n:"Wola",loc:"na Woli",v:70,
  lead:"Wola to nasza codzienna trasa przy wjeździe do Warszawy od zachodu. Zwykle jesteśmy na miejscu tego samego dnia.",
  near:["Odolany","Ulrychów","Koło","Młynów","Czyste","Mirów","Nowolipki"]},
 {s:"praga-poludnie",n:"Praga-Południe",loc:"na Pradze-Południe",v:70,
  lead:"Grochów, Gocław, Saska Kępa — jeździmy tam stale. Auta stojące od lat na podwórku też odbieramy, także lawetą.",
  near:["Saska Kępa","Grochów","Gocław","Gocławek","Kamionek","Olszynka","Witolin"]},
 {s:"bialoleka",n:"Białołęka",loc:"na Białołęce",v:50,
  lead:"Białołęka i cała północ prawobrzeżnej Warszawy. Duże osiedla z parkingami podziemnymi nie są problemem — wjeżdżamy lawetą tam, gdzie się da, albo wypychamy auto na poziom zero.",
  near:["Tarchomin","Nowodwory","Choszczówka","Brzeziny","Grodzisk","Henryków","Żerań"]},
 {s:"ursynow",n:"Ursynów",loc:"na Ursynowie",v:50,
  lead:"Ursynów i Kabaty — zjazd z S2 mamy po drodze, więc terminy są krótkie. Dojazd bezpłatny niezależnie od stanu auta.",
  near:["Kabaty","Natolin","Imielin","Stokłosy","Wyczółki","Pyry","Jeziorki"]},
 {s:"bemowo",n:"Bemowo",loc:"na Bemowie",v:40,
  lead:"Bemowo, Jelonki i okolice fortu — po zgłoszeniu rano zwykle jesteśmy jeszcze tego samego dnia po południu.",
  near:["Jelonki","Boernerowo","Chrzanów","Górce","Fort Bema","Nowe Bemowo"]},
 {s:"targowek",n:"Targówek",loc:"na Targówku",v:40,
  lead:"Bródno, Zacisze i Targówek Fabryczny. Auta bez przeglądu i bez OC odbieramy lawetą, żeby nie ruszać nimi z parkingu.",
  near:["Bródno","Zacisze","Elsnerów","Utrata","Targówek Fabryczny"]},
 {s:"bielany",n:"Bielany",loc:"na Bielanach",v:40,
  lead:"Bielany od Młocin po Marymont. Przy blokach umawiamy się na konkretną godzinę, żebyś nie schodził dwa razy.",
  near:["Chomiczówka","Wrzeciono","Piaski","Huta","Młociny","Wawrzyszew","Słodowiec"]},
 {s:"wawer",n:"Wawer",loc:"w Wawrze",v:40,
  lead:"Wawer jest rozległy — Anin, Falenica, Radość, Międzylesie. Przy domach jednorodzinnych podjeżdżamy pod bramę, także po godzinach.",
  near:["Anin","Międzylesie","Falenica","Radość","Marysin","Zerzeń","Miedzeszyn"]},
 {s:"ochota",n:"Ochota",loc:"na Ochocie",v:30,
  lead:"Ochota i Szczęśliwice. Krótka trasa od naszej strony miasta, więc zwykle jesteśmy w ciągu kilku godzin od telefonu.",
  near:["Rakowiec","Szczęśliwice","Filtry","Stara Ochota"]},
 {s:"zoliborz",n:"Żoliborz",loc:"na Żoliborzu",v:30,
  lead:"Żoliborz — od Marymontu po Powązki. Wąskie uliczki i ciasne podwórka nie są przeszkodą, przywozimy mniejszą lawetę.",
  near:["Marymont","Sady Żoliborskie","Zatrasie","Powązki","Żoliborz Oficerski"]},
 {s:"ursus",n:"Ursus",loc:"w Ursusie",v:30,
  lead:"Ursus i Skorosze — przy trasie na Pruszków, którą i tak jeździmy. Odbieramy też auta dostawcze od firm z tutejszych hal.",
  near:["Niedźwiadek","Skorosze","Gołąbki","Czechowice","Szamoty"]},
 {s:"wlochy",n:"Włochy",loc:"we Włochach",v:30,
  lead:"Włochy, Okęcie i Raków. Kupujemy tu sporo aut poleasingowych i firmowych — na fakturę też.",
  near:["Raków","Okęcie","Salomea","Nowe Włochy","Załuski"]},
 {s:"wilanow",n:"Wilanów",loc:"w Wilanowie",v:20,
  lead:"Wilanów i Miasteczko Wilanów. Umawiamy się w garażu podziemnym albo pod budynkiem, jak Ci wygodniej.",
  near:["Miasteczko Wilanów","Powsin","Zawady","Kępa Zawadowska","Wilanów Niski"]},
 {s:"praga-polnoc",n:"Praga-Północ",loc:"na Pradze-Północ",v:20,
  lead:"Stara Praga, Szmulowizna, Nowa Praga. Odbieramy auta z podwórek-studni i z komórek — także takie, które nie odpalają od lat.",
  near:["Nowa Praga","Stara Praga","Szmulowizna","Pelcowizna","Michałów"]},
 {s:"rembertow",n:"Rembertów",loc:"w Rembertowie",v:20,
  lead:"Rembertów i okolice poligonu. Blisko trasy na Mińsk Mazowiecki, więc łączymy dojazd z tamtą trasą — terminy są krótkie.",
  near:["Stary Rembertów","Nowy Rembertów","Kawęczyn","Wygoda","Pohulanka"]},
 {s:"wesola",n:"Wesoła",loc:"w Wesołej",v:20,
  lead:"Wesoła i Stara Miłosna. Domy jednorodzinne, garaże i auta stojące pod wiatą — zabieramy je w takim stanie, w jakim są.",
  near:["Stara Miłosna","Zielona","Groszówka","Wola Grzybowska","Centrum Wesoła"]}
];

const districtLinks=(light)=>`<div class="links ${light?'light':''}">${DISTRICTS.map(d=>`<a href="#/skup-aut-warszawa-${d.s}"><b>Skup aut ${esc(d.n)}</b><small>Warszawa</small><em class="vol">skup ${d.v}/mies</em></a>`).join('')}</div>`;
const districtChips=()=>`<div class="dchip">${DISTRICTS.map(d=>`<a href="#/skup-aut-warszawa-${d.s}">${esc(d.n)}</a>`).join('')}</div>`;

/* ================= podstrona dzielnicy ================= */
function districtPage(d){
  const df=[
   [`Ile czekam na dojazd ${d.loc}?`, d.lead],
   [`Czy przyjedziecie ${d.loc} pod blok albo do garażu podziemnego?`, `Tak. Oglądamy auto tam, gdzie stoi — pod blokiem, na parkingu osiedlowym albo w garażu. Jeśli auto nie odpala, wjeżdżamy lawetą albo wypychamy je na poziom zero.`],
   [`Skup aut ${d.n} — ile płacą za samochód?`, `Tyle, ile auto jest warte na rynku, pomniejszone o koszt przygotowania go do dalszej sprzedaży. Widełki podajemy przez telefon, ostateczną kwotę ${d.loc} po oględzinach — i nie zmieniamy jej w trakcie podpisywania umowy.`],
   [`Czy kupicie auto ${d.loc} bez ważnego OC albo przeglądu?`, `Tak. Brak OC lub przeglądu nie blokuje sprzedaży. Auto zabieramy lawetą, żeby nie jeździć nim po mieście bez ubezpieczenia.`],
   ...FAQ.slice(3,6)
  ];
  return `
  <div class="chero">
    <img src="${IMG.hero2}" alt="">
    <div class="w">
      <p class="crumb"><a href="#/">TINA</a> / <a href="#/skup-aut-warszawa">Skup aut Warszawa</a> / ${esc(d.n)}</p>
      <h1><span class="kw" data-v="${d.v} wyszukiwań/mies">Skup aut ${esc(d.n)}</span></h1>
      <p class="lede">${esc(d.lead)}</p>
      <div class="acts"><a class="btn g" href="#wycena">Wyceń auto ${esc(d.loc)}</a>${telBtn()}</div>
      <p class="sub">Skup samochodów, auto skup i komis samochodowy ${esc(d.loc)} — cała Warszawa i okolice.</p>
    </div>
  </div>

  ${form({n:'Warszawa'})}

  ${vowsSection()}

  <div class="w"><section>
    <div class="sechead">
      <p class="eyebrow">Obszar</p>
      <h2><span class="kw" data-v="${d.v}/mies">Auto skup ${esc(d.n)}</span> — <span class="gold">gdzie dojeżdżamy</span></h2>
      <div class="hr"></div>
      <p>Cała dzielnica i osiedla wokół. Jeśli Twojego adresu nie ma na liście, i tak zadzwoń — po Warszawie jeździmy codziennie.</p>
    </div>
    <div class="local">
      <div class="box">
        <h3>Osiedla i okolice</h3>
        <div class="near">${d.near.map(n=>`<span>${esc(n)}</span>`).join('')}</div>
      </div>
      <div class="box">
        <h3>Jak to wygląda ${esc(d.loc)}</h3>
        <ul class="tick">
          <li>Dojazd ${esc(d.loc)} bezpłatny, niezależnie od stanu auta</li>
          <li>Godzinę ustalasz Ty — także wieczorem i w sobotę</li>
          <li>Oglądamy auto tam, gdzie stoi — pod blokiem albo w garażu</li>
          <li>Gotówka albo przelew od razu po podpisaniu umowy</li>
          <li>Auta niejeżdżące odbieramy lawetą</li>
        </ul>
      </div>
    </div>
  </section></div>

  <div class="dark"><div class="w"><section>
    <div class="sechead">
      <p class="eyebrow">Dowód, nie deklaracja</p>
      <h2>Auta, które <span class="gold">już odkupiliśmy</span></h2>
      <div class="hr"></div>
    </div>
    <div>${shots(IMG.cars.slice(2,10))}</div>
  </section></div></div>

  <div class="w"><section>
    <div class="sechead">
      <p class="eyebrow">Druga strona</p>
      <h2><span class="kw" data-v="Warszawa 6 470/mies">Komis samochodowy</span> <span class="gold">${esc(d.n)}</span></h2>
      <div class="hr"></div>
      <p>Nie tylko odkupujemy auta ${esc(d.loc)} — sprzedajemy też sprawdzone samochody używane.</p>
    </div>
    <div class="duo">
      <div class="box">
        <h3>Samochody używane ${esc(d.n)}</h3>
        <ul class="tick">
          <li>Każde auto sprawdzone przed wystawieniem na sprzedaż</li>
          <li>Historia pojazdu i przebieg zweryfikowane</li>
          <li>Umowa i komplet dokumentów, bez niespodzianek</li>
          <li>Szukamy auta na zamówienie, pod Twój budżet</li>
        </ul>
      </div>
      <div class="box no">
        <h3>Aktualna oferta</h3>
        <p style="font-size:16px">Auta schodzą i dochodzą z tygodnia na tydzień, więc aktualną listę podajemy przez telefon. Zadzwoń i powiedz, czego szukasz — powiemy, co stoi i w jakiej cenie.</p>
        <div style="margin-top:20px"><a class="btn k" href="#wycena">Zapytaj o dostępne auta</a></div>
      </div>
    </div>
  </section></div>

  <div class="w"><section style="padding-top:0">
    <div class="sechead">
      <p class="eyebrow">Marki</p>
      <h2>Skup samochodów ${esc(d.n)}<br><span class="gold">wszystkie marki</span></h2>
      <div class="hr"></div>
    </div>
    <div>${brandTiles()}</div>
  </section></div>

  <div class="w"><section style="padding-top:0">
    <div class="sechead">
      <p class="eyebrow">Pytania</p>
      <h2>Skup aut ${esc(d.n)}<br><span class="gold">najczęstsze pytania</span></h2>
      <div class="hr"></div>
    </div>
    <div class="faq">${faq(df)}</div>
  </section></div>

  <div class="dark"><div class="w"><section>
    <div class="sechead">
      <p class="eyebrow">Pozostałe dzielnice</p>
      <h2>Skup aut <span class="gold">w całej Warszawie</span></h2>
      <div class="hr"></div>
      <p>Każda dzielnica ma własną stronę z informacją o dojeździe i obsługiwanych osiedlach.</p>
    </div>
    <div>${districtLinks()}</div>
  </section></div></div>

  <div class="w"><section>
    <div class="sechead">
      <p class="eyebrow">Oraz w miastach w okolicy</p>
      <h2>Skup aut <span class="gold">na Mazowszu</span></h2>
      <div class="hr"></div>
    </div>
    <div>${cityLinks(1)}</div>
  </section></div>`;
}

/* ================= router ================= */

/* ---------- rozwijany wybór miasta w nawigacji ---------- */
const dropBtn=document.querySelector('.dropbtn');
const dropMenu=document.getElementById('miastamenu');
function zamknijMiasta(){
  if(!dropMenu) return;
  dropMenu.classList.remove('on');
  dropBtn.setAttribute('aria-expanded','false');
}
if(dropBtn&&dropMenu){
  dropMenu.innerHTML=
    `<h5>Miasta na Mazowszu</h5>
     <div class="dg">${CITIES.map(c=>`<a href="#/skup-aut-${c.s}" class="${c.pri?'pri':''}" role="menuitem">${esc(c.n)}</a>`).join('')}</div>
     <h5>Warszawa — dzielnice</h5>
     <div class="dg">${DISTRICTS.map(d=>`<a href="#/skup-aut-warszawa-${d.s}" role="menuitem">${esc(d.n)}</a>`).join('')}</div>
     <div class="stopka">
       <a href="#/miasta" role="menuitem">Wszystkie miasta i dzielnice</a>
       <a href="#/skup-aut-warszawa" role="menuitem">Skup aut Warszawa — strona główna dzielnic</a>
     </div>`;
  dropBtn.addEventListener('click',e=>{
    e.stopPropagation();
    const otwarte=dropMenu.classList.toggle('on');
    dropBtn.setAttribute('aria-expanded',otwarte?'true':'false');
  });
  document.addEventListener('click',e=>{ if(!e.target.closest('.navdrop')) zamknijMiasta(); });
  document.addEventListener('keydown',e=>{ if(e.key==='Escape') zamknijMiasta(); });
}

/* ---------- odslanianie przy przewijaniu ---------- */
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

/* ================= router ================= */
/* ================= sekcje strony ================= */
const SEK={
hero(){return `
  <div class="hero">
    <img src="${IMG.hero}" alt="">
    <div class="w">
      <p class="tag">Twoje zaufanie, nasze doświadczenie</p>
      <h1><span class="kw" data-v="14 800/mies">Skup aut</span> za gotówkę<span class="l2 gold">i sprzedaż samochodów</span></h1>
      <p class="lede">Prowadzimy <span class="kw" data-v="6 600/mies">skup samochodów</span> na terenie całego Mazowsza — każda marka, każdy rocznik, także <span class="kw" data-v="1 300/mies">skup aut uszkodzonych</span> i powypadkowych. A jeśli szukasz auta dla siebie, nasz <span class="kw" data-v="1 900/mies w Warszawie">komis samochodowy</span> znajdzie je i sprawdzi przed zakupem.</p>
      ${quickForm()}
      <div class="acts" style="margin-top:18px">
        <a class="btn o" href="#sprzedaz">Nie sprzedaję — szukam auta do kupienia</a>
      </div>
      <div class="pillars">
        <div>
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#d4af37" stroke-width="1.5"><path d="M12 2 4 5.5v6c0 5 3.4 9.4 8 10.5 4.6-1.1 8-5.5 8-10.5v-6L12 2z"/><path d="m8.5 12 2.5 2.5 4.5-5" stroke-linecap="round"/></svg>
          <b>Sprawdzone samochody</b>
        </div>
        <div>
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#d4af37" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8.5 14.5l2 2 4-4.5" stroke-linecap="round"/></svg>
          <b>Przejrzyste warunki</b>
        </div>
        <div>
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#d4af37" stroke-width="1.5" stroke-linecap="round"><path d="M11 6 8 9l4 4 3-3"/><path d="m2 12 4-4 5 5 3-3 4 4 4-4"/><path d="M2 12v3l6 5 3-2 3 2 6-5v-3"/></svg>
          <b>Uczciwość i konkret</b>
        </div>
        <div>
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#d4af37" stroke-width="1.5"><circle cx="12" cy="8" r="3.6"/><path d="M4.5 21a7.5 7.5 0 0 1 15 0" stroke-linecap="round"/></svg>
          <b>Indywidualne podejście</b>
        </div>
      </div>
    </div>
  </div>`;},
filary(){return `  <div class="w"><section id="skup">
    <div class="sechead">
      <p class="eyebrow">Dwie strony jednej transakcji</p>
      <h2><span class="kw" data-v="14 800/mies">Skup aut</span> albo <span class="gold"><span class="kw" data-v="wg miasta">komis samochodowy</span></span></h2>
      <div class="hr"></div>
      <p>Większość skupów robi tylko jedno. My prowadzimy obie strony — <span class="kw" data-v="1 300/mies">auto skup</span> i sprzedaż aut używanych — dlatego wiemy, ile Twoje auto jest naprawdę warte na rynku.</p>
    </div>
    <div class="two">
      <div class="pane">
        <img src="${IMG.cars[4].s}" alt="">
        <div class="in">
          <h3><span>Skup</span><span class="kw" data-v="2 400/mies">Sprzedam auto</span></h3>
          <p><span class="kw" data-v="1 300/mies">Skup aut za gotówkę</span> — przyjeżdżamy pod wskazany adres, oglądamy auto i płacimy na miejscu.</p>
          <ul>
            <li>Każda marka i rocznik, także powypadkowe i niejeżdżące</li>
            <li>Bez ważnego OC albo przeglądu</li>
            <li>Osobowe, dostawcze, terenowe, pickupy i busy</li>
            <li>Odkup flot firmowych i aut poleasingowych</li>
          </ul>
          <div class="go"><a class="btn g" href="#wycena">Wyceń auto</a></div>
        </div>
      </div>
      <div class="pane" id="sprzedaz">
        <img src="${IMG.cars[13].s}" alt="">
        <div class="in">
          <h3><span>Sprzedaż</span><span class="kw" data-v="880/mies w Warszawie">Samochody używane</span></h3>
          <p>Każde auto z naszej oferty przechodzi sprawdzenie przed wystawieniem.</p>
          <ul>
            <li>Historia pojazdu i przebieg sprawdzone przed sprzedażą</li>
            <li>Umowa i komplet dokumentów, bez niespodzianek</li>
            <li>Szukamy też auta na zamówienie, pod Twój budżet</li>
            <li>Możliwość rozliczenia w rozliczeniu za Twoje stare auto</li>
          </ul>
          <div class="go"><a class="btn o" style="color:var(--g);border-color:var(--g3)" href="#kontakt">Zapytaj o dostępne auta</a></div>
        </div>
      </div>
    </div>
  </section></div>`;},
realizacje(){return `  <div class="dark"><div class="w"><section id="realizacje">
    <div class="sechead">
      <p class="eyebrow">Dowód, nie deklaracja</p>
      <h2>Auta, które <span class="gold">już odkupiliśmy</span></h2>
      <div class="hr"></div>
      <p>Zdjęcia z naszych transakcji — <span class="kw" data-v="880/mies">skup aut używanych</span> obejmuje u nas wszystko, od trzydziestoletniego mercedesa po skrzyniowego craftera i auto po kolizji. Żadnych zdjęć ze stocka.</p>
    </div>
    ${shots(IMG.cars.slice(0,12))}
  </section></div></div>`;},
uszkodzone(){return `  <div class="w"><section id="uszkodzone">
    <div class="sechead">
      <p class="eyebrow">Auta w każdym stanie</p>
      <h2><span class="kw" data-v="1 300/mies">Skup aut uszkodzonych</span> i <span class="gold"><span class="kw" data-v="590/mies">powypadkowych</span></span></h2>
      <div class="hr"></div>
      <p>Nie musisz naprawiać auta przed sprzedażą ani jeździć na stację diagnostyczną. Odkupimy je takie, jakie jest.</p>
    </div>
    <div class="duo">
      <div class="box">
        <h3>W jakim stanie kupujemy</h3>
        <ul class="tick">
          <li><span class="kw" data-v="590/mies">Skup aut powypadkowych</span> i po szkodzie całkowitej</li>
          <li><span class="kw" data-v="590/mies">Skup samochodów uszkodzonych</span> — także niejeżdżących</li>
          <li><span class="kw" data-v="50/mies">Skup aut bez OC</span> i bez ważnego przeglądu</li>
          <li><span class="kw" data-v="880/mies">Skup aut na części</span> i do kasacji</li>
          <li>Auta w kredycie i po leasingu, po ustaleniu z bankiem</li>
        </ul>
      </div>
      <div class="box no">
        <h3><span class="kw" data-v="70/mies">Skup aut — ile płacą</span></h3>
        <p style="font-size:16px">Widełki podajemy przez telefon, po marce, roczniku, przebiegu i stanie. Ostateczną kwotę — po oględzinach. Wycena jest darmowa i nie zobowiązuje do niczego.</p>
        <p style="margin-top:16px;color:var(--muted);font-size:15.5px">Auto niejeżdżące odbieramy lawetą, transport jest po naszej stronie i nie schodzi z ceny.</p>
        <div style="margin-top:20px"><a class="btn k" href="#wycena">Sprawdź, ile dostaniesz</a></div>
      </div>
    </div>
  </section></div>`;},
kroki(){return `  <div class="w"><section id="jak">
    <div class="sechead">
      <p class="eyebrow">Przebieg sprawy</p>
      <h2>Trzy kroki i <span class="gold"><span class="kw" data-v="480/mies „jak sprzedać auto”">auto sprzedane</span></span></h2>
      <div class="hr"></div>
      <p>Bez wystawiania ogłoszeń, bez oglądaczy pod domem, bez czekania na przelew od nieznajomego.</p>
    </div>
    <div class="steps">
      <div class="step"><span class="n">KROK I</span><h3>Zgłoszenie</h3><p>Dzwonisz albo wypełniasz formularz. Pytamy o markę, rocznik, przebieg i stan — widełki podajemy jeszcze przez telefon.</p></div>
      <div class="step"><span class="n">KROK II</span><h3>Oględziny</h3><p>Przyjeżdżamy w umówionym miejscu i o umówionej godzinie. Oglądamy auto i podajemy ostateczną kwotę.</p></div>
      <div class="step"><span class="n">KROK III</span><h3>Umowa i gotówka</h3><p>Podpisujesz umowę, dostajesz pieniądze, my zabieramy auto i załatwiamy resztę papierów.</p></div>
    </div>
  </section></div>`;},
marki(){return `  <div class="w"><section id="marki">
    <div class="sechead">
      <p class="eyebrow">Marki</p>
      <h2><span class="kw" data-v="6 600/mies">Skup samochodów</span> <span class="gold">wszystkich marek</span></h2>
      <div class="hr"></div>
      <p>Niezależnie od tego, skąd pochodzi Twoje auto — sprawdź, ile jest warte.</p>
    </div>
    ${brandTiles()}
  </section></div>`;},
zakres(){return `  <div class="w"><section style="padding-top:0" id="zakres">
    <div class="duo">
      <div class="box">
        <h3>Kupujemy</h3>
        <ul class="tick">
          <li>Wszystkie marki i roczniki, z całej Polski</li>
          <li>Sprawne, uszkodzone, powypadkowe i niejeżdżące</li>
          <li>Bez ważnego OC albo przeglądu</li>
          <li>Osobowe, dostawcze, terenowe, pickupy i busy</li>
          <li>Od osób prywatnych i od firm</li>
          <li>Odkup flot firmowych i aut poleasingowych</li>
          <li>Od korporacji taksówkarskich i szkół jazdy</li>
        </ul>
      </div>
      <div class="box no">
        <h3>Nie kupimy</h3>
        <ul class="tick x">
          <li>Aut bez możliwości rejestracji w Polsce</li>
          <li>Aut bez kompletu dokumentów i dowodu własności</li>
          <li>Aut zajętych przez komornika</li>
        </ul>
        <p style="margin-top:20px;font-size:15.5px;color:var(--muted)">Nie masz pewności, czy Twoje auto się łapie? Zadzwoń i zapytaj — odpowiemy od razu, zamiast przeciągać temat.</p>
      </div>
    </div>
  </section></div>`;},
miasta(){return `  <div class="dark"><div class="w"><section id="miasta">
    <div class="sechead">
      <p class="eyebrow">Obszar działania</p>
      <h2><span class="kw" data-v="14 800/mies">Skup aut</span> <span class="gold"><span class="kw" data-v="320/mies">na całym Mazowszu</span></span></h2>
      <div class="hr"></div>
      <p>Promienie liczymy od bazy w Sochaczewie. Każde miasto ma własną stronę z informacją o dojeździe, terminach i obsługiwanych gminach.</p>
    </div>
    ${cityLinks()}
  </section></div></div>`;},
opinie(){return `  <div class="w"><section id="faq" style="padding-top:0">
    <div class="sechead">
      <p class="eyebrow">Pytania</p>
      <h2>Zanim <span class="gold">zadzwonisz</span></h2>
      <div class="hr"></div>
    </div>
    <div class="faq">${faq(FAQ)}</div>
  </section></div>`;},
};

/* ---------- sekcje dopisane pod podstrony ---------- */
SEK.komis=()=>`
  <div class="w"><section>
    <div class="sechead">
      <p class="eyebrow">Druga strona transakcji</p>
      <h2><span class="kw" data-v="12 100/mies na Mazowszu">Komis samochodowy</span> <span class="gold">i auta na zamówienie</span></h2>
      <div class="hr"></div>
      <p>Większość skupów robi tylko jedno. My prowadzimy obie strony, dlatego wiemy, ile auto jest naprawdę warte na rynku — i dlatego umiemy znaleźć konkretne auto pod Twój budżet.</p>
    </div>
    <div class="duo">
      <div class="box">
        <h3>Co dostajesz, kupując u nas</h3>
        <ul class="tick">
          <li>Każde auto sprawdzone przed wystawieniem na sprzedaż</li>
          <li>Historia pojazdu i przebieg zweryfikowane, nie „słowo daję”</li>
          <li>Umowa i komplet dokumentów, bez niespodzianek</li>
          <li>Szukamy auta na zamówienie, pod Twój budżet i przeznaczenie</li>
          <li>Możliwość rozliczenia w cenie Twojego starego auta</li>
        </ul>
      </div>
      <div class="box no">
        <h3>Aktualna oferta</h3>
        <p style="font-size:16px">Auta schodzą i dochodzą z tygodnia na tydzień, więc aktualną listę podajemy przez telefon. Zadzwoń i powiedz, czego szukasz — powiemy, co stoi i w jakiej cenie.</p>
        <div style="margin-top:20px">${telBtn()}</div>
      </div>
    </div>
  </section></div>`;

SEK.jakLiczymy=()=>`
  <div class="w"><section style="padding-top:0">
    <div class="sechead">
      <p class="eyebrow">Bez tajemnic</p>
      <h2>Jak liczymy <span class="gold">kwotę</span></h2>
      <div class="hr"></div>
      <p>Nikt w tej branży nie podaje cen. My pokazujemy, z czego się składa nasza — i dlaczego nie jest równa cenie z ogłoszeń.</p>
    </div>
    <div class="steps">
      <div class="step"><span class="n">SKŁADNIK I</span><h3>Wartość rynkowa</h3><p>Marka, model, rocznik, przebieg, paliwo i wyposażenie. Punkt wyjścia to cena, za jaką takie auto realnie schodzi, a nie za jaką wisi w ogłoszeniu.</p></div>
      <div class="step"><span class="n">SKŁADNIK II</span><h3>Stan techniczny</h3><p>Usterki, szkody, brak przeglądu albo OC. To jedyna rzecz, która może się zmienić po oględzinach — i tylko wtedy, gdy auto nie zgadza się z opisem.</p></div>
      <div class="step"><span class="n">SKŁADNIK III</span><h3>Nasz koszt</h3><p>Transport, przygotowanie auta do dalszej sprzedaży i czas, w którym stoi u nas. To jest różnica między naszą kwotą a ceną z portalu — i to jest cena za to, że masz sprawę z głowy w jeden dzień.</p></div>
    </div>
    <p style="margin-top:24px;font-size:15.5px;color:var(--muted);max-width:80ch;margin-inline:auto;text-align:center">
      Kalkulator powyżej liczy widełki z danych rynkowych. To nie jest oferta — ale nie jest też strzałem w ciemno. Po telefonie widełki zwężamy, po oględzinach podajemy jedną kwotę i już jej nie zmieniamy.</p>
  </section></div>`;

SEK.miastaSkrot=()=>`
  <div class="dark"><div class="w"><section>
    <div class="sechead">
      <p class="eyebrow">Obszar działania</p>
      <h2><span class="kw" data-v="14 800/mies">Skup aut</span> <span class="gold">na całym Mazowszu</span></h2>
      <div class="hr"></div>
      <p>Bazę mamy w Sochaczewie. Każde miasto ma własną stronę z informacją o dojeździe, terminach i obsługiwanych gminach.</p>
    </div>
    ${cityLinks()}
    <div style="text-align:center;margin-top:30px"><a class="btn o" href="#/miasta">Wszystkie miasta i dzielnice Warszawy</a></div>
  </section></div></div>`;

SEK.miastaPelne=()=>`
  <div class="dark"><div class="w"><section>
    <div class="sechead">
      <p class="eyebrow">Dziewiętnaście miast</p>
      <h2>Miasta, w których <span class="gold">prowadzimy skup</span></h2>
      <div class="hr"></div>
      <p>Kolejność od najbliższych naszej bazy w Sochaczewie. Jeśli Twojej miejscowości tu nie ma, i tak zadzwoń — prawie zawsze jesteśmy w stanie podjechać.</p>
    </div>
    ${cityLinks()}
  </section></div></div>

  <div class="w"><section>
    <div class="sechead">
      <p class="eyebrow">Osiemnaście dzielnic</p>
      <h2><span class="kw" data-v="5 400/mies">Skup aut Warszawa</span> <span class="gold">dzielnica po dzielnicy</span></h2>
      <div class="hr"></div>
      <p>Umawiamy się pod blokiem, na parkingu osiedlowym albo w garażu podziemnym — tam, gdzie stoi auto.</p>
    </div>
    ${districtLinks(1)}
  </section></div>`;

SEK.realizacjeSkrot=()=>`
  <div class="dark"><div class="w"><section>
    <div class="sechead">
      <p class="eyebrow">Dowód, nie deklaracja</p>
      <h2>Auta, które <span class="gold">już odkupiliśmy</span></h2>
      <div class="hr"></div>
      <p>Prawdziwe transakcje, nie zdjęcia ze stocka. Od trzydziestoletniego mercedesa po skrzyniowego craftera.</p>
    </div>
    ${shots(IMG.cars.slice(0,8))}
    <div style="text-align:center;margin-top:30px"><a class="btn o" href="#/realizacje">Zobacz wszystkie realizacje</a></div>
  </section></div></div>`;

SEK.faqSkrot=()=>`
  <div class="w"><section>
    <div class="sechead">
      <p class="eyebrow">Pytania</p>
      <h2>Zanim <span class="gold">zadzwonisz</span></h2>
      <div class="hr"></div>
    </div>
    <div class="faq">${faq(FAQ.slice(0,6))}</div>
    <div style="text-align:center;margin-top:30px"><a class="btn k" href="#/pytania">Wszystkie pytania i odpowiedzi</a></div>
  </section></div>`;

SEK.cta=()=>`
  <div class="darker"><div class="w"><section style="text-align:center">
    <p class="eyebrow">Jeden telefon i masz to z głowy</p>
    <h2 style="margin-top:14px;font-size:clamp(22px,3.1vw,38px)">Sprawdź, ile <span class="gold">dostaniesz za swoje auto</span></h2>
    <p style="margin:18px auto 0;font-size:17px;color:var(--onk-mut);max-width:62ch">Wycena jest darmowa i nie zobowiązuje do sprzedaży. Dojazd i laweta po naszej stronie — także wtedy, gdy się nie dogadamy.</p>
    <div class="acts" style="margin-top:28px;display:flex;gap:14px;justify-content:center;flex-wrap:wrap">
      <a class="btn g" href="#wycena">Wyceń auto online</a>${telBtn()}
    </div>
  </section></div></div>`;

/* ---------- strona główna: tylko to, co musi być na pierwszym ekranie ---------- */
function home(){
  return SEK.hero()
    + proofBar()
    + form(null)
    + vowsSection()
    + SEK.filary()
    + SEK.kroki()
    + SEK.realizacjeSkrot()
    + SEK.miastaSkrot()
    + SEK.faqSkrot()
    + SEK.cta();
}

/* ================= podstrony zakładek ================= */
const TABS={
 skup:{
  n:'Skup', h1:`${'Skup aut'} <span class="gold">za gotówkę</span>`,
  kw:'14 800/mies',
  crumb:'Skup aut',
  lede:'Odkupujemy auta w każdym stanie — sprawne, uszkodzone, powypadkowe i niejeżdżące. Przyjeżdżamy pod wskazany adres, oglądamy auto i płacimy na miejscu.',
  sub:'Skup samochodów, auto skup i skup aut używanych na terenie całego Mazowsza.',
  t:'Skup aut za gotówkę — Mazowsze | TINA',
  d:'Skup aut za gotówkę na Mazowszu. Każda marka i rocznik, także powypadkowe i niejeżdżące. Dojazd i laweta gratis, wypłata na miejscu.'
 },
 sprzedaz:{
  n:'Sprzedaż', h1:`<span class="gold">Samochody używane</span><br>sprawdzone przed sprzedażą`,
  kw:'880/mies',
  crumb:'Sprzedaż aut',
  lede:'Prowadzimy też drugą stronę transakcji. Każde auto z naszej oferty przechodzi sprawdzenie historii i przebiegu, zanim trafi na sprzedaż.',
  sub:'Komis samochodowy i sprzedaż samochodów używanych na Mazowszu.',
  t:'Samochody używane i komis — Mazowsze | TINA',
  d:'Sprawdzone samochody używane i komis samochodowy na Mazowszu. Historia pojazdu i przebieg zweryfikowane, komplet dokumentów, auto na zamówienie.'
 },
 wycena:{
  n:'Wycena', h1:`<span class="gold">Wycena auta</span><br>w piętnaście minut`,
  kw:'online',
  crumb:'Wycena auta',
  lede:'Cztery krótkie kroki. Widełki widzisz od razu na ekranie, dokładną kwotę potwierdzamy przez telefon, a ostateczną po oględzinach.',
  sub:'Wycena jest darmowa i nie zobowiązuje do sprzedaży.',
  t:'Wycena auta online — darmowa, w 15 minut | TINA',
  d:'Darmowa wycena auta online. Podaj markę, rocznik, przebieg i stan — widełki dostaniesz od razu. Wycena nie zobowiązuje do sprzedaży.'
 },
 realizacje:{
  n:'Realizacje', h1:`Auta, które <span class="gold">już odkupiliśmy</span>`,
  kw:'880/mies',
  crumb:'Realizacje',
  lede:'Zdjęcia z naszych transakcji — od trzydziestoletniego mercedesa po skrzyniowego craftera i auto po kolizji. Żadnych zdjęć ze stocka.',
  sub:'Kliknij zdjęcie, żeby powiększyć.',
  t:'Realizacje — auta, które odkupiliśmy | TINA',
  d:'Zdjęcia aut odkupionych przez TINA: osobowe, dostawcze, powypadkowe i niejeżdżące. Prawdziwe transakcje, nie zdjęcia ze stocka.'
 },
 porownanie:{
  n:'Porównanie', h1:`Skup, ogłoszenie<br>czy <span class="gold">komis</span>`,
  kw:'480/mies',
  crumb:'Porównanie',
  lede:'Nie każdemu opłaca się skup. Jeśli masz trzy miesiące i mocne nerwy, na ogłoszeniu wyciśniesz więcej. Poniżej uczciwie, czym się to różni.',
  sub:'',
  t:'Skup, ogłoszenie czy komis — co się bardziej opłaca | TINA',
  d:'Porównanie trzech dróg sprzedaży auta: skup, ogłoszenie na portalu i komis w rozliczeniu. Czas, cena, formalności i ryzyko w jednej tabeli.'
 },
 marki:{
  n:'Marki', h1:`<span class="gold">Skup samochodów</span><br>wszystkich marek`,
  kw:'6 600/mies',
  crumb:'Marki',
  lede:'Niezależnie od tego, skąd pochodzi Twoje auto — sprawdź, ile jest warte. Lista nie jest zamknięta, jeśli Twojej marki tu nie ma, zadzwoń i zapytaj.',
  sub:'',
  t:'Skup samochodów wszystkich marek | TINA',
  d:'Skupujemy auta niemieckie, japońskie, koreańskie, francuskie, angielskie, amerykańskie, włoskie i czeskie. Każdy rocznik i każdy stan.'
 },
 miasta:{
  n:'Miasta', h1:`Skup aut <span class="gold">na całym Mazowszu</span>`,
  kw:'320/mies',
  crumb:'Miasta',
  lede:'Dziewiętnaście miast i osiemnaście dzielnic Warszawy — każde z własną stroną, informacją o dojeździe i obsługiwanych gminach.',
  sub:'Bazę mamy w Sochaczewie, ale jeździmy po całym województwie.',
  t:'Skup aut — miasta na Mazowszu | TINA',
  d:'Skup aut w miastach Mazowsza: Sochaczew, Płock, Warszawa, Piaseczno, Radom, Siedlce i kolejne. Osobna strona dla każdego miasta i dzielnicy Warszawy.'
 },
 pytania:{
  n:'Pytania', h1:`Zanim <span class="gold">zadzwonisz</span>`,
  kw:'',
  crumb:'Pytania',
  lede:'Najczęstsze pytania o skup aut, formalności i wypłatę. Nie ma tu Twojego pytania? Zadzwoń — odpowiemy od razu, zamiast przeciągać temat.',
  sub:'',
  t:'Pytania i odpowiedzi — skup aut | TINA',
  d:'Ile trwa wycena, czy odbierzemy auto niejeżdżące, kiedy dostanę pieniądze, kto załatwia formalności. Odpowiedzi na najczęstsze pytania o skup aut.'
 }
};

function subHero(t){
  return `
  <div class="chero">
    <img src="${IMG.hero2}" alt="">
    <div class="w">
      <p class="crumb"><a href="#/">TINA</a> / ${esc(t.crumb)}</p>
      <h1>${t.kw?`<span class="kw" data-v="${t.kw}">`:''}${t.h1}${t.kw?'</span>':''}</h1>
      <p class="lede">${esc(t.lede)}</p>
      <div class="acts"><a class="btn g" href="#wycena">Wyceń swoje auto</a>${telBtn()}</div>
      ${t.sub?`<p class="sub">${esc(t.sub)}</p>`:''}
    </div>
  </div>`;
}

function tabPage(k){
  const t=TABS[k];
  const H=subHero(t);
  if(k==='skup')       return H+form(null)+SEK.uszkodzone()+SEK.zakres()+SEK.kroki()+SEK.miastaSkrot();
  if(k==='sprzedaz')   return H+SEK.komis()+form(null)+SEK.realizacjeSkrot();
  if(k==='wycena')     return H+form(null)+SEK.jakLiczymy()+docsSection()+SEK.kroki();
  if(k==='realizacje') return H+`<div class="w"><section>${shots(IMG.cars)}</section></div>`+form(null);
  if(k==='porownanie') return H+compareSection()+vowsSection()+form(null);
  if(k==='marki')      return H+`<div class="w"><section>${brandTiles()}</section></div>`+form(null)+SEK.miastaSkrot();
  if(k==='miasta')     return H+SEK.miastaPelne()+form(null);
  if(k==='pytania')    return H+`<div class="w"><section><div class="faq">${faq(FAQ)}</div></section></div>`+form(null);
  return H;
}


function meta(d){
  let m=document.querySelector('meta[name="description"]');
  if(!m){ m=document.createElement('meta'); m.name='description'; document.head.appendChild(m); }
  m.setAttribute('content',d);
}

function render(){
  const h=location.hash.replace(/^#/,'');
  const m=h.match(/^\/skup-aut-([a-z0-9-]+)/);
  const app=document.getElementById('app');
  let city=null, brand=null, dist=null, tab=null;
  if(m){
    const sl=m[1];
    dist=DISTRICTS.find(d=>('warszawa-'+d.s)===sl);
    if(!dist){ city=CITIES.find(c=>c.s===sl); if(!city) brand=BRANDS.find(b=>b.s===sl); }
  } else {
    const t=h.replace(/^\//,'').split('#')[0];
    if(TABS[t]) tab=t;
  }

  app.innerHTML = tab ? tabPage(tab)
    : dist ? districtPage(dist)
    : city ? cityPage(city)
    : brand ? brandPage(brand)
    : home();

  let tytul, opis, zakladka;
  if(tab){
    tytul=TABS[tab].t; opis=TABS[tab].d; zakladka=tab;
  } else if(dist){
    tytul=`Skup aut ${dist.n} Warszawa \u2014 skup samochod\u00f3w | TINA`;
    opis=`Skup aut ${dist.loc}. Dojazd i laweta gratis, wycena przez telefon, got\u00f3wka po podpisaniu umowy. Ogl\u0105damy auto tam, gdzie stoi.`;
    zakladka='miasta';
  } else if(city){
    tytul=`Skup aut ${city.n} \u2014 skup samochod\u00f3w i komis | TINA`;
    opis=`Skup aut ${city.loc} i w obszarze, jakim jest ${city.area}. Ka\u017cda marka i rocznik, tak\u017ce powypadkowe. Dojazd bezp\u0142atny, wyp\u0142ata na miejscu.`;
    zakladka='miasta';
  } else if(brand){
    tytul=`Skup aut ${brand.d} \u2014 skup samochod\u00f3w | TINA`;
    opis=`Skup aut ${brand.d} na Mazowszu: ${brand.m}. Sprawne, uszkodzone i niejezd\u017c\u0105ce. Wycena przez telefon, got\u00f3wka przy odbiorze.`;
    zakladka='marki';
  } else {
    tytul='Skup aut Mazowsze \u2014 skup samochod\u00f3w za got\u00f3wk\u0119 | TINA';
    opis='Skup aut za got\u00f3wk\u0119 i sprzeda\u017c samochod\u00f3w u\u017cywanych na Mazowszu. Wycena online w 15 minut, dojazd i laweta gratis, p\u0142atno\u015b\u0107 na miejscu.';
    zakladka='';
  }
  document.title=tytul; meta(opis);
  document.querySelectorAll('[data-t]').forEach(el=>el.classList.toggle('act',el.dataset.t===zakladka));
  zamknijMiasta();

  bindForm();
  reveal();
  counters();
  jsonld(null,{
    faq: tab==='pytania' ? FAQ : (tab||dist||city||brand) ? null : FAQ.slice(0,6),
    crumbs: tab ? ['TINA',TABS[tab].crumb]
      : dist ? ['TINA','Skup aut Warszawa','Skup aut '+dist.n]
      : city ? ['TINA','Skup aut '+city.n]
      : brand ? ['TINA','Skup aut '+brand.d]
      : ['TINA']
  });
}

let rtKey=null, rtFirst=true;
function route(){
  const h=location.hash.replace(/^#/,'');
  if(h && h.charAt(0)!=='/'){                       /* zwykla kotwica */
    const el=document.getElementById(h);
    if(el) el.scrollIntoView({behavior:'smooth',block:'start'});
    return;
  }
  const key=(h.match(/^\/[a-z0-9-]*/)||['/'])[0];
  const anchor=h.split('#')[1];
  const jump=()=>{
    if(anchor){ const el=document.getElementById(anchor); if(el){ el.scrollIntoView({behavior:'smooth',block:'start'}); return; } }
    window.scrollTo(0,0);
  };
  if(key===rtKey){ jump(); return; }
  const app=document.getElementById('app');
  const swap=()=>{
    rtKey=key;
    render();
    app.style.transition=''; app.style.opacity=''; app.style.transform='';
    app.style.animation='none'; void app.offsetWidth; app.style.animation='';
    window.scrollTo(0,0);
    if(anchor) setTimeout(jump,60);
  };
  if(rtFirst){ rtFirst=false; swap(); return; }
  app.style.transition='opacity .17s ease, transform .17s ease';
  app.style.opacity='0';
  app.style.transform='translateY(-10px)';
  setTimeout(swap,175);
}

if(STATIC){
  /* Tresc jest juz w pliku - wystarczy podpiac formularz i animacje. */
  bindForm(); reveal(); counters();
}else{
  document.getElementById('footcities').innerHTML=CITIES.slice(0,10).map(c=>`<a href="#/skup-aut-${c.s}">${c.n}</a>`).join(' · ');
  document.getElementById('footdistricts').innerHTML=DISTRICTS.map(d=>`<a href="#/skup-aut-warszawa-${d.s}">${d.n}</a>`).join(' · ');
  window.addEventListener('hashchange',route);
  route();
}
