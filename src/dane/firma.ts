/* Dane firmy w jednym miejscu. Zmiana numeru czy adresu = jedna edycja, nie szesnascie. */

export const SITE = 'https://tinaskupaut.pl';

export const FIRMA = {
  nazwa: 'TINA Skup Aut',
  podmiot: 'TINA Rafał Kocimski',
  ulica: 'Przyszła 2B',
  kod: '96-513',
  miasto: 'Kozłów Biskupi',
  region: 'mazowieckie',
  nip: '522-234-50-44',
  nipPlain: '5222345044',
  regon: '142742668',
  odRoku: 2011,          // wpis do ewidencji
  wBranzyOd: 1999,       // poczatek dzialalnosci w motoryzacji (giełda)
  tel1: '692 493 797',
  tel1tel: '+48692493797',
  tel2: '693 649 549',
  tel2tel: '+48693649549',
  mail: 'rafal.kocimski@o2.pl',
  fb: 'https://www.facebook.com/p/Skup-Aut-Tina-61565193384415/',
};

/* "Ile płacimy" celowo poza menu, podstrona dziala i jest podlinkowana
   ze stopki oraz z kafelkow na stronie glownej, tylko nie zajmuje miejsca w pasku. */
export const NAW = [
  { href: '/', label: 'Skup' },
  { href: '/sprzedaz', label: 'Sprzedaż' },
  { href: '/realizacje', label: 'Realizacje' },
  { href: '/pytania', label: 'FAQ' },
  { href: '/o-nas', label: 'O nas' },
  { href: '/kontakt', label: 'Kontakt' },
];

export const FIRMA_LD = {
  '@context': 'https://schema.org',
  '@type': 'AutoDealer',
  name: FIRMA.nazwa,
  legalName: FIRMA.podmiot,
  description:
    'Skup samochodów za gotówkę i sprzedaż aut używanych na terenie całego Mazowsza. Dojazd z lawetą i wycena bez opłat, płatność na miejscu.',
  url: SITE + '/',
  logo: SITE + '/img/logo.png',
  image: SITE + '/img/og.jpg',
  telephone: [FIRMA.tel1tel, FIRMA.tel2tel],
  email: FIRMA.mail,
  taxID: FIRMA.nipPlain,
  vatID: 'PL' + FIRMA.nipPlain,
  foundingDate: String(FIRMA.odRoku),
  sameAs: [FIRMA.fb],
  address: {
    '@type': 'PostalAddress',
    streetAddress: FIRMA.ulica,
    postalCode: FIRMA.kod,
    addressLocality: FIRMA.miasto,
    addressRegion: FIRMA.region,
    addressCountry: 'PL',
  },
  geo: { '@type': 'GeoCoordinates', latitude: 52.18222, longitude: 20.19086 },
  areaServed: { '@type': 'State', name: 'mazowieckie' },
  currenciesAccepted: 'PLN',
  paymentAccepted: 'Gotówka, przelew',
  priceRange: '$$',
};

/** Okruszki do JSON-LD. sciezka: [['/ile-placimy','Ile płacimy']...] */
export function okruszki(sciezka: [string, string][]) {
  const el: any[] = [
    { '@type': 'ListItem', position: 1, name: 'Strona główna', item: SITE + '/' },
  ];
  sciezka.forEach(([url, nazwa], i) => {
    const p: any = { '@type': 'ListItem', position: i + 2, name: nazwa };
    if (url) p.item = SITE + url;
    el.push(p);
  });
  return { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: el };
}

/** FAQPage z tych samych par, ktore renderujemy na stronie. */
export function faqLd(pary: [string, string][]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: pary.map(([p, o]) => ({
      '@type': 'Question',
      name: p,
      acceptedAnswer: { '@type': 'Answer', text: o },
    })),
  };
}
