import vue from '@vitejs/plugin-vue'
import md from 'unplugin-vue-markdown/vite'
import vike from 'vike/plugin'
import { UserConfig } from 'vite'

const config: UserConfig = {
  plugins: [
    vike(),
    vue({
      include: [/\.vue$/, /\.md$/]
    }),
    md({})
  ]
}

export default config
