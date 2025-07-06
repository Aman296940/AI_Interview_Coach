import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    tailwindcss(), // Add this line
    ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
        // Optional: remove the prefix if your backend doesn't use `/api`
        // rewrite: path => path.replace(/^\/api/, '')
      },
      '/ask': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
})
