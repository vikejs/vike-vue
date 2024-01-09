import type { DehydrateStore } from 'vike-vue';

export { dehydratePinia }

const dehydratePinia: DehydrateStore = ({ app }): ReturnType<DehydrateStore> => app.config.globalProperties.$pinia.state.value
