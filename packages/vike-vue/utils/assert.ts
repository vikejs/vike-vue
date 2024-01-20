export function assert(condition: unknown): asserts condition {
  if (condition) return
  throw new Error('You stumbled upon a vike-vue bug. Reach out on GitHub and a maintainer will fix the bug.')
}
