export { Config }

// Same as ./Config-client.ts but importing useConfig-server.js

import { useConfig } from '../../hooks/useConfig/useConfig-server.js'
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
