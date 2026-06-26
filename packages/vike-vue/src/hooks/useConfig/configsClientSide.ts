// The `useConfig()` settings that the client-side applies upon (client-side) navigation, see applyHeadSettings().
// All other settings are HTML-only and/or non-serializable (e.g. <Head> components), thus we don't pass them to the client-side.
export const configsClientSide = ['title', 'lang'] as const
export type ConfigsClientSide = (typeof configsClientSide)[number]
