import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import basicSsl from '@vitejs/plugin-basic-ssl'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), basicSsl()],
  resolve: {
    alias: {
      '@pages': '/src/pages',
      '@shared': '/src/shared'
    }
  },
  test: {
    environment: 'happy-dom'
  },
  server: {
    host: process.env.VITE_HOST || 'localhost',
    port: parseInt(process.env.VITE_PORT) || 8080
  }
})
