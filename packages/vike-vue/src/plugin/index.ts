export { vikeVueClientOnly }

import type { Plugin } from 'vite'
import { treeShake } from './tree-shake.js'

const skipNodeModules = 'node_modules'

const filterFunction = (id: string) => {
  if (id.includes(skipNodeModules)) return false
  return true
}

/**
 * Vite plugin that transforms Vue components on server-side:
 * - Strips default slots of <ClientOnly>
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
          return await treeShake(code, id)
        },
      },
    },
  ]

  return plugins
}
