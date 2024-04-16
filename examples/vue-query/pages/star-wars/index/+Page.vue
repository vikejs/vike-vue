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
        <a :href="'/star-wars/' + item.id">{{ item.title }}</a> ({{ item.release_date }})
      </li>
    </template>
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
import { onServerPrefetch } from 'vue'
import type { Movie, MovieDetails } from '../types'
import { useQuery } from '@tanstack/vue-query'

const { isError, isPending, isFetching, data, error, suspense } = useQuery({
  queryKey: ['movies'],
  queryFn: fetchMovies,
  select: (data) => minimize(data)
})

// this will be called on the server to prefetch the data
onServerPrefetch(suspense)

async function fetchMovies() {
  const response = await fetch('https://brillout.github.io/star-wars/api/films.json')
  const moviesData = (await response.json()) as MovieDetails[]
  // simulate slow network
  await new Promise((resolve) => setTimeout(resolve, 3000))
  return moviesData
}

function minimize(movies: MovieDetails[]): Movie[] {
  return movies.map((movie) => {
    const { title, release_date, id } = movie
    return { title, release_date, id }
  })
}
</script>
