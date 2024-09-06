// https://vike.dev/useData
export { useData }
export { setData }

import { inject } from 'vue'
import type { App, ShallowReactive } from 'vue'

const key = 'vike-vue:useData'

/** https://vike.dev/useData */
function useData<Data>(): ShallowReactive<Data> {
  const data = inject<ShallowReactive<Data>>(key)!
  return data
}

function setData(app: App, data: ShallowReactive<unknown>): void {
  app.provide(key, data)
}
