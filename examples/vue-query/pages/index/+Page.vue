<template>
  <h1>Star Wars Movies</h1>
  <!-- put the suspensible components in Suspense -->
  <Suspense>
    <MoviesList />
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
import Counter from '../../components/Counter.vue'
import MoviesList from './MoviesList.vue'
</script>
