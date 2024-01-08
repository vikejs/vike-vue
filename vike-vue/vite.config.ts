import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'node:path'
import dts from 'vite-plugin-dts'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), dts()],
  build: {
    emptyOutDir: true,
    sourcemap: true,
    lib: {
      entry: {
        ['renderer/+config']: resolve(__dirname, './renderer/+config.ts'),
        ['renderer/onRenderClient']: resolve(__dirname, './renderer/onRenderClient.ts'),
        ['renderer/onRenderHtml']: resolve(__dirname, './renderer/onRenderHtml.ts'),
        ['components/usePageContext']: resolve(__dirname, './components/usePageContext.ts'),
        ['components/useData']: resolve(__dirname, './components/useData.ts')
      },
      formats: ['es']
    },
    rollupOptions: {
      external: ['vue', 'vike', 'vike/server', 'vike/types'],
      output: {
        sanitizeFileName: false,
        globals: {
          vue: 'Vue'
        }
      }
    }
  }
})
