export { useConfig }

import type { PageContext } from 'vike/types'
import type { PageContextInternal } from '../../types/PageContext.js'
import type { ConfigFromHook } from '../../types/Config.js'
import { usePageContext } from '../usePageContext.js'
import { getPageContext } from 'vike/getPageContext'

/**
 * Set configurations inside React components and Vike hooks.
 *
 * https://vike.dev/useConfig
 */
function useConfig(): (config: ConfigFromHook) => void {
  const configSetter = (config: ConfigFromHook) => setConfigOverPageContext(config, pageContext)

  // Vike hook
  let pageContext = getPageContext() as PageContext & PageContextInternal
  if (pageContext) return configSetter

  // React component
  pageContext = usePageContext()
  return (config: ConfigFromHook) => {
    if (!pageContext._headAlreadySet) {
      configSetter(config)
    } else {
      throw new Error("Using useConfig() with HTML streaming isn't supported yet")
    }
  }
}

const configsHtmlOnly = ['Head', 'description', 'image'] as const
const configsCumulative = ['Head'] as const
const configsOverridable = ['title', 'description', 'image'] as const
function setConfigOverPageContext(config: ConfigFromHook, pageContext: PageContext & PageContextInternal) {
  pageContext._configFromHook ??= {}

  if (pageContext.isClientSideNavigation) {
    // Remove HTML only configs which the client-side doesn't need (also avoiding serialization errors)
    for (const configName of configsHtmlOnly) delete config[configName]
  }

  // Cumulative values
  configsCumulative.forEach((configName) => {
    const configValue = config[configName]
    if (!configValue) return
    pageContext._configFromHook![configName] ??= []
    pageContext._configFromHook![configName].push(configValue)
  })

  // Overridable values
  configsOverridable.forEach((configName) => {
    const configValue = config[configName]
    if (!configValue) return
    pageContext._configFromHook![configName] = configValue
  })
}
