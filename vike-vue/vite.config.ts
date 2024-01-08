import { defineConfig, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'node:path'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [vue(), dts(), assertExternal()],
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
      // There doesn't seem to be way to externalize all dependencies.
      // We use assertExternal() to make sure we didn't forget any import in this list.
      external: ['vue', 'vue/server-renderer', 'vike/server'],
      output: {
        sanitizeFileName: false,
        globals: {
          vue: 'Vue'
        }
      }
    }
  }
})

function assertExternal(): Plugin {
  return {
    name: 'vike-vue:assertExternal',
    transform(_, id) {
      // All npm package imports should be listed in config.build.rollupOptions.external
      if (id.includes('node_modules')) {
        console.log()
        console.error(new Error(`should be external: ${id}`))
        process.exit(1)
      }
    }
  }
}
