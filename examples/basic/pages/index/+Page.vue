<template>
  <h1>My Vike + Vue app</h1>
  This page is:
  <ul>
    <li>Rendered to HTML.</li>
    <li>Interactive. <Counter /></li>
  </ul>
</template>

<script lang="ts">
import Counter from '../../components/Counter.vue'
const components = { Counter }
export default { components }
</script>
