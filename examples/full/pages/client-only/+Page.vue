<template>
  <h1>ClientOnly</h1>
  <h2>Basic Usage</h2>
  <pre><code>{{ codeExample }}</code></pre>
  <p>Time until load: {{ timeLeft / 1000 }}s</p>
  <h2>Demo</h2>
  <ClientOnlyCounter :start="1" @increment="onIncrement">
    <template #fallback>
      <p>Loading counter...</p>
    </template>
    <template #prefix>
      Pressed
    </template>
    <template #="{ count }">
      {{ count.toFixed(2) }}
    </template>
    <template #suffix>
      times
    </template>
  </ClientOnlyCounter>

  <ClientOnlyCounter :start="1" @increment="onIncrement">
    <template #client-only-fallback>
      <p>Loading counter...</p>
    </template>
    <template #fallback>
      Fallback
    </template>
    <template #prefix>
      Pressed
    </template>
    <template #="{ count }">
      {{ count.toFixed(2) }}
    </template>
    <template #suffix>
      times
    </template>
  </ClientOnlyCounter>

  <ClientOnlyToggler :status="true">
    <template #client-only-fallback>
      <p>Loading toggler...</p>
    </template>
    <template #prefix>
      Button is
    </template>
    <template #="{ status }">
      {{ status ? 'pressed' : 'depressed :)' }}
    </template>
  </ClientOnlyToggler>

  <ClientOnlyTogglerFast />
</template>

<script lang="ts" setup>
import { ref, watchEffect } from 'vue'
import { clientOnly } from 'vike-vue/clientOnly'

const codeExample = `<ClientOnlyCounter :start="1" @increment="test">
  <template #fallback>
    <p>Loading...</p>
  </template>
  <template #test="{ count }">
    aaa {{ count }}
  </template>
</ClientOnlyCounter>
`

const delay = 3000

const timeLeft = ref(delay)

const interval = setInterval(() => {
  timeLeft.value -= 100
}, 100)

watchEffect(() => {
  if (timeLeft.value <= 0) {
    clearInterval(interval)
  }
})

const onIncrement = <T>(val: T) => {
  console.log(val)
}

const ClientOnlyCounter = clientOnly(async () => {
  await new Promise((resolve) => {
    setTimeout(resolve, delay)
  })
  return import('../../components/Counter.vue')
})

// const ClientOnlyCounter = clientOnly(
//   () =>
//     new Promise((resolve) => {
//       setTimeout(() => {
//         // does not match type???
//         resolve(import('../../components/Counter.vue'))
//       }, delay)
//     }),
// )

const ClientOnlyToggler = clientOnly(async () => {
  await new Promise((resolve) => {
    setTimeout(resolve, delay)
  })
  return import('../../components/Toggler.vue').then((m) => m.default)
})

const ClientOnlyTogglerFast = clientOnly(() => import('../../components/Toggler.vue'))
</script>

<style scoped>
pre {
  background-color: #eee;
  padding: 1rem;
}
</style>
