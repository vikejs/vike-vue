export { useConfig }

import type { PageContext } from 'vike/types'
import type { PageContextInternal } from '../../types/PageContext.js'
import type { ConfigFromHook } from '../../types/Config.js'
import { usePageContext } from '../usePageContext.js'
import { getPageContext } from 'vike/getPageContext'
import { applyHeadSettings } from '../../integration/applyHeadSettings.js'
import { type MaybeRefOrGetter, ShallowRef, toValue, watchEffect } from 'vue'

function useConfig(): (config: MaybeRefOrGetter<ConfigFromHook>) => void {
  // Vike hook
  const pageContextInternal = getPageContext() as PageContext & PageContextInternal
  if (pageContextInternal) return (config) => setPageContextConfigFromHook(toValue(config), pageContextInternal)

  // Component
  const pageContext = usePageContext() as ShallowRef<PageContext & PageContextInternal>
  return (config) => {
    watchEffect(() => {
      const configValue = toValue(config)
      if (!pageContext.value._headAlreadySetWrapper!.val) {
        setPageContextConfigFromHook(configValue, pageContext.value)
      } else {
        applyHead(configValue)
      }
    })
  }
}

function setPageContextConfigFromHook(config: ConfigFromHook, pageContext: PageContextInternal) {
  pageContext._configFromHook ??= {}
  Object.assign(pageContext._configFromHook, config)
}

function applyHead(config: ConfigFromHook) {
  const { title, lang } = config
  applyHeadSettings(title, lang)
}
