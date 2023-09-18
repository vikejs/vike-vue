declare module '*.vue' {
  const Component: any
  export default Component
}
declare module '*.svg' {
  const imageUrl: string
  export default imageUrl
}

export type {
  PageContextBuiltIn,
  PageContextBuiltInClientWithClientRouting as PageContextBuiltInClient
} from 'vite-plugin-ssr/types'
import type { Component } from './renderer/types'
