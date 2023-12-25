// https://vike.dev/onBeforeRender
export { onBeforeRender }

import { fetchStarWarsMovies, filterMoviesData, getTitle } from './data'
import type { OnBeforeRenderAsync } from 'vike/types'

const onBeforeRender: OnBeforeRenderAsync = async (pageContext): ReturnType<OnBeforeRenderAsync> => {
  const movies = await fetchStarWarsMovies()
  return {
    pageContext: {
      pageProps: {
        // We remove data we don't need because the data is passed to the client; we should
        // minimize what is sent over the network.
        movies: filterMoviesData(movies)
      },
      // The page's <title>
      title: getTitle(movies)
    }
  }
}
