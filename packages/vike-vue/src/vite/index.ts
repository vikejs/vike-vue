export { vitePlugin }

import { pluginClientOnly } from './pluginClientOnly.js'

// Return `PluginInterop` instead of `Plugin` to avoid type mismatch upon different Vite versions
type PluginInterop = Record<string, unknown> & { name: string }
function vitePlugin(): PluginInterop[] {
  return [
    //
    ...pluginClientOnly(),
  ] as PluginInterop[]
}
