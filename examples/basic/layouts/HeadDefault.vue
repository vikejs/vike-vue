<template>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="description" content="Demo showcasing Vike + Vue" />
  <link rel="icon" :href="logoUrl" />
  <link v-if="canonicalUrl" rel="canonical" :href="canonicalUrl">
</template>

<script lang="ts" setup>
import logoUrl from '../assets/logo.svg'

import { usePageContext } from 'vike-vue/usePageContext'
import { PageContext } from 'vike/types';

const pageContext = usePageContext();

function getCanonicalUrl(pageContext: PageContext): null | string {

  // A canonical URL for a 404 page would be nonsensical in the general case.
  //
  // If, on the other hand, you deprecate links to old content, for SEO you may 
  // need to decide whether to return a 404 (optionally with a canonical URL),
  // or a 301, or to handle the link deprecation in some other fashion. Good luck.
  if (pageContext.is404) {
    return null
  }
    
  return new URL(pageContext.urlPathname, pageContext.config.baseUrl).toString();
}

const canonicalUrl = getCanonicalUrl(pageContext);
</script>
