import { ConfigsCumulative } from '../hooks/useConfig/configsCumulative'

// JSDocs are preserved
type PickWithoutGetter<T, K extends keyof T> = {
  [P in K]: Exclude<T[P], Function>
}
export const configsFromHook = [
  'Head',
  'title',
  'description',
  'image',
  'favicon',
  'lang',
  'viewport',
  'bodyAttributes',
  'htmlAttributes',
] as const
type ConfigsFromHook = (typeof configsFromHook)[number]
export type ConfigFromHook = PickWithoutGetter<Vike.Config, ConfigsFromHook>
export type ConfigFromHookResolved = Omit<ConfigFromHook, ConfigsCumulative> &
  Pick<Vike.ConfigResolved, ConfigsCumulative>
