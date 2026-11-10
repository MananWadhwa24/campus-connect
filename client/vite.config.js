import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import os from 'os'

export default defineConfig({
  // Move Vite cache out of OneDrive folder to prevent EPERM file locking
  cacheDir: path.join(os.tmpdir(), 'campus-connect-vite'),
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    host: true, // Exposes on all network interfaces (e.g. http://192.168.1.8:5173)
    port: 5173,
    watch: {
      usePolling: true,
    },
  },
})
