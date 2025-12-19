<template>
  <h1>ClientOnly</h1>

  <h2>Using <code>&lt;ClientOnly&gt;</code> component</h2>

  <h3>Basic example with fallback</h3>
  <ClientOnly>
    <template #fallback>
      <p>Loading client-only component...</p>
    </template>
    <p>Some text before</p>
    <ClientOnlyComponent msg="hello" />
    <p>Some text after</p>
  </ClientOnly>

  <h3>Without fallback</h3>
  <ClientOnly>
    <ClientOnlyComponent msg="bonjour" />
  </ClientOnly>
</template>

<script lang="ts" setup>
import { ClientOnly } from 'vike-vue/ClientOnly'
import ClientOnlyComponent from './ClientOnlyComponent.vue'
</script>

<style scoped>
h2 {
  margin-top: 50px;
}
</style>
