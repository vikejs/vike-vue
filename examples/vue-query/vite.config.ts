import vue from '@vitejs/plugin-vue'
import vike from 'vike/plugin'
import { UserConfig } from 'vite'

const config: UserConfig = {
  plugins: [
    vike({ prerender: true }),
    vue({
      include: [/\.vue$/, /\.md$/]
    })
  ]
}

export default config
