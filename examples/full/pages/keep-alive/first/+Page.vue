<template>
  <h1>KeepAlive - First Page</h1>
  <p>This page's component instance is preserved across client-side navigation.</p>
  <Counter />
  <p><a href="/keep-alive/second">KeepAlive - Second Page</a></p>
</template>

<script lang="ts" setup>
import Counter from '../../../components/Counter.vue'
</script>
