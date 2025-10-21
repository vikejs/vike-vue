# Vike Vue vs Nuxt Feature Comparison

This document provides a comprehensive comparison between Vike Vue and Nuxt to help you understand which features are supported, how they differ, and where each framework has its strengths.

## Overview

Both Vike Vue and Nuxt are Vue.js frameworks for building full-stack applications with SSR (Server-Side Rendering) support. While Nuxt is an opinionated, batteries-included framework, Vike Vue offers more flexibility and explicit control. This comparison aims to inform users of the different philosophies and technical features of each framework, so you can choose the one that best fits your needs.

## Feature Comparison Table

| Feature | Vike Vue | Nuxt | Notes |
|---------|----------|------|-------|
| **File-based Routing** | ✅ Yes | ✅ Yes | Vike uses `+Page.vue` files, Nuxt uses `pages/` directory |
| **SSR (Server-Side Rendering)** | ✅ Yes | ✅ Yes | Both support SSR out of the box |
| **SSG (Static Site Generation)** | ✅ Yes | ✅ Yes | Vike calls it pre-rendering |
| **Client-Side Navigation** | ✅ Yes | ✅ Yes | Both support SPA-like navigation |
| **Layouts** | ✅ Yes | ✅ Yes | Vike uses `+Layout.vue`, Nuxt uses `layouts/` directory |
| **Error Pages** | ✅ Yes | ✅ Yes | Vike uses `_error/+Page.vue` |
| **Data Fetching** | ✅ Yes | ✅ Yes | Vike uses `+data.ts`, Nuxt uses `useAsyncData`/`useFetch` |
| **Head/Meta Management** | ✅ Yes | ✅ Yes | Vike uses `+Head.vue` or config, Nuxt uses `useHead`/`useSeoMeta` |
| **TypeScript** | ✅ Yes | ✅ Yes | Both have first-class TypeScript support |
| **Vite** | ✅ Yes | ✅ Yes | Both are built on Vite |
| **State Management (Pinia)** | ✅ Yes (via extension) | ✅ Yes (built-in) | Vike uses `vike-vue-pinia` extension |
| **API Routes** | ⚠️ Via Vike | ✅ Yes | Nuxt has `server/api/`, Vike requires manual setup |
| **Middleware** | ✅ Yes | ✅ Yes | Vike uses hooks like `onBeforeRender`, Nuxt uses `middleware/` |
| **Plugins** | ✅ Yes | ✅ Yes | Vike uses `+onCreateApp.ts`, Nuxt uses `plugins/` |
| **Auto-imports** | ❌ No | ✅ Yes | Nuxt auto-imports components, composables; Vike requires explicit imports |
| **Built-in Components** | ❌ Minimal | ✅ Yes | Nuxt provides `<NuxtLink>`, `<NuxtPage>`, etc. |
| **Dev Tools** | ⚠️ Via Vite | ✅ Yes | Nuxt has dedicated DevTools, Vike uses Vite DevTools |
| **Deployment Presets** | ⚠️ Manual | ✅ Yes | Nuxt has many deployment presets, Vike requires more manual configuration |
| **Modules Ecosystem** | ⚠️ Growing | ✅ Extensive | Nuxt has a larger ecosystem of modules |

## Detailed Feature Breakdown

### 1. Routing

#### Vike Vue
- **File-based routing**: Pages are defined using `+Page.vue` files
- **Route parameters**: Dynamic routes via `+route.ts` files
- **Customizable**: Full control over routing logic
- **Example**:
  ```
  pages/
    index/+Page.vue           # /
    about/+Page.vue           # /about
    user/@id/+Page.vue        # /user/:id
    product/+route.ts         # Custom route logic
  ```

#### Nuxt
- **File-based routing**: Pages in `pages/` directory
- **Dynamic routes**: Using bracket syntax `[id].vue`
- **Nested routes**: Automatic via folder structure
- **Example**:
  ```
  pages/
    index.vue                 # /
    about.vue                 # /about
    user/[id].vue             # /user/:id
  ```

Both frameworks offer robust file-based routing with different conventions and extensibility.

### 2. Data Fetching

#### Vike Vue
- **`+data.ts` files**: Define data fetching logic per page
- **Type-safe**: Full TypeScript support with type inference
- **Flexible**: Choose when and where to fetch data
- **TanStack Query support**: Via `vike-vue-query` extension
- **Example**:
  ```typescript
  // pages/movies/+data.ts
  export { data }
  export type Data = Awaited<ReturnType<typeof data>>

  const data = async (pageContext) => {
    const response = await fetch('https://api.example.com/movies')
    const movies = await response.json()
    return { movies }
  }
  ```

#### Nuxt
- **`useAsyncData` & `useFetch`**: Composables for data fetching
- **Auto-deduplication**: Prevents duplicate requests
- **State management**: Automatically manages loading states
- **Example**:
  ```vue
  <script setup>
  const { data: movies } = await useFetch('/api/movies')
  </script>
  ```

Nuxt provides convenient built-in composables for data fetching and state, whereas Vike Vue offers more explicit control and flexibility.

### 3. Layouts

#### Vike Vue
- **`+Layout.vue` files**: Define layouts per page or globally
- **Nested layouts**: Support via cumulative configs
- **Flexible**: Can define layouts at any level
- **Example**:
  ```vue
  <!-- pages/+Layout.vue (global) -->
  <template>
    <div class="layout">
      <Header />
      <slot /> <!-- Page content -->
      <Footer />
    </div>
  </template>
  ```

#### Nuxt
- **`layouts/` directory**: Named layouts
- **Default layout**: `layouts/default.vue`
- **Per-page selection**: Via `definePageMeta({ layout: 'name' })`
- **Example**:
  ```vue
  <!-- layouts/default.vue -->
  <template>
    <div>
      <Header />
      <slot />
      <Footer />
    </div>
  </template>
  ```

Both frameworks provide powerful layout systems, each with its own conventions.

### 4. Head/SEO Management

#### Vike Vue
- **Multiple approaches**:
  - `+Head.vue` component for complex head content
  - Config options: `title`, `description`, `image`, `favicon`, `lang`
  - `htmlAttributes`, `bodyAttributes` for tag attributes
- **Type-safe**: Full TypeScript support
- **Example**:
  ```typescript
  // pages/+config.ts
  export default {
    title: 'My App',
    description: 'App description',
    image: '/og-image.png',
    lang: 'en'
  }
  ```

#### Nuxt
- **`useHead()` composable**: Dynamic head management
- **`useSeoMeta()` composable**: SEO-focused meta tags
- **App.vue head**: Global head configuration
- **Example**:
  ```vue
  <script setup>
  useHead({
    title: 'My App',
    meta: [
      { name: 'description', content: 'App description' }
    ]
  })
  </script>
  ```

Both frameworks offer comprehensive and flexible SEO and meta management, but through different APIs.

### 5. State Management

#### Vike Vue
- **Pinia integration**: Via `vike-vue-pinia` extension
- **Explicit setup**: Install and configure the extension
- **SSR support**: Full server-side rendering support
- **Example**:
  ```typescript
  // Install: npm install vike-vue-pinia pinia
  // pages/+config.ts
  import vikeVue from 'vike-vue/config'
  import vikeVuePinia from 'vike-vue-pinia/config'
  
  export default {
    extends: [vikeVue, vikeVuePinia]
  }
  ```

#### Nuxt
- **Pinia built-in**: Available via `@pinia/nuxt` module
- **Auto-setup**: Just add the module
- **Example**:
  ```typescript
  // nuxt.config.ts
  export default defineNuxtConfig({
    modules: ['@pinia/nuxt']
  })
  ```

Both support Pinia for state management, but Nuxt provides it out of the box, while Vike Vue requires adding an extension.

### 6. CSS & Styling

#### Vike Vue
- **Vite features**: All Vite CSS features available
- **CSS Modules**: Supported via Vite
- **CSS Preprocessors**: SCSS, Less, Stylus supported
- **Global CSS**: Import in `+config.ts` or components
- **Example**:
  ```typescript
  // pages/+config.ts
  import './global.css'
  ```

#### Nuxt
- **Built-in support**: CSS, SCSS, Less, Stylus
- **Global CSS**: Via `nuxt.config.ts`
- **PostCSS**: Built-in support
- **Example**:
  ```typescript
  // nuxt.config.ts
  export default defineNuxtConfig({
    css: ['~/assets/css/main.css']
  })
  ```

Both frameworks support modern CSS workflows via Vite.

### 7. Client-Only Components

#### Vike Vue
- **`clientOnly()` helper**: Wrap components for client-side only rendering
- **Example**:
  ```vue
  <script setup>
  import { clientOnly } from 'vike-vue/clientOnly'
  const ClientOnlyComponent = clientOnly(() => import('./MyComponent.vue'))
  </script>
  ```

#### Nuxt
- **`<ClientOnly>` component**: Built-in wrapper component
- **Example**:
  ```vue
  <template>
    <ClientOnly>
      <MyComponent />
    </ClientOnly>
  </template>
  ```

Nuxt provides a built-in component for this scenario, while Vike Vue uses an explicit helper.

### 8. Environment Variables

#### Vike Vue
- **Vite's `import.meta.env`**: Standard Vite approach
- **`.env` files**: Supported via Vite
- **Public variables**: Prefix with `VITE_`
- **Example**:
  ```typescript
  const apiUrl = import.meta.env.VITE_API_URL
  ```

#### Nuxt
- **`useRuntimeConfig()`**: Type-safe runtime config
- **`.env` files**: Built-in support
- **Public/private**: Automatic distinction
- **Example**:
  ```typescript
  const config = useRuntimeConfig()
  const apiUrl = config.public.apiUrl
  ```

Nuxt offers a more structured runtime config system; Vike Vue follows Vite conventions.

### 9. Middleware & Hooks

#### Vike Vue
- **Lifecycle hooks**: 
  - `onBeforeRender` - Server-side, before page render
  - `onBeforeRenderClient` - Client-side, before hydration
  - `onAfterRenderClient` - Client-side, after render
  - `onCreateApp` - App initialization
- **Page-level or global**: Can be defined at any config level
- **Example**:
  ```typescript
  // pages/+onBeforeRender.ts
  export { onBeforeRender }
  
  const onBeforeRender = async (pageContext) => {
    // Authentication check, redirects, etc.
  }
  ```

#### Nuxt
- **Route middleware**: In `middleware/` directory
- **Global middleware**: Via `.global.ts` suffix
- **Navigation guards**: Via `definePageMeta()`
- **Example**:
  ```typescript
  // middleware/auth.ts
  export default defineNuxtRouteMiddleware((to, from) => {
    // Check authentication
  })
  ```

Both systems provide flexible middleware and lifecycle hooks, though the patterns differ.

### 10. TypeScript Support

#### Vike Vue
- **First-class support**: Built with TypeScript
- **Type inference**: Automatic type inference for `+data.ts`
- **Config types**: Fully typed configuration
- **Example**:
  ```typescript
  import type { PageContext } from 'vike/types'
  
  export type Data = Awaited<ReturnType<typeof data>>
  
  const data = async (pageContext: PageContext) => {
    return { message: 'Hello' }
  }
  ```

#### Nuxt
- **Built-in TypeScript**: Zero configuration needed
- **Auto-generated types**: `.nuxt/types` directory
- **Type checking**: Via `nuxi typecheck`
- **Example**:
  ```typescript
  // Automatically typed
  const { data } = await useFetch('/api/data')
  ```

Both frameworks offer modern TypeScript support, with Nuxt emphasizing zero-config DX.

### 11. Streaming & Progressive Rendering

#### Vike Vue
- **HTML Streaming**: Supported via `stream` config
- **Node.js & Web Streams**: Both supported
- **Example**:
  ```typescript
  // pages/+config.ts
  export default {
    stream: true // or { type: 'node' | 'web' }
  }
  ```

#### Nuxt
- **Limited streaming**: Basic support in Nuxt 3
- **Experimental**: Some streaming features are experimental

Streaming support is more mature in Vike Vue, while Nuxt is evolving in this area.

### 12. Flexibility & Customization

#### Vike Vue
- **Highly flexible**: Choose your own libraries and patterns
- **Extension-based**: Add features via extensions
- **No lock-in**: Easy to integrate custom solutions
- **Vite ecosystem**: Full access to Vite plugins
- **Example**: Can use any Vue library, router configuration, build setup

#### Nuxt
- **Opinionated**: Conventions and best practices built-in
- **Module ecosystem**: Many pre-built modules
- **Nitro server**: Powerful server engine
- **Less flexible**: Harder to deviate from conventions

Vike Vue is designed for maximum flexibility and customization, while Nuxt focuses on conventions and developer experience.

### 13. Learning Curve

#### Vike Vue
- **Moderate**: Requires understanding Vike concepts
- **Explicit**: Need to understand file naming conventions
- **More manual**: Less magic, more explicit configuration

#### Nuxt
- **Easier for beginners**: More magic, less configuration
- **Conventions**: Strong conventions reduce decisions
- **Better DX**: Auto-imports and built-in features

Nuxt is easier for beginners and teams who value strong conventions; Vike Vue requires more explicit setup but rewards with flexibility.

### 14. Bundle Size & Performance

#### Vike Vue
- **Minimal core**: Smaller base footprint
- **Add what you need**: Only include necessary features
- **Optimized**: Fine-grained control over what's included

#### Nuxt
- **Larger base**: More features out of the box
- **Auto-optimization**: Automatic code splitting and tree shaking
- **Nitro optimizations**: Server-side optimizations

Vike Vue allows minimal, highly-optimized bundles by default; Nuxt optimizes for typical apps with many features included.

### 15. Deployment

#### Vike Vue
- **Flexible deployment**: Deploy to any Node.js host
- **Static export**: Pre-render to static files
- **Manual configuration**: More setup required for different platforms
- **Any adapter**: Build your own deployment adapter

#### Nuxt
- **Deployment presets**: Vercel, Netlify, Cloudflare, etc.
- **Zero-config**: Many platforms work out of the box
- **Nitro server**: Universal server engine
- **Static export**: Via `nuxt generate`

Nuxt provides easier deployment to many platforms, while Vike Vue gives more manual control and flexibility.

## When to Choose Vike Vue

Choose Vike Vue when you:

1. **Need maximum flexibility** - Want full control over your architecture
2. **Have specific requirements** - Need to integrate with specific libraries or patterns
3. **Value explicit control** - Prefer explicit imports and configuration
4. **Want smaller bundles** - Building a minimal application
5. **Need advanced streaming** - Require sophisticated HTML streaming
6. **Prefer Vite-first** - Want to leverage the full Vite ecosystem
7. **Are migrating** - Moving from another framework and want gradual adoption

## When to Choose Nuxt

Choose Nuxt when you:

1. **Want rapid development** - Need to build quickly with conventions
2. **Prefer batteries-included** - Want many features out of the box
3. **Need rich ecosystem** - Want access to many pre-built modules
4. **Value DX features** - Want auto-imports, dev tools, etc.
5. **Easy deployment** - Need simple deployment to various platforms
6. **Team consistency** - Want strong conventions for team collaboration
7. **Building typical apps** - Creating standard web applications

## Migration Path

### From Nuxt to Vike Vue

If you're considering migrating from Nuxt to Vike Vue:

1. **Pages**: Convert `pages/index.vue` → `pages/index/+Page.vue`
2. **Layouts**: Convert `layouts/default.vue` → `pages/+Layout.vue`
3. **Data fetching**: Convert `useAsyncData`/`useFetch` → `+data.ts` files
4. **Middleware**: Convert `middleware/` → `+onBeforeRender.ts` hooks
5. **Plugins**: Convert `plugins/` → `+onCreateApp.ts` hooks
6. **State**: Add `vike-vue-pinia` extension for Pinia
7. **Auto-imports**: Add explicit imports for components and composables

### From Vike Vue to Nuxt

If you're considering migrating from Vike Vue to Nuxt:

1. **Pages**: Convert `pages/index/+Page.vue` → `pages/index.vue`
2. **Layouts**: Convert `pages/+Layout.vue` → `layouts/default.vue`
3. **Data fetching**: Convert `+data.ts` → use `useAsyncData`/`useFetch`
4. **Hooks**: Convert lifecycle hooks → route middleware
5. **Configuration**: Consolidate to `nuxt.config.ts`

## Conclusion

Both Vike Vue and Nuxt are excellent frameworks for building Vue.js applications with SSR support. The choice between them depends on your specific needs and preferences:

- **Choose Vike Vue** if you value maximum flexibility, explicit control, and have specific architectural requirements.
- **Choose Nuxt** if you prioritize rapid development, a rich ecosystem, and prefer conventions over configuration.

Both frameworks are actively maintained, performant, and production-ready. Consider your team's preferences, project requirements, and long-term maintenance needs when making your decision.

## Resources

### Vike Vue
- [Documentation](https://vike.dev/vike-vue)
- [GitHub Repository](https://github.com/vikejs/vike-vue)
- [Examples](https://github.com/vikejs/vike-vue/tree/main/examples)

### Nuxt
- [Documentation](https://nuxt.com/)
- [GitHub Repository](https://github.com/nuxt/nuxt)
- [Modules](https://nuxt.com/modules)

## Contributing

This comparison is maintained by the Vike Vue community. If you find any inaccuracies or have suggestions for improvements, please [open an issue](https://github.com/vikejs/vike-vue/issues) or submit a pull request.

---

*Last updated: 2025-10-21*
