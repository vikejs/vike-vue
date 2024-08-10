<template>
  <img :src="src" />
  <Head>
    <CustomScript />
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

const { src, author } = defineProps<{
  src?: string
  author?: string
}>()

const CustomScript = h('script', {
  type: 'application/ld+json',
  innerHTML: JSON.stringify({
    '@context': 'https://schema.org/',
    contentUrl: { src: src },
    creator: {
      '@type': 'Person',
      name: author,
    },
  }),
})
</script>
