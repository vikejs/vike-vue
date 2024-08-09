export { Config }

// Same as ./Config-server.ts but importing useConfig-client.js

import { defineComponent, PropType } from 'vue'
import { useConfig } from '../../hooks/useConfig/useConfig-client.js'
import type { ConfigFromHook } from '../../+config.js'

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
