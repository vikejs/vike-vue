import vue from '@vitejs/plugin-vue'
import md from 'unplugin-vue-markdown/vite'
import ssr from 'vike/plugin'
import { UserConfig } from 'vite'

const config: UserConfig = {
  plugins: [
    ssr({ prerender: true }),
    vue({
      include: [/\.vue$/, /\.md$/]
    }),
    md({})
  ],
  optimizeDeps: { include: ['cross-fetch'] }
}

export default config
