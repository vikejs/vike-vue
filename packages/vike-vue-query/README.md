# `vike-vue-query`

[Installation](#installation)  
[Settings](#settings)  
[Example](https://github.com/vikejs/vike-vue/tree/main/examples/vue-query)  
[Version history](https://github.com/vikejs/vike-vue/blob/main/packages/vike-vue-query/CHANGELOG.md)  
[See also](#see-also)  

<br/>

Integrates [TanStack Query](https://tanstack.com/query) into your [`vike-vue`](https://vike.dev/vike-vue) app.


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
3. You can now use TanStack Query in any of your components.
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

> [!NOTE]
> The `vike-vue-query` extension requires [`vike-vue`](https://vike.dev/vike-vue).

<br/>


## Settings

The query client can receive custom options either by adding `queryClientConfig` to your `+config.ts` or adding a separate `+queryClientConfig.ts` file in your `pages` directory.

```ts
// pages/+queryClientConfig.ts

export { queryClientConfig }

import type { QueryClientConfig } from '@tanstack/vue-query'

// Query client options
const queryClientConfig: QueryClientConfig = {
  defaultOptions: {
    queries: {
      // Don't refetch when window loses or gains focus during development
      refetchOnWindowFocus: import.meta.env.PROD,
      staleTime: 1000 * 60 * 2
      // ... more options ...
    }
  }
}
```

<br/>


## See also

- [Vike Docs > TanStack Query](https://vike.dev/tanstack-query)
