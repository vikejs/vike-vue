// https://vike.dev/onBeforeRender
export { onBeforeRender }

import fetch from 'cross-fetch'
import { filterMovieData } from '../filterMovieData'
import type { MovieDetails } from '../types'
import type { OnBeforeRenderAsync } from 'vike/types'

const onBeforeRender: OnBeforeRenderAsync = async (pageContext): ReturnType<OnBeforeRenderAsync> => {
  const response = await fetch(`https://star-wars.brillout.com/api/films/${pageContext.routeParams?.movieId}.json`)
  let movie = (await response.json()) as MovieDetails

  // We remove data we don't need because the data is passed to the client; we should
  // minimize what is sent over the network.
  movie = filterMovieData(movie)

  // The page's <title>
  const { title } = movie

  return {
    pageContext: {
      pageProps: {
        movie
      },
      // The page's <title>
      title
    }
  }
}
