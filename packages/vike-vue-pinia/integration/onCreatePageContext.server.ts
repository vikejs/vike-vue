import { createPinia } from 'pinia'
import { PageContext } from 'vike/types'

export const onCreatePageContext = (pageContext: PageContext) => {
  pageContext.pinia = createPinia()
}
