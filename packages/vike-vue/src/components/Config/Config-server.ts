export { Config }

// Same as ./Config-client.ts but importing useConfig-server.js

import { defineComponent } from 'vue'
import { useConfig } from '../../hooks/useConfig/useConfig-server.js'
import { ConfigFromHook } from '../../types/Config.js'
import { removeCssScopeId } from '../../utils/removeCssScopeId.js'

/**
 * Set configurations inside Vue components.
 *
 * https://vike.dev/useConfig
 */
const Config = defineComponent<ConfigFromHook>(
  (props) => {
    const config = useConfig()

    const Head = removeCssScopeId(props.Head)
    config({ ...props, Head })
    return () => {}
  },
  // Manual runtime props declaration is currently still needed.
  // See https://vuejs.org/api/general.html#function-signature
  {
    name: 'Config',
    inheritAttrs: false,
    props: ['Head', 'description', 'favicon', 'image', 'title', 'viewport'],
  },
)
