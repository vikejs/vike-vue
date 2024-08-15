// https://vike.dev/onRenderClient
export { onRenderClient, applyHeadSettings }

import { createVueApp, type ChangePage } from './createVueApp.js'
import { getHeadSetting } from './getHeadSetting.js'
import type { OnRenderClientAsync, PageContextClient } from 'vike/types'
import { callCumulativeHooks } from '../utils/callCumulativeHooks.js'
import type { App } from 'vue'
import { objectAssign } from '../utils/objectAssign.js'
import type { PageContextInternal } from '../types/PageContext.js'

let app: App | undefined
let changePage: ChangePage | undefined
const onRenderClient: OnRenderClientAsync = async (
  pageContext: PageContextClient & PageContextInternal,
): ReturnType<OnRenderClientAsync> => {
  // Workaround for https://github.com/vikejs/vike-vue/pull/178#issuecomment-2285852251b
  pageContext._configFromHook ??= {}
  // Workaround for https://github.com/vikejs/vike-vue/issues/181
  pageContext._headAlreadySetWrapper = { val: !pageContext.isHydration }

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
    applyHeadSettings(pageContext)
  } else {
    // Client-side navigation

    await callCumulativeHooks(pageContext.config.onBeforeRenderClient, pageContext)
    await changePage!(pageContext)
  }

  // Use cases:
  // - Custom user settings: https://vike.dev/head-tags#custom-settings
  // - Testing tools: https://github.com/vikejs/vike-react/issues/95
  await callCumulativeHooks(pageContext.config.onAfterRenderClient, pageContext)
}

function applyHeadSettings(pageContext: PageContextClient & PageContextInternal) {
  console.log('applyHeadSettings()')

  pageContext._headAlreadySetWrapper!.val = true
  const title = getHeadSetting<string | null>('title', pageContext)
  const lang = getHeadSetting<string | null>('lang', pageContext)

  // - We skip if `undefined` as we shouldn't remove values set by the Head setting.
  // - Setting a default prevents the previous value to be leaked: upon client-side navigation, the value set by the previous page won't be removed if the next page doesn't override it.
  //   - Most of the time, the user sets a default himself (i.e. a value defined at /pages/+config.js)
  //     - If he doesn't have a default then he can use `null` to opt into Vike's defaults
  if (title !== undefined) document.title = title || ''
  if (lang !== undefined) document.documentElement.lang = lang || 'en'
}
