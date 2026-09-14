// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://tinaskupaut.pl',
  output: 'static',
  // format:'file' => /ile-placimy.html zamiast /ile-placimy/index.html.
  // Cloudflare Pages serwuje to pod czystym /ile-placimy i kanonizuje bez ukosnika.
  // Tak samo jest skonfigurowana strona firmowa — trzymamy jedna konwencje.
  build: {
    format: 'file',
  },
  devToolbar: { enabled: false },
});
