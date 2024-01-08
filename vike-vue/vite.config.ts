import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from "node:path"
import dts from "vite-plugin-dts"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), dts()],
  build: {
    lib: {
      entry: resolve(__dirname, "index.ts"),
      formats: ["es"]
    },
    rollupOptions: {
      external: ["vue", "vike/server"],
      output: {
        globals: {
          vue: "Vue"
        }
      }
    }
  },
})
