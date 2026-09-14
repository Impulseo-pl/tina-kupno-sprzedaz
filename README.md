# TINA Skup Aut — strona

**TINA Rafał Kocimski** · skup i sprzedaż aut, całe Mazowsze · **to nie jest komis**
NIP 522-234-50-44 · REGON 142742668 · Przyszła 2B, 96-513 Kozłów Biskupi · firma od 2011

Docelowy adres: **tinaskupaut.pl**
Podgląd roboczy: **https://tina-skup-aut.pages.dev** (CF Pages, `git push` = deploy)
Stary link dla klienta: https://impulseo-pl.github.io/tina-kupno-sprzedaz/

---

## Jak to jest zbudowane

Statyczny HTML, bez build-stepu. Każda podstrona to osobny plik, który edytuje się wprost —
otwierasz w edytorze, zapisujesz, `git push`. Nic się nie generuje, nic nie trzeba instalować.

```
index.html                 strona główna
skup.html                  skup aut
sprzedaz.html              sprzedaż aut
wycena.html                formularz wyceny
realizacje.html            galeria odkupionych aut (18 zdjęć klienta)
pytania.html               FAQ
polityka-prywatnosci.html
dziekujemy.html            po wysłaniu formularza
404.html
assets/styles.css          jeden arkusz dla całej strony
assets/app.js              formularz, galeria, animacje (11 kB)
img/                       zdjęcia klienta, logo, og.jpg
```

Nagłówek i stopka są powielone w każdym pliku — zmiana w nawigacji oznacza poprawkę
we wszystkich podstronach (jest ich osiem).

## Gdzie to stoi

Projekt Cloudflare Pages **`tina-skup-aut`**, git connection z tym repo, branch `main`,
**bez build-stepu** (pusty build command, output = katalog główny). Push na `main` idzie na żywo.
GitHub Pages nadal działa równolegle, bo link do niego siedzi w CRM u klienta.

Strona jest zamknięta przed Google: `noindex` na wszystkich podstronach + `robots.txt`
z `Disallow: /`. Tak zostaje do dnia go-live.

## Stan treści

⚠️ **Treść jest do napisania od nowa.** To, co dziś stoi na stronie, zostało po wersji
z 13.09 i nie jest zatwierdzone przez klienta. Plan architektury i treści (16 podstron,
research Senuto, analiza konkurencji):
https://claude.ai/code/artifact/e317aa7a-0076-4db4-aba5-318005e138d0

Co wypada przy przebudowie:
- **kalkulator widełek** — klient nie chce widełek ani kalkulatora, ma być sam formularz;
  wycena dopiero po zgłoszeniu, przez człowieka
- **„480+ odkupionych aut" i „24 h do odbioru"** — liczby, których nikt nigdy nie potwierdził
- **słowo „komis"** w opisie usług — firma komisu nie prowadzi

## Ustalenia z klientem (14.09) — tak piszemy treść

Całe Mazowsze, baza Sochaczew, **7 dni w tygodniu**, laweta gratis, **przyjazd tego samego dnia**.
Proces: telefon albo formularz → klient sam podaje oczekiwaną kwotę → dogadanie ceny przez
telefon → przyjazd → oględziny wizualne i krótka jazda, bez mechaników i rzeczoznawców →
**15 minut, gotówka, auto na lawetę**.

- **Kupują:** osobowe, dostawcze, hybrydy, powypadkowe i rozbite — tylko takie, które da się
  jeszcze odratować.
- **Nie kupują:** kampery, przyczepy, motocykle, **elektryki**, auta tylko na części.
  **Nie złomują i nie wystawiają zaświadczeń o demontażu.**

## ⛔ Zanim strona pójdzie na tinaskupaut.pl

1. **Zdjąć noindex** ze wszystkich podstron i przestawić `robots.txt` na `Allow: /`
   (plus wpis `Sitemap:`). Bez tego Google jej nie pokaże.
2. **Zamienić linki wewnętrzne z `.html` na czyste adresy** (`href="skup.html"` → `href="/skup"`).
   Canonical i `sitemap.xml` są już czyste; dziś CF robi z `.html` przekierowanie 308 samo,
   ale to zbędny skok przy każdym kliknięciu. Ta zamiana zabija wersję na GitHub Pages,
   więc robi się ją razem z wyłączeniem GH Pages.
3. **Przenieść formularz** z FormSubmit na Cloudflare Pages Function + Resend, jak u reszty
   klientów. Dziś mail klienta siedzi jawnie w HTML-u.
4. **Podpiąć domenę** (`tinaskupaut.pl` wskazuje dziś na parking OVH) — kolejność z runbooka:
   DNSSEC → NS → custom domain → `www` → analityka → GSC.
5. **Zgłosić w Google Search Console** i wysłać `sitemap.xml` — dopiero po punkcie 4.

## Do uzupełnienia od klienta

Twarde blokady:
- **potwierdzenie danych firmy** — czy NIP, REGON i adres wyżej są aktualne
- **czy adres Przyszła 2B ma być publiczny** (decyduje o wizytówce Google)
- **główny numer telefonu** (są dwa: 693 649 549 i 692 493 797) i **mail na zgłoszenia**
- **godziny pracy** przy „7 dni w tygodniu" — konkretne od–do

Reszta:
- dolna granica: od jakiej kwoty i od jakiego rocznika w ogóle jadą
- czy gotówka obowiązuje też przy aucie za 40–50 tys.
- deklarowany czas oddzwonienia po wysłaniu formularza
- auta na sprzedaż: ile sztuk, gdzie są wystawione (OTOMOTO / OLX / FB), gdzie się je ogląda
- ile aut miesięcznie realnie odkupują — jedyne liczby, które mają prawo trafić na stronę
- wizytówka Google: dostęp albo zgoda na założenie + zgoda na przepisanie 3–5 opinii
- zdjęcia firmowe (laweta, odbiór auta) i **logo w wektorze** — mamy JPG 309×121 px
- ⚠️ klient mówi „od 1999", a firma jest zarejestrowana od 2011 — na stronie ma być
  „w motoryzacji od 1999", nie „firma od 1999"

## Notatki techniczne

- Zdjęcia przyszły z WhatsAppa i są już mocno skompresowane — konwersja do WebP dawała pliki
  **cięższe** od źródłowych JPEG-ów, więc jej nie robimy.
- Analytics nie jest podpięty. Jeśli ma być, trzeba dopisać go do polityki prywatności.
- Historia: do 13.09.2026 strona stała na własnym generatorze (SPA + Playwright prerenderujący
  54 podstrony). Wycięty razem z podstronami miast, dzielnic, marek i porównania.
- Pułapka z tamtego cięcia: kurtyna powitalna (`.intro-on` na `<html>`) była zdejmowana przez
  router — po wycięciu SPA klasa zostawała na zawsze i ukrywała całą nawigację.

---
Realizacja: [Impulseo](https://impulseo.pl)
