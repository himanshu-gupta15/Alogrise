import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
     tailwindcss(),
  ],
  // Google OAuth only allows the origins registered in Cloud Console (http://localhost:5173),
  // so fail loudly instead of silently moving to 5174 when the port is busy
  server: {
    port: 5173,
    strictPort: true,
  },
})

