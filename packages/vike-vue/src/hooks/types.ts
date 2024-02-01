export type {
  OnCreateAppSync,
  OnCreateAppAsync,
  OnAfterRenderSSRAppSync,
  OnAfterRenderSSRAppAsync,
  OnBeforeMountAppSync,
  OnBeforeMountAppAsync
}

import type { PageContext } from 'vike/types'
import type { PageContextWithApp } from '../types/PageContext'

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
type OnAfterRenderSSRAppSync = (pageContext: PageContext) => PageContext['fromHtmlRenderer']
/**
 * Hook called right after rendering the page's root Vue component.
 * The hook can return additional page context that will be passed to the client under `pageContext.fromHtmlRenderer`.
 *
 * Typically used for dehydrating state management libraries.
 */
type OnAfterRenderSSRAppAsync = (pageContext: PageContext) => Promise<PageContext['fromHtmlRenderer']>

/**
 * Hook called right before mounting the page's root Vue component.
 *
 * Typically used for hydrating state management libraries.
 */
type OnBeforeMountAppSync = (pageContext: PageContext) => void
/**
 * Hook called right before mounting the page's root Vue component.
 *
 * Typically used for hydrating state management libraries.
 */
type OnBeforeMountAppAsync = (pageContext: PageContext) => Promise<void>
