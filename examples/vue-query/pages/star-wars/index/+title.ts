export { title }

import type { PageContext } from 'vike/types'

function title(pageContext: PageContext) {
  const movies = pageContext.data
  // return `${movies.length} Star Wars Movies`
  return "Star Wars Movies"
}
