# TINA Skup Aut — strona

**TINA Rafał Kocimski** · skup i sprzedaż aut, całe Mazowsze · **to nie jest komis**
NIP 522-234-50-44 · REGON 142742668 · Przyszła 2B, 96-513 Kozłów Biskupi · firma od 2011

Docelowy adres: **tinaskupaut.pl**
Podgląd roboczy: **https://tina-skup-aut.pages.dev** (CF Pages, `git push` = deploy)
⚠️ Stary link na GitHub Pages **już nie działa** — do podmiany w CRM na adres Cloudflare.

---

## Jak to jest zbudowane

**Astro** — generator stron statycznych. Ten sam stack co strona firmowa impulseo.pl, więc
konwencje są identyczne: `build.format: 'file'`, budowanie przez `bash build.sh`, katalog `dist`.

```
src/pages/*.astro        jedna podstrona = jeden plik
src/layouts/Base.astro   nagłówek, nawigacja, stopka, pasek CTA — w jednym miejscu
src/components/          powtarzalne bloki: formularz, kroki, co kupujemy, FAQ, CTA
src/dane/firma.ts        dane firmy, menu, schema.org — zmiana numeru = jedna edycja
src/pages/sitemap.xml.ts sitemapa z jawnej listy adresów
public/assets/           styles.css i app.js (kopiowane bez zmian)
public/img/              zdjęcia klienta, logo, og.jpg
public/robots.txt
```

Praca na co dzień: `npm run dev` (podgląd na żywo), `npm run build` (to samo, co robi Cloudflare).
Pierwsze uruchomienie wymaga `npm install`.

**Dlaczego Astro, a nie płaskie pliki .html:** nagłówek i stopka były skopiowane w każdym pliku,
więc zmiana jednego linku w menu oznaczała szesnaście edycji. Przy blogu i kolejnych podstronach
miejscowości byłoby tego kilkadziesiąt. Astro robi z tego jeden layout.

⚠️ **To nie zwalnia z myślenia o treści.** Szablon ułatwia produkowanie podstron miejscowości
hurtem — czyli dokładnie to, co dało poprzedniej wersji 37 doorway pages różniących się w 4%.
Zasada zostaje: **jedna miejscowość = jeden własny tekst**, dopisywany etapami, nigdy z szablonu.

## Podstrony

| Plik | Adres | Fraza główna |
|---|---|---|
| `index.astro` | `/` | skup aut za gotówkę, skup aut mazowieckie |
| `ile-placimy.astro` | `/ile-placimy` | skup aut cennik |
| `auta-uszkodzone-powypadkowe.astro` | `/auta-uszkodzone-powypadkowe` | skup aut uszkodzonych, powypadkowych |
| `skup-aut-dostawczych.astro` | `/skup-aut-dostawczych` | skup aut dostawczych |
| `skup-aut-sochaczew.astro` | `/skup-aut-sochaczew` | skup aut sochaczew |
| `skup-aut-warszawa.astro` | `/skup-aut-warszawa` | skup aut warszawa |
| `komis-czy-skup-aut.astro` | `/komis-czy-skup-aut` | komis czy skup, ile bierze komis |
| `jak-sprzedac-auto.astro` | `/jak-sprzedac-auto` | jak sprzedać auto, zgłoszenie zbycia |
| `sprzedaz.astro` | `/sprzedaz` | samochody na sprzedaż |
| `wycena.astro` | `/wycena` | wycena auta — cel konwersji |
| `o-nas.astro`, `realizacje.astro`, `pytania.astro`, `kontakt.astro` | — | wsparcie, zaufanie |
| `polityka-prywatnosci.astro`, `dziekujemy.astro`, `404.astro` | — | wymogi i obsługa |

## Gdzie to stoi

Projekt Cloudflare Pages **`tina-skup-aut`**, git connection z tym repo, branch `main`,
budowanie `bash build.sh` → `dist`. Push na `main` idzie na żywo: **https://tina-skup-aut.pages.dev**

GitHub Pages zostało **wyłączone** przy przejściu na Astro — serwowało katalog główny repo, w którym
po migracji nie ma już gotowego HTML-a. Link w CRM trzeba podmienić na adres Cloudflare.

Strona jest zamknięta przed Google: `noindex` w `Base.astro` + `robots.txt` z `Disallow: /`.
Tak zostaje do dnia go-live.

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

1. **Zdjąć noindex** — jedna linijka w `src/layouts/Base.astro` — i przestawić `public/robots.txt`
   na `Allow: /` wraz z odkomentowaniem wpisu `Sitemap:`. Bez tego Google strony nie pokaże.
2. **Przenieść formularz** z FormSubmit na Cloudflare Pages Function + Resend, jak u reszty
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
- **deklarowany czas oddzwonienia** — na `/dziekujemy` stoi dziś „zwykle tego samego dnia”,
  przyjęte na podstawie tego, że firma pracuje 7 dni w tygodniu i przyjeżdża tego samego dnia.
  Do potwierdzenia przez klienta przed go-live
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
