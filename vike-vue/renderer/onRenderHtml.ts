export default onRenderHtml

import { renderToNodeStream, renderToString } from '@vue/server-renderer'
import { dangerouslySkipEscape, escapeInject } from 'vite-plugin-ssr/server'
import { getTitle } from './getTitle.js'
import type { PageContextServer } from './types'
import { createVueApp } from './app'

async function onRenderHtml(pageContext: PageContextServer) {
  let pageStream: ReturnType<typeof renderToNodeStream> | string = ''
  if (pageContext.Page !== undefined) {
    // SSR is enabled
    const app = createVueApp(pageContext)
    pageStream = await renderToNodeStream(app)
  }

  const title = getTitle(pageContext)
  const titleTag = !title ? '' : escapeInject`<title>${title}</title>`

  const { description } = pageContext.config
  const descriptionTag = !description ? '' : escapeInject`<meta name="description" content="${description}" />`

  const { favicon } = pageContext.config
  const faviconTag = !favicon ? '' : escapeInject`<link rel="icon" href="${favicon}" />`

  let headHtml = ''
  if (pageContext.config.Head !== undefined) {
    const app = createVueApp(pageContext, /*ssrApp*/ true, /*renderHead*/ true)
    headHtml = await renderToString(app)
  }

  const lang = pageContext.config.lang || 'en'

  const documentHtml = escapeInject`<!DOCTYPE html>
    <html lang='${lang}'>
      <head>
        <meta charset="UTF-8" />
        ${faviconTag}
        ${titleTag}
        ${descriptionTag}
        ${dangerouslySkipEscape(headHtml)}
      </head>
      <body>
        <div id="page-view">${pageStream}</div>
      </body>
    </html>`

  return {
    documentHtml,
    pageContext: {
      enableEagerStreaming: true
    }
  }
}
