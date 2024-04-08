// TODO/next-major-release: remove this file/export
console.warn(
  "[vike-vue][warning][deprecation] Replace `import vikeVue from 'vike-vue'` with `import vikeVue from 'vike-vue/config'` (typically in your /pages/+config.js)"
)
export { config } from './+config.js'
export * from './hooks/types.js'
