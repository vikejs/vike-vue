// https://vike.dev/onRenderClient
export { onRenderClient }

import { createVueApp, type ChangePage } from './createVueApp.js'
import { getHeadSetting } from './getHeadSetting.js'
import type { OnRenderClientAsync, PageContextClient } from 'vike/types'
import { callCumulativeHooks } from '../utils/callCumulativeHooks.js'
import type { App } from 'vue'
import { objectAssign } from '../utils/objectAssign.js'

let app: App | undefined
let changePage: ChangePage | undefined
const onRenderClient: OnRenderClientAsync = async (pageContext): ReturnType<OnRenderClientAsync> => {
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
    // E.g. document.title
    updateDocument(pageContext)
  }
}

function updateDocument(pageContext: PageContextClient) {
  const title = getHeadSetting('title', pageContext)
  const lang = getHeadSetting('lang', pageContext)

  // - We skip if `undefined` as we shouldn't remove values set by the Head setting.
  // - Setting a default prevents the previous value to be leaked: upon client-side navigation, the value set by the previous page won't be removed if the next page doesn't override it.
  //   - Most of the time, the user sets a default himself (i.e. a value defined at /pages/+config.js)
  //     - If he doesn't have a default then he can use `null` to opt into Vike's defaults
  if (title !== undefined) document.title = title || ''
  if (lang !== undefined) document.documentElement.lang = lang || 'en'
}
