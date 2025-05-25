import { PageContext } from 'vike/types'

export const onAfterRenderHtml = (pageContext: PageContext) => {
  pageContext._piniaInitialState = pageContext.pinia?.state.value
}
