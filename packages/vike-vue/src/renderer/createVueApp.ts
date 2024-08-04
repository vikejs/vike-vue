export { createVueApp }
export type { ChangePage }

import {
  type App,
  createApp,
  createSSRApp,
  h,
  nextTick,
  shallowRef,
  shallowReactive,
  type Component,
  Fragment,
} from 'vue'
import type { PageContext } from 'vike/types'
import { setPageContext } from '../hooks/usePageContext'
import { objectAssign } from '../utils/objectAssign'
import { callCumulativeHooks } from '../utils/callCumulativeHooks'
import { isPlainObject } from '../utils/isPlainObject'
import { setData } from '../hooks/useData'

type ChangePage = (pageContext: PageContext) => Promise<void>
async function createVueApp(pageContext: PageContext, ssr: boolean, entryComponentName: 'Head' | 'Page') {
  let onChangePage: undefined | ((pageContext: PageContext) => void)
  let RootComponent: Component | (() => ReturnType<typeof h>)
  // Wrap <Page> with <Layout>
  if (entryComponentName === 'Page') {
    const entryComponentRef = shallowRef(pageContext.config[entryComponentName])
    const layoutRef = shallowRef(pageContext.config.Layout || [])
    onChangePage = (pageContext: PageContext) => {
      entryComponentRef.value = pageContext.config[entryComponentName]
      layoutRef.value = pageContext.config.Layout || []
    }
    const EntryComponent = () => h(entryComponentRef.value)
    RootComponent = () => {
      let RootComp = EntryComponent
      layoutRef.value.forEach((layout) => {
        const Comp = RootComp
        RootComp = () => h(layout, null, Comp)
      })
      return RootComp()
    }
  } else {
    RootComponent = () => {
      const HeadElements = pageContext.config[entryComponentName]!.map((HeadComponent) => h(HeadComponent))
      return h(Fragment, null, HeadElements)
    }
  }

  const app: App = ssr ? createSSRApp(RootComponent) : createApp(RootComponent)
  objectAssign(pageContext, { app })
  const { onCreateApp } = pageContext.config
  await callCumulativeHooks(onCreateApp, pageContext)

  const data = pageContext.data ?? {}
  assertDataIsObject(data)
  const dataReactive = shallowReactive(data)
  const pageContextReactive = shallowReactive(pageContext)
  setPageContext(app, pageContextReactive)
  setData(app, dataReactive)

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
    onChangePage?.(pageContext)
    await nextTick()
    returned = true
    if (err) throw err
  }

  return { app, changePage }
}

function assertDataIsObject(data: unknown): asserts data is Record<string, unknown> {
  if (!isPlainObject(data)) throw new Error('data() should return a plain object, undefined, or null')
}

export function objectReplace(obj: object, objAddendum: object) {
  // @ts-ignore
  Object.keys(obj).forEach((key) => delete obj[key])
  Object.assign(obj, objAddendum)
}
