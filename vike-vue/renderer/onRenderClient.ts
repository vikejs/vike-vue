export default onRenderClient

import { createVueApp } from './app'
import { getTitle } from './getTitle.js'
import type { PageContextClient } from './types'

let app: ReturnType<typeof createVueApp>
async function onRenderClient(pageContext: PageContextClient) {
  if (!app) {
    const container = document.getElementById('page-view')!
    const ssr = container.innerHTML !== ''
    app = createVueApp(pageContext, ssr)
    app.mount(container)
  } else {
    app.changePage(pageContext)
  }

  const title = getTitle(pageContext)
  if (title !== null) {
    document.title = title
  }
}
