export { config as default }

import type { Config } from 'vike/types'
import './utils/tsx-workaround.js'
import { ssrEffect } from './integration/ssrEffect.js'
import { vitePlugin } from './vite/index.js'

const config = {
  name: 'vike-vue',
  require: {
    vike: '>=0.4.191',
  },

  // https://vike.dev/onRenderHtml
  onRenderHtml: 'import:vike-vue/__internal/integration/onRenderHtml:onRenderHtml',
  // https://vike.dev/onRenderClient
  onRenderClient: 'import:vike-vue/__internal/integration/onRenderClient:onRenderClient',

  vite: {
    plugins: [vitePlugin()],
  },

  // https://vike.dev/passToClient
  // It is a cumulative config option, so a web app using vike-vue can extend
  // this list.
  passToClient: ['fromHtmlRenderer', '_configViaHook'],

  // https://vike.dev/clientRouting
  clientRouting: true,
  hydrationCanBeAborted: true,
  // https://vike.dev/meta
  meta: {
    Head: {
      env: { server: true },
      cumulative: true,
    },
    Layout: {
      env: { server: true, client: true },
      cumulative: true,
    },
    title: {
      env: { server: true, client: true },
    },
    description: {
      env: { server: true },
    },
    image: {
      env: { server: true },
    },
    viewport: {
      env: { server: true },
    },
    favicon: {
      env: { server: true },
      global: true,
    },
    lang: {
      env: { server: true, client: true },
    },
    ssr: {
      env: { config: true },
      effect: ssrEffect,
    },
    stream: {
      env: { server: true },
      cumulative: true,
    },
    onCreateApp: {
      env: { server: true, client: true },
      cumulative: true,
    },
    onBeforeRenderHtml: {
      env: { server: true },
      cumulative: true,
    },
    onAfterRenderHtml: {
      env: { server: true },
      cumulative: true,
    },
    onBeforeRenderClient: {
      env: { server: false, client: true },
      cumulative: true,
    },
    onAfterRenderClient: {
      env: { server: false, client: true },
      cumulative: true,
    },
    bodyHtmlBegin: {
      env: { server: true },
      cumulative: true,
      global: true,
    },
    bodyHtmlEnd: {
      env: { server: true },
      cumulative: true,
      global: true,
    },
    headHtmlBegin: {
      env: { server: true },
      cumulative: true,
      global: true,
    },
    headHtmlEnd: {
      env: { server: true },
      cumulative: true,
      global: true,
    },
    htmlAttributes: {
      env: { server: true },
      global: true,
      cumulative: true, // for Vike extensions
    },
    bodyAttributes: {
      env: { server: true },
      global: true,
      cumulative: true, // for Vike extensions
    },
  },
} satisfies Config

/* Doesn't work: rollup removes these imports
import './types/Config.js'
import './types/PageContext.js'
*/
// Trick to ensure Rollup doesn't remove the imports
export type { __FakeExport_Config } from './types/Config.js'
export type { __FakeExport_PageContext } from './types/PageContext.js'
