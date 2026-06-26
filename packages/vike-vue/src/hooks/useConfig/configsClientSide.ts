import type { ConfigViaHookResolved } from '../../types/Config.js'

export const configsClientSide = ['title'] as const satisfies ReadonlyArray<keyof ConfigViaHookResolved>
