import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) =>({
  plugins: [react()],
  server: {
    proxy: mode === 'development' ? {
      '/api': 'http://localhost:3000',
    } : {},
  },
}))
