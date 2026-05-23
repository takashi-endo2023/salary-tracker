import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { salaryApiPlugin } from './server/plugin'

export default defineConfig({
  plugins: [react(), salaryApiPlugin()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('recharts') || id.includes('d3-')) return 'charts'
          if (id.includes('node_modules')) return 'vendor'
        },
      },
    },
  },
})
