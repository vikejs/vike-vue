import vue from '@vitejs/plugin-vue'
import md from 'vite-plugin-md'
import ssr from 'vite-plugin-ssr/plugin'
import { UserConfig } from 'vite'

const config: UserConfig = {
  plugins: [
    ssr({ prerender: true }),
    vue({
      include: [/\.vue$/, /\.md$/]
    }),
    md()
  ],
  optimizeDeps: { include: ['cross-fetch'] }
}

export default config
