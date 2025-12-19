export { vikeVueClientOnly }

import type { Plugin } from 'vite'
import { transformCode, type TransformOptions } from './babelTransformer.js'

const skipNodeModules = 'node_modules'

const filterFunction = (id: string) => {
  if (id.includes(skipNodeModules)) return false
  return true
}

// Default rules for vike-vue
const defaultOptions: TransformOptions = {
  rules: [
    // ssrRenderComponent with unref(ClientOnly) - production build
    {
      env: 'server',
      call: {
        match: {
          function: ['import:vue/server-renderer:ssrRenderComponent'],
          args: {
            0: {
              call: 'import:vue:unref',
              args: {
                0: 'import:vike-vue/ClientOnly:ClientOnly',
              },
            },
          },
        },
        remove: { arg: 2, prop: 'default' },
      },
    },
    // ssrRenderComponent with $setup["ClientOnly"] - dev mode
    {
      env: 'server',
      call: {
        match: {
          function: ['import:vue/server-renderer:ssrRenderComponent'],
          args: {
            0: {
              member: true,
              object: '$setup',
              property: 'ClientOnly',
            },
          },
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
          const after = await transformCode({ code, id, env: env, options: defaultOptions })
          if (after) {
            console.log('======')
            console.log(code)
            console.log('======')
            console.log(after.code)
            console.log('======')
          }
          return after
        },
      },
    },
  ]

  return plugins
}
