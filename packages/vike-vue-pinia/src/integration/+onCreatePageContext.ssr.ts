export { onCreatePageContext }

import type { PageContextServer } from 'vike/types'
import { createPiniaPlus } from './createPiniaPlus.js'

async function onCreatePageContext(pageContext: PageContextServer) {
  await createPiniaPlus(pageContext)
}
