export { Config }

// Same as ./Config-server.ts but importing useConfig-client.js

import { defineComponent } from 'vue'
import { useConfig, configsClientSide } from '../../hooks/useConfig/useConfig-client.js'
import type { ConfigFromHook } from '../../+config.js'

const Config = defineComponent<ConfigFromHook>(
  (props) => {
    const config = useConfig()
    config(props)
    return () => {}
  },
  // manual runtime props declaration is currently still needed.
  // see https://vuejs.org/api/general.html#function-signature
  {
    props: [...configsClientSide],
  },
)
