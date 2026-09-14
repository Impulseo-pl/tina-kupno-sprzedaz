/* Sitemapa budowana z jawnej listy — chcemy wiedziec, co do niej wchodzi,
   zamiast wrzucac wszystko, co akurat lezy w src/pages. */
import { SITE } from '../dane/firma';

const STRONY: [string, string][] = [
  // [sciezka, priorytet]
  ['/', '1.0'],
  ['/ile-placimy', '0.9'],
  ['/auta-uszkodzone-powypadkowe', '0.9'],
  ['/skup-aut-dostawczych', '0.8'],
  ['/skup-aut-sochaczew', '0.9'],
  ['/skup-aut-warszawa', '0.9'],
  ['/komis-czy-skup-aut', '0.7'],
  ['/jak-sprzedac-auto', '0.7'],
  ['/wycena', '0.8'],
  ['/sprzedaz', '0.7'],
  ['/realizacje', '0.6'],
  ['/o-nas', '0.5'],
  ['/pytania', '0.6'],
  ['/kontakt', '0.6'],
  ['/polityka-prywatnosci', '0.2'],
];

export function GET() {
  const data = new Date().toISOString().slice(0, 10);
  const wpisy = STRONY.map(
    ([s, p]) =>
      `  <url><loc>${SITE}${s === '/' ? '/' : s}</loc><lastmod>${data}</lastmod><priority>${p}</priority></url>`
  ).join('\n');
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${wpisy}\n</urlset>\n`,
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } }
  );
}
