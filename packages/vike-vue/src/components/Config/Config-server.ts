export { Config }

// Same as ./Config-client.ts but importing useConfig-server.js

import { defineComponent, PropType } from 'vue'
import { useConfig } from '../../hooks/useConfig/useConfig-server.js'
import type { ConfigFromHook } from '../../+config.js'

/**
 * Set configurations inside Vue components.
 *
 * https://vike.dev/useConfig
 */
const Config = defineComponent({
  name: 'Config',
  props: {
    head: Object as PropType<ConfigFromHook['Head']>,
    title: String,
    description: String,
    image: String,
  },
  inheritAttrs: false,
  setup: (props) => () => {
    const config = useConfig()
    config({ Head: () => props.head, ...props })
    return null
  },
})
