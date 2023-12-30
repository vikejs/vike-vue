export function assert(condition: unknown): asserts condition {
  if (condition) return
  throw new Error("You stumbled upon a bug in vike-vue's source code. Reach out on GitHub and we will fix the bug.")
}
