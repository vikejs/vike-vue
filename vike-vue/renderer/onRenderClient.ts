export default onRenderClient

import { createApp } from './app'
import { getTitle } from './getTitle.js'
import type { PageContextClient } from './types'

let app: ReturnType<typeof createApp>
async function onRenderClient(pageContext: PageContextClient) {
  if (!app) {
    app = createApp(pageContext)
    app.mount('#page-view')
  }

  const title = getTitle(pageContext)
  if (title !== null) {
    document.title = title
  }
}
