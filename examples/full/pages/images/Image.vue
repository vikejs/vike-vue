<template>
  <img :src="props.src" :author="props.author" />
  <Head>
    <Script></Script>
  </Head>
</template>

<style scoped>
img {
  height: 48px;
  vertical-align: middle;
  margin-left: 10px;
}
</style>

<script lang="ts" setup>
import { h } from 'vue'
import { Head } from 'vike-vue/Head'

const props = defineProps<{
  src?: string
  author?: string
}>()

const Script = h('script', {
  type: 'application/ld+json',
  innerHTML: JSON.stringify({
    '@context': 'https://schema.org/',
    contentUrl: { src: props.src },
    creator: {
      '@type': 'Person',
      name: props.author,
    },
  }),
})
</script>
