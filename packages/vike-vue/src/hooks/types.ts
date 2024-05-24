export type {
  OnCreateAppSync,
  OnCreateAppAsync,
  OnAfterRenderHtmlSync,
  OnAfterRenderHtmlAsync,
  OnBeforeRenderClientSync,
  OnBeforeRenderClientAsync,
  BodyInjectHtml,
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
 * Hook called right after rendering the page's root Vue component.
 * The hook can return additional page context that will be passed to the client under `pageContext.fromHtmlRenderer`.
 *
 * Typically used for dehydrating state management libraries.
 */
type OnAfterRenderHtmlSync = (pageContext: PageContextServer) => PageContextServer['fromHtmlRenderer']
/**
 * Hook called right after rendering the page's root Vue component.
 * The hook can return additional page context that will be passed to the client under `pageContext.fromHtmlRenderer`.
 *
 * Typically used for dehydrating state management libraries.
 */
type OnAfterRenderHtmlAsync = (pageContext: PageContextServer) => Promise<PageContextServer['fromHtmlRenderer']>

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

/**
 * Injected HTML at the start / end of the body.
 */
type BodyInjectHtml = (pageContext: PageContext) => string
