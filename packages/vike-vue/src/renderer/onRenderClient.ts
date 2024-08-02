// https://vike.dev/onRenderClient
export { onRenderClient }

import { createVueApp, type ChangePage } from './createVueApp.js'
import { getHeadSetting } from './getHeadSetting.js'
import type { OnRenderClientAsync } from 'vike/types'
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

    const title = getHeadSetting('title', pageContext) || ''
    const lang = getHeadSetting('lang', pageContext) || 'en'

    if (title !== undefined)
      // We skip if the value is undefined because we shouldn't remove values set in HTML (by the Head setting).
      //  - This also means that previous values will leak: upon client-side navigation, the title set by the previous
      //    page won't be removed if the next page doesn't override it. But that's okay because usually pages always have
      //    a favicon and title, which means that previous values are always overridden. Also, as a workaround, the user
      //    can set the value to `null` to ensure that previous values are overridden.
      document.title = title
    if (lang !== undefined) document.documentElement.lang = lang
  }
}
