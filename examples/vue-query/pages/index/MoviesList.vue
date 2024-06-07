<template>
  <template v-if="isPending">
    <p>Loading...</p>
  </template>
  <template v-else-if="isError">
    <p>Error: {{ error }}</p>
  </template>
  <ol v-else>
    <li v-for="item in data!" :key="item.id">
      {{ item.title }} ({{ item.release_date }})
    </li>
  </ol>
  <p>Source: <a href="https://brillout.github.io/star-wars">brillout.github.io/star-wars</a>.</p>
  <p>
    While initial data is fetched on the server, the client will refresh after rendering.<br>
    <code>
      Refreshing: {{ isFetching ? 'Yes' : 'No' }}
    </code>
  </p>
</template>

<script lang="ts" setup>
import type { Movie, MovieDetails } from './types'
import { useQuery } from '@tanstack/vue-query'

const ALLOWED_SSR_DELAY = 300

const { isError, isPending, isFetching, data, error, suspense } = useQuery({
  queryKey: ['movies'],
  queryFn: fetchMovies,
  select: (data) => minimize(data),
  staleTime: 3000
})

// await for `useQuery`'s `suspense` but only as much as you want to wait on SSR
await new Promise(async (resolve) => {
  setTimeout(() => {
    resolve(false)
  }, ALLOWED_SSR_DELAY)
  await suspense()
  resolve(true)
})

async function fetchMovies() {
  const delay = Math.ceil(import.meta.env.SSR ? 2 * ALLOWED_SSR_DELAY * Math.random() : 500 + 3000 * Math.random())
  console.log(`[${ import.meta.env.SSR ? 'SERVER' : 'CLIENT' }] Fetch movies network delay: ${ delay }${ import.meta.env.SSR && delay < ALLOWED_SSR_DELAY ? ' - PREFETCH' : ''}`)
  const tsStart = Date.now()

  const response = await fetch('https://brillout.github.io/star-wars/api/films.json')
  const moviesData = (await response.json()) as MovieDetails[]

  // simulate slow network on client
  await new Promise((resolve) => setTimeout(resolve, Math.max(0, delay - Date.now() + tsStart)))

  return moviesData;
}

function minimize(movies: MovieDetails[]): Movie[] {
  return movies.map((movie) => {
    const { title, release_date, id } = movie
    return { title, release_date, id }
  })
}
</script>
