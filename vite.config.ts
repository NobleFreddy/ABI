import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/** Entfernt die GitHub-Pages-Weiterleitung aus der gebauten Seite (sonst Endlosschleife in docs/). */
const stripPagesRedirect = (): Plugin => ({
  name: 'strip-pages-redirect',
  apply: 'build',
  transformIndexHtml: (html) => html.replace(/\s*<!-- pages-redirect -->[\s\S]*?<!-- \/pages-redirect -->/, ''),
})

// Fester Port: Die Daten liegen im Browser-Speicher, der an die Adresse
// (http://localhost:5180) gebunden ist. Ein anderer Port = scheinbar leere App.
export default defineConfig({
  // Relative Pfade: läuft lokal und auf GitHub Pages unter /ABI/ (Routing per #/… braucht keinen Server)
  base: './',
  plugins: [react(), tailwindcss(), stripPagesRedirect()],
  server: { port: 5180, strictPort: true },
  preview: { port: 5180, strictPort: true },
  // Lokale App mit vielen Lerninhalten – ein großes Bundle ist hier unkritisch
  build: { chunkSizeWarningLimit: 1500 },
})
