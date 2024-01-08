// https://vike.dev/onRenderHtml
export { onRenderHtml }

import { renderToNodeStream, renderToString } from 'vue/server-renderer'
import { dangerouslySkipEscape, escapeInject, version } from 'vike/server'
import { getTitle } from './getTitle.js'
import { getLang } from './getLang.js'
import type { OnRenderHtmlAsync } from 'vike/types'
import { createVueApp } from './app.js'
import { App } from 'vue'

checkVikeVersion()

const onRenderHtml: OnRenderHtmlAsync = async (pageContext): ReturnType<OnRenderHtmlAsync> => {
  const { stream } = pageContext.config
  let pageView: ReturnType<typeof dangerouslySkipEscape> | ReturnType<typeof renderToNodeStream> | string = ''

  if (!!pageContext.Page) {
    // SSR is enabled
    const app = createVueApp(pageContext)
    pageView = !stream
      ? dangerouslySkipEscape(await renderToStringWithErrorHandling(app))
      : renderToNodeStreamWithErrorHandling(app)
  }

  const title = getTitle(pageContext)
  const titleTag = !title ? '' : escapeInject`<title>${title}</title>`

  const { description } = pageContext.config
  const descriptionTag = !description ? '' : escapeInject`<meta name="description" content="${description}" />`

  const { favicon } = pageContext.config
  const faviconTag = !favicon ? '' : escapeInject`<link rel="icon" href="${favicon}" />`

  let headHtml: ReturnType<typeof dangerouslySkipEscape> | string = ''
  if (!!pageContext.config.Head) {
    const app = createVueApp(pageContext, /*ssrApp*/ true, /*renderHead*/ true)
    headHtml = dangerouslySkipEscape(await renderToStringWithErrorHandling(app))
  }

  const lang = getLang(pageContext) || 'en'

  const documentHtml = escapeInject`<!DOCTYPE html>
    <html lang='${lang}'>
      <head>
        <meta charset="UTF-8" />
        ${faviconTag}
        ${titleTag}
        ${descriptionTag}
        ${headHtml}
      </head>
      <body>
        <div id="page-view">${pageView}</div>
      </body>
      <!-- built with https://github.com/vikejs/vike-vue -->
    </html>`

  return {
    documentHtml,
    pageContext: {
      enableEagerStreaming: true
    }
  }
}

async function renderToStringWithErrorHandling(app: App) {
  let returned = false
  let err: unknown
  // Workaround: renderToString_() swallows errors in production, see https://github.com/vuejs/core/issues/7876
  app.config.errorHandler = (err_) => {
    if (returned) {
      console.error(err_)
    } else {
      err = err_
    }
  }
  const appHtml = await renderToString(app)
  returned = true
  if (err) throw err
  return appHtml
}

function renderToNodeStreamWithErrorHandling(app: App) {
  let returned = false
  let err: unknown
  app.config.errorHandler = (err_) => {
    if (returned) {
      console.error(err_)
    } else {
      err = err_
    }
  }
  const appHtml = renderToNodeStream(app)
  returned = true
  if (err) throw err
  return appHtml
}

function checkVikeVersion() {
  if (version) {
    const versionParts = version.split('.').map((s) => parseInt(s, 10)) as [number, number, number]
    if (versionParts[0] > 0) return
    if (versionParts[1] > 4) return
    if (versionParts[2] >= 147) return
  }
  throw new Error('Update Vike to its latest version (or vike@0.4.147 and any version above)')
}
