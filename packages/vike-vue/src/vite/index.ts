export { vitePlugin }

import { pluginClientOnly } from './pluginClientOnly.js'
import type { Plugin } from 'vite'

// Return `PluginInterop` instead of `Plugin` to avoid type mismatch upon different Vite versions
type PluginInterop = Record<string, unknown> & { name: string }
function vitePlugin(): PluginInterop[] {
  const plugins: Plugin[] = [
    //
    ...pluginClientOnly(),
  ]
  return plugins as PluginInterop[]
}
