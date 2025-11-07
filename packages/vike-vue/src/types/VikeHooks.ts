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
/** @deprecated This type is deprecated, see:
 * - https://vike.dev/migration/hook-types
 * - https://vike.dev/onCreateApp
 */
type OnCreateAppSync = (pageContext: PageContextWithApp) => void
/** @deprecated This type is deprecated, see:
 * - https://vike.dev/migration/hook-types
 * - https://vike.dev/onCreateApp
 */
type OnCreateAppAsync = (pageContext: PageContextWithApp) => Promise<void>

/** @deprecated This type is deprecated, see:
 * - https://vike.dev/migration/hook-types
 * - https://vike.dev/onBeforeRenderHtml
 */
type OnBeforeRenderHtmlSync = (pageContext: PageContextServer) => void
/** @deprecated This type is deprecated, see:
 * - https://vike.dev/migration/hook-types
 * - https://vike.dev/onBeforeRenderHtml
 */
type OnBeforeRenderHtmlAsync = (pageContext: PageContextServer) => Promise<void>

/** @deprecated This type is deprecated, see:
 * - https://vike.dev/migration/hook-types
 * - https://vike.dev/onAfterRenderHtml
 */
type OnAfterRenderHtmlSync = (pageContext: PageContextServer) => void | PageContextServer['fromHtmlRenderer']
/** @deprecated This type is deprecated, see:
 * - https://vike.dev/migration/hook-types
 * - https://vike.dev/onAfterRenderHtml
 */
type OnAfterRenderHtmlAsync = (pageContext: PageContextServer) => Promise<void | PageContextServer['fromHtmlRenderer']>

/** @deprecated This type is deprecated, see:
 * - https://vike.dev/migration/hook-types
 * - https://vike.dev/onBeforeRenderClient
 */
type OnBeforeRenderClientSync = (pageContext: PageContextClient) => void
/** @deprecated This type is deprecated, see:
 * - https://vike.dev/migration/hook-types
 * - https://vike.dev/onBeforeRenderClient
 */
type OnBeforeRenderClientAsync = (pageContext: PageContextClient) => Promise<void>
