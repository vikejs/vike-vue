// https://vike.dev/onRenderClient
export { onRenderClient }

import { createVueApp } from './app.js'
import { getHeadSetting } from './getHeadSetting.js'
import type { OnRenderClientAsync } from 'vike/types'
import type { VikeVueApp } from '../types/PageContext'

let app: VikeVueApp | undefined = undefined
const onRenderClient: OnRenderClientAsync = async (pageContext): ReturnType<OnRenderClientAsync> => {
  if (!app) {
    // First rendering/hydration

    const container = document.getElementById('page-view')!
    const ssr = container.innerHTML !== ''
    const ctxWithApp = await createVueApp(pageContext, ssr)
    app = ctxWithApp.app

    await pageContext.config.onBeforeMountApp?.(ctxWithApp)

    app.mount(container)
  } else {
    // Client-side navigation

    await app.changePage(pageContext)

    const title = getHeadSetting('title', pageContext) || ''
    const lang = getHeadSetting('lang', pageContext) || 'en'
    const favicon = getHeadSetting('favicon', pageContext)

    // We skip if the value is undefined because we shouldn't remove values set in HTML (by the Head setting).
    //  - This also means that previous values will leak: upon client-side navigation, the title set by the previous
    //    page won't be removed if the next page doesn't override it. But that's okay because usually pages always have
    //    a favicon and title, which means that previous values are always overridden. Also, as a workaround, the user
    //    can set the value to `null` to ensure that previous values are overridden.
    if (title !== undefined) document.title = title
    if (lang !== undefined) document.documentElement.lang = lang
    if (favicon !== undefined) setFavicon(favicon)
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
