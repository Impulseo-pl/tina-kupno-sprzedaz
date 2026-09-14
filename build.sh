#!/usr/bin/env bash
# Budowanie katalogu publikacyjnego dla Cloudflare Pages.
#
# Od 2026-09-14 strona stoi na Astro. Ten skrypt jest cienka nakladka na `astro build`,
# zeby polecenie budowania w panelu Cloudflare ("bash build.sh") bylo takie samo jak
# na pozostalych projektach firmowych.
#
# Co Astro robi samo:
#   src/pages/**   -> gotowe pliki .html w dist/
#   public/**      -> assets, img, robots.txt kopiowane bez zmian
#
# Sitemape generujemy z src/dane/strony.ts, zeby miec kontrole nad tym, co do niej wchodzi.

set -euo pipefail

npm run build

echo "dist gotowy:"
ls -1 dist | sed 's/^/  /'
