export { Config }

import { defineComponent, watchEffect } from 'vue'
import { useConfig } from '../../hooks/useConfig/useConfig-client.js'
import { noop } from '../../utils/noop.js'
import { configsFromHook } from '../../types/Config.js'
import type { ConfigFromHook } from '../../types/Config.js'

const Config = defineComponent<ConfigFromHook>(
  (props) => {
    const config = useConfig()
    watchEffect(() => {
      config(props)
    })
    return noop
  },
  {
    name: 'Config',
    inheritAttrs: false,
    props: [...configsFromHook],
  },
)
