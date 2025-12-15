Example of using [Pinia](https://pinia.vuejs.org) with the `vike-vue-pinia` extension.

This example demonstrates:
- Basic Pinia store usage with SSR (Home page: counters synced between components)
- Client-side state persistence using `pinia-plugin-persistedstate` (About page: counter persists across page reloads)
- Using `onCreatePinia` hook to register Pinia plugins
- Todo list with SSR data fetching and store population
- Client-only rendering for persisted stores to avoid hydration mismatches

> [!NOTE]
> The home page uses a **non-persisted** store to demonstrate SSR without hydration issues. The about page uses a **persisted** store with **client-only rendering** (`v-if="mounted"`) to avoid hydration mismatches between server (no localStorage) and client (has localStorage).

> [!NOTE]
> For more examples, see [Bati](https://batijs.dev) which generates `vike-vue` apps.

```bash
git clone git@github.com:vikejs/vike-vue
cd vike-vue/examples/vue-pinia/
npm install
npm run dev
```
