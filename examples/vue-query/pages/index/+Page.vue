<template>
  <h1>Star Wars Movies</h1>
  <!-- put the suspensible components in Suspense -->
  <Suspense>
    <MoviesList :forced-delay="forcedDelay" />
  </Suspense>
  <p>
  This page is:
  </p>
  <ul>
    <li>Rendered to HTML.</li>
    <li>Interactive. <Counter /></li>
  </ul>
</template>

<script lang="ts" setup>
import { usePageContext } from 'vike-vue/usePageContext'
import Counter from '../../components/Counter.vue'
import MoviesList from './MoviesList.vue'

const pageContext = usePageContext()
const forcedDelay = pageContext.urlParsed.search.delay
</script>
