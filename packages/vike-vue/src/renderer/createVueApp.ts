export { createVueApp }

import { createApp, createSSRApp, h, markRaw, nextTick, reactive, ref } from 'vue'
import type { PageContextWithApp, PageContextWithoutApp } from '../types/PageContext'
import type { PageContext } from 'vike/types'
import { setPageContext } from '../hooks/usePageContext.js'
import { objectAssign } from '../utils/objectAssign'
import { callCumulativeHooks } from '../utils/callCumulativeHooks'
import { isObject } from '../utils/isObject'
import { setData } from '../hooks/useData'

async function createVueApp(
  pageContext: PageContext,
  ssr: boolean,
  rootComponentName: 'Head' | 'Page',
): Promise<PageContextWithApp> {
  const rootComponentRef = ref(markRaw(pageContext.config[rootComponentName]))
  const layoutRef = ref(markRaw(pageContext.config.Layout))

  const PageWithLayout = {
    render() {
      if (!!layoutRef.value && rootComponentName === 'Page') {
        // Wrap <Page> with <Layout>
        return h(layoutRef.value, {}, { default: () => h(rootComponentRef.value) })
      } else {
        return h(rootComponentRef.value)
      }
    },
  }

  const app = ssr ? createSSRApp(PageWithLayout) : createApp(PageWithLayout)

  // app.changePage() is called upon navigation, see +onRenderClient.ts
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
      const data = pageContext.data ?? {}
      assertDataIsObject(data)
      Object.assign(dataReactive, data)
      Object.assign(pageContextReactive, pageContext)
      rootComponentRef.value = markRaw(pageContext.config[rootComponentName])
      layoutRef.value = markRaw(pageContext.config.Layout)
      await nextTick()
      returned = true
      if (err) throw err
    },
  })

  const data = pageContext.data ?? {}
  assertDataIsObject(data)
  const dataReactive = reactive(data)
  const pageContextReactive = reactive(pageContext as PageContextWithoutApp)
  setPageContext(app, pageContextReactive)
  setData(app, dataReactive)

  objectAssign(pageContext, { app })
  const pageContextWithApp = pageContext as PageContextWithApp

  await callCumulativeHooks(pageContextWithApp.config.onCreateApp, pageContext)

  if (pageContextWithApp.config.vuePlugins) {
    console.warn('[vike-vue][warning] +vuePlugins.js is deprecated, use onCreateApp() instead')
    pageContextWithApp.config.vuePlugins.forEach(({ plugin, options }) => {
      app.use(plugin, options)
    })
  }

  return pageContext as PageContextWithApp
}

function assertDataIsObject(data: unknown): asserts data is Record<string, unknown> {
  if (!isObject(data)) throw new Error('Return value of data() should be an object, undefined, or null')
}
