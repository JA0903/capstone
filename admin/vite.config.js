import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5174,
    host: 'localhost',
    middlewareMode: false,
    hmr: {
      protocol: 'http',
      host: 'localhost',
      port: 5174,
    }
  }
})
