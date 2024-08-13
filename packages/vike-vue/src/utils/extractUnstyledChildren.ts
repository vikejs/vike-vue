export { extractUnstyledChildren }

import type { Slot } from 'vue'

function extractUnstyledChildren(slot?: Slot<any>) {
  if (slot != null) {
    const els = slot()
    return () =>
      els.map((el) => ({
        ...el,
        // remove CSS scope marker (data-v-...)
        scopeId: undefined,
      }))
  }
}
