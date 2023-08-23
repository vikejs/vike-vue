import { createApp, createSSRApp, defineComponent, h, markRaw, reactive } from 'vue'
import type { Component, Config, PageContext, PageProps } from './types'
import { setPageContext } from '../components/usePageContext'

export { createVueApp }

function createVueApp(pageContext: PageContext, ssrAppIfPossible = true) {
  const { Page } = pageContext

  // Note: if Page is undefined, we're typically on the server and SSR is disabled (SPA mode).
  const doNotRenderPage = Page === undefined
  ssrAppIfPossible &&= !doNotRenderPage

  let rootComponent: Component & { Page: Component; pageProps: PageProps; config: Config }
  const PageWithLayout = defineComponent({
    data: () => ({
      Page: markRaw(
        Page || {
          // We're typically on the server and SSR is disabled (SPA mode).
          render() {
            return ''
          }
        }
      ),

      pageProps: markRaw(pageContext.pageProps || {}),
      config: markRaw(pageContext.config)
    }),
    created() {
      rootComponent = this
    },
    render() {
      if (!!this.config.Layout && !doNotRenderPage) {
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

  const app = ssrAppIfPossible ? createSSRApp(PageWithLayout) : createApp(PageWithLayout)

  // We use `app.changePage()` to do Client Routing, see `_default.page.client.js`
  objectAssign(app, {
    changePage: (pageContext: PageContext) => {
      Object.assign(pageContextReactive, pageContext)
      rootComponent.Page = markRaw(pageContext.Page)
      rootComponent.pageProps = markRaw(pageContext.pageProps || {})
      rootComponent.config = markRaw(pageContext.config)
    }
  })

  // When doing Client Routing, we mutate pageContext (see usage of `app.changePage()` in `_default.page.client.js`).
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
