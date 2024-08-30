// https://vike.dev/onRenderHtml
export { onRenderHtml }

import { dangerouslySkipEscape, escapeInject } from 'vike/server'
import type { OnRenderHtmlAsync, PageContextServer } from 'vike/types'
import { App } from 'vue'
import { type SSRContext, renderToNodeStream, renderToString, renderToWebStream } from 'vue/server-renderer'
import { callCumulativeHooks } from '../utils/callCumulativeHooks.js'
import { assert } from '../utils/assert.js'
import { createVueApp } from './createVueApp.js'
import { getHeadSetting } from './getHeadSetting.js'
import { getTagAttributesString, type TagAttributes } from '../utils/getTagAttributesString.js'
import type { PageContextInternal } from '../types/PageContext.js'

const onRenderHtml: OnRenderHtmlAsync = async (
  pageContext: PageContextServer & PageContextInternal,
): ReturnType<OnRenderHtmlAsync> => {
  const { pageHtml, fromHtmlRenderer } = await getPageHtml(pageContext)

  pageContext.isRenderingHead = true
  const headHtml = await getHeadHtml(pageContext)
  pageContext.isRenderingHead = false

  const { bodyHtmlBegin, bodyHtmlEnd } = await getBodyHtmlBoundary(pageContext)

  const { htmlAttributesString, bodyAttributesString } = getTagAttributes(pageContext)

  // Not needed on the client-side, thus we remove it to save KBs sent to the client
  delete pageContext._configFromHook

  const documentHtml = escapeInject`<!DOCTYPE html>
    <html${dangerouslySkipEscape(htmlAttributesString)}>
      <head>
        <meta charset="UTF-8" />
        ${headHtml}
      </head>
      <body${dangerouslySkipEscape(bodyAttributesString)}>
        ${bodyHtmlBegin}
        <div id="app">${pageHtml}</div>
        ${bodyHtmlEnd}
      </body>
    </html>`

  return {
    documentHtml,
    pageContext: {
      enableEagerStreaming: true,
      fromHtmlRenderer,
    },
  }
}

export type PageHtmlStream = ReturnType<typeof renderToNodeStream> | ReturnType<typeof renderToWebStream>
async function getPageHtml(pageContext: PageContextServer) {
  let pageHtml: ReturnType<typeof dangerouslySkipEscape> | PageHtmlStream | string = ''
  const ssrContext: SSRContext = {}
  const fromHtmlRenderer: PageContextServer['fromHtmlRenderer'] = {}

  let app: App | undefined
  if (
    // Whether SSR is enabled
    !!pageContext.Page
  ) {
    const { app: app_ } = await createVueApp(pageContext, true, 'Page')
    app = app_
    pageContext.app = app
  }

  // - We call onBeforeRenderHtml() right before rendering, so that pageContext.app is available to onBeforeRenderHtml()
  //   - https://github.com/vikejs/vike-vue/issues/141
  await callCumulativeHooks(pageContext.config.onBeforeRenderHtml, pageContext)

  if (!!pageContext.Page) {
    assert(app)

    if (!pageContext.config.stream) {
      const pageHtmlString = await renderToStringWithErrorHandling(app, ssrContext)
      pageContext.pageHtmlString = pageHtmlString
      pageHtml = dangerouslySkipEscape(pageHtmlString)
    } else {
      const pageHtmlStream =
        pageContext.config.stream === 'web'
          ? renderToWebStreamWithErrorHandling(app, ssrContext)
          : renderToNodeStreamWithErrorHandling(app, ssrContext)
      pageContext.pageHtmlStream = pageHtmlStream
      pageHtml = pageHtmlStream
    }

    // TODO/breaking-change: always call onAfterRenderHtml()
    //  - I.e. don't call it inside this `if (!!pageContext.Page)` block.
    //  - Tell users to use `!!pageContext.Page` if they want to apply the hook only for SSR.
    //    - Already done: https://vike.dev/onAfterRenderHtml
    const afterRenderResults = await callCumulativeHooks(pageContext.config.onAfterRenderHtml, pageContext)
    pageContext.ssrContext = ssrContext
    Object.assign(fromHtmlRenderer, ...afterRenderResults)
  }
  return { pageHtml, fromHtmlRenderer }
}

async function getHeadHtml(pageContext: PageContextServer & PageContextInternal) {
  pageContext._headAlreadySetWrapper = { val: true }

  const title = getHeadSetting<string | null>('title', pageContext)
  const favicon = getHeadSetting<string | null>('favicon', pageContext)
  const description = getHeadSetting<string | null>('description', pageContext)
  const image = getHeadSetting<string | null>('image', pageContext)

  const titleTags = !title ? '' : escapeInject`<title>${title}</title><meta property="og:title" content="${title}">`
  const faviconTag = !favicon ? '' : escapeInject`<link rel="icon" href="${favicon}" />`
  const descriptionTags = !description
    ? ''
    : escapeInject`<meta name="description" content="${description}"><meta property="og:description" content="${description}">`
  const imageTags = !image
    ? ''
    : escapeInject`<meta property="og:image" content="${image}"><meta name="twitter:card" content="summary_large_image">`
  const viewportTag = dangerouslySkipEscape(getViewportTag(getHeadSetting<Viewport>('viewport', pageContext)))

  let headElementHtml: ReturnType<typeof dangerouslySkipEscape> | string = ''
  const { app } = await createVueApp(pageContext, true, 'Head')
  headElementHtml = dangerouslySkipEscape(await renderToStringWithErrorHandling(app))

  const headHtml = escapeInject`
    ${titleTags}
    ${viewportTag}
    ${headElementHtml}
    ${faviconTag}
    ${descriptionTags}
    ${imageTags}
  `
  return headHtml
}

async function getBodyHtmlBoundary(pageContext: PageContextServer) {
  const bodyHtmlBegin = dangerouslySkipEscape(
    (await callCumulativeHooks(pageContext.config.bodyHtmlBegin, pageContext)).join(''),
  )

  // we define this hook here so that it doesn't need to be exported by vike-vue
  const defaultTeleport = `<div id="teleported">${pageContext.ssrContext!.teleports?.['#teleported'] ?? ''}</div>`
  const bodyHtmlEndHooks = [defaultTeleport, ...(pageContext.config.bodyHtmlEnd ?? [])]
  const bodyHtmlEnd = dangerouslySkipEscape((await callCumulativeHooks(bodyHtmlEndHooks, pageContext)).join(''))

  return { bodyHtmlBegin, bodyHtmlEnd }
}

function getTagAttributes(pageContext: PageContextServer) {
  let lang = getHeadSetting<string | null>('lang', pageContext)
  // Don't set `lang` to its default value if it's `null` (so that users can set it to `null` in order to remove the default value)
  if (lang === undefined) lang = 'en'

  const bodyAttributes = mergeTagAttributesList(getHeadSetting<TagAttributes[]>('bodyAttributes', pageContext))
  const htmlAttributes = mergeTagAttributesList(getHeadSetting<TagAttributes[]>('htmlAttributes', pageContext))

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

export type Viewport = 'responsive' | number | null
function getViewportTag(viewport: Viewport | undefined): string {
  if (viewport === 'responsive' || viewport === undefined) {
    // `user-scalable=no` isn't recommended anymore:
    //   - https://stackoverflow.com/questions/22354435/to-user-scalable-no-or-not-to-user-scalable-no/22544312#comment120949420_22544312
    return '<meta name="viewport" content="width=device-width,initial-scale=1">'
  }
  if (typeof viewport === 'number') {
    return `<meta name="viewport" content="width=${viewport}">`
  }
  return ''
}
