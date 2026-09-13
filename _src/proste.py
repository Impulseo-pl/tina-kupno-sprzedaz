# -*- coding: utf-8 -*-
"""Tresc stron, ktorych nie generuje aplikacja: polityka, podziekowanie, 404."""

FIRMA = u'TINA Rafał Kocimski'
ADRES = u'Przyszła 2B, 96-513 Kozłów Biskupi'
NIP = u'522-234-50-44'
MAIL = u'rafal.kocimski@o2.pl'
TEL = u'693 649 549'

POLITYKA_TYTUL = u'Polityka prywatności | TINA Skup Aut'
POLITYKA_OPIS = (u'Polityka prywatności serwisu tinaskupaut.pl — kto przetwarza dane '
                 u'z formularza wyceny auta, w jakim celu, jak długo i jakie masz prawa.')

POLITYKA = u"""
<div class="chero">
  <div class="w">
    <p class="crumb"><a href="{ROOT}">TINA</a> / Polityka prywatności</p>
    <h1>Polityka <span class="gold">prywatności</span></h1>
    <p class="lede">Kto przetwarza Twoje dane, po co, jak długo je trzymamy i co możesz z tym zrobić.</p>
  </div>
</div>
<div class="w"><section><div class="proza">

<p class="data">Obowiązuje od 13 września 2026 r.</p>

<h2>1. Kto jest administratorem danych</h2>
<p>Administratorem Twoich danych osobowych jest <b>{FIRMA}</b>, {ADRES}, NIP {NIP}.
Kontakt w sprawie danych: <a href="mailto:{MAIL}">{MAIL}</a>, tel. <a href="tel:+48693649549">{TEL}</a>.</p>

<h2>2. Jakie dane zbieramy</h2>
<p>Zbieramy tylko to, co sam podasz w formularzu wyceny albo powiesz przez telefon:</p>
<ul>
  <li>numer telefonu — bez niego nie oddzwonimy;</li>
  <li>miejscowość i preferowaną porę kontaktu;</li>
  <li>dane pojazdu: marka, model, rocznik, przebieg, paliwo, pojemność, stan, oczekiwana cena;</li>
  <li>treść uwag, które wpiszesz, oraz zdjęcia auta, jeśli je dołączysz.</li>
</ul>
<p>Nie prosimy o numer PESEL, numer dowodu ani numer rejestracyjny na etapie wyceny.
Te dane pojawiają się dopiero w umowie kupna-sprzedaży, jeśli do niej dojdzie.</p>

<h2>3. Po co nam te dane i na jakiej podstawie</h2>
<ul>
  <li><b>Żeby wycenić auto i oddzwonić</b> — podstawą jest art. 6 ust. 1 lit. b RODO,
      czyli działania podejmowane na Twoje żądanie przed zawarciem umowy.</li>
  <li><b>Żeby zawrzeć i rozliczyć umowę kupna-sprzedaży</b> — art. 6 ust. 1 lit. b RODO.</li>
  <li><b>Żeby wypełnić obowiązki podatkowe i rachunkowe</b> — art. 6 ust. 1 lit. c RODO.</li>
  <li><b>Żeby ustalić lub dochodzić ewentualnych roszczeń</b> — art. 6 ust. 1 lit. f RODO,
      czyli nasz prawnie uzasadniony interes.</li>
</ul>
<p>Podanie danych jest dobrowolne, ale bez numeru telefonu nie jesteśmy w stanie podać wyceny.</p>

<h2>4. Jak długo trzymamy dane</h2>
<ul>
  <li>Zgłoszenie, które nie skończyło się sprzedażą — <b>12 miesięcy</b> od ostatniego kontaktu.</li>
  <li>Dane z zawartej umowy — <b>5 lat</b> licząc od końca roku podatkowego, w którym doszło do transakcji;
      tak długo wymagają tego przepisy podatkowe.</li>
  <li>Dane przetwarzane na podstawie naszego uzasadnionego interesu — do upływu terminu przedawnienia roszczeń
      albo do czasu skutecznego sprzeciwu.</li>
</ul>

<h2>5. Komu przekazujemy dane</h2>
<p>Nie sprzedajemy danych i nie przekazujemy ich do celów marketingowych. Dostęp do nich mają wyłącznie:</p>
<ul>
  <li>dostawca poczty elektronicznej, na którą trafia zgłoszenie z formularza;</li>
  <li>usługa <b>FormSubmit</b> (formsubmit.co), która przekazuje treść formularza na naszą skrzynkę;</li>
  <li><b>GitHub Pages</b> — firma hostująca tę stronę;</li>
  <li>biuro rachunkowe i — w razie potrzeby — kancelaria prawna;</li>
  <li>organy publiczne, jeśli wymagają tego przepisy.</li>
</ul>
<p>Część z tych podmiotów ma serwery poza Europejskim Obszarem Gospodarczym. Przekazanie danych
odbywa się wtedy na podstawie standardowych klauzul umownych zatwierdzonych przez Komisję Europejską.</p>

<h2>6. Twoje prawa</h2>
<p>Masz prawo dostępu do swoich danych, ich sprostowania, usunięcia, ograniczenia przetwarzania,
przenoszenia oraz wniesienia sprzeciwu wobec przetwarzania opartego na naszym uzasadnionym interesie.
Wystarczy napisać na <a href="mailto:{MAIL}">{MAIL}</a> albo zadzwonić pod {TEL}.
Odpowiadamy najpóźniej w ciągu miesiąca.</p>
<p>Jeśli uznasz, że przetwarzamy dane niezgodnie z prawem, możesz złożyć skargę do Prezesa Urzędu
Ochrony Danych Osobowych, ul. Stawki 2, 00-193 Warszawa.</p>

<h2>7. Ciasteczka i statystyki</h2>
<p>Strona nie używa ciasteczek reklamowych ani śledzących. Korzysta wyłącznie z pamięci przeglądarki
(<i>sessionStorage</i>), żeby ekran powitalny z logo pokazał się raz na wizytę, a nie przy każdym przejściu
między podstronami. Ta informacja nie opuszcza Twojego urządzenia.</p>
<p>Kroje pisma pobierane są z serwerów Google Fonts — Google odnotowuje przy tym adres IP urządzenia,
co jest technicznie konieczne, żeby wysłać plik czcionki.</p>

<h2>8. Automatyczne decyzje</h2>
<p>Widełki, które pokazuje kalkulator na stronie, wylicza skrypt na podstawie rocznika, przebiegu,
paliwa i stanu auta. To jest wyłącznie orientacyjne oszacowanie, a nie decyzja wywołująca wobec Ciebie
skutki prawne. Ostateczną kwotę zawsze podaje człowiek po obejrzeniu auta.</p>

<h2>9. Zmiany polityki</h2>
<p>Jeśli zmienimy zasady, zaktualizujemy tę stronę i zmienimy datę na górze. Wersja obowiązująca
to zawsze ta opublikowana pod adresem tinaskupaut.pl/polityka-prywatnosci/.</p>

</div></section></div>
"""

DZIEKUJEMY_TYTUL = u'Zgłoszenie przyjęte | TINA Skup Aut'
DZIEKUJEMY_OPIS = u'Dziękujemy za zgłoszenie auta do wyceny. Oddzwaniamy zwykle w kwadrans w godzinach pracy.'

DZIEKUJEMY = u"""
<div class="chero">
  <div class="w">
    <p class="crumb"><a href="{ROOT}">TINA</a> / Zgłoszenie przyjęte</p>
    <h1>Zgłoszenie <span class="gold">przyjęte</span></h1>
    <p class="lede" id="dz-lede">Oddzwaniamy zwykle w kwadrans w godzinach pracy.</p>
    <div class="acts"><a class="btn g" href="tel:+48693649549">Zadzwoń teraz: 693 649 549</a></div>
  </div>
</div>
<div class="w"><section><div class="dziek">
  <p class="eyebrow" id="dz-etykieta" hidden>Orientacyjne widełki z kalkulatora</p>
  <p class="kwota" id="dz-kwota" hidden></p>
  <p style="margin-top:18px;color:var(--muted);font-size:16.5px">
    To wyliczenie z danych rynkowych, a nie oferta. Widełki potwierdzamy przez telefon,
    ostateczną kwotę po obejrzeniu auta — i nie zmieniamy jej przy podpisywaniu umowy.</p>
  <p style="margin-top:16px;color:var(--muted);font-size:16.5px">
    Jeśli spieszysz się ze sprzedażą, nie czekaj na nasz telefon — zadzwoń pod
    <a href="tel:+48693649549" style="color:var(--g4);font-weight:700">693 649 549</a>
    albo <a href="tel:+48692493797" style="color:var(--g4);font-weight:700">692 493 797</a>,
    wycenimy auto od ręki.</p>
  <div class="acts">
    <a class="btn k" href="{ROOT}">Wróć na stronę główną</a>
    <a class="btn o" style="color:var(--ink);border-color:var(--line)" href="{ROOT}realizacje/">Zobacz, co odkupiliśmy</a>
  </div>
</div></section></div>
<script>
(function(){
  var q=new URLSearchParams(location.search);
  var a=q.get('a'), w=q.get('w'), t=q.get('t');
  var l=document.getElementById('dz-lede');
  if(a||t){
    l.textContent=(a?a+' — o':'O')+'ddzwaniamy'+(t?' pod '+t:'')+', zwykle w kwadrans w godzinach pracy.';
  }
  if(w){
    document.getElementById('dz-etykieta').hidden=false;
    var k=document.getElementById('dz-kwota'); k.hidden=false; k.textContent=w;
  }
})();
</script>
"""

CZTERY_TYTUL = u'Nie ma takiej strony | TINA Skup Aut'
CZTERY_OPIS = u'Pod tym adresem nic nie ma. Wróć na stronę główną albo zadzwoń — wycenimy auto przez telefon.'

CZTERY = u"""
<div class="chero">
  <div class="w">
    <p class="crumb"><a href="{ROOT}">TINA</a> / Błąd 404</p>
    <h1>Pod tym adresem <span class="gold">nic nie ma</span></h1>
    <p class="lede">Strona została przeniesiona albo adres ma literówkę. Auto wycenimy też przez telefon —
      to zwykle szybsze niż szukanie po stronie.</p>
    <div class="acts">
      <a class="btn g" href="tel:+48693649549">Zadzwoń: 693 649 549</a>
      <a class="btn o" href="{ROOT}">Strona główna</a>
    </div>
  </div>
</div>
<div class="w"><section><div class="proza">
  <h2>Czego zwykle szukają</h2>
  <ul>
    <li><a href="{ROOT}skup/">Skup aut za gotówkę</a> — każda marka, rocznik i stan.</li>
    <li><a href="{ROOT}wycena/">Wycena auta online</a> — widełki na ekranie w kilkanaście minut.</li>
    <li><a href="{ROOT}sprzedaz/">Samochody używane</a> — auta sprawdzone przed sprzedażą.</li>
    <li><a href="{ROOT}miasta/">Miasta, w których jeździmy</a> — całe Mazowsze.</li>
    <li><a href="{ROOT}pytania/">Pytania i odpowiedzi</a> — dokumenty, laweta, brak OC, leasing.</li>
  </ul>
</div></section></div>
"""


def podstaw(t, root):
    return (t.replace('{ROOT}', root)
             .replace('{FIRMA}', FIRMA).replace('{ADRES}', ADRES)
             .replace('{NIP}', NIP).replace('{MAIL}', MAIL).replace('{TEL}', TEL))


STRONY = [
    # (sciezka pliku, adres kanoniczny, root, tytul, opis, tresc)
    ('polityka-prywatnosci/index.html', 'polityka-prywatnosci/', '../',
     POLITYKA_TYTUL, POLITYKA_OPIS, POLITYKA),
    ('dziekujemy/index.html', 'dziekujemy/', '../',
     DZIEKUJEMY_TYTUL, DZIEKUJEMY_OPIS, DZIEKUJEMY),
    ('404.html', None, '/',
     CZTERY_TYTUL, CZTERY_OPIS, CZTERY),
]
