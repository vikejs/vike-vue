export { removeCssScopeId }

import { Component } from '../types/PageContext'

/**
 * Remove CSS scope marker (data-v-...)
 */
const removeCssScopeId = (Head: Component | Component[]) => {
  if (Array.isArray(Head)) {
    return () =>
      Head.map((rest) => ({
        ...rest,
        scopeId: undefined,
      }))
  }

  Head.scopeId = undefined
  return Head
}
