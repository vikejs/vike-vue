import type { Component } from './PageContext'

// JSDocs are preserved
type PickWithoutGetter<T, K extends keyof T> = {
  [P in K]: Exclude<T[P], Function>
}
export type ConfigFromHook = PickWithoutGetter<Vike.Config, 'Head' | 'title' | 'description' | 'image'>
export type ConfigFromHookResolved = {
  Head?: Component[]
  title?: string
  description?: string
  image?: string
}
