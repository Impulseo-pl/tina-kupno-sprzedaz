/**
 * Cloudflare Pages Function — odbiera formularze TINA i wysyła je mailem przez Resend.
 *
 * Obsługuje oba formularze na stronie:
 *   rodzaj=wycena  — kreator „sprzedaj auto” (#wf), razem ze zdjęciami
 *   rodzaj=szukam  — zapytanie o auto do kupienia (#zf)
 *
 * Zmienne środowiskowe (Pages → Settings → Environment variables):
 *   RESEND_API_KEY  — klucz API z resend.com
 *   MAIL_OD         — nadawca na domenie zweryfikowanej w Resend
 *   MAIL_DO         — odbiorca zgłoszeń
 *   MAIL_KOPIA      — opcjonalnie: adres kopii (DW)
 *
 * Bez tych zmiennych funkcja zwraca 503, a formularz pokazuje numer telefonu —
 * zgłoszenie nie ginie po cichu.
 */

const MAX_ZDJEC = 5;
const MAX_ZDJECIE = 8 * 1024 * 1024;
const MAX_SUMA = 15 * 1024 * 1024;     // limit Resendu na całą wiadomość
const LIMIT_POLA = 400;
const LIMIT_OPISU = 4000;

/* Pola sterujące: nie trafiają do treści maila. */
const POMIN = new Set(['rodzaj', 'skad', 'firma', '_next', 'attachment', 'zdjecia[]']);

function odpowiedz(dane, status) {
  return new Response(JSON.stringify(dane), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}

function escapuj(tekst) {
  return String(tekst || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/* btoa() nie przyjmuje tablicy bajtów, a rozwinięcie kilku MB przez spread
   przepełnia stos — stąd sklejanie po kawałku. */
function doBase64(bufor) {
  const bajty = new Uint8Array(bufor);
  const KAWALEK = 0x8000;
  let tekst = '';
  for (let i = 0; i < bajty.length; i += KAWALEK) {
    tekst += String.fromCharCode.apply(null, bajty.subarray(i, i + KAWALEK));
  }
  return btoa(tekst);
}

function czystaNazwa(nazwa) {
  return String(nazwa || 'zdjecie.jpg').replace(/[\\/\r\n\t]/g, '_').slice(0, 120);
}

function human(bajty) {
  return bajty < 1048576
    ? Math.max(1, Math.round(bajty / 1024)) + ' kB'
    : (bajty / 1048576).toFixed(1).replace('.', ',') + ' MB';
}

export async function onRequestPost({ request, env }) {
  let dane;
  try {
    dane = await request.formData();
  } catch (e) {
    return odpowiedz({ blad: 'Nie udało się odczytać formularza' }, 400);
  }

  /* Pułapka na boty: pole ukryte stylem, człowiek go nie wypełni.
     Udajemy sukces, żeby bot nie próbował dalej. */
  if (dane.get('firma')) return odpowiedz({ ok: true }, 200);

  const rodzaj = String(dane.get('rodzaj') || 'wycena');
  const skad = String(dane.get('skad') || '').slice(0, 60);

  /* Zbieramy wszystko, co formularz przysłał, w kolejności pól.
     Dzięki temu dodanie pola w .astro nie wymaga ruszania tej funkcji. */
  const wiersze = [];
  const wartosci = {};
  for (const [klucz, wartosc] of dane.entries()) {
    if (POMIN.has(klucz) || typeof wartosc !== 'string') continue;
    const czysty = wartosc.trim().slice(0, klucz === 'Dodatkowe informacje' ? LIMIT_OPISU : LIMIT_POLA);
    if (!czysty) continue;
    if (wartosci[klucz]) {
      wartosci[klucz] += ', ' + czysty;           // checkboxy o tej samej nazwie
    } else {
      wartosci[klucz] = czysty;
      wiersze.push(klucz);
    }
  }

  const telefon = wartosci['Telefon'];
  if (!telefon) return odpowiedz({ blad: 'Podaj numer telefonu' }, 400);
  if (!wartosci['Zgoda']) return odpowiedz({ blad: 'Potrzebna jest zgoda na kontakt' }, 400);

  const email = wartosci['Email'] || '';
  const imie = wartosci['Imie'] || '';

  const zalaczniki = [];
  let suma = 0;
  for (const plik of dane.getAll('zdjecia[]')) {
    if (typeof plik === 'string' || !plik || !plik.size) continue;
    if (zalaczniki.length >= MAX_ZDJEC) {
      return odpowiedz({ blad: 'Maksymalnie ' + MAX_ZDJEC + ' zdjęć' }, 413);
    }
    if (plik.size > MAX_ZDJECIE) {
      return odpowiedz({ blad: 'Zdjęcie „' + plik.name + '” jest większe niż 8 MB' }, 413);
    }
    suma += plik.size;
    if (suma > MAX_SUMA) {
      return odpowiedz({
        blad: 'Zdjęcia ważą razem ' + human(suma) + ', a zmieści się 15 MB. Usuń jedno z nich.',
      }, 413);
    }
    zalaczniki.push({ filename: czystaNazwa(plik.name), content: doBase64(await plik.arrayBuffer()) });
  }

  if (!env.RESEND_API_KEY || !env.MAIL_DO || !env.MAIL_OD) {
    return odpowiedz({ blad: 'Wysyłka maili nie jest jeszcze skonfigurowana' }, 503);
  }

  const naglowek = rodzaj === 'szukam'
    ? 'Zapytanie o samochód do kupienia'
    : 'Nowe zgłoszenie do wyceny';

  /* E-mail jest nieobowiązkowy. Bez niego „odpowiedz” poleci w próżnię —
     mówimy o tym wprost, zamiast pozwolić komuś czekać na odpowiedź. */
  const bezMaila =
    '<p style="margin-top:24px;padding:12px 14px;border-left:3px solid #d4af37;background:#fbf6e6">'
    + '<strong>Zgłaszający nie podał adresu e-mail.</strong><br>'
    + 'Odpowiedź na tę wiadomość do niego nie dotrze — trzeba oddzwonić na ' + escapuj(telefon) + '.'
    + '</p>';

  const tresc = [
    '<h2 style="font-family:Arial,sans-serif">' + naglowek + '</h2>',
    '<p style="font-family:Arial,sans-serif;color:#666">Formularz na podstronie: ' + escapuj(skad || 'nieznana') + '</p>',
    '<table cellpadding="6" style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:15px">',
    wiersze.map((k) => {
      const w = k === 'Telefon'
        ? '<a href="tel:' + escapuj(wartosci[k]) + '">' + escapuj(wartosci[k]) + '</a>'
        : escapuj(wartosci[k]).replace(/\n/g, '<br>');
      return '<tr><td style="border-bottom:1px solid #eee;color:#666;white-space:nowrap">'
        + escapuj(k) + '</td><td style="border-bottom:1px solid #eee"><strong>' + w + '</strong></td></tr>';
    }).join(''),
    '</table>',
    '<p style="font-family:Arial,sans-serif"><strong>Zdjęcia:</strong> '
      + (zalaczniki.length ? zalaczniki.length + ' (' + human(suma) + ')' : 'brak') + '</p>',
    email ? '' : bezMaila,
  ].join('\n');

  const auto = [wartosci['Marka'], wartosci['Model'], wartosci['Rok produkcji']].filter(Boolean).join(' ');
  const temat = (rodzaj === 'szukam' ? 'Szukam auta' : 'Wycena')
    + ': ' + (auto || wartosci['Szukane auto'] || 'zgłoszenie')
    + (imie ? ', ' + imie : '') + ', ' + telefon;

  const wyslij = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + env.RESEND_API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: env.MAIL_OD,
      to: [env.MAIL_DO],
      cc: env.MAIL_KOPIA ? [env.MAIL_KOPIA] : undefined,
      reply_to: email || undefined,
      subject: temat.slice(0, 180),
      html: tresc,
      attachments: zalaczniki.length ? zalaczniki : undefined,
    }),
  });

  if (!wyslij.ok) {
    const tekst = await wyslij.text();
    console.log('Resend odrzucił wysyłkę', wyslij.status, tekst.slice(0, 400));
    return odpowiedz({ blad: 'Nie udało się wysłać wiadomości' }, 502);
  }

  return odpowiedz({ ok: true }, 200);
}
