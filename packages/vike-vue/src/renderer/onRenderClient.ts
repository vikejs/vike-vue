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

    const title = getHeadSetting('title', pageContext) || ''
    const lang = getHeadSetting('lang', pageContext) || 'en'
    const favicon = getHeadSetting('favicon', pageContext)

    if (title !== undefined)
      // We skip if the value is undefined because we shouldn't remove values set in HTML (by the Head setting).
      //  - This also means that previous values will leak: upon client-side navigation, the title set by the previous
      //    page won't be removed if the next page doesn't override it. But that's okay because usually pages always have
      //    a favicon and title, which means that previous values are always overridden. Also, as a workaround, the user
      //    can set the value to `null` to ensure that previous values are overridden.
      document.title = title
    if (lang !== undefined) document.documentElement.lang = lang
    if (favicon !== undefined) setFavicon(favicon)
    replaceAdjacentBodyHtml(pageContext, 'bodyHtmlBegin')
    replaceAdjacentBodyHtml(pageContext, 'bodyHtmlEnd')
  }
}

// https://stackoverflow.com/questions/260857/changing-website-favicon-dynamically/260876#260876
function setFavicon(faviconUrl: string | null) {
  let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']")
  if (!faviconUrl) {
    if (link) document.head.removeChild(link)
    return
  }
  if (!link) {
    link = document.createElement('link')
    link.rel = 'icon'
    document.head.appendChild(link)
  }
  link.href = faviconUrl
}

async function replaceAdjacentBodyHtml(pageContext: PageContextClient, method: 'bodyHtmlBegin' | 'bodyHtmlEnd') {
  const hooks = pageContext.config[method]
  if (!hooks) return

  const hookHtml = (await callCumulativeHooks(hooks, pageContext)).join('')
  // replace everything between existing comments <!-- bodyHtmlBegin begin --> and <!-- bodyHtmlBegin finish -->
  const startComment = `<!-- vike-vue:${method} begin -->`
  const endComment = `<!-- vike-vue:${method} finish -->`
  const startIndex = document.body.innerHTML.indexOf(startComment) + startComment.length
  const endIndex = document.body.innerHTML.indexOf(endComment)
  if (startIndex !== -1 && endIndex !== -1) {
    document.body.innerHTML =
      document.body.innerHTML.substring(0, startIndex) + hookHtml + document.body.innerHTML.substring(endIndex)
  }
}
