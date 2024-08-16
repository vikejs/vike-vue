// https://vike.dev/onRenderClient
export { onRenderClient }

import { createVueApp, type ChangePage } from './createVueApp.js'
import { getHeadSetting } from './getHeadSetting.js'
import type { OnRenderClientAsync, PageContextClient } from 'vike/types'
import { callCumulativeHooks } from '../utils/callCumulativeHooks.js'
import type { App } from 'vue'
import { objectAssign } from '../utils/objectAssign.js'
import type { PageContextInternal } from '../types/PageContext.js'
import { applyHeadSettings } from './applyHeadSettings.js'

let app: App | undefined
let changePage: ChangePage | undefined
const onRenderClient: OnRenderClientAsync = async (
  pageContext: PageContextClient & PageContextInternal,
): ReturnType<OnRenderClientAsync> => {
  // Workaround for https://github.com/vikejs/vike-vue/pull/178#issuecomment-2285852251b
  pageContext._configFromHook ??= {}
  // Workaround for https://github.com/vikejs/vike-vue/issues/181
  pageContext._headAlreadySetWrapper = { val: pageContext.isHydration }

  if (!app) {
    // First rendering/hydration

    const container = document.getElementById('app')!
    const ssr = container.innerHTML !== ''
    const res = await createVueApp(pageContext, ssr, 'Page')
    changePage = res.changePage
    app = res.app
    objectAssign(pageContext, { app })

    await callCumulativeHooks(pageContext.config.onBeforeRenderClient, pageContext)

    app.mount(container)
  } else {
    // Client-side navigation

    await callCumulativeHooks(pageContext.config.onBeforeRenderClient, pageContext)
    await changePage!(pageContext)
  }

  if (!pageContext.isHydration) {
    pageContext._headAlreadySetWrapper!.val = true
    applyHead(pageContext)
  }

  // Use cases:
  // - Custom user settings: https://vike.dev/head-tags#custom-settings
  // - Testing tools: https://github.com/vikejs/vike-react/issues/95
  await callCumulativeHooks(pageContext.config.onAfterRenderClient, pageContext)
}

function applyHead(pageContext: PageContextClient) {
  const title = getHeadSetting<string | null>('title', pageContext)
  const lang = getHeadSetting<string | null>('lang', pageContext)
  applyHeadSettings(title, lang)
}
