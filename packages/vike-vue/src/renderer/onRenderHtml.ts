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
import { getTagAttributesString, type TagAttributes } from '../utils/getTagAttributesString.js'

checkVikeVersion()

const onRenderHtml: OnRenderHtmlAsync = async (pageContext): ReturnType<OnRenderHtmlAsync> => {
  const title = getHeadSetting('title', pageContext)
  const favicon = getHeadSetting('favicon', pageContext)

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

  const { htmlAttributesString, bodyAttributesString } = getTagAttributes(pageContext)

  const documentHtml = escapeInject`<!DOCTYPE html>
    <html${dangerouslySkipEscape(htmlAttributesString)}>
      <head>
        <meta charset="UTF-8" />
        ${titleTag}
        ${headHtml}
        ${faviconTag}
      </head>
      <body${dangerouslySkipEscape(bodyAttributesString)}>
        ${bodyHtmlBegin}
        <div id="app">${pageView}</div>
        ${bodyHtmlEnd}
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

function getTagAttributes(pageContext: PageContext) {
  let lang = getHeadSetting('lang', pageContext)
  // Don't set `lang` to its default value if it's `null` (so that users can set it to `null` in order to remove the default value)
  if (lang === undefined) lang = 'en'

  const bodyAttributes = mergeTagAttributesList(pageContext.config.bodyAttributes)
  const htmlAttributes = mergeTagAttributesList(pageContext.config.htmlAttributes)

  const bodyAttributesString = getTagAttributesString(bodyAttributes)
  const htmlAttributesString = getTagAttributesString({ ...htmlAttributes, lang: lang ?? htmlAttributes.lang })

  return { htmlAttributesString, bodyAttributesString }
}
function mergeTagAttributesList(tagAttributesList: TagAttributes[] = []) {
  const tagAttributes: TagAttributes = {}
  tagAttributesList.forEach((tagAttrs) => Object.assign(tagAttributes, tagAttrs))
  return tagAttributes
}

async function renderToStringWithErrorHandling(app: App, ctx?: SSRContext) {
  let returned = false
  let err: unknown
  // Workaround: Vue's renderToString() swallows errors in production https://github.com/vuejs/core/issues/7876
  // Let's eventually use app.config.throwUnhandledErrorInProduction instead (recently released in vue@3.5).
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
