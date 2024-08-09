export { Config }

// Same as ./Config-client.ts but importing useConfig-server.js
import { defineComponent, useAttrs, watchEffect } from 'vue'
import { useConfig } from '../../hooks/useConfig/useConfig-server.js'
import type { ConfigFromHook } from '../../+config.js'

/**
 * Set configurations inside Vue components.
 *
 * (The children are added to `<head>`.)
 *
 * https://vike.dev/useConfig#config-head
 */
const Config = /* @__PURE__ */ defineComponent({
  name: 'Config',
  setup(_, { slots }) {
    const attrs: ConfigFromHook = useAttrs()
    const config = useConfig()
    watchEffect(() => {
      let Head
      if (slots.default != null) {
        const els = slots.default()
        Head = () =>
          els.map((el) => ({
            ...el,
            // remove CSS scope marker (data-v-...)
            scopeId: undefined,
          }))
      }
      config({
        ...attrs,
        // we ignore a Head attribute
        Head,
      })
    })
    return () => undefined
  },
})
