import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined

          if (id.includes('@supabase')) return 'supabase'
          if (id.includes('@stripe/stripe-js')) return 'stripe-js'
          if (id.includes('lucide-react')) return 'icons'
          if (id.includes('react') || id.includes('scheduler')) return 'react-vendor'

          return 'vendor'
        }
      }
    }
  },
  server: {
    allowedHosts: true
  },
  preview: {
    allowedHosts: true
  }
})
