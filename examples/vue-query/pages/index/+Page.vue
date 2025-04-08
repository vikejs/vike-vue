<template>
  <h1>Star Wars Movies</h1>
  <ol>
    <template v-if="isPending">
      <li>Loading...</li>
    </template>
    <template v-else-if="isError">
      <li>Error: {{ error }}</li>
    </template>
    <template v-else>
      <li v-for="item in data!" :key="item.id">
        {{ item.title }} ({{ item.release_date }})
      </li>
    </template>
  </ol>
  <p>Source: <a href="https://brillout.github.io/star-wars">brillout.github.io/star-wars</a>.</p>
  <p>
  This page is:
  </p>
  <ul>
    <li>Rendered to HTML.</li>
    <li>Interactive. <Counter /></li>
  </ul>
</template>

<script lang="ts" setup>
import { onServerPrefetch } from 'vue'
import type { Movie, MovieDetails } from './types'
import { useQuery } from '@tanstack/vue-query'
import Counter from '../../components/Counter.vue'

const components = { Counter }

const { isError, isPending, isFetching, data, error, suspense } = useQuery({
  queryKey: ['movies'],
  queryFn: fetchMovies,
  // Or set global `staleTime` at pages/+queryClientConfig.ts
  staleTime: 1000 * 60 * 5,
  select: (data) => minimize(data),
})

// This will be called on the server to prefetch the data
onServerPrefetch(suspense)

async function fetchMovies() {
  const response = await fetch('https://brillout.github.io/star-wars/api/films.json')
  const moviesData = (await response.json()) as MovieDetails[]
  // simulate slow network on client
  await new Promise((resolve) => setTimeout(resolve, import.meta.env.SSR ? 0 : 3000))
  return moviesData
}

function minimize(movies: MovieDetails[]): Movie[] {
  return movies.map((movie) => {
    const { title, release_date, id } = movie
    return { title, release_date, id }
  })
}
</script>
