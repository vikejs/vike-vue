// https://vike.dev/data
export { data }
export type { Data }

import { fetchStarWarsMovies, filterMoviesData, getTitle } from './data'

type Data = Awaited<ReturnType<typeof data>>

const data = async () => {
  const movies = await fetchStarWarsMovies()
  return {
    // We remove data we don't need because we pass `pageContext.movies` to
    // the client; we want to minimize what is sent over the network.
    movies: filterMoviesData(movies),
    // The page's <title>
    title: getTitle(movies)
  }
}
