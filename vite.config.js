import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  json: {
    stringify: true,
  },
  base: process.env.VITE_BASE_URL || '/',
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        chunkFileNames: (chunkInfo) => {
          const ids = [chunkInfo.facadeModuleId, ...Object.keys(chunkInfo.modules || {})].filter(Boolean)
          for (const id of ids) {
            const match = id.match(/locales[\\/]([^\\/]+)[\\/]translation\.json/)
            if (match) {
              return `assets/locale-${match[1]}-[hash].js`
            }
          }
          return 'assets/[name]-[hash].js'
        },
      },
    },
  },
})
