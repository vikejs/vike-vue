export { Config }

import { defineComponent } from 'vue'
import { useConfig } from '../../hooks/useConfig/useConfig-client.js'
import { noop } from '../../utils/noop.js'
import { configsViaHook } from '../../types/Config.js'
import type { ConfigViaHook } from '../../types/Config.js'

const Config = defineComponent<ConfigViaHook>(
  (props) => {
    const config = useConfig()
    config(props)
    return noop
  },
  {
    name: 'Config',
    inheritAttrs: false,
    props: [...configsViaHook],
  },
)
