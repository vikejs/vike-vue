<template>
  <div>
    <h1>Client Only Component</h1>
    <p>This component is rendered only on the client side.</p>
  </div>
</template>

<script setup lang="ts">
console.log('This will only run on the client side.')
</script>
