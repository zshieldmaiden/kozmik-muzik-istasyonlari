import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env vars
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [
      vue(),
      vueDevTools(),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
    },
    define: {
      // Sadece ihtiyaç duyulan ortam değişkenini tanımlayın
      'import.meta.env.VITE_OPENWEATHER_KEY': JSON.stringify(env.VITE_OPENWEATHER_KEY || 'c99d2fa61ce79aa4756128dea10d53e5')
    }
  }
})
