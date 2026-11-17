import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Fester Port: Die Daten liegen im Browser-Speicher, der an die Adresse
// (http://localhost:5180) gebunden ist. Ein anderer Port = scheinbar leere App.
export default defineConfig({
  // Relative Pfade: läuft lokal und auf GitHub Pages unter /ABI/ (Routing per #/… braucht keinen Server)
  base: './',
  plugins: [react(), tailwindcss()],
  server: { port: 5180, strictPort: true },
  preview: { port: 5180, strictPort: true },
  // Lokale App mit vielen Lerninhalten – ein großes Bundle ist hier unkritisch
  build: { chunkSizeWarningLimit: 1500 },
})
