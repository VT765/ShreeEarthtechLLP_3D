import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // three.js + R3F stay in their own lazily loaded chunk (~920 kB); everything eager is far below this.
    chunkSizeWarningLimit: 1000,
    rolldownOptions: {
      output: {
        // Long-lived vendor chunks for the eagerly loaded libraries (Vite 8 / Rolldown: `codeSplitting`
        // replaces Rollup's `manualChunks`). three/R3F/drei are deliberately not listed so they remain lazy.
        codeSplitting: {
          groups: [
            { name: 'react', test: /node_modules[\\/](react|react-dom|scheduler|react-router|react-router-dom|cookie|set-cookie-parser)[\\/]/, priority: 2 },
            { name: 'motion', test: /node_modules[\\/](gsap|lenis)[\\/]/, priority: 1 },
          ],
        },
      },
    },
  },
})
