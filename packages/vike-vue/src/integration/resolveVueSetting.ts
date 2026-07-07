export { resolveVueSetting }

import type { PageContext } from 'vike/types'

type VueSettingResolved = Exclude<Vike.Config['vue'], Function | undefined>

// The +vue setting is cumulative: we merge all values into a single object.
function resolveVueSetting(pageContext: PageContext): VueSettingResolved {
  const resolved: VueSettingResolved = {}
  const values = pageContext.config.vue ?? []
  // `values` is ordered by inheritance: the most specific value (e.g. defined at the page-level) comes first.
  // We iterate in reverse so that more specific values override less specific ones (e.g. defined globally).
  for (const value of [...values].reverse()) {
    const val = typeof value === 'function' ? value(pageContext) : value
    if (val) Object.assign(resolved, val)
  }
  return resolved
}
