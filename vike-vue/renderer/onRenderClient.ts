// https://vike.dev/onRenderClient
export { onRenderClient }

import { createVueApp } from './app.js'
import { getLang } from './getLang.js'
import { getTitle } from './getTitle.js'
import type { OnRenderClientAsync } from 'vike/types'

let app: ReturnType<typeof createVueApp>
const onRenderClient: OnRenderClientAsync = async (pageContext): ReturnType<OnRenderClientAsync> => {
  if (!app) {
    // First rendering/hydration

    const container = document.getElementById('page-view')!
    const ssr = container.innerHTML !== ''
    app = createVueApp(pageContext, ssr)

    pageContext.config.hydrateStore?.({ ...pageContext, app })

    app.mount(container)
  } else {
    // Client routing
    // See https://vike.dev/server-routing-vs-client-routing

    await app.changePage(pageContext)

    // Get the page's `title` config value, which may be different from the
    // previous page. It can even be null, in which case we should unset the
    // document title.
    const title = getTitle(pageContext)
    const lang = getLang(pageContext) || 'en'
    document.title = title || ''
    document.documentElement.lang = lang
  }
}
