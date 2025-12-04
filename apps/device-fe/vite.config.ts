import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [devtools(), viteReact(), tailwindcss()],
  resolve: {
    alias: {
      '@state': fileURLToPath(new URL('./src/state', import.meta.url)),
      '@': fileURLToPath(new URL('./src', import.meta.url)),

      '@assets': fileURLToPath(new URL('./assets', import.meta.url)),

    },
  },
})
