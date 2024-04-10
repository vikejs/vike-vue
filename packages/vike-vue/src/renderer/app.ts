export { createVueApp }

import { createApp, createSSRApp, defineComponent, h, markRaw, nextTick, reactive, ref } from 'vue'
import type { PageContextWithApp, PageContextWithoutApp } from '../types/PageContext'
import type { PageContext } from 'vike/types'
import { setPageContext } from '../hooks/usePageContext.js'
import { objectAssign } from '../utils/objectAssign'

async function createVueApp(pageContext: PageContext, ssr: boolean, renderHead = false): Promise<PageContextWithApp> {
  const rootComponentRef = ref(markRaw(pageContext.config[renderHead ? 'Head' : 'Page']))
  const layoutRef = ref(markRaw(pageContext.config.Layout))

  const PageWithLayout = defineComponent({
    render() {
      if (!!layoutRef.value && !renderHead) {
        return h(layoutRef.value, {}, { default: () => h(rootComponentRef.value) })
      } else {
        return h(rootComponentRef.value)
      }
    }
  })

  const app = ssr ? createSSRApp(PageWithLayout) : createApp(PageWithLayout)

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
      rootComponentRef.value = markRaw(pageContext.config[renderHead ? 'Head' : 'Page'])
      layoutRef.value = markRaw(pageContext.config.Layout)
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
