# TINA Skup Aut — strona

**TINA Rafał Kocimski** · skup aut i komis, Mazowsze
NIP 522-234-50-44 · REGON 142742668 · Przyszła 2B, 96-513 Kozłów Biskupi · firma od 2011

Docelowy adres: **tinaskupaut.pl** · podgląd: https://impulseo-pl.github.io/tina-kupno-sprzedaz/

---

## Jak to jest zbudowane

Statyczny HTML, bez build-stepu. Każda podstrona to osobny plik, który edytuje się wprost —
otwierasz w edytorze, zapisujesz, `git push`. Nic się nie generuje, nic nie trzeba instalować.

```
index.html                 strona główna
skup.html                  skup aut
sprzedaz.html              komis i sprzedaż
wycena.html                formularz wyceny + jak liczymy
realizacje.html            galeria odkupionych aut (18 zdjęć klienta)
pytania.html               FAQ
polityka-prywatnosci.html
dziekujemy.html            po wysłaniu formularza
404.html
assets/styles.css          jeden arkusz dla całej strony
assets/app.js              kalkulator widełek, formularz, galeria, animacje (10 kB)
img/                       zdjęcia klienta, logo, og.jpg
```

Nagłówek i stopka są powielone w każdym pliku — zmiana w nawigacji oznacza poprawkę
we wszystkich podstronach (jest ich osiem).

## Co strona ma

- **Kalkulator widełek** — formularz krokowy liczy orientacyjną kwotę na żywo z rocznika,
  przebiegu, paliwa, stanu i zaznaczonych cech. ⚠️ **Marka i model NIE wpływają na wynik** —
  algorytm jest do skalibrowania na prawdziwych danych klienta.
- **Formularz** — wysyłka przez FormSubmit na `rafal.kocimski@o2.pl`, ze zdjęciami auta
  w załączniku, zgodą RODO i przekierowaniem na stronę podziękowania z wyliczonymi widełkami.
- Galeria z lightboxem, tabela dokumentów do sprzedaży, FAQ.
- Dane strukturalne `AutoDealer` na każdej stronie, `FAQPage` tam, gdzie są pytania.
- `noindex` na wszystkich podstronach + `robots.txt` z `Disallow: /` — **to demo**.

## ⛔ Zanim strona pójdzie na tinaskupaut.pl

1. **Zdjąć noindex** ze wszystkich podstron i przestawić `robots.txt` na `Allow: /`
   (plus wpis `Sitemap:`). Bez tego Google jej nie pokaże.
2. **Aktywować FormSubmit.** Pierwsze zgłoszenie wysyła na `rafal.kocimski@o2.pl` maila
   z linkiem aktywacyjnym — dopóki ktoś w niego nie kliknie, żaden lead nie dojdzie.
   Docelowo: przenieść formularz na Cloudflare Pages Function + Resend, jak u reszty klientów.
3. **Przenieść na Cloudflare Pages** i podpiąć domenę (dziś `tinaskupaut.pl` wskazuje na OVH).
   Canonical i `sitemap.xml` są już zapisane pod czyste adresy bez `.html` — CF robi z tego
   przekierowanie 308 samo, ale **linki wewnętrzne w plikach zostają z `.html`**.
4. **Zgłosić w Google Search Console** i wysłać `sitemap.xml` — dopiero po punkcie 3.

## Do uzupełnienia od klienta

- **godziny pracy** — brakuje ich w stopce i w danych strukturalnych
- **ile aut łącznie odkupili i typowy czas od zgłoszenia do odbioru** — pasek pod heroem
  („480+ odkupionych aut", „24 h do odbioru") stoi dziś na liczbach, których nikt nie potwierdził
- **za ile realnie kupują** — 5–10 przykładów do skalibrowania kalkulatora
- **auta na sprzedaż**: zdjęcia, roczniki, przebiegi, ceny — sekcja komisu świeci pustką
- **wizytówka Google**: link, ocena, liczba opinii + zgoda na przepisanie 3–5 opinii
- **logo w wektorze** (SVG / AI / PDF) — mamy JPG, sam znak ma 309×121 px
- czy adres Przyszła 2B ma być publiczny (decyduje o wizytówce Google)

## Notatki techniczne

- Zdjęcia przyszły z WhatsAppa i są już mocno skompresowane — konwersja do WebP dawała pliki
  **cięższe** od źródłowych JPEG-ów, więc jej nie robimy.
- Analytics nie jest podpięty. Jeśli ma być, trzeba dopisać go do polityki prywatności.
- Historia: do 13.09.2026 strona stała na własnym generatorze (SPA + Playwright prerenderujący
  54 podstrony). Wycięty razem z podstronami miast, dzielnic, marek i porównania.

---
Realizacja: [Impulseo](https://impulseo.pl)
