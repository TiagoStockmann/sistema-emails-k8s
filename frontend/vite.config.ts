import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Backend .NET — roda em outra máquina da rede.
const API_TARGET = 'http://10.11.23.21:8080'

const proxy = {
  '/api': {
    target: API_TARGET,
    changeOrigin: true,
  },
}

export default defineConfig({
  plugins: [react()],

  // host: true escuta em 0.0.0.0, liberando o acesso pelo IP da máquina.
  server: {
    host: true,
    port: 8080,
    strictPort: true,
    proxy,
  },

  preview: {
    host: true,
    port: 8080,
    strictPort: true,
    proxy,
  },
})
