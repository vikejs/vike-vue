<template>
  <img />
  <Head>
    <meta name="description" content="testing Head component">
  </Head>
</template>

<style>
  img {
    height: 48px;
    vertical-align: middle;
    margin-left: 10px;
  }
</style>

<script lang="ts" setup>
import { useAttrs, h } from 'vue'
import { useConfig } from 'vike-vue/useConfig'
import { Head } from 'vike-vue/Head'

const { src, author } = useAttrs() as { src: string; author: string }

const config = useConfig()
config({
  Head: h('script', {
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org/',
      contentUrl: { src },
      creator: {
        '@type': 'Person',
        name: author,
      },
    }),
  }),
})
</script>
