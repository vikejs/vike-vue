<template>
  <p>
    Page showcasing an <code>&lt;Image&gt;</code> component that adds/teleports structured data (<code
      >&lt;script type="application/ld+json"&gt;</code
    >) to <code>&lt;head&gt;</code>, see HTML.
  </p>
  <div>New logo: <Image :src="logoNew" author="brillout" /></div>
  <br />
  <div>Old logo: <Image :src="logoOld" author="Romuald Brillout" /></div>
  <br />
  <Counter />
</template>

<script lang="ts" setup>
import Counter from '../../components/Counter.vue'
import logoNew from '../../assets/logo-new.svg'
import logoOld from '../../assets/logo.svg'
import Image from './Image.vue'
</script>
