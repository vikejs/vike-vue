// https://vike.dev/useData
export { useData }
export { setData }

import { inject } from 'vue'
import type { App, ShallowRef } from 'vue'

const key = 'vike-vue:useData'

/** https://vike.dev/useData */
function useData<Data>(): ShallowRef<Data> {
  const data = inject<ShallowRef<Data>>(key)!
  return data
}

function setData(app: App, data: ShallowRef<unknown>): void {
  app.provide(key, data)
}
