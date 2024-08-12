import type { ConfigFromHookCumulative } from '../hooks/useConfig/useConfig-server'

// JSDocs are preserved
type PickWithoutGetter<T, K extends keyof T> = {
  [P in K]: Exclude<T[P], Function>
}
export type ConfigFromHook = PickWithoutGetter<
  Vike.Config,
  'Head' | 'title' | 'description' | 'image' | 'favicon' | 'lang' | 'viewport'
>
export type ConfigFromHookResolved = Omit<ConfigFromHook, ConfigFromHookCumulative> &
  Pick<Vike.ConfigResolved, ConfigFromHookCumulative>
