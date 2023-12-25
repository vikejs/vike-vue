import vue from '@vitejs/plugin-vue'
import md from 'unplugin-vue-markdown/vite'
import vike from 'vike/plugin'
import { UserConfig } from 'vite'

const config: UserConfig = {
  plugins: [
    vike({ prerender: true }),
    vue({
      include: [/\.vue$/, /\.md$/]
    }),
    md({})
  ],
  optimizeDeps: { include: ['cross-fetch'] }
}

export default config
