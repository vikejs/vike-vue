// Hook `useData()` to make `pageContext.data` available from any Vue component.
// See
// * https://vike.dev/useData

export { useData }

import { type ComputedRef, computed } from 'vue'
import { usePageContext } from './usePageContext'

function useData<Data>(): ComputedRef<Data> {
  const data = computed(() => (usePageContext() as any).data)
  return data
}
