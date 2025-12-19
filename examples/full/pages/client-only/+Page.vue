<template>
  <h1>ClientOnly</h1>


  <h2>Using <code>&lt;ClientOnly&gt;</code> component</h2>

  <h3>Basic example with fallback</h3>
  <ClientOnly>
    <template #fallback>
      <p>Loading...</p>
    </template>
    <p>Some text before</p>
    <ClientOnlyComponent msg="hello" />
    <p>Some text after</p>
  </ClientOnly>

  <h3>Without fallback</h3>
  <ClientOnly>
    <ClientOnlyComponent msg="bonjour" />
  </ClientOnly>


  <h2>Using <code>clientOnly()</code> helper</h2>
  <pre><code>{{ `const ClientOnlyCounter = clientOnly(() => import('../../components/Counter.vue'))

<ClientOnlyCounter>
  <template #fallback>
    <p>Loading...</p>
  </template>
</ClientOnlyCounter>
` }}</code></pre>

  <h3>Basic example</h3>
  <ClientOnlyCounter>
    <template #fallback>
      <p style="min-height: 21px">Fast loading counter...</p>
    </template>
  </ClientOnlyCounter>

  <h3>Slow loading component</h3>
  <SlowClientOnlyToggler :status="null" @toggle="onToggle" style="color: green; min-height: 32px">
    <!-- if the component uses the #fallback slot you can use #client-only-fallback -->
    <template #client-only-fallback="{ attrs }">
      <p :style="attrs.style">Slow loading toggler...Time until load: {{ timeLeft / 1000 }}s</p>
    </template>

    <template #fallback>Buton is in limbo</template>

    <template #prefix>Button is </template>

    <template #="{ status }">{{ status ? 'pressed' : 'depressed :)' }}</template>
  </SlowClientOnlyToggler>

  <h3>Handling errors when loading</h3>
  <ErrorClientOnlyToggler>
    <!-- handling errors using the #fallback / #client-only-fallback slot -->
    <template #client-only-fallback="{ error }">
      <p v-if="!error">Trying to load toggler...</p>
      <p v-else style="color: red">{{ error.message }}</p>
    </template>
  </ErrorClientOnlyToggler>

  <h3>Nothing rendered on server</h3>
  <ClientOnlyCounter />

  <h3>Nothing rendered on server when component uses #fallback slot</h3>
  <FastClientOnlyToggler :status="null">
    <template #client-only-fallback></template>

    <template #fallback>Buton is in limbo</template>
  </FastClientOnlyToggler>
</template>

<script lang="ts" setup>
import { ref, watchEffect } from 'vue'
import { clientOnly } from 'vike-vue/clientOnly'
import { ClientOnly } from 'vike-vue/ClientOnly'
import ClientOnlyComponent from './ClientOnlyComponent.vue'

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

const onToggle = <T>(val: T) => {
  console.log('Toggled value:', val)
}

const ClientOnlyCounter = clientOnly(() => import('../../components/Counter.vue'))

const SlowClientOnlyToggler = clientOnly(async () => {
  await new Promise((resolve) => {
    setTimeout(resolve, delay)
  })
  return import('../../components/Toggler.vue')
})

const FastClientOnlyToggler = clientOnly(() => import('../../components/Toggler.vue'))

const ErrorClientOnlyToggler = clientOnly(() => {
  throw new Error('The Toggler does not like to be loaded')
})
</script>

<style scoped>
pre {
  background-color: #eee;
  padding: 1rem;
}
h2 {
  margin-top: 50px;
}
</style>
