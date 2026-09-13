# TINA Skup Aut — strona

**TINA Rafał Kocimski** · skup aut i komis, Mazowsze
NIP 522-234-50-44 · REGON 142742668 · Przyszła 2B, 96-513 Kozłów Biskupi · firma od 2011

Docelowy adres: **tinaskupaut.pl** · podgląd: https://impulseo-pl.github.io/tina-kupno-sprzedaz/

---

## Jak to jest zbudowane

Treść mieszka w **jednym pliku `_src/app.html`** — to aplikacja, która składa wszystkie
podstrony z tablic `CITIES`, `DISTRICTS`, `BRANDS` i `TABS`. Otwarta bezpośrednio w przeglądarce
działa jak podgląd z adresami po hashu.

`_src/build.py` otwiera ten plik w przeglądarce, zdejmuje gotowy HTML z każdego adresu
i zapisuje jako **osobny plik z własnym katalogiem**. Dzięki temu Google widzi 54 strony,
a nie jedną — i każda ma swój `<title>`, opis, `canonical` i dane strukturalne w źródle,
bez czekania na JavaScript.

```
python -m pip install playwright
python -m playwright install chromium
python _src/build.py
```

Generator sam sprawdza, czy każda podstrona dostała własny tytuł, i przerywa, jeśli nie.

⚠️ **Nie edytuj plików `index.html` w katalogach ani `assets/*`** — są nadpisywane przy
każdym budowaniu. Zmiany wprowadzasz w `_src/app.html` (treść, style, skrypt)
albo w `_src/proste.py` (polityka prywatności, podziękowanie, 404) i budujesz od nowa.

```
_src/app.html      cała treść, style i skrypt — jedyne miejsce do edycji
_src/build.py      generator stron + sitemap.xml
_src/proste.py     polityka prywatności, strona podziękowania, 404
assets/            styles.css i app.js wycięte z app.html (generowane)
img/               zdjęcia od klienta, logo, og.jpg
<slug>/index.html  54 wygenerowane podstrony
```

## Co strona ma

- **Kalkulator widełek** — formularz krokowy liczy orientacyjną kwotę na żywo.
  Algorytm nadal do skalibrowania na prawdziwych danych klienta.
- **Szybka wycena w hero** — trzy pola, przenoszą dane do pełnego formularza.
- **54 osobne podstrony:** 8 zakładek, 19 miast, 18 dzielnic Warszawy, 8 grup marek,
  polityka prywatności, podziękowanie, 404.
- **Formularz podłączony** — wysyłka przez FormSubmit na `rafal.kocimski@o2.pl`,
  ze zdjęciami auta w załączniku, zgodą RODO i przekierowaniem na stronę podziękowania
  z wyliczonymi widełkami.
- Tabela porównawcza skup / ogłoszenie / komis, ekran powitalny z logo, galeria z lightboxem.
- Dane strukturalne: `AutoDealer` z pełnym adresem, `FAQPage`, `BreadcrumbList`.
- `sitemap.xml`, `robots.txt`, `canonical` na każdej stronie, `og:image` 1200×630.

## ⛔ Zanim strona pójdzie na tinaskupaut.pl

1. **Aktywować FormSubmit.** Pierwsze zgłoszenie z formularza wysyła na
   `rafal.kocimski@o2.pl` maila z linkiem aktywacyjnym. Dopóki ktoś w niego nie kliknie,
   żaden lead nie dojdzie. **Wysłać testowe zgłoszenie i poprosić Rafała o kliknięcie.**
2. **Przełączyć DNS.** Domena `tinaskupaut.pl` jest zarejestrowana i wskazuje dziś
   na OVH (213.186.33.5). Żeby ruszyła z GitHub Pages, trzeba w panelu domeny ustawić
   rekordy A na `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   oraz CNAME `www` → `impulseo-pl.github.io`, a w repo dodać plik `CNAME` z treścią
   `tinaskupaut.pl` i włączyć *Enforce HTTPS*.
   **Plik `CNAME` dokładamy dopiero po zmianie DNS** — wcześniej zepsuje podgląd.
3. **Zgłosić stronę w Google Search Console** i wysłać `sitemap.xml` — dopiero po punkcie 2.
4. `canonical` i `sitemap.xml` wskazują na `tinaskupaut.pl`. Gdyby strona miała zostać
   na innym adresie, zmienić stałą `SITE` w `_src/build.py` i przebudować.

## Do uzupełnienia od klienta

- **godziny pracy** — jedyna luka w stopce i w danych strukturalnych
- **wizytówka Google**: link, ocena, liczba opinii + zgoda na przepisanie 3–5 opinii
  (sekcja opinii jest na razie zdjęta ze strony, bo nie zmyślamy)
- **auta na sprzedaż**: zdjęcia, roczniki, przebiegi, ceny — sekcja komisu świeci pustką
- **za ile realnie kupują** — 5–10 przykładów do skalibrowania kalkulatora
- ile aut łącznie odkupili i typowy czas od zgłoszenia do odbioru
- **logo w wektorze** (SVG / AI / PDF) — mamy JPG, sam znak ma 309×121 px
- czy adres Przyszła 2B ma być publiczny (decyduje o wizytówce Google)

## Notatki techniczne

- Zdjęcia przyszły z WhatsAppa i są już mocno skompresowane — konwersja do WebP dawała
  pliki **cięższe** od źródłowych JPEG-ów, więc jej nie robimy. Zeszliśmy tylko z jakością
  dwóch heroów, bo i tak leżą pod ciemną zasłoną.
- Analytics nie jest podpięty. Jeśli ma być, trzeba dopisać go do polityki prywatności.

---
Realizacja: [Impulseo](https://impulseo.pl)
