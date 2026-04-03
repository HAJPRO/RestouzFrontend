import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/vue'
import legacy from '@vitejs/plugin-legacy'
import path from 'path'

export default defineConfig({
  plugins: [
    vue(),
    legacy({
      targets: ['defaults', 'not IE 11'], // Eski mobil brauzerlar uchun ham moslashuvchanlik
    }),
  ],
  resolve: {
    alias: {
      // Eng ishonchli va universal alias sozlamasi
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '~': path.resolve(__dirname, './src'),
    }
  },
  // Mobile (Capacitor) uchun build sozlamalari
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Mobile qurilmalarda kesh muammosi bo'lmasligi uchun
    emptyOutDir: true,
  },
  // Dev server sozlamalari (Web va Mobile debugging uchun)
  server: {
    host: true, // Tarmoqdagi boshqa qurilmalar (telefon) ulanishi uchun
    port: 8100,
  }
})