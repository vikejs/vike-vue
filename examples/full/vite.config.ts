import vue from '@vitejs/plugin-vue'
import md from 'unplugin-vue-markdown/vite'
import vike from 'vike/plugin'
import vueDevTools from 'vite-plugin-vue-devtools'
import { UserConfig } from 'vite'
import { cjsInterop } from 'vite-plugin-cjs-interop'

const config: UserConfig = {
  plugins: [
    vike(),
    vue({
      include: [/\.vue$/, /\.md$/],
    }),
    md({}),
    cjsInterop({
      dependencies: ['vue-toast-notification'],
    }),
    vueDevTools(),
  ],
}

export default config
