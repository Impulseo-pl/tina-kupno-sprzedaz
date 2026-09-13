# -*- coding: utf-8 -*-
"""
Generator strony TINA.

Zrodlem tresci jest _src/app.html - jedna aplikacja z adresami po hashu.
Ten skrypt otwiera ja w przegladarce, zdejmuje gotowy HTML z kazdego adresu
i zapisuje jako osobny plik. Dzieki temu Google widzi 45 stron, a nie jedna.

    python _src/build.py

Wymaga: pip install playwright  oraz  python -m playwright install chromium
"""
import io, os, re, sys
from playwright.sync_api import sync_playwright

KOR    = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ZRODLO = os.path.join(KOR, '_src', 'app.html')
SITE   = 'https://tinaskupaut.pl'
DZIS   = '2026-09-13'


def czytaj(p):
    return io.open(p, encoding='utf-8').read()


def pisz(p, t):
    kat = os.path.dirname(p)
    if kat:
        os.makedirs(kat, exist_ok=True)
    io.open(p, 'w', encoding='utf-8', newline='\n').write(t)


src = czytaj(ZRODLO)

# ---------------------------------------------------------------- 1. arkusz stylow
style = re.findall(r'<style>(.*?)</style>', src, re.S)
pisz(os.path.join(KOR, 'assets', 'styles.css'),
     '\n\n'.join(s.strip() for s in style) + '\n')

# ---------------------------------------------------------------- 2. skrypt aplikacji
skrypty = re.findall(r'<script>(.*?)</script>', src, re.S)
app_js = max(skrypty, key=len)          # glowny skrypt jest najdluzszy
pisz(os.path.join(KOR, 'assets', 'app.js'), app_js.strip() + '\n')

# ---------------------------------------------------------------- 3. szkielet strony
szkielet = src
for s in style:
    szkielet = szkielet.replace('<style>' + s + '</style>', '', 1)
szkielet = szkielet.replace(
    '<script>' + app_js + '</script>',
    '<script>window.STATIC=true;window.ROOT="{{ROOT}}";</script>\n'
    '<script src="{{ROOT}}assets/app.js" defer></script>', 1)
szkielet = szkielet.replace(
    '&display=swap">',
    '&display=swap">\n<link rel="stylesheet" href="{{ROOT}}assets/styles.css">', 1)
szkielet = re.sub(r'(src|href)="img/', r'\1="{{ROOT}}img/', szkielet)
assert '{{ROOT}}assets/app.js' in szkielet, 'nie podmienilem skryptu aplikacji'
assert '{{ROOT}}assets/styles.css' in szkielet, 'nie podmienilem arkusza stylow'

GLOWA = szkielet[:szkielet.index('</head>')]
RESZTA = szkielet[szkielet.index('</head>'):]

# ---------------------------------------------------------------- 4. lista adresow
def slugi(nazwa):
    m = re.search(r'const %s\s*=\s*\[(.*?)\n\];' % nazwa, src, re.S)
    return re.findall(r'\{s:"([a-z0-9-]+)"', m.group(1))


TABY = ['skup', 'sprzedaz', 'wycena', 'realizacje', 'porownanie', 'marki', 'miasta', 'pytania']
MIASTA = slugi('CITIES')
MARKI = slugi('BRANDS')
DZIELNICE = slugi('DISTRICTS')

ADRESY = [('', '')]
ADRESY += [('/' + t, t) for t in TABY]
ADRESY += [('/skup-aut-' + c, 'skup-aut-' + c) for c in MIASTA]
ADRESY += [('/skup-aut-warszawa-' + d, 'skup-aut-warszawa-' + d) for d in DZIELNICE]
ADRESY += [('/skup-aut-' + b, 'skup-aut-' + b) for b in MARKI]

# ---------------------------------------------------------------- 5. adresy w tresci
def linki(html, root):
    """#/cos -> ../cos/ ; #/ -> ../ ; zwykle kotwice zostaja bez zmian."""
    def f(m):
        cel = m.group(1)
        if cel in ('', '/'):
            return 'href="%s"' % root
        kotwica = ''
        if '#' in cel:
            cel, kotwica = cel.split('#', 1)
            kotwica = '#' + kotwica
        return 'href="%s%s/%s"' % (root, cel.strip('/'), kotwica)
    html = re.sub(r'href="#(/[a-z0-9-]*(?:#[a-z0-9-]+)?)"', f, html)
    return html.replace('src="img/', 'src="%simg/' % root)


def sprzataj(html):
    """Znaczniki `kw` to nasza notatka o liczbie wyszukiwan - na stronie klienta
    nie maja czego szukac, nawet w zrodle."""
    return re.sub(r'<span class="kw" data-v="[^"]*">', '<span>', html)


# ---------------------------------------------------------------- 6. zdejmowanie stron
ZBIERZ = """() => {
  document.querySelectorAll('#app .rv,#app .rvs').forEach(function(e){
    e.classList.remove('rv','rvs','on');
  });
  document.querySelectorAll('#app [data-done]').forEach(function(e){
    e.removeAttribute('data-done');
  });
  return {
    app:   document.getElementById('app').innerHTML,
    menu:  document.getElementById('miastamenu').innerHTML,
    fc:    document.getElementById('footcities').innerHTML,
    fd:    document.getElementById('footdistricts').innerHTML,
    tytul: document.title,
    opis:  (document.querySelector('meta[name=description]') || {}).content || '',
    ld:    [].map.call(document.querySelectorAll('script[data-ld]'), function(s){ return s.textContent; }),
    akt:   (document.querySelector('.nav .act, .dropbtn.act') || {dataset:{}}).dataset.t || ''
  };
}"""


OGONKI = {ord(a): b for a, b in zip(u'ąćęłńóśźżĄĆĘŁŃÓŚŹŻ', u'acelnoszzACELNOSZZ')}


def goly(t):
    return re.sub(r'[^a-z0-9]', '', t.translate(OGONKI).lower())


def sprawdz(sciezka, tytul):
    """Straznik pomylki adresow: tytul musi mowic o tej stronie, nie o poprzedniej."""
    if not sciezka or sciezka in TABY:
        return
    klucz = sciezka.replace('skup-aut-warszawa-', '').replace('skup-aut-', '')
    assert goly(klucz) in goly(tytul), \
        'strona %s dostala tytul innej strony: %r' % (sciezka, tytul)


def podmien(tekst, wzor, nowa):
    return re.sub(wzor, lambda m: m.group(1) + nowa.replace('\\', '\\\\') + m.group(2), tekst)


zrobione = []
WSPOLNE = {}
with sync_playwright() as pw:
    br = pw.chromium.launch()
    ctx = br.new_context(reduced_motion='reduce', viewport={'width': 1440, 'height': 2400})
    pg = ctx.new_page()
    baza = 'file:///' + ZRODLO.replace('\\', '/')

    for hasz, sciezka in ADRESY:
        # Pusta strona miedzy adresami jest konieczna: sama zmiana hasza nie
        # przeladowuje dokumentu, tylko odpala przejscie z zanikaniem - i skrypt
        # zdejmowal wtedy tresc POPRZEDNIEGO adresu.
        pg.goto('about:blank')
        pg.goto(baza + ('#' + hasz if hasz else ''), wait_until='load')
        pg.wait_for_function("document.getElementById('app').children.length>0")
        pg.wait_for_timeout(150)
        d = pg.evaluate(ZBIERZ)
        sprawdz(sciezka, d['tytul'])
        if sciezka == '':
            WSPOLNE.update({k: d[k] for k in ('menu', 'fc', 'fd')})

        root = './' if sciezka == '' else '../'
        kanon = SITE + ('/' if sciezka == '' else '/' + sciezka + '/')
        tytul = d['tytul'].replace('"', '&quot;')
        opis = d['opis'].replace('"', '&quot;')

        glowa = (GLOWA.replace('{{CANONICAL}}', kanon)
                      .replace('{{SITE}}', SITE)
                      .replace('{{ROOT}}', root))
        glowa = re.sub(r'<title>.*?</title>', lambda m: '<title>%s</title>' % d['tytul'], glowa, flags=re.S)
        glowa = podmien(glowa, r'(<meta name="description" content=")[^"]*(")', opis)
        glowa = podmien(glowa, r'(<meta property="og:title" content=")[^"]*(")', tytul)
        glowa = podmien(glowa, r'(<meta property="og:description" content=")[^"]*(")', opis)
        for ld in d['ld']:
            glowa += '\n<script type="application/ld+json">%s</script>' % ld

        reszta = RESZTA.replace('{{ROOT}}', root)
        reszta = reszta.replace('<main id="app"></main>',
                                '<main id="app">%s</main>' % sprzataj(linki(d['app'], root)))
        reszta = reszta.replace('<div class="dropmenu" id="miastamenu" role="menu"></div>',
                                '<div class="dropmenu" id="miastamenu" role="menu">%s</div>' % linki(d['menu'], root))
        reszta = reszta.replace('<p id="footcities"></p>',
                                '<p id="footcities">%s</p>' % linki(d['fc'], root))
        reszta = reszta.replace('<p id="footdistricts"></p>',
                                '<p id="footdistricts">%s</p>' % linki(d['fd'], root))
        reszta = linki(reszta, root)
        if d['akt']:
            reszta = reszta.replace('data-t="%s"' % d['akt'],
                                    'data-t="%s" class="act" aria-current="page"' % d['akt'], 1)

        plik = os.path.join(KOR, 'index.html') if sciezka == '' \
            else os.path.join(KOR, sciezka, 'index.html')
        pisz(plik, glowa + reszta)
        zrobione.append(sciezka)
        print('  %-36s %6.0f kB' % (sciezka or '(strona glowna)', len(glowa + reszta) / 1024.0))

    br.close()

# ---------------------------------------------------------------- 7. proste strony
import proste

for plik, kanon_sciezka, root, tytul, opis, tresc in proste.STRONY:
    glowa = (GLOWA.replace('{{SITE}}', SITE).replace('{{ROOT}}', root))
    if kanon_sciezka:
        glowa = glowa.replace('{{CANONICAL}}', SITE + '/' + kanon_sciezka)
    else:
        glowa = re.sub(r'\n?<link rel="canonical" href="\{\{CANONICAL\}\}">', '', glowa)
        glowa = glowa.replace('{{CANONICAL}}', SITE + '/')
    glowa = re.sub(r'<title>.*?</title>', lambda m: '<title>%s</title>' % tytul, glowa, flags=re.S)
    glowa = podmien(glowa, r'(<meta name="description" content=")[^"]*(")', opis)
    glowa = podmien(glowa, r'(<meta property="og:title" content=")[^"]*(")', tytul)
    glowa = podmien(glowa, r'(<meta property="og:description" content=")[^"]*(")', opis)
    glowa += '\n<meta name="robots" content="noindex">' if not kanon_sciezka else ''

    reszta = RESZTA.replace('{{ROOT}}', root)
    reszta = reszta.replace('<main id="app"></main>',
                            '<main id="app">%s</main>' % proste.podstaw(tresc, root))
    reszta = reszta.replace('<div class="dropmenu" id="miastamenu" role="menu"></div>',
                            '<div class="dropmenu" id="miastamenu" role="menu">%s</div>' % linki(WSPOLNE['menu'], root))
    reszta = reszta.replace('<p id="footcities"></p>',
                            '<p id="footcities">%s</p>' % linki(WSPOLNE['fc'], root))
    reszta = reszta.replace('<p id="footdistricts"></p>',
                            '<p id="footdistricts">%s</p>' % linki(WSPOLNE['fd'], root))
    reszta = linki(reszta, root)
    pisz(os.path.join(KOR, *plik.split('/')), glowa + reszta)
    print('  %-36s %6.0f kB' % (plik, len(glowa + reszta) / 1024.0))

# ---------------------------------------------------------------- 8. mapa strony
def adres(s):
    return SITE + ('/' if s == '' else '/' + s + '/')


def waga(s):
    if s == '':
        return '1.0'
    if s in TABY:
        return '0.8'
    return '0.6'


mapa = ['<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
for _, s in ADRESY:
    mapa.append('  <url><loc>%s</loc><lastmod>%s</lastmod><priority>%s</priority></url>'
                % (adres(s), DZIS, waga(s)))
mapa.append('  <url><loc>%s</loc><lastmod>%s</lastmod><priority>0.2</priority></url>'
            % (adres('polityka-prywatnosci'), DZIS))
mapa.append('</urlset>')
pisz(os.path.join(KOR, 'sitemap.xml'), '\n'.join(mapa) + '\n')

print('\nGotowe: %d stron, sitemap.xml, assets/styles.css, assets/app.js' % len(zrobione))
