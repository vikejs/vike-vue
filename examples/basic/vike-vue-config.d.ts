/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare global {
  
  namespace VikePackages {
    interface ConfigVikeVue {
      baseUrl?: string
    }  
  }
  
}

// Tell TypeScript this file isn't an ambient module
export {}
