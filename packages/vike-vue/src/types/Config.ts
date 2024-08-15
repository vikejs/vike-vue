import { ConfigsCumulative } from '../hooks/useConfig/configsCumulative'

// JSDocs are preserved
type PickWithoutGetter<T, K extends keyof T> = {
  [P in K]: Exclude<T[P], Function>
}
export type ConfigFromHook = PickWithoutGetter<
  Vike.Config,
  'Head' | 'title' | 'description' | 'image' | 'favicon' | 'lang' | 'viewport' | 'bodyAttributes' | 'htmlAttributes'
>
export type ConfigFromHookResolved = Omit<ConfigFromHook, ConfigsCumulative> &
  Pick<Vike.ConfigResolved, ConfigsCumulative>
