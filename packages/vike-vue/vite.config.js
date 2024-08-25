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
        ['+config']: resolve(__dirname, './src/+config.ts'),
        ['integration/onRenderClient']: resolve(__dirname, './src/integration/onRenderClient.ts'),
        ['integration/onRenderHtml']: resolve(__dirname, './src/integration/onRenderHtml.ts'),
        ['helpers/clientOnly']: resolve(__dirname, './src/helpers/clientOnly.ts'),
        ['types/public']: resolve(__dirname, './src/types/public.ts'),
        ['hooks/usePageContext']: resolve(__dirname, './src/hooks/usePageContext.ts'),
        ['hooks/useData']: resolve(__dirname, './src/hooks/useData.ts'),
        ['hooks/useConfig/useConfig-client']: resolve(__dirname, './src/hooks/useConfig/useConfig-client.ts'),
        ['hooks/useConfig/useConfig-server']: resolve(__dirname, './src/hooks/useConfig/useConfig-server.ts'),
        ['components/Config/Config-client']: resolve(__dirname, './src/components/Config/Config-client.ts'),
        ['components/Config/Config-server']: resolve(__dirname, './src/components/Config/Config-server.ts'),
        ['components/Head/Head-client']: resolve(__dirname, './src/components/Head/Head-client.ts'),
        ['components/Head/Head-server']: resolve(__dirname, './src/components/Head/Head-server.ts'),
      },
      formats: ['es'],
    },
    rollupOptions: {
      // There doesn't seem to be way to externalize all dependencies.
      // We use assertExternal() to make sure we didn't forget any import in this list.
      external: ['vue', 'vue/server-integration', 'vike/server', 'vike/getPageContext'],
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
