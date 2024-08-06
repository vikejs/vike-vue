export { description }

import type { Data } from './+data.js'
import type { PageContext } from 'vike/types'

function description(pageContext: PageContext<Data>) {
  const movie = pageContext.data
  return `Star Wars Movie ${movie.title} from ${movie.director}`
}
