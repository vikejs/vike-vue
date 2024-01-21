// https://vike.dev/onRenderHtml
export { onRenderHtml }

import { renderToNodeStream, renderToString } from 'vue/server-renderer'
import { dangerouslySkipEscape, escapeInject, version } from 'vike/server'
import { getHeadSetting } from './getHeadSetting.js'
import type { OnRenderHtmlAsync } from 'vike/types'
import { createVueApp } from './app.js'
import { App } from 'vue'

checkVikeVersion()

const onRenderHtml: OnRenderHtmlAsync = async (pageContext): ReturnType<OnRenderHtmlAsync> => {
  const title = getHeadSetting('title', pageContext)
  const favicon = getHeadSetting('favicon', pageContext)
  const lang = getHeadSetting('lang', pageContext) || 'en'

  const titleTag = !title ? '' : escapeInject`<title>${title}</title>`
  const faviconTag = !favicon ? '' : escapeInject`<link rel="icon" href="${favicon}" />`

  let pageView: ReturnType<typeof dangerouslySkipEscape> | ReturnType<typeof renderToNodeStream> | string = ''
  let fromHtmlRenderer = undefined

  if (!!pageContext.Page) {
    // SSR is enabled
    const ctxWithApp = await createVueApp(pageContext)
    const { app } = ctxWithApp
    pageView = !pageContext.config.stream
      ? dangerouslySkipEscape(await renderToStringWithErrorHandling(app))
      : renderToNodeStreamWithErrorHandling(app)

    fromHtmlRenderer = await pageContext.config.onAfterRenderSSRApp?.(ctxWithApp)
  }

  let headHtml: ReturnType<typeof dangerouslySkipEscape> | string = ''
  if (!!pageContext.config.Head) {
    const { app } = await createVueApp(pageContext, /*ssrApp*/ true, /*renderHead*/ true)
    headHtml = dangerouslySkipEscape(await renderToStringWithErrorHandling(app))
  }

  const documentHtml = escapeInject`<!DOCTYPE html>
    <html lang='${lang}'>
      <head>
        <meta charset="UTF-8" />
        ${titleTag}
        ${headHtml}
        ${faviconTag}
      </head>
      <body>
        <div id="page-view">${pageView}</div>
      </body>
      <!-- built with https://github.com/vikejs/vike-vue -->
    </html>`

  return {
    documentHtml,
    pageContext: {
      enableEagerStreaming: true,
      fromHtmlRenderer
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
  throw new Error('Update Vike to 0.4.147 or above')
}
