import { defineConfig } from 'vite'
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
        ['index']: resolve(__dirname, './src/index.ts'),
        ['+config']: resolve(__dirname, './src/+config.ts'),
        ['renderer/onRenderClient']: resolve(__dirname, './src/renderer/onRenderClient.ts'),
        ['renderer/onRenderHtml']: resolve(__dirname, './src/renderer/onRenderHtml.ts'),
        ['helpers/clientOnly']: resolve(__dirname, './src/helpers/clientOnly.ts'),
        ['types/index']: resolve(__dirname, './src/types/index.ts'),
        ['hooks/usePageContext']: resolve(__dirname, './src/hooks/usePageContext.ts'),
        ['hooks/useData']: resolve(__dirname, './src/hooks/useData.ts'),
        ['components/ClientOnly']: resolve(__dirname, './src/components/ClientOnly.vue'),
      },
      formats: ['es'],
    },
    rollupOptions: {
      // There doesn't seem to be way to externalize all dependencies.
      // We use assertExternal() to make sure we didn't forget any import in this list.
      external: ['vue', 'vue/server-renderer', 'vike/server'],
      output: {
        sanitizeFileName: false,
        globals: {
          vue: 'Vue',
        },
      },
    },
    minify: false,
  },
})

function assertExternal() {
  return {
    name: 'vike-vue:assertExternal',
    transform(_, id) {
      // All npm package imports should be listed in config.build.rollupOptions.external
      if (id.includes('node_modules')) {
        console.log()
        console.error(new Error(`should be external: ${id}`))
        process.exit(1)
      }
    },
  }
}
