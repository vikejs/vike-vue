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

<script lang="ts" setup>
import * as toastPlugin from 'vue-toast-notification'
import { onBeforeUnmount, onMounted } from 'vue'

onMounted(() => {
  const useToast = toastPlugin.useToast()
  useToast.success('I am a Vue plugin!', {
    position: 'bottom',
    duration: 0, // infinite
  })
})

onBeforeUnmount(() => {
  const useToast = toastPlugin.useToast()
  useToast.clear()
})
</script>

<style>
/* see https://stackoverflow.com/questions/55206901/how-to-import-css-files-in-vue-3-child-components */
@import 'vue-toast-notification/dist/theme-sugar.css';
</style>
