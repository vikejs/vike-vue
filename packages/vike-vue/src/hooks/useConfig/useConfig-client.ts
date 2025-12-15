export { useConfig }

import type { PageContext } from 'vike/types'
import type { PageContextInternal } from '../../types/PageContext.js'
import type { ConfigViaHook } from '../../types/Config.js'
import { usePageContext } from '../usePageContext.js'
import { getPageContext } from 'vike/getPageContext'
import { applyHeadSettings } from '../../integration/applyHeadSettings.js'
import { type MaybeRefOrGetter, toValue, watchEffect } from 'vue'

function useConfig(): (config: MaybeRefOrGetter<ConfigViaHook>) => void {
  // Vike hook
  let pageContext = getPageContext({ asyncHook: false }) as PageContext & PageContextInternal
  if (pageContext) return (config) => setPageContextConfigViaHook(toValue(config), pageContext)

  // Component
  pageContext = usePageContext()
  return (config) => {
    watchEffect(() => {
      const configValue = toValue(config)
      if (!pageContext._headAlreadySetWrapper!.val) {
        setPageContextConfigViaHook(configValue, pageContext)
      } else {
        applyHead(configValue)
      }
    })
  }
}

function setPageContextConfigViaHook(config: ConfigViaHook, pageContext: PageContextInternal) {
  pageContext._configViaHook ??= {}
  Object.assign(pageContext._configViaHook, config)
}

function applyHead(config: ConfigViaHook) {
  const { title, lang } = config
  applyHeadSettings(title, lang)
}
