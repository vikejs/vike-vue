<!-- WARNING: keep links absolute in this file so they work on NPM too -->

[![npm version](https://img.shields.io/npm/v/vike-vue-query)](https://www.npmjs.com/package/vike-vue-query)

# `vike-vue-query`

Integrates [TanStack Query](https://tanstack.com/query) into your [`vike-vue`](https://vike.dev/vike-vue) app.

[Installation](#installation)  
[Basic usage](#basic-usage)  
[Example](#example)  
[SSR & Hydration](#ssr--hydration)  
[Error Handling](#error-handling)  
[Client-only fetching](#client-only-fetching)  
[Settings](#settings)  
[Version history](https://github.com/vikejs/vike-vue/blob/main/packages/vike-vue-query/CHANGELOG.md)  
[See also](#see-also)  

Features:
- **Automatic SSR**: Data is fetched on the server and automatically hydrated on the client
- **Progressive rendering**: The rest of your page renders while data is being fetched
- **Type-safe**: Full TypeScript support
- **Caching & refetching**: Leverage TanStack Query's powerful caching and refetching capabilities
- **Stale-while-revalidate**: Show stale data immediately while fetching fresh data in the background

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


## Basic usage

```vue
<template>
  <h1>Star Wars Movies</h1>
  <ol>
    <template v-if="isPending">
      <li>Loading...</li>
    </template>
    <template v-else-if="isError">
      <li>Error: {{ error.message }}</li>
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

const { isError, isPending, data, error, suspense } = useQuery({
  queryKey: ['movies'],
  queryFn: fetchMovies,
  staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
})

// Prefetch data on the server for SSR
onServerPrefetch(suspense)

async function fetchMovies() {
  const response = await fetch('https://brillout.github.io/star-wars/api/films.json')
  return await response.json()
}
</script>
```

Benefits:
 - **Component-level data fetching**: Fetch data at the component level (unlike [`+data`](https://vike.dev/data), which fetches at the page level).
 - **Automatic SSR**: Data is fetched on the server and automatically sent to the client.
 - **Progressive rendering**: The rest of the page renders while components wait for their data.
 - **Caching & refetching**: All the benefits of TanStack Query's caching, refetching, and stale-while-revalidate patterns.

You can use TanStack Query alongside Vike's [`+data` hook](https://vike.dev/data) — use `+data` for some pages and `vike-vue-query` for others, or mix both approaches as needed.

<br/>


## Example

See [examples/vue-query/](https://github.com/vikejs/vike-vue/tree/main/examples/vue-query).

<br/>


## SSR & Hydration

Data fetched on the server is automatically serialized and sent to the client for hydration:

```vue
<script setup>
import { onServerPrefetch } from 'vue'
import { useQuery } from '@tanstack/vue-query'

const { data, suspense } = useQuery({
  queryKey: ['user', userId],
  queryFn: () => fetchUser(userId)
})

// This ensures the query runs on the server
onServerPrefetch(suspense)
</script>
```

When your page is server-side rendered:
1. **On the server**: The query is executed via `onServerPrefetch(suspense)`, fetching the data
2. **Data serialization**: The fetched data is automatically serialized and embedded in the HTML
3. **On the client**: When the page hydrates, TanStack Query uses the serialized data instead of refetching

This prevents the "flash of loading state" and improves perceived performance. The data is already available when your component mounts on the client.

> [!NOTE]
> If you don't call `onServerPrefetch(suspense)`, the query will only run on the client-side. See [Client-only fetching](#client-only-fetching) for more details.

<br/>


## Error Handling

TanStack Query provides built-in error handling:

```vue
<template>
  <div v-if="isError" class="error">
    <p>Error: {{ error.message }}</p>
    <button @click="refetch">Retry</button>
  </div>
  <div v-else-if="isPending">Loading...</div>
  <div v-else>
    <h1>{{ data.title }}</h1>
  </div>
</template>

<script setup>
import { onServerPrefetch } from 'vue'
import { useQuery } from '@tanstack/vue-query'

const { isPending, isError, data, error, refetch, suspense } = useQuery({
  queryKey: ['movie', movieId],
  queryFn: async () => {
    const response = await fetch(`/api/movies/${movieId}`)
    if (!response.ok) {
      throw new Error('Failed to fetch movie')
    }
    return response.json()
  },
  retry: 3, // Retry failed requests up to 3 times
  retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
})

onServerPrefetch(suspense)
</script>
```

You can also configure global error handling in your query client config:

```ts
// pages/+queryClientConfig.ts

import type { QueryClientConfig } from '@tanstack/vue-query'

export const queryClientConfig: QueryClientConfig = {
  defaultOptions: {
    queries: {
      retry: 1,
      onError: (error) => {
        console.error('Query error:', error)
      }
    }
  }
}
```

<br/>


## Client-only fetching

If you want a query to only run on the client (not during SSR), simply don't call `onServerPrefetch`:

```vue
<script setup>
import { useQuery } from '@tanstack/vue-query'

// This query only runs on the client
const { data, isPending } = useQuery({
  queryKey: ['user-preferences'],
  queryFn: fetchUserPreferences,
  // These queries often don't need SSR
  staleTime: Infinity,
})
</script>
```

This is useful for:
- User-specific data that doesn't need to be in the initial HTML
- Data that depends on client-side state (e.g., auth tokens stored in localStorage)
- Non-critical data that can load progressively after the page renders

<br/>


## Settings

You can customize the TanStack Query client by providing a `queryClientConfig` setting. This can be done either in your `+config.ts` file or in a separate `+queryClientConfig.ts` file in your `pages` directory.

```ts
// pages/+queryClientConfig.ts

export { queryClientConfig }

import type { QueryClientConfig } from '@tanstack/vue-query'

const queryClientConfig: QueryClientConfig = {
  defaultOptions: {
    queries: {
      // Consider data stale after 2 minutes
      staleTime: 1000 * 60 * 2,
      // Don't refetch when window regains focus during development
      refetchOnWindowFocus: import.meta.env.PROD,
      // Retry failed requests once
      retry: 1,
    }
  }
}
```

Common options you might want to configure:

- **`staleTime`**: Time in milliseconds before cached data is considered stale (default: 0)
- **`cacheTime`**: Time in milliseconds that unused/inactive cache data remains in memory (default: 5 minutes)
- **`refetchOnWindowFocus`**: Refetch queries when the window regains focus (default: true)
- **`refetchOnReconnect`**: Refetch queries when the network reconnects (default: true)
- **`retry`**: Number of times to retry failed requests (default: 3)

For all available options, see the [TanStack Query documentation](https://tanstack.com/query/latest/docs/framework/vue/reference/QueryClient).

<br/>


## See also

- [Vike Docs > TanStack Query](https://vike.dev/tanstack-query)
