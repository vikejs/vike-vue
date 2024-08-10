export { Config }

// Same as ./Config-client.ts but importing useConfig-server.js

import { defineComponent } from 'vue'
import { useConfig, configsCumulative, configsOverridable } from '../../hooks/useConfig/useConfig-server.js'
import type { ConfigFromHook } from '../../+config.js'

/**
 * Set configurations inside Vue components.
 *
 * https://vike.dev/useConfig
 */
const Config = defineComponent<ConfigFromHook>(
  (props) => {
    const config = useConfig()
    if (props.Head) {
      // remove CSS scope marker (data-v-...)
      props.Head.scopeId = undefined
    }
    config(props)
    return () => {}
  },
  // manual runtime props declaration is currently still needed.
  // see https://vuejs.org/api/general.html#function-signature
  {
    props: [...configsCumulative, ...configsOverridable],
  },
)
