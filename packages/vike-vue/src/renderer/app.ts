import { createApp, createSSRApp, defineComponent, h, markRaw, nextTick, reactive, ref } from 'vue'
import type { Component, PageContextWithApp, PageContextWithoutApp } from '../types/PageContext'
import type { PageContext } from 'vike/types'
import { setPageContext } from '../hooks/usePageContext.js'
import { objectAssign } from '../utils/objectAssign'

export { createVueApp }

/**
 * Isomorphic function to create a Vue app.
 *
 * @param pageContext Object providing the Vue component to be rendered and additional config and data.
 * @param ssrApp Whether to use `createSSRApp()` or `createApp()`. See https://vuejs.org/api/application.html
 * @param renderHead If true, `pageContext.config.Head` will be rendered instead of `pageContext.Page`.
 * @returns The `pageContext` object with the `app` property set.
 */
async function createVueApp(pageContext: PageContext, ssrApp = true, renderHead = false): Promise<PageContextWithApp> {
  const { Page } = pageContext
  const Head = renderHead ? (pageContext.config.Head as Component) : undefined

  const pageRef = ref(markRaw(Head ? Head : Page))
  const configRef = ref(markRaw(pageContext.config))

  const PageWithLayout = defineComponent({
    render() {
      if (!!configRef.value.Layout && !renderHead) {
        return h(
          configRef.value.Layout,
          {},
          {
            default: () => {
              return h(pageRef.value)
            }
          }
        )
      }
      return h(pageRef.value)
    }
  })

  const app = ssrApp ? createSSRApp(PageWithLayout) : createApp(PageWithLayout)

  // We use `app.changePage()` to do Client Routing, see `onRenderClient.ts`
  objectAssign(app, {
    changePage: async (pageContext: PageContext) => {
      let returned = false
      let err: unknown
      app.config.errorHandler = (err_) => {
        if (returned) {
          console.error(err_)
        } else {
          err = err_
        }
      }
      Object.assign(pageContextReactive, pageContext)
      pageRef.value = markRaw(pageContext.Page)
      configRef.value = markRaw(pageContext.config)
      await nextTick()
      returned = true
      if (err) throw err
    }
  })

  // When doing Client Routing, we mutate pageContext (see usage of `app.changePage()` in `onRenderClient.ts`).
  // We therefore use a reactive pageContext.
  const pageContextReactive = reactive(pageContext as PageContextWithoutApp)

  objectAssign(pageContext, { app })
  const pageContextWithApp = pageContext as PageContextWithApp

  await pageContextWithApp.config.onCreateApp?.(pageContext)
  await pageContextWithApp.config.onCreateAppPinia?.(pageContext)

  // Make `pageContext` accessible from any Vue component
  setPageContext(app, pageContextReactive)

  if (pageContextWithApp.config.vuePlugins) {
    console.warn('[vike-vue][warning] +vuePlugins.js is deprecated, use onCreateApp() instead')
    pageContextWithApp.config.vuePlugins.forEach(({ plugin, options }) => {
      app.use(plugin, options)
    })
  }

  return pageContextWithApp
}
