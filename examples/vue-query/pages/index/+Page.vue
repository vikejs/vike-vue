<template>
  <h1>My Vike + Vue app</h1>
  This page is:
  <ul>
    <li>Rendered to HTML.</li>
    <li>Interactive.</li>
  </ul>
  <Counter />
  <hr />
  <Counter />
</template>

<script lang="ts" setup>
import Counter from '../../components/Counter.vue'
</script>
