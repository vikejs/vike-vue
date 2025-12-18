export { vikeVueClientOnly }

import type { Plugin } from 'vite'
import { transformCode, type TransformOptions } from './babelTransformer.js'
import { assert } from '../utils/assert.js'

const skipNonJsFiles = /\.[jt]sx?$/
const skipNodeModules = 'node_modules'
const filterRolldown = {
  id: {
    include: skipNonJsFiles,
    exclude: `**/${skipNodeModules}/**`,
  },
}
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
          function: ['import:vue:h', 'import:vue:createVNode'],
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
      applyToEnvironment(environment) {
        return environment.name !== 'client'
      },
      transform: {
        filter: filterRolldown,
        handler(code, id) {
          assert(filterFunction(id))
          return transformCode({ code, id, env: this.environment.name, options: defaultOptions })
        },
      },
    },
  ]

  return plugins
}
