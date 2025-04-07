# `vike-vue-pinia`

Integrates [Pinia](https://pinia.vuejs.org) into your [`vike-vue`](https://vike.dev/vike-vue) app.

[Installation](#installation)  
[Example](https://github.com/vikejs/vike-vue/tree/main/examples/vue-pinia)  
[Version history](https://github.com/vikejs/vike-vue/blob/main/packages/vike-vue-pinia/CHANGELOG.md)  
[See also](#see-also)  

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


## See also

- [Vike Docs > Pinia](https://vike.dev/pinia)
