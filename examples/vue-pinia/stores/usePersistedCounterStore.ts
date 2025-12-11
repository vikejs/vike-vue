import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePersistedCounterStore = defineStore(
  'persistedCounter',
  () => {
    const count = ref(0)

    const increment = () => count.value++

    return { count, increment }
  },
  {
    // Persist state to localStorage - counter persists across page reloads
    persist: true,
  },
)
