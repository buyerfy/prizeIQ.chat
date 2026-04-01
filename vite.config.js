import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        privatnost: resolve(__dirname, 'privatnost.html'),
        terms: resolve(__dirname, 'terms-of-use-of-the-survey-and-privacy.html')
      }
    }
  }
})
