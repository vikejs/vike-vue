export { Config }

// Same as ./Config-server.ts but importing useConfig-client.js

import { useConfig } from '../../hooks/useConfig/useConfig-client.js'
import type { ConfigFromHook } from '../../+config.js'

// TODO: make this a Vue component

/**
 * Set configurations inside React components.
 *
 * https://vike.dev/useConfig
 */
function Config(props: ConfigFromHook): null {
  const config = useConfig()
  config(props)
  return null
}
