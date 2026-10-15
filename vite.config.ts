import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base './' so the built site works from any static host sub-path
// (GitHub Pages project sites, Netlify, Cloudflare Pages, etc.)
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks: {
          echarts: ['echarts'],
          maplibre: ['maplibre-gl'],
        },
      },
    },
  },
})
