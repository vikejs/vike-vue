export { pluginClientOnly }

import type { Plugin } from 'vite'
import { treeShake } from './pluginClientOnly/tree-shake.js'
import { assert } from '../utils/assert.js'

// === Rolldown filter
const skipNodeModules = '/node_modules/'
const skipIrrelevant = 'vike-vue/ClientOnly'
const filterRolldown = {
  id: {
    exclude: `**${skipNodeModules}**`,
  },
  code: {
    include: skipIrrelevant,
  },
}
const filterFunction = (id: string, code: string) => {
  if (id.includes(skipNodeModules)) return false
  if (!code.includes(skipIrrelevant)) return false
  return true
}
// ===

/**
 * Vite plugin that transforms Vue components on server-side:
 * - Strips default slots of <ClientOnly>
 * - Removes unreferenced imports that result from the stripping
 */
function pluginClientOnly(): Plugin[] {
  return [
    {
      name: 'vike-vue:pluginClientOnly',
      enforce: 'post',
      transform: {
        filter: filterRolldown,
        async handler(code, id, options) {
          if (!options?.ssr) return null
          assert(filterFunction(id, code))
          return await treeShake(code, id)
        },
      },
    },
  ]
}
