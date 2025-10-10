import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // increase the allowed chunk size (default is 500 KB)
    chunkSizeWarningLimit: 2000, // 2000 KB = 2 MB
  },
  server: {
    port: 5173, // optional: keeps your local dev port consistent
  },
})
