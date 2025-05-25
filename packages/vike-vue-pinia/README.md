# `vike-vue-pinia`

Integrates [Pinia](https://pinia.vuejs.org) into your [`vike-vue`](https://vike.dev/vike-vue) app.

[Installation](#installation)  
[Example](#example)  
[Populate store with `+data`](#populate-store-with-data)  
[Version history](#version-history)  
[See also](#see-also)  

<br/>

## Example

See [examples/vue-pinia](https://github.com/vikejs/vike-vue/tree/main/examples/vue-pinia).

<br/>

## Installation

1. `npm install vike-vue-pinia pinia`
2. Extend `+config.js`:
   ```js
   // pages/+config.js

   import vikeVue from 'vike-vue/config'
   import vikeVuePinia from 'vike-vue-pinia/config'

   export default {
     // ...
     extends: [vikeVue, vikeVuePinia]
   }
   ```
3. You can now use Pinia in any of your components.
   ```vue
    <template>
      <button type="button" @click="counterStore.increment">Counter {{ counterStore.count }}</button>
    </template>

    <script setup>
    import { useCounterStore } from './useCounterStore'
    const counterStore = useCounterStore()
    </script>
    ```
    ```js
    import { defineStore } from 'pinia'
    import { ref } from 'vue'

    export const useCounterStore = defineStore('counter', () => {
      const count = ref(0)
      const increment = () => count.value++
      return { count, increment }
    })
    ```

> [!NOTE]
> The `vike-vue-pinia` extension requires [`vike-vue`](https://vike.dev/vike-vue).

<br/>

## Populate store with `+data`

To populate your store with data fetched via the [`+data`](https://vike.dev/data) hook, use [`+onData`](https://vike.dev/onData) and [`pageContext.data`](https://vike.dev/pageContext#data).

```ts
// pages/todos/+onData.ts
// Environment: server, client
export { onData }

import type { PageContext } from 'vike/types'
import type { Data } from './+data'
import { useTodoStore } from '../../stores/useTodoStore'

function onData(pageContext: PageContext & { data?: Data }) {
  const { initTodos } = useTodoStore(pageContext.pinia!)
  initTodos(pageContext.data!.todosInit)

  // Saving KBs: we don't need pageContext.data (we use the store instead)
  // - If we don't delete pageContext.data then Vike sends pageContext.data to the client-side
  // - This optimization only works if the page is SSR'd: if the page is pre-rendered then don't do this
  delete pageContext.data
}
```

See To-Do List example at [examples/vue-pinia](https://github.com/vikejs/vike-vue/tree/main/examples/vue-pinia).

> [!NOTE]
> During [SSR](https://vike.dev/ssr), `+onData` is called only on the server. That's because the store state is sent to the client, so that when the page hydrates, the client has the exact same state as the server — preventing [hydration mismatches](https://vike.dev/hydration-mismatch).
>
> As a result, the store doesn't need to be populated on the client: it's already populated on the server and then sent to the client.
>
> See also: [What it does](#what-it-does).

<br/>

## Version history

See [CHANGELOG.md](https://github.com/vikejs/vike-vue/blob/main/packages/vike-vue-pinia/CHANGELOG.md).

<br/>

## See also

- [Vike Docs > Pinia](https://vike.dev/pinia)
