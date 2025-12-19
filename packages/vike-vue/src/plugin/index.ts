export { vikeVueClientOnly }

import type { Plugin } from 'vite'
import { transformCode, type TransformOptions } from './babelTransformer.js'

const skipNonJsFiles = /\.[jt]sx?$/
const skipNodeModules = 'node_modules'

const filterFunction = (id: string) => {
  if (id.includes(skipNodeModules)) return false
  if (!skipNonJsFiles.test(id)) return false
  return true
}

// Default rules for vike-vue
const defaultOptions: TransformOptions = {
  rules: [
    // h() and related functions: slots are in third argument
    {
      env: 'server',
      call: {
        match: {
          // function: ['import:vue:h', 'import:vue:createVNode'],
          function: ['import:vue/server-renderer:ssrRenderComponent'],
          args: { 0: 'import:vike-vue/ClientOnly:ClientOnly' },
        },
        remove: { arg: 2, prop: 'default' },
      },
    },
    {
      env: 'server',
      call: {
        match: {
          function: 'import:vike-vue/useHydrated:useHydrated',
        },
        replace: { with: false },
      },
    },
  ],
}

/**
 * Vite plugin that transforms Vue components on server-side:
 * - Strips specified slots (e.g., default) from components
 * - Removes unreferenced imports that result from the stripping
 */
function vikeVueClientOnly() {
  const plugins: Plugin[] = [
    {
      name: 'vike-vue:client-only',
      enforce: 'post',
      transform: {
        // order: 'pre',
        async handler(code, id, options) {
          // Only transform for SSR (server-side)
          if (!options?.ssr) return null
          if (!filterFunction(id)) return null
          const env = 'ssr'
          if (code.includes('ClientOnly')) {
            console.log('id  ===== ', id)
            console.log('code', code)
          }
          return await transformCode({ code, id, env, options: defaultOptions })
        },
      },
    },
  ]

  return plugins
}
