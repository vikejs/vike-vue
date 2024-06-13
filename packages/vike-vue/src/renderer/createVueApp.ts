export { createVueApp }
export type { ChangePage }

import { type App, createApp, createSSRApp, h, markRaw, nextTick, ref, shallowReactive } from 'vue'
import type { PageContext } from 'vike/types'
import { setPageContext } from '../hooks/usePageContext'
import { objectAssign } from '../utils/objectAssign'
import { callCumulativeHooks } from '../utils/callCumulativeHooks'
import { isPlainObject } from '../utils/isPlainObject'
import { setData } from '../hooks/useData'

type ChangePage = (pageContext: PageContext) => Promise<void>
async function createVueApp(pageContext: PageContext, ssr: boolean, rootComponentName: 'Head' | 'Page') {
  const rootComponentRef = ref(markRaw(pageContext.config[rootComponentName]))
  const layoutRef = ref(markRaw(pageContext.config.Layout))

  const PageWithLayout = () => {
    if (layoutRef.value && rootComponentName === 'Page') {
      // Wrap <Page> with <Layout>
      return h(layoutRef.value, null, () => h(rootComponentRef.value))
    } else {
      return h(rootComponentRef.value)
    }
  }

  const app: App = ssr ? createSSRApp(PageWithLayout) : createApp(PageWithLayout)
  objectAssign(pageContext, { app })

  // changePage() is called upon navigation, see +onRenderClient.ts
  const changePage: ChangePage = async (pageContext: PageContext) => {
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
    objectReplace(dataReactive, data)
    objectReplace(pageContextReactive, pageContext)
    rootComponentRef.value = markRaw(pageContext.config[rootComponentName])
    layoutRef.value = markRaw(pageContext.config.Layout)
    await nextTick()
    returned = true
    if (err) throw err
  }

  const data = pageContext.data ?? {}
  assertDataIsObject(data)
  const dataReactive = shallowReactive(data)
  const pageContextReactive = shallowReactive(pageContext)
  setPageContext(app, pageContextReactive)
  setData(app, dataReactive)

  const { onCreateApp } = pageContext.config
  const pageContextWithApp = pageContext

  await callCumulativeHooks(onCreateApp, pageContext)

  if (pageContextWithApp.config.vuePlugins) {
    console.warn('[vike-vue][warning] +vuePlugins.js is deprecated, use onCreateApp() instead')
    pageContextWithApp.config.vuePlugins.forEach(({ plugin, options }) => {
      app.use(plugin, options)
    })
  }

  return { app, changePage }
}

function assertDataIsObject(data: unknown): asserts data is Record<string, unknown> {
  if (!isPlainObject(data)) throw new Error('Return value of data() should be a plain object, undefined, or null')
}

export function objectReplace(obj: object, objAddendum: object) {
  // @ts-ignore
  Object.keys(obj).forEach((key) => delete obj[key])
  Object.assign(obj, objAddendum)
}
