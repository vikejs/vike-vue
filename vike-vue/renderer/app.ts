import { createApp, createSSRApp, defineComponent, h, markRaw, reactive } from 'vue'
import type { Component, PageProps } from './types'
import type { Config, PageContext } from 'vike/types'
import { setPageContext } from '../components/usePageContext.js'

export { createVueApp }

/**
 * Isomorphic function to create a Vue app.
 *
 * @param pageContext Object providing the Vue component to be rendered, the props for that component, and additional
 *                    config and data.
 * @param ssrApp Whether to use `createSSRApp()` or `createApp()`. See https://vuejs.org/api/application.html
 * @param renderHead If true, `pageContext.config.Head` will be rendered instead of `pageContext.Page`.
 */
function createVueApp(pageContext: PageContext, ssrApp = true, renderHead = false) {
  const { Page } = pageContext
  const Head = renderHead ? (pageContext.config.Head as Component) : undefined

  // TODO/next-major-release: remove pageProps (i.e. tell users to use data() instead of onBeforeRender() to fetch data)
  let rootComponent: Component & { Page: Component; pageProps: PageProps; config: Config }
  const PageWithLayout = defineComponent({
    data: () => ({
      Page: markRaw(Head ? Head : Page),
      pageProps: markRaw(pageContext.pageProps || {}),
      config: markRaw(pageContext.config)
    }),
    created() {
      rootComponent = this
    },
    render() {
      if (!!this.config.Layout && !renderHead) {
        return h(
          this.config.Layout,
          {},
          {
            default: () => {
              return h(this.Page, this.pageProps)
            }
          }
        )
      }
      return h(this.Page, this.pageProps)
    }
  })

  const app = ssrApp ? createSSRApp(PageWithLayout) : createApp(PageWithLayout)

  // We use `app.changePage()` to do Client Routing, see `onRenderClient.ts`
  objectAssign(app, {
    changePage: (pageContext: PageContext) => {
      Object.assign(pageContextReactive, pageContext)
      rootComponent.Page = markRaw(pageContext.Page)
      rootComponent.pageProps = markRaw(pageContext.pageProps || {})
      rootComponent.config = markRaw(pageContext.config)
    }
  })

  // When doing Client Routing, we mutate pageContext (see usage of `app.changePage()` in `onRenderClient.ts`).
  // We therefore use a reactive pageContext.
  const pageContextReactive = reactive(pageContext)

  // Make `pageContext` accessible from any Vue component
  setPageContext(app, pageContextReactive)

  return app
}

// Same as `Object.assign()` but with type inference
function objectAssign<Obj extends object, ObjAddendum>(
  obj: Obj,
  objAddendum: ObjAddendum
): asserts obj is Obj & ObjAddendum {
  Object.assign(obj, objAddendum)
}
