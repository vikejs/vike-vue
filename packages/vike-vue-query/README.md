<!-- WARNING: keep links absolute in this file so they work on NPM too -->

[![npm version](https://img.shields.io/npm/v/vike-vue-query)](https://www.npmjs.com/package/vike-vue-query)

# `vike-vue-query`

Integrates [TanStack Query](https://tanstack.com/query) into your [`vike-vue`](https://vike.dev/vike-vue) SSR app.

Features:
- Data is fetched at the component level (unlike [`+data`](https://vike.dev/data), which fetches at the page level)
- All TanStack Query niceties
- All SSR benefits

You can completely stop using Vike's [`+data` hook](https://vike.dev/data) — or use both: `+data` for some pages, and `vike-vue-query` for others.

> [!NOTE]
> If you don't use [SSR](https://vike.dev/ssr) (i.e. SPA/SSG with [pre-rendering](https://vike.dev/pre-rendering)), then **you don't need `vike-vue-query`** — you can use TanStack Query without any Vike integration.

<br/>

**Table of Contents**

[Installation](#installation)  
[Basic usage](#basic-usage)  
[Example](#example)  
[Settings](#settings)  
[Version history](#version-history)  
[See also](#see-also)  

<br/>

## Installation

1. `npm install vike-vue-query @tanstack/vue-query`
2. Extend `+config.js`:
   ```js
   // pages/+config.js

   import vikeVue from 'vike-vue/config'
   import vikeVueQuery from 'vike-vue-query/config'

   export default {
     // ...
     extends: [vikeVue, vikeVueQuery]
   }
   ```

> [!NOTE]
> The `vike-vue-query` extension requires [`vike-vue`](https://vike.dev/vike-vue).

<br/>

# Basic usage

```vue
<template>
  <h1>Star Wars Movies</h1>
  <ol>
    <template v-if="isPending">
      <li>Loading...</li>
    </template>
    <template v-else-if="isError">
      <li>Error: {{ error }}</li>
    </template>
    <template v-else>
      <li v-for="item in data!" :key="item.id">
        {{ item.title }} ({{ item.release_date }})
      </li>
    </template>
  </ol>
</template>

<script setup>
import { onServerPrefetch } from 'vue'
import { useQuery } from '@tanstack/vue-query'

const { isError, isPending, isFetching, data, error, suspense } = useQuery({
  queryKey: ['movies'],
  queryFn: fetchMovies,
  staleTime: 1000 * 60 * 5,
  select: (data) => minimize(data),
})

// This will be called on the server to prefetch the data
onServerPrefetch(suspense)

async function fetchMovies() {
  const response = await fetch('https://brillout.github.io/star-wars/api/films.json')
  const moviesData = (await response.json())
  return moviesData
}

function minimize(movies) {
  return movies.map((movie) => {
    const { title, release_date, id } = movie
    return { title, release_date, id }
  })
}
</script>
```

<br/>

## Example

See [examples/vue-query/](https://github.com/vikejs/vike-vue/tree/main/examples/vue-query).

<br/>

## Settings

You can set TanStack Query client options:

```ts
// pages/+queryClientConfig.ts

export { queryClientConfig }

import type { QueryClientConfig } from '@tanstack/vue-query'

const queryClientConfig: QueryClientConfig = {
  defaultOptions: {
    queries: {
      // Retry failed requests once
      retry: 1,
      // Consider data stale after 2 minutes
      staleTime: 1000 * 60 * 2,
      // Don't refetch when window loses or gains focus during development
      refetchOnWindowFocus: import.meta.env.PROD,
      // ... more options ...
    }
  }
}
```

For all available options, see [TanStack Query > API reference > useQuery](https://tanstack.com/query/latest/docs/framework/vue/reference/useQuery).

<br/>

## Version history

See [CHANGELOG.md](https://github.com/vikejs/vike-vue/blob/main/packages/vike-vue-query/CHANGELOG.md).

<br/>

## See also

- [Vike Docs > TanStack Query](https://vike.dev/tanstack-query)
