import { PageContext } from 'vike/types'

export function callCumulativeHooks<T extends (pageContext: C) => unknown, C extends PageContext>(
  hooks: T[] | undefined,
  pageContext: C,
) {
  return Promise.all(hooks?.map((hook) => hook(pageContext)) ?? [])
}
