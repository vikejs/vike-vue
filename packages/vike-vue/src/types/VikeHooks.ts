// TODO: deprecate these
export type {
  OnCreateAppSync,
  OnCreateAppAsync,
  OnBeforeRenderHtmlSync,
  OnBeforeRenderHtmlAsync,
  OnAfterRenderHtmlSync,
  OnAfterRenderHtmlAsync,
  OnBeforeRenderClientSync,
  OnBeforeRenderClientAsync,
}

import type { PageContext, PageContextClient, PageContextServer } from 'vike/types'

type PageContextWithApp = PageContext & { app: NonNullable<PageContext['app']> }

// Purposeful code duplication for improving QuickInfo IntelliSense
/**
 * Hook called right after creating Vue's `app` instance.
 *
 * Typically used for registering Vue plugins.
 *
 * See https://vike.dev/onCreateApp
 */
type OnCreateAppSync = (pageContext: PageContextWithApp) => void
/**
 * Hook called right after creating Vue's `app` instance.
 *
 * Typically used for registering Vue plugins.
 *
 * See https://vike.dev/onCreateApp
 */
type OnCreateAppAsync = (pageContext: PageContextWithApp) => Promise<void>

/**
 * Hook called before rendering the page's HTML.
 *
 * https://vike.dev/onBeforeRenderHtml
 */
type OnBeforeRenderHtmlSync = (pageContext: PageContextServer) => void
/**
 * Hook called before rendering the page's HTML.
 *
 * https://vike.dev/onBeforeRenderHtml
 */
type OnBeforeRenderHtmlAsync = (pageContext: PageContextServer) => Promise<void>

/**
 * Hook called right after rendering the page's root Vue component to HTML.
 *
 * https://vike.dev/onAfterRenderHtml
 */
type OnAfterRenderHtmlSync = (pageContext: PageContextServer) => void | PageContextServer['fromHtmlRenderer']
/**
 * Hook called right after rendering the page's root Vue component to HTML.
 *
 * https://vike.dev/onAfterRenderHtml
 */
type OnAfterRenderHtmlAsync = (pageContext: PageContextServer) => Promise<void | PageContextServer['fromHtmlRenderer']>

/**
 * Hook called right before mounting the page's root Vue component or when navigating on the client.
 * When mounting pageContext.isHydration is true, otherwise false.
 *
 * Typically used for hydrating state management libraries.
 */
type OnBeforeRenderClientSync = (pageContext: PageContextClient) => void
/**
 * Hook called right before mounting the page's root Vue component or when navigating on the client.
 * When mounting pageContext.isHydration is true, otherwise false.
 *
 * Typically used for hydrating state management libraries.
 */
type OnBeforeRenderClientAsync = (pageContext: PageContextClient) => Promise<void>
