export { useConfig }

import type { PageContext } from 'vike/types'
import type { PageContextInternal } from '../../types/PageContext.js'
import type { ConfigFromHook } from '../../types/Config.js'
import { usePageContext } from '../usePageContext.js'
import { getPageContext } from 'vike/getPageContext'

function useConfig(): (config: ConfigFromHook) => void {
  console.log('useConfig()')
  // Vike hook
  let pageContext = getPageContext() as PageContext & PageContextInternal
  if (pageContext) return (config: ConfigFromHook) => setPageContextConfigFromHook(config, pageContext)

  // Component
  pageContext = usePageContext()
  return (config: ConfigFromHook) => {
    console.log('config()')
    if (!pageContext._headAlreadySet) {
      setPageContextConfigFromHook(config, pageContext)
    } else {
      apply(config)
    }
  }
}

function setPageContextConfigFromHook(config: ConfigFromHook, pageContext: PageContextInternal) {
  pageContext._configFromHook ??= {}
  Object.assign(pageContext._configFromHook, config)
}

function apply(config: ConfigFromHook) {
  console.log('apply()')
  const { title } = config
  if (title) window.document.title = title
}
