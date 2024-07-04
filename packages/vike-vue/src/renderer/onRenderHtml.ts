// https://vike.dev/onRenderHtml
export { onRenderHtml }

import { dangerouslySkipEscape, escapeInject, version } from 'vike/server'
import type { OnRenderHtmlAsync, PageContext } from 'vike/types'
import { App } from 'vue'
import { type SSRContext, renderToNodeStream, renderToString, renderToWebStream } from 'vue/server-renderer'
import { callCumulativeHooks } from '../utils/callCumulativeHooks.js'
import { objectAssign } from '../utils/objectAssign.js'
import { createVueApp } from './createVueApp.js'
import { getHeadSetting } from './getHeadSetting.js'
import { escapeHtml } from '../utils/escapeHtml.js'
import { TagAttribues } from '../hooks/types.js'

checkVikeVersion()

const onRenderHtml: OnRenderHtmlAsync = async (pageContext): ReturnType<OnRenderHtmlAsync> => {
  const title = getHeadSetting('title', pageContext)
  const favicon = getHeadSetting('favicon', pageContext)
  const lang = getHeadSetting('lang', pageContext) || 'en'

  const titleTag = !title ? '' : escapeInject`<title>${title}</title>`
  const faviconTag = !favicon ? '' : escapeInject`<link rel="icon" href="${favicon}" />`

  let pageView:
    | ReturnType<typeof dangerouslySkipEscape>
    | ReturnType<typeof renderToNodeStream>
    | ReturnType<typeof renderToWebStream>
    | string = ''
  const ssrContext: SSRContext = {}
  const fromHtmlRenderer: PageContext['fromHtmlRenderer'] = {}

  if (!!pageContext.Page) {
    // SSR is enabled
    const { app } = await createVueApp(pageContext, true, 'Page')
    objectAssign(pageContext, { app })
    pageView = !pageContext.config.stream
      ? dangerouslySkipEscape(await renderToStringWithErrorHandling(app, ssrContext))
      : pageContext.config.stream === 'web'
        ? renderToWebStreamWithErrorHandling(app, ssrContext)
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

  const bodyHtmlBegin = dangerouslySkipEscape(
    (await callCumulativeHooks(pageContext.config.bodyHtmlBegin, pageContext)).join(''),
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
      <body${dangerouslySkipEscape(stringifyAttributes(pageContext.config.bodyTagAttributes ?? {}))}>
        <!-- vike-vue:bodyHtmlBegin start -->
        ${bodyHtmlBegin}
        <!-- vike-vue:bodyHtmlBegin finish -->
        <div id="app">${pageView}</div>
        <!-- vike-vue:bodyHtmlEnd start -->
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

function renderToWebStreamWithErrorHandling(app: App, ctx?: SSRContext) {
  let returned = false
  let err: unknown
  app.config.errorHandler = (err_) => {
    if (returned) {
      console.error(err_)
    } else {
      err = err_
    }
  }
  const appHtml = renderToWebStream(app, ctx)
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

function stringifyAttributes(attributes: TagAttribues) {
  let result = ''
  for (const [key, value] of Object.entries(attributes)) {
    if (
      ['key', 'textContent', 'innerHTML', 'children', 'tagName'].includes(key) ||
      value === false ||
      value === undefined
    ) {
      continue
    }

    if (value === true) {
      result += ` ${escapeHtml(key)}`
      continue
    }

    result += ` ${escapeHtml(key)}="${escapeHtml(String(value))}"`
  }

  return result
}
