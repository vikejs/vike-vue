<!-- WARNING: keep links absolute in this file so they work on NPM too -->

[![npm version](https://img.shields.io/npm/v/vike-vue-pinia)](https://www.npmjs.com/package/vike-vue-pinia)

# `vike-vue-pinia`

Integrates [Pinia](https://pinia.vuejs.org) into your [`vike-vue`](https://vike.dev/vike-vue) app.

[Installation](#installation)  
[Basic usage](#basic-usage)  
[Example](#example)  
[SSR & Hydration](#ssr--hydration)  
[Populate store with `+data`](#populate-store-with-data)  
[Version history](#version-history)  
[See also](#see-also)  

Features:
- **Zero-config SSR**: Store state is automatically serialized on the server and hydrated on the client — no manual setup needed
- **Type-safe**: Full TypeScript support with Pinia's composable stores
- **Hydration-safe**: Prevents hydration mismatches by ensuring client and server have the same state

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

> [!NOTE]
> The `vike-vue-pinia` extension requires [`vike-vue`](https://vike.dev/vike-vue).

<br/>


## Basic usage

Define your stores using Pinia's composition API:

```js
// stores/useCounterStore.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const increment = () => count.value++
  return { count, increment }
})
```

Use the store in your components:

```vue
<template>
  <button type="button" @click="counterStore.increment">
    Counter {{ counterStore.count }}
  </button>
</template>

<script setup>
import { useCounterStore } from '../stores/useCounterStore'
const counterStore = useCounterStore()
</script>
```

That's it! The store state is automatically:
- **Initialized on the server** during SSR
- **Serialized and sent to the client** with the HTML
- **Hydrated on the client** so your app starts with the same state

<br/>


## Example

See [examples/vue-pinia](https://github.com/vikejs/vike-vue/tree/main/examples/vue-pinia).

<br/>


## SSR & Hydration

When using SSR (Server-Side Rendering), `vike-vue-pinia` automatically handles state transfer between server and client:

```vue
<script setup>
import { onServerPrefetch } from 'vue'
import { useCounterStore } from '../stores/useCounterStore'

const counterStore = useCounterStore()

// Initialize state on the server
onServerPrefetch(() => {
  counterStore.increment()
})
</script>
```

Here's what happens:

1. **On the server**: Your store is created and any `onServerPrefetch` hooks run to initialize the state
2. **State serialization**: The store's state is automatically serialized and embedded in the HTML
3. **On the client**: When the page hydrates, the store is initialized with the serialized state from the server

This ensures that the client starts with the exact same state as the server, preventing [hydration mismatches](https://vike.dev/hydration-mismatch).

> [!TIP]
> You can access the Pinia instance via `pageContext.pinia` if you need to interact with it directly in hooks like `+onData`.

<br/>

## Populate store with `+data`

You can populate your store with data fetched via Vike's [`+data`](https://vike.dev/data) hook. Use the [`+onData`](https://vike.dev/onData) hook to initialize your store when data is fetched:

```ts
// pages/todos/+data.ts
export { data }

export type Data = Awaited<ReturnType<typeof data>>

async function data() {
  const todosInit = await fetchTodos()
  return { todosInit }
}
```

```ts
// pages/todos/+onData.ts
// Environment: server, client
export { onData }

import type { PageContext } from 'vike/types'
import type { Data } from './+data'
import { useTodoStore } from '../../stores/useTodoStore'

function onData(pageContext: PageContext & { data?: Data }) {
  // Access the Pinia instance from pageContext
  const todoStore = useTodoStore(pageContext.pinia!)
  todoStore.initTodos(pageContext.data!.todosInit)

  // Optional optimization: delete pageContext.data to save KBs
  // The data is now in the store, so we don't need to send it separately
  // Note: Only do this for SSR'd pages, not pre-rendered pages
  if (!pageContext.isPrerendering) {
    delete pageContext.data
  }
}
```

Define your store with an initialization method:

```ts
// stores/useTodoStore.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'

type Todo = { text: string }

export const useTodoStore = defineStore('todo', () => {
  const todos = ref<Todo[]>([])

  const initTodos = (todosInit: Todo[]) => {
    // Only initialize if not already populated
    if (todos.value.length === 0) {
      todos.value = todosInit
    }
  }

  const addTodo = (todo: Todo) => {
    todos.value.push(todo)
  }

  return { todos, initTodos, addTodo }
})
```

See complete To-Do List example at [examples/vue-pinia](https://github.com/vikejs/vike-vue/tree/main/examples/vue-pinia).

> [!NOTE]
> During [SSR](https://vike.dev/ssr), `+onData` is called only on the server. The store state is automatically sent to the client and restored during hydration, so there's no need to populate the store again on the client.

<br/>

## Version history

See [CHANGELOG.md](https://github.com/vikejs/vike-vue/blob/main/packages/vike-vue-pinia/CHANGELOG.md).

<br/>

## See also

- [Vike Docs > Pinia](https://vike.dev/pinia)
