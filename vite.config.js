import { defineConfig } from 'vite'

// base relativa: la web funciona igual en GitHub Pages, Netlify o abriendo /dist en un servidor
export default defineConfig({
  base: './',
  build: { target: 'es2020', chunkSizeWarningLimit: 1200 },
})
