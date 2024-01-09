import { createPinia } from 'pinia';
import type { OnCreateAppSync } from 'vike-vue';

export { installPinia }

const installPinia: OnCreateAppSync = ({ app }): ReturnType<OnCreateAppSync> => {
  const pinia = createPinia()
  app.use(pinia)
}
