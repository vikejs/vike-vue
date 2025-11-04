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
import { isNotNullish } from '../utils/isNotNullish.js'
import { isObject } from '../utils/isObject.js'
import { isType } from '../utils/isType.js'

const onRenderHtml: OnRenderHtmlAsync = async (
  pageContext: PageContextServer & PageContextInternal,
): ReturnType<OnRenderHtmlAsync> => {
  const { fromHtmlRenderer } = await renderPageToHtml(pageContext)

  pageContext.isRenderingHead = true
  const headHtml = await getHeadHtml(pageContext)
  pageContext.isRenderingHead = false

  const { headHtmlBegin, headHtmlEnd, bodyHtmlBegin, bodyHtmlEnd } = await getHtmlInjections(pageContext)


  const { htmlAttributesString, bodyAttributesString } = getTagAttributes(pageContext)

  // Not needed on the client-side, thus we remove it to save KBs sent to the client
  delete pageContext._configFromHook

  // pageContext.{pageHtmlString,pageHtmlStream} is set by renderPageToHtml() and can be overridden by user at onAfterRenderHtml()
  let pageHtmlStringOrStream: string | ReturnType<typeof dangerouslySkipEscape> | PageHtmlStream =
    // Set to empty string if SSR is disabled
    ''
  if (pageContext.pageHtmlString) {
    assert(pageContext.pageHtmlStream === undefined)
    pageHtmlStringOrStream = dangerouslySkipEscape(pageContext.pageHtmlString)
  }
  if (pageContext.pageHtmlStream) {
    assert(pageContext.pageHtmlString === undefined)
    pageHtmlStringOrStream = pageContext.pageHtmlStream
  }

  const documentHtml = escapeInject`<!DOCTYPE html>
    <html${dangerouslySkipEscape(htmlAttributesString)}>
      <head>
        <meta charset="UTF-8" />
        ${headHtmlBegin}
        ${headHtml}
        ${headHtmlEnd}
      </head>
      <body${dangerouslySkipEscape(bodyAttributesString)}>
        ${bodyHtmlBegin}
        <div id="app">${pageHtmlStringOrStream}</div>
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
async function renderPageToHtml(pageContext: PageContextServer) {
  pageContext.ssrContext = {}
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

  if (pageContext.Page) {
    assert(app)

    const streamSetting = resolveStreamSetting(pageContext)
    if (!streamSetting.enable) {
      const pageHtmlString = await renderToStringWithErrorHandling(app, pageContext.ssrContext)
      pageContext.pageHtmlString = pageHtmlString
    } else {
      const pageHtmlStream =
        streamSetting.type === 'web'
          ? renderToWebStreamWithErrorHandling(app, pageContext.ssrContext)
          : renderToNodeStreamWithErrorHandling(app, pageContext.ssrContext)
      pageContext.pageHtmlStream = pageHtmlStream
    }

    // TO-DO/breaking-change: always call onAfterRenderHtml()
    //  - I.e. don't call it inside this `if (!!pageContext.Page)` block.
    //  - Tell users to use `!!pageContext.Page` if they want to apply the hook only for SSR.
    //    - Already done: https://vike.dev/onAfterRenderHtml
    const afterRenderResults = await callCumulativeHooks(pageContext.config.onAfterRenderHtml, pageContext)
    Object.assign(fromHtmlRenderer, ...afterRenderResults)
  }
  return { fromHtmlRenderer }
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

async function getHtmlInjections(pageContext: PageContextServer) {
  const { config } = pageContext
  // run these in Promise.all
  const [headHtmlBegin, headHtmlEnd, bodyHtmlBegin, bodyHtmlEnd] = await Promise.all([
    dangerouslySkipEscape((await callCumulativeHooks(config.headHtmlBegin, pageContext)).join('')),
    dangerouslySkipEscape((await callCumulativeHooks(config.headHtmlEnd, pageContext)).join('')),
    dangerouslySkipEscape((await callCumulativeHooks(config.bodyHtmlBegin, pageContext)).join('')),
    dangerouslySkipEscape((await callCumulativeHooks(config.bodyHtmlEnd, pageContext)).join('')),
  ])
  return { bodyHtmlBegin, bodyHtmlEnd, headHtmlBegin, headHtmlEnd }
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

async function renderToStringWithErrorHandling(app: App, pageContext?: SSRContext) {
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
  const appHtml = await renderToString(app, pageContext)
  returned = true
  if (err) throw err
  return appHtml
}

function renderToNodeStreamWithErrorHandling(app: App, pageContext?: SSRContext) {
  let returned = false
  let err: unknown
  app.config.errorHandler = (err_) => {
    if (returned) {
      console.error(err_)
    } else {
      err = err_
    }
  }
  const appHtml = renderToNodeStream(app, pageContext)
  returned = true
  if (err) throw err
  return appHtml
}

function renderToWebStreamWithErrorHandling(app: App, pageContext?: SSRContext) {
  let returned = false
  let err: unknown
  app.config.errorHandler = (err_) => {
    if (returned) {
      console.error(err_)
    } else {
      err = err_
    }
  }
  const appHtml = renderToWebStream(app, pageContext)
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

type StreamSetting = {
  type: 'node' | 'web' | null
  enable: boolean | null
}
function resolveStreamSetting(pageContext: PageContextServer): StreamSetting {
  const { stream } = pageContext.config
  const streamSetting: StreamSetting = {
    type: null,
    enable: null,
  }
  stream
    ?.reverse()
    .filter(isNotNullish)
    .forEach((setting) => {
      if (typeof setting === 'boolean') {
        streamSetting.enable = setting
        return
      }
      if (typeof setting === 'string') {
        streamSetting.type = setting
        streamSetting.enable = true
        return
      }
      if (isObject(setting)) {
        if (setting.enable !== null) streamSetting.enable = setting.enable ?? true
        if (setting.type !== undefined) streamSetting.type = setting.type
        return
      }
      isType<never>(setting)
      throw new Error(`Unexpected +stream value ${setting}`)
    })
  return streamSetting
}
