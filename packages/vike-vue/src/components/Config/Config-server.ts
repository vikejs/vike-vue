export { Config }

// Same as ./Config-client.ts but importing useConfig-server.js
import { defineComponent } from 'vue'
import { useConfig } from '../../hooks/useConfig/useConfig-server.js'
import { noop } from '../../utils/noop.js'
import { extractUnstyledChildren } from '../../utils/extractUnstyledChildren.js'

/**
 * Set configurations inside Vue components.
 *
 * (The children are added to `<head>`.)
 *
 * https://vike.dev/useConfig#config-head
 */
const Config = defineComponent({
  name: 'Config',
  inheritAttrs: false,
  setup(_, { attrs, slots }) {
    const Head = extractUnstyledChildren(slots.default) || (() => attrs.Head)
    const config = useConfig()
    config({ ...attrs, Head })
    return noop
  },
})
