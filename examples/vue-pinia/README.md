Example of using [Pinia](https://pinia.vuejs.org) with the `vike-vue-pinia` extension.

This example demonstrates:
- Basic Pinia store usage with SSR
- Client-side state persistence using `pinia-plugin-persistedstate` (counter state persists across page reloads)
- Using `onCreatePinia` hook to register Pinia plugins

> [!NOTE]
> For more examples, see [Bati](https://batijs.dev) which generates `vike-vue` apps.

```bash
git clone git@github.com:vikejs/vike-vue
cd vike-vue/examples/vue-pinia/
npm install
npm run dev
```
