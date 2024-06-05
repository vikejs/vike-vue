// https://vike.dev/onRenderHtml
export { onRenderHtml }

import { renderToNodeStream, renderToString, type SSRContext } from 'vue/server-renderer'
import { dangerouslySkipEscape, escapeInject, version } from 'vike/server'
import { getHeadSetting } from './getHeadSetting.js'
import type { OnRenderHtmlAsync, PageContext } from 'vike/types'
import { createVueApp } from './createVueApp.js'
import { App } from 'vue'
import { callCumulativeHooks } from '../utils/callCumulativeHooks.js'
import { objectAssign } from '../utils/objectAssign.js'

checkVikeVersion()

const onRenderHtml: OnRenderHtmlAsync = async (pageContext): ReturnType<OnRenderHtmlAsync> => {
  const title = getHeadSetting('title', pageContext)
  const favicon = getHeadSetting('favicon', pageContext)
  const lang = getHeadSetting('lang', pageContext) || 'en'

  const titleTag = !title ? '' : escapeInject`<title>${title}</title>`
  const faviconTag = !favicon ? '' : escapeInject`<link rel="icon" href="${favicon}" />`

  let pageView: ReturnType<typeof dangerouslySkipEscape> | ReturnType<typeof renderToNodeStream> | string = ''
  const ssrContext: SSRContext = {}
  const fromHtmlRenderer: PageContext['fromHtmlRenderer'] = {}

  if (!!pageContext.Page) {
    // SSR is enabled
    const { app } = await createVueApp(pageContext, true, 'Page')
    objectAssign(pageContext, { app })
    pageView = !pageContext.config.stream
      ? dangerouslySkipEscape(await renderToStringWithErrorHandling(app, ssrContext))
      : renderToNodeStreamWithErrorHandling(app, ssrContext)

    const afterRenderResults = await callCumulativeHooks(pageContext.config.onAfterRenderHtml, pageContext)
    Object.assign(pageContext, { ssrContext })

    Object.assign(fromHtmlRenderer, ...afterRenderResults)
  }

  let headHtml: ReturnType<typeof dangerouslySkipEscape> | string = ''
  if (pageContext.config.Head) {
    const { app } = await createVueApp(pageContext, true, 'Head')
    headHtml = dangerouslySkipEscape(await renderToStringWithErrorHandling(app))
  }

  const bodyHtmlStart = dangerouslySkipEscape(
    (await callCumulativeHooks(pageContext.config.bodyHtmlStart, pageContext)).join(''),
  )

  // we define this hook here so that it doesn't need to be exported by vike-vue
  const defaultTeleport = `<div id="teleported">${ssrContext.teleports?.['#teleported'] ?? ''}</div>`

  const bodyHtmlEndHooks = [defaultTeleport, ...(pageContext.config.bodyHtmlEnd ?? [])]
  const bodyHtmlEnd = dangerouslySkipEscape((await callCumulativeHooks(bodyHtmlEndHooks, pageContext)).join(''))

  const documentHtml = escapeInject`<!DOCTYPE html>
    <html lang='${lang}'>
      <head>
        <meta charset="UTF-8" />
        ${titleTag}
        ${headHtml}
        ${faviconTag}
      </head>
      <body>
        <!-- vike-vue:bodyHtmlStart begin -->
        ${bodyHtmlStart}
        <!-- vike-vue:bodyHtmlStart finish -->
        <div id="app">${pageView}</div>
        <!-- vike-vue:bodyHtmlEnd begin -->
        ${bodyHtmlEnd}
        <!-- vike-vue:bodyHtmlEnd finish -->
      </body>
      <!-- built with https://github.com/vikejs/vike-vue -->
    </html>`

  return {
    documentHtml,
    pageContext: {
      enableEagerStreaming: true,
      fromHtmlRenderer,
    },
  }
}

async function renderToStringWithErrorHandling(app: App, ctx?: SSRContext) {
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
  const appHtml = await renderToString(app, ctx)
  returned = true
  if (err) throw err
  return appHtml
}

function renderToNodeStreamWithErrorHandling(app: App, ctx?: SSRContext) {
  let returned = false
  let err: unknown
  app.config.errorHandler = (err_) => {
    if (returned) {
      console.error(err_)
    } else {
      err = err_
    }
  }
  const appHtml = renderToNodeStream(app, ctx)
  returned = true
  if (err) throw err
  return appHtml
}

// We don't need this anymore starting from vike@0.4.173 which added the `require` setting.
// TODO/eventually: remove this once <=0.4.172 versions become rare.
function checkVikeVersion() {
  if (version) {
    const versionParts = version.split('.').map((s) => parseInt(s, 10)) as [number, number, number]
    if (versionParts[0] > 0) return
    if (versionParts[1] > 4) return
    if (versionParts[2] >= 172) return
  }
  // We can leave it 0.4.172 until we entirely remove checkVikeVersion() (because starting vike@0.4.173 we use the new `require` setting).
  throw new Error('Update Vike to 0.4.172 or above')
}
