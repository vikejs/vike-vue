import vue from '@vitejs/plugin-vue'
import vike from 'vike/plugin'
import { defineConfig } from 'vite'

const config = defineConfig({
  plugins: [
    vike({ prerender: true }),
    vue({
      include: [/\.vue$/, /\.md$/],
    }),
  ],
})

export default config
